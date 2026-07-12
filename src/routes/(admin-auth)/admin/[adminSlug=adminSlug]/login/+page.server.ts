import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { APIError } from 'better-auth/api';
import { ne, eq, and } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { adminAccounts } from '$lib/server/db/account/admin-account.schema';
import { session as authSession } from '$lib/server/db/auth.schema';
import { ADMIN_BASE_PATH, getAdminConfig, isAllowedAdminEmail } from '$lib/server/config/admin';
import { issueAdminSessionCookie } from '$lib/server/security/admin-cookie';
import { safeRedirect } from '$lib/server/safe-redirect';
import type { Session, User } from 'better-auth';
import { env } from '$env/dynamic/private';

function assertAdminSlug(slug: string) {
	const config = getAdminConfig();

	if (slug !== config.loginSlug) {
		error(404, 'Not found');
	}

	return config;
}

function getSessionId(session: Session | undefined): string | null {
	if (!session) {
		return null;
	}

	const maybeId = (session as Session & { id?: string }).id;
	return typeof maybeId === 'string' && maybeId.length > 0 ? maybeId : null;
}

async function isAdminAccount(userId: string): Promise<boolean> {
	const rows = await db
		.select({ userId: adminAccounts.userId })
		.from(adminAccounts)
		.where(eq(adminAccounts.userId, userId))
		.limit(1);

	return rows.length > 0;
}

async function pruneOtherSessions(userId: string, currentSessionId: string) {
	await db
		.delete(authSession)
		.where(and(eq(authSession.userId, userId), ne(authSession.id, currentSessionId)));
}

export const load: PageServerLoad = async (event) => {
	assertAdminSlug(event.params.adminSlug);

	const redirectTo = safeRedirect(event.url.searchParams.get('redirectTo'), ADMIN_BASE_PATH, {
		allowedPrefix: ADMIN_BASE_PATH
	});

	if (event.locals.admin) {
		redirect(302, redirectTo);
	}

	return {
		redirectTo
	};
};

export const actions: Actions = {
	signIn: async (event) => {
		const config = assertAdminSlug(event.params.adminSlug);
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), ADMIN_BASE_PATH, {
			allowedPrefix: ADMIN_BASE_PATH
		});

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required', redirectTo });
		}

		if (!isAllowedAdminEmail(email, config)) {
			return fail(400, { message: 'Invalid email or password', redirectTo });
		}

		try {
			const result = await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/auth/verification-success'
				}
			});

			if (!isAllowedAdminEmail(result.user.email, config) || !result.user.emailVerified) {
				return fail(403, { message: 'This account cannot access admin', redirectTo });
			}

			if (!(await isAdminAccount(result.user.id))) {
				return fail(403, { message: 'This account cannot access admin', redirectTo });
			}

			const sessionRow = await db.query.session.findFirst({
				where: eq(authSession.token, result.token)
			});

			const sessionId = getSessionId(sessionRow as Session | undefined);
			if (!sessionRow || !sessionId) {
				return fail(500, { message: 'Failed to establish admin session', redirectTo });
			}

			await pruneOtherSessions(result.user.id, sessionId);
			issueAdminSessionCookie(
				event.cookies,
				result.user as User,
				sessionRow as Session,
				env.BETTER_AUTH_SECRET
			);
		} catch (caught) {
			if (caught instanceof APIError) {
				return fail(400, {
					message: caught.message || 'Invalid email or password',
					redirectTo
				});
			}

			return fail(500, { message: 'An unexpected error occurred', redirectTo });
		}

		redirect(302, `${config.loginPath}?redirectTo=${encodeURIComponent(redirectTo)}`);
	}
};
