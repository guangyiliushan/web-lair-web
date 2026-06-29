import { beforeEach, describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import type { Session, User } from 'better-auth';
import { clearAdminSessionCookie, getAdminSessionContext, issueAdminSessionCookie } from './admin-cookie';

class MockCookies implements Pick<Cookies, 'get' | 'set' | 'delete'> {
	private jar = new Map<string, string>();

	get(name: string): string | undefined {
		return this.jar.get(name);
	}

	set(name: string, value: string): void {
		this.jar.set(name, value);
	}

	delete(name: string): void {
		this.jar.delete(name);
	}
}

const NOW = new Date();

function testUser(overrides?: Partial<User>): User {
	return {
		id: 'user-1',
		email: 'owner@example.com',
		emailVerified: true,
		name: 'Owner',
		createdAt: NOW,
		updatedAt: NOW,
		...overrides
	} as unknown as User;
}

function testSession(id: string, userId: string): Session {
	return {
		id,
		userId,
		token: `token-${id}`,
		expiresAt: new Date(Date.now() + 60_000),
		createdAt: NOW,
		updatedAt: NOW
	} as unknown as Session;
}

describe('admin-cookie', () => {
	beforeEach(() => {
		process.env.ADMIN_LOGIN_SLUG = 'secure-9x7k2q';
		process.env.ADMIN_SESSION_COOKIE_NAME = 'admin_session';
		process.env.ADMIN_SESSION_MAX_AGE = '3600';
	});

	it('issues and validates an admin session cookie for the same user and session', () => {
		const cookies = new MockCookies();
		const user = testUser();
		const session = testSession('session-1', 'user-1');

		issueAdminSessionCookie(cookies as unknown as Cookies, user, session, 'secret');
		const context = getAdminSessionContext(
			cookies as unknown as Cookies,
			user,
			session,
			'secret'
		);

		expect(context).toMatchObject({
			userId: 'user-1',
			sessionId: 'session-1'
		});
	});

	it('rejects the cookie when the request session id does not match', () => {
		const cookies = new MockCookies();
		const user = testUser();
		const session = testSession('session-1', 'user-1');

		issueAdminSessionCookie(cookies as unknown as Cookies, user, session, 'secret');
		const context = getAdminSessionContext(
			cookies as unknown as Cookies,
			user,
			testSession('session-2', 'user-1'),
			'secret'
		);

		expect(context).toBeNull();
	});

	it('clears the admin session cookie', () => {
		const cookies = new MockCookies();
		const user = testUser();
		const session = testSession('session-1', 'user-1');

		issueAdminSessionCookie(cookies as unknown as Cookies, user, session, 'secret');
		clearAdminSessionCookie(cookies as unknown as Cookies);

		expect(cookies.get('admin_session')).toBeUndefined();
	});
});
