// scripts/seed-owner.ts
// 用法:
//   1. pnpm dev （启动 dev server）
//   2. pnpm db:seed-owner
//
// 环境变量:
//   OWNER_EMAIL     — admin 邮箱（默认取 ADMIN_ALLOWED_EMAILS 第一项；必须在白名单中）
//   OWNER_PASSWORD  — 密码（最少 8 位）
//   OWNER_NAME      — 显示名称（默认 "Admin"）
//   ORIGIN          — SvelteKit server 地址（默认 http://localhost:5173）
//   DATABASE_URL    — PostgreSQL 连接串
//   ADMIN_ALLOWED_EMAILS — 逗号分隔的管理员邮箱白名单

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { user } from '../src/lib/server/db/auth.schema';
import { adminAccounts } from '../src/lib/server/db/account/admin-account.schema';

const FETCH_TIMEOUT_MS = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 读取必填环境变量，缺失时报错并退出。
 * 返回值始终为 string（非 undefined），因为 process.exit 返回 never。
 */
function requireEnv(name: string, value: string | undefined): string {
	if (!value?.trim()) {
		console.error(`✗ ${name} is required.`);
		process.exit(1);
	}
	return value;
}

// ── 解析环境变量 ──
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
const NAME = process.env.OWNER_NAME || 'Admin';

// OWNER_EMAIL 未设置时，回退到 ADMIN_ALLOWED_EMAILS 的第一个条目
const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS ?? '')
	.split(',')
	.map((e: string) => e.trim().toLowerCase())
	.filter(Boolean);

const EMAIL = (process.env.OWNER_EMAIL ?? allowedEmails[0] ?? '').trim().toLowerCase();

// requireEnv 返回 string 类型，避免跨函数边界时 narrowing 丢失
const PASSWORD = requireEnv('OWNER_PASSWORD', process.env.OWNER_PASSWORD);
const DB_URL = requireEnv('DATABASE_URL', process.env.DATABASE_URL);

// ── 校验 ──
if (!EMAIL) {
	console.error('✗ OWNER_EMAIL or ADMIN_ALLOWED_EMAILS is required.');
	process.exit(1);
}
if (!EMAIL_RE.test(EMAIL)) {
	console.error(`✗ Invalid email format: ${EMAIL}`);
	process.exit(1);
}
if (PASSWORD.length < 8) {
	console.error('✗ OWNER_PASSWORD must be at least 8 characters.');
	process.exit(1);
}
if (allowedEmails.length > 0 && !allowedEmails.includes(EMAIL)) {
	console.error(`✗ OWNER_EMAIL (${EMAIL}) is not in ADMIN_ALLOWED_EMAILS.`);
	process.exit(1);
}

// ── 辅助：带超时的 fetch ──
async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}

async function main() {
	const pg = postgres(DB_URL);
	const db = drizzle(pg);

	try {
		// ── Step 1: 检查用户是否已存在（幂等性核心）──
		const [existing] = await db
			.select({ id: user.id, emailVerified: user.emailVerified })
			.from(user)
			.where(eq(user.email, EMAIL))
			.limit(1);

		if (existing) {
			console.log(`→ User already exists: ${EMAIL}`);
		} else {
			// ── Step 2: 用户不存在，调用 Better Auth 注册 API ──
			console.log(`→ Creating user via Better Auth API: ${EMAIL} ...`);
			const signUpRes = await fetchWithTimeout(`${ORIGIN}/api/auth/sign-up/email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Origin: ORIGIN
				},
				body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: NAME })
			});

			if (!signUpRes.ok) {
				const err = await signUpRes.json().catch(() => ({}));
				console.error('✗ Sign-up failed:', signUpRes.status, err);
				console.error('  Make sure dev server is running (pnpm dev).');
				process.exit(1);
			}

			console.log('✓ User created.');

			// 等待 databaseHooks (user.create.after → userProfiles) 完成
			await new Promise((r) => setTimeout(r, 500));
		}

		// ── Step 3: 获取用户 ID（可能刚注册，重新查询）──
		const [u] = await db
			.select({ id: user.id, emailVerified: user.emailVerified })
			.from(user)
			.where(eq(user.email, EMAIL))
			.limit(1);

		if (!u) {
			console.error('✗ User not found in DB after sign-up. Check database connection.');
			process.exit(1);
		}

		// ── Step 4: 设置 emailVerified = true（幂等）──
		if (!u.emailVerified) {
			await db.update(user).set({ emailVerified: true }).where(eq(user.email, EMAIL));
			console.log('✓ emailVerified set to true.');
		} else {
			console.log('→ emailVerified already true, skipping.');
		}

		// ── Step 5: 插入 admin_account（幂等，依赖 userId 唯一约束）──
		const [existingAdmin] = await db
			.select({ id: adminAccounts.id })
			.from(adminAccounts)
			.where(eq(adminAccounts.userId, u.id))
			.limit(1);

		if (existingAdmin) {
			console.log('→ admin_account entry already exists, skipping.');
		} else {
			await db
				.insert(adminAccounts)
				.values({ id: crypto.randomUUID(), userId: u.id })
				.onConflictDoNothing();
			console.log('✓ admin_account entry created.');
		}

		console.log('\n✔ Done! Owner account is ready.');
		console.log(`  Email: ${EMAIL}`);
		console.log('  You can now log in at the admin login page.');
	} catch (err) {
		console.error('✗ Unexpected error:', err);
		process.exitCode = 1;
	} finally {
		await pg.end();
	}
}

main();
