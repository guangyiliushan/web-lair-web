/**
 * Snowflake ID Generator
 *
 * Generates time-sortable, globally unique 64-bit IDs inspired by Twitter's Snowflake.
 *
 * Bit layout (64 bits total):
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ timestamp (41 bits)  │ worker (10 bits)  │ sequence (12 bits)    │
 * │ milliseconds since    │ node identifier   │ per-ms counter        │
 * │ custom epoch          │ 0–1023            │ 0–4095               │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * Features:
 * - 69 years of IDs from custom epoch (2025-05-02)
 * - 1024 unique worker IDs (supports horizontal scaling)
 * - 4096 IDs per millisecond per worker
 * - Clock drift tolerance with configurable threshold
 * - Zero external dependencies
 * - Testable via injectable `now` function
 *
 * @module snowflake
 */

// ═══════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════

const SEQUENCE_BITS = 12n;
const WORKER_ID_BITS = 10n;
const SEQUENCE_MASK = (1n << SEQUENCE_BITS) - 1n; // 4095
const WORKER_ID_MAX = (1n << WORKER_ID_BITS) - 1n; // 1023
const TIMESTAMP_LEFT_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;
const WORKER_ID_LEFT_SHIFT = SEQUENCE_BITS;
const TIMESTAMP_BITS = 41n;
const TIMESTAMP_MAX = (1n << TIMESTAMP_BITS) - 1n;
const WORKER_ID_MAX_NUMBER = Number(WORKER_ID_MAX);

/** Base36 alphabet for encoding. */
const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Fixed encoded length for a 64-bit value in base36 (ceil(64 / log2(36)) = 13). */
const ENCODED_LENGTH = 13;

// ═══════════════════════════════════════════════════════════════════
// Epoch
// ═══════════════════════════════════════════════════════════════════

/**
 * Custom epoch: 2025-05-02T00:00:00.000Z in milliseconds since Unix epoch.
 *
 * Using a recent custom epoch maximizes the lifetime of the 41-bit timestamp
 * field (~69 years from epoch) while keeping IDs smaller during our
 * application's active lifetime.
 */
export const SNOWFLAKE_EPOCH_MS = 1_746_144_000_000n;

// ═══════════════════════════════════════════════════════════════════
// Environment variable names
// ═══════════════════════════════════════════════════════════════════

/** Explicitly set the worker offset. Takes precedence over PM2 instance ID. */
export const SNOWFLAKE_WORKER_OFFSET_ENV = 'SNOWFLAKE_WORKER_OFFSET';

/** PM2 cluster instance ID (set by PM2 via `NODE_APP_INSTANCE`). */
const PM2_INSTANCE_ID_ENV = 'NODE_APP_INSTANCE';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

/** Configuration options for a SnowflakeGenerator instance. */
export interface SnowflakeOptions {
	/** Base worker ID (0–1023). Combined with environment offset for final worker ID. */
	workerId: number;
	/** Custom epoch in milliseconds since Unix epoch. Defaults to {@link SNOWFLAKE_EPOCH_MS}. */
	epochMs?: bigint;
	/**
	 * Maximum tolerated backward clock drift in milliseconds.
	 * When exceeded, throws instead of generating IDs. Default: 0 (no tolerance).
	 */
	toleratesBackwardsClockMs?: number;
	/**
	 * Injectable clock function (milliseconds since Unix epoch).
	 * Defaults to `Date.now`. Override in tests.
	 */
	now?: () => number;
}

/** Decoded components of a Snowflake ID. */
export interface DecodedSnowflake {
	/** Unix timestamp (milliseconds) when this ID was generated. */
	timestampMs: bigint;
	/** Worker ID that generated this ID. */
	workerId: bigint;
	/** Sequence number within the same millisecond. */
	sequence: bigint;
}

// ═══════════════════════════════════════════════════════════════════
// Worker ID resolution
// ═══════════════════════════════════════════════════════════════════

/**
 * Parses and validates a raw worker ID component.
 * @throws {Error} If the value is not an integer in [0, 1023].
 */
function parseWorkerIdPart(value: number, label: string): number {
	if (!Number.isInteger(value) || value < 0 || value > WORKER_ID_MAX_NUMBER) {
		throw new Error(
			`Snowflake worker ${label} must be an integer in [0, ${WORKER_ID_MAX_NUMBER}], got ${value}`,
		);
	}
	return value;
}

/**
 * Parses a worker offset from an environment variable.
 * Returns 0 for undefined or empty values.
 * @throws {Error} If the value is not a non-negative integer.
 */
function parseWorkerOffset(raw: string | undefined, source: string): number {
	if (raw === undefined || raw === '') return 0;
	const value = Number(raw);
	if (!Number.isInteger(value) || value < 0) {
		throw new Error(
			`Snowflake worker offset from ${source} must be a non-negative integer, got "${raw}"`,
		);
	}
	return value;
}

