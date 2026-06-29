import { env } from '$env/dynamic/private';

export const ADMIN_BASE_PATH = '/admin';
const DEFAULT_ADMIN_LOGIN_SLUG = 'secure-9x7k2q';
const DEFAULT_ADMIN_COOKIE_MAX_AGE = 12 * 60 * 60;

function normalizeSlug(value: string | undefined, fallback: string): string {
	const normalized = value?.trim().replace(/^\/+|\/+$/g, '') ?? '';

	if (!normalized) {
		return fallback;
	}

	return normalized;
}

function parseAllowedEmails(value: string | undefined): string[] {
	return (value ?? '')
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);
}

function parseBoolean(value: string | undefined, fallback = false): boolean {
	if (!value) {
		return fallback;
	}

	return value === 'true';
}

function parseNumber(value: string | undefined, fallback: number): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export interface AdminConfig {
	loginPath: string;
	loginSlug: string;
	allowedEmails: string[];
	sessionCookieName: string;
	sessionMaxAge: number;
	devBypass: boolean;
}

export function getAdminConfig(): AdminConfig {
	const loginSlug = normalizeSlug(env.ADMIN_LOGIN_SLUG, DEFAULT_ADMIN_LOGIN_SLUG);
	const loginPath = `${ADMIN_BASE_PATH}/${loginSlug}/login`;

	return {
		loginPath,
		loginSlug,
		allowedEmails: parseAllowedEmails(env.ADMIN_ALLOWED_EMAILS),
		sessionCookieName: env.ADMIN_SESSION_COOKIE_NAME?.trim() || 'admin_session',
		sessionMaxAge: parseNumber(env.ADMIN_SESSION_MAX_AGE, DEFAULT_ADMIN_COOKIE_MAX_AGE),
		devBypass: parseBoolean(env.DEV_ADMIN_BYPASS, false)
	};
}

export function isAllowedAdminEmail(email: string, config = getAdminConfig()): boolean {
	if (config.allowedEmails.length === 0) {
		return false;
	}

	return config.allowedEmails.includes(email.trim().toLowerCase());
}

export function safeAdminRedirectTarget(
	target: string | null | undefined,
): string {
	if (!target) {
		return ADMIN_BASE_PATH;
	}

	const trimmed = target.trim();
	if (!trimmed.startsWith(ADMIN_BASE_PATH)) {
		return ADMIN_BASE_PATH;
	}

	return trimmed;
}
