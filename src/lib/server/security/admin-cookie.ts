import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import type { Session, User } from 'better-auth';
import { ADMIN_BASE_PATH, getAdminConfig } from '$lib/server/config/admin';

interface AdminCookiePayload {
	userId: string;
	sessionId: string;
	issuedAt: number;
	expiresAt: number;
}

function encodeBase64Url(value: string): string {
	return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value: string): string {
	return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value: string, secret: string): string {
	return createHmac('sha256', secret).update(value).digest('base64url');
}

function serialize(payload: AdminCookiePayload, secret: string): string {
	const encoded = encodeBase64Url(JSON.stringify(payload));
	const signature = sign(encoded, secret);
	return `${encoded}.${signature}`;
}

function parse(rawValue: string | undefined, secret: string): AdminCookiePayload | null {
	if (!rawValue) {
		return null;
	}

	const [encoded, signature] = rawValue.split('.');
	if (!encoded || !signature) {
		return null;
	}

	const expected = sign(encoded, secret);
	const actualBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);

	if (actualBuffer.length !== expectedBuffer.length) {
		return null;
	}

	if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
		return null;
	}

	try {
		const parsed = JSON.parse(decodeBase64Url(encoded)) as Partial<AdminCookiePayload>;
		if (
			typeof parsed.userId !== 'string' ||
			typeof parsed.sessionId !== 'string' ||
			typeof parsed.issuedAt !== 'number' ||
			typeof parsed.expiresAt !== 'number'
		) {
			return null;
		}

		return parsed as AdminCookiePayload;
	} catch {
		return null;
	}
}

function getSessionId(session: Session | undefined): string | null {
	if (!session) {
		return null;
	}

	const maybeId = (session as Session & { id?: string }).id;
	return typeof maybeId === 'string' && maybeId.length > 0 ? maybeId : null;
}

export interface AdminSessionContext {
	userId: string;
	sessionId: string;
	issuedAt: number;
	expiresAt: number;
}

export function issueAdminSessionCookie(
	cookies: Cookies,
	user: User,
	session: Session,
	secret: string
): AdminSessionContext {
	const config = getAdminConfig();
	const now = Math.floor(Date.now() / 1000);
	const sessionId = getSessionId(session);

	if (!sessionId) {
		throw new Error('Session id is required to issue an admin session cookie');
	}

	const payload: AdminCookiePayload = {
		userId: user.id,
		sessionId,
		issuedAt: now,
		expiresAt: now + config.sessionMaxAge
	};

	cookies.set(config.sessionCookieName, serialize(payload, secret), {
		httpOnly: true,
		secure: !import.meta.env.DEV,
		sameSite: 'strict',
		path: ADMIN_BASE_PATH,
		maxAge: config.sessionMaxAge
	});

	return payload;
}

export function clearAdminSessionCookie(cookies: Cookies): void {
	const config = getAdminConfig();
	cookies.delete(config.sessionCookieName, {
		httpOnly: true,
		secure: !import.meta.env.DEV,
		sameSite: 'strict',
		path: ADMIN_BASE_PATH
	});
}

export function getAdminSessionContext(
	cookies: Cookies,
	user: User | undefined,
	session: Session | undefined,
	secret: string
): AdminSessionContext | null {
	const config = getAdminConfig();
	const payload = parse(cookies.get(config.sessionCookieName), secret);
	const sessionId = getSessionId(session);
	const now = Math.floor(Date.now() / 1000);

	if (!payload || !user || !sessionId) {
		return null;
	}

	if (payload.userId !== user.id || payload.sessionId !== sessionId || payload.expiresAt <= now) {
		return null;
	}

	return payload;
}