/**
 * Resolves the final worker ID by combining a base worker ID with an
 * environment-variable-driven offset (e.g. `SNOWFLAKE_WORKER_OFFSET` or
 * PM2's `NODE_APP_INSTANCE`).
 *
 * Priority: `SNOWFLAKE_WORKER_OFFSET` > `NODE_APP_INSTANCE` > 0
 *
 * @param baseWorkerId - The base worker ID configured for this deployment.
 * @param env - Environment variable lookup. Defaults to `process.env`.
 * @returns The resolved worker ID (base + offset), guaranteed in [0, 1023].
 * @throws {Error} If the resolved ID exceeds 1023.
 */
export function resolveSnowflakeWorkerId(
	baseWorkerId: number,
	env: Record<string, string | undefined> = process.env,
): number {
	const base = parseWorkerIdPart(baseWorkerId, 'base id');
	const explicitOffset = env[SNOWFLAKE_WORKER_OFFSET_ENV];
	const offsetSource =
		explicitOffset === undefined ? PM2_INSTANCE_ID_ENV : SNOWFLAKE_WORKER_OFFSET_ENV;
	const offset = parseWorkerOffset(
		explicitOffset ?? env[PM2_INSTANCE_ID_ENV],
		offsetSource,
	);
	const workerId = base + offset;
	if (workerId > WORKER_ID_MAX_NUMBER) {
		throw new Error(
			`Snowflake worker id ${workerId} out of range [0, ${WORKER_ID_MAX_NUMBER}]; base ${base} + ${offsetSource} ${offset}`,
		);
	}
	return workerId;
}

// ═══════════════════════════════════════════════════════════════════
// Encoding / Decoding
// ═══════════════════════════════════════════════════════════════════

/**
 * Encodes a `bigint` to a fixed-width base36 string.
 *
 * Base36 is URL-safe, case-insensitive, and more compact than decimal.
 * A 64-bit value always produces exactly 13 characters.
 */
function encodeBase36(value: bigint): string {
	if (value < 0n) {
		throw new Error(`Cannot encode negative value: ${value}`);
	}
	if (value === 0n) return BASE36[0].repeat(ENCODED_LENGTH);

	let result = '';
	let remaining = value;
	while (remaining > 0n) {
		const digit = Number(remaining % 36n);
		result = BASE36[digit] + result;
		remaining = remaining / 36n;
	}
	return result.padStart(ENCODED_LENGTH, BASE36[0]);
}

/**
 * Decodes a base36-encoded Snowflake ID string back to a `bigint`.
 * @throws {Error} If the string contains invalid characters.
 */
function decodeBase36(encoded: string): bigint {
	if (encoded.length !== ENCODED_LENGTH) {
		throw new Error(
			`Invalid Snowflake ID length: expected ${ENCODED_LENGTH}, got ${encoded.length}`,
		);
	}
	let result = 0n;
	for (const char of encoded) {
		const digit = BASE36.indexOf(char);
		if (digit === -1) {
			throw new Error(`Invalid base36 character in Snowflake ID: "${char}"`);
		}
		result = result * 36n + BigInt(digit);
	}
	return result;
}

// ═══════════════════════════════════════════════════════════════════
// Generator
// ═══════════════════════════════════════════════════════════════════

/**
 * Pure Snowflake ID generator.
 *
 * Thread-safe for single-threaded Node.js. For multi-process deployments,
 * assign each process a unique worker ID via {@link resolveSnowflakeWorkerId}.
 *
 * @example
 * ```ts
 * const gen = new SnowflakeGenerator({ workerId: 1 });
 * const id = gen.nextId();   // "00004xq5n9gjk"
 * const big = gen.nextBigInt(); // 501234567890123n
 * const decoded = gen.decode(id);
 * // { timestampMs: 1746144123456n, workerId: 1n, sequence: 0n }
 * ```
 */
export class SnowflakeGenerator {
	private readonly workerIdBig: bigint;
	private readonly epochMs: bigint;
	private readonly toleratesBackwardsClockMs: number;
	private readonly now: () => number;

	private lastTimestamp = -1n;
	private sequence = 0n;

	constructor(options: SnowflakeOptions) {
		if (
			typeof options.workerId !== 'number' ||
			!Number.isInteger(options.workerId)
		) {
			throw new Error(
				`SnowflakeGenerator: workerId must be an integer, got ${options.workerId}`,
			);
		}
		const workerIdBig = BigInt(options.workerId);
		if (workerIdBig < 0n || workerIdBig > WORKER_ID_MAX) {
			throw new Error(
				`SnowflakeGenerator: workerId ${options.workerId} out of range [0, ${WORKER_ID_MAX}]`,
			);
		}
		this.workerIdBig = workerIdBig;
		this.epochMs = options.epochMs ?? SNOWFLAKE_EPOCH_MS;
		this.toleratesBackwardsClockMs = options.toleratesBackwardsClockMs ?? 0;
		this.now = options.now ?? Date.now;
	}

	/** The configured worker ID for this generator. */
	get workerId(): number {
		return Number(this.workerIdBig);
	}

	/**
	 * Generates the next Snowflake ID as a base36-encoded string.
	 *
	 * Use this for database text columns (e.g. Drizzle `text('id')`).
	 * The returned string is always 13 characters, URL-safe, and
	 * lexicographically sortable (newer IDs sort after older ones).
	 */
	nextId(): string {
		return encodeBase36(this.nextBigInt());
	}

	/**
	 * Generates the next Snowflake ID as a raw `bigint`.
	 *
	 * Use this for numeric database columns or internal comparisons.
	 *
	 * @throws {Error} If the clock drifts backwards beyond the tolerance threshold.
	 * @throws {Error} If the timestamp overflows the 41-bit field (epoch is too old).
	 */
	nextBigInt(): bigint {
		let timestamp = BigInt(this.now());

		// Handle clock drift
		if (timestamp < this.lastTimestamp) {
			const drift = this.lastTimestamp - timestamp;
			if (drift <= BigInt(this.toleratesBackwardsClockMs)) {
				// Busy-wait until the clock catches up
				while (timestamp < this.lastTimestamp) {
					timestamp = BigInt(this.now());
				}
			} else {
				throw new Error(
					`SnowflakeGenerator: clock moved backwards by ${drift}ms; refusing to generate ID (tolerance: ${this.toleratesBackwardsClockMs}ms)`,
				);
			}
		}

		// Sequence logic
		if (timestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1n) & SEQUENCE_MASK;
			if (this.sequence === 0n) {
				// Sequence exhausted for this millisecond; wait for next ms
				timestamp = this.#waitNextMillis(this.lastTimestamp);
			}
		} else {
			this.sequence = 0n;
		}

		this.lastTimestamp = timestamp;

		// Validate epoch bounds
		const elapsed = timestamp - this.epochMs;
		if (elapsed < 0n) {
			throw new Error(
				`SnowflakeGenerator: current timestamp ${timestamp} is before epoch ${this.epochMs}`,
			);
		}
		if (elapsed > TIMESTAMP_MAX) {
			throw new Error(
				`SnowflakeGenerator: timestamp overflow — epoch must be advanced. ` +
					`Elapsed: ${elapsed}, max: ${TIMESTAMP_MAX}`,
			);
		}

		return (
			(elapsed << TIMESTAMP_LEFT_SHIFT) |
			(this.workerIdBig << WORKER_ID_LEFT_SHIFT) |
			this.sequence
		);
	}

	/**
	 * Decodes a Snowflake ID (string or bigint) into its components.
	 *
	 * @example
	 * ```ts
	 * const gen = new SnowflakeGenerator({ workerId: 1 });
	 * gen.decode("00004xq5n9gjk");
	 * // { timestampMs: 1746144123456n, workerId: 1n, sequence: 5n }
	 * ```
	 */
	decode(id: string | bigint): DecodedSnowflake {
		const value = typeof id === 'bigint' ? id : decodeBase36(id);
		const sequence = value & SEQUENCE_MASK;
		const workerId = (value >> WORKER_ID_LEFT_SHIFT) & WORKER_ID_MAX;
		const timestamp = (value >> TIMESTAMP_LEFT_SHIFT) + this.epochMs;
		return { timestampMs: timestamp, workerId, sequence };
	}

	/** Busy-waits until the clock advances past the given timestamp. */
	#waitNextMillis(lastTimestamp: bigint): bigint {
		let timestamp = BigInt(this.now());
		while (timestamp <= lastTimestamp) {
			timestamp = BigInt(this.now());
		}
		return timestamp;
	}
}

// ═══════════════════════════════════════════════════════════════════
// Singleton factory (app-wide shared instance)
// ═══════════════════════════════════════════════════════════════════

let _defaultGenerator: SnowflakeGenerator | null = null;

/**
 * Returns (and lazily creates) the default app-wide Snowflake generator.
 *
 * The worker ID is resolved from environment variables:
 * - Base worker ID defaults to 0; override via the `workerId` parameter.
 * - Offset from `SNOWFLAKE_WORKER_OFFSET` or PM2's `NODE_APP_INSTANCE`.
 *
 * Only call this in server-side code (e.g. `+page.server.ts`, `hooks.server.ts`,
 * API routes). It relies on `process.env` and is not available in the browser.
 *
 * @example
 * ```ts
 * import { getSnowflake } from '$lib/server/snowflake';
 * const id = getSnowflake().nextId();
 * ```
 */
export function getSnowflake(workerId = 0): SnowflakeGenerator {
	if (!_defaultGenerator) {
		_defaultGenerator = new SnowflakeGenerator({
			workerId: resolveSnowflakeWorkerId(workerId),
		});
	}
	return _defaultGenerator;
}

/**
 * Resets the default generator singleton.
 * Primarily useful in tests to ensure clean state between test cases.
 */
export function resetSnowflake(): void {
	_defaultGenerator = null;
}
