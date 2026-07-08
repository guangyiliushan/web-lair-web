import { fail, redirect } from '@sveltejs/kit';
import { timingSafeEqual } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { adminAccounts } from '$lib/server/db/account/admin-account.schema';
import { ownerProfiles } from '$lib/server/db/account/owner-profile.schema';
import { user, session as authSession } from '$lib/server/db/auth.schema';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { getAdminConfig, isAllowedAdminEmail } from '$lib/server/config/admin';
import { issueAdminSessionCookie } from '$lib/server/security/admin-cookie';
import { env } from '$env/dynamic/private';
import type { Session, User } from 'better-auth';
import { APIError } from 'better-auth/api';

async function hasAnyAdmin(): Promise<boolean> {
	const rows = await db.select({ id: adminAccounts.id }).from(adminAccounts).limit(1);
	return rows.length > 0;
}

function verifySetupToken(formToken: string): string | null {
	const config = getAdminConfig();

	if (!config.setupToken) {
		return 'ADMIN_SETUP_TOKEN is not configured on the server.';
	}
	if (!formToken) {
		return 'Setup token is required.';
	}

	const a = Buffer.from(config.setupToken);
	const b = Buffer.from(formToken);
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return 'Invalid setup token.';
	}

	return null;
}

export const load: PageServerLoad = async () => {
	if (await hasAnyAdmin()) {
		redirect(303, '/admin');
	}

	const config = getAdminConfig();

	return {
		allowedEmailsConfigured: config.allowedEmails.length > 0,
		setupTokenConfigured: config.setupToken.length > 0
	};
};

export const actions: Actions = {
	setup: async (event) => {
		if (await hasAnyAdmin()) {
			return fail(403, { message: 'Admin already exists.' });
		}

		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? 'Admin';
		const formSetupToken = formData.get('setupToken')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		if (!isAllowedAdminEmail(email)) {
			return fail(400, { message: 'Email is not in the admin allowlist.' });
		}

		// Verify setup token
		const tokenError = verifySetupToken(formSetupToken);
		if (tokenError) {
			return fail(403, { message: tokenError });
		}

		// Create user via Better Auth API
		const result = await auth.api.signUpEmail({
			body: { email, password, name }
		});

		// Use transaction for email verification + admin grants
		await db.transaction(async (tx) => {
			await tx.update(user).set({ emailVerified: true }).where(eq(user.id, result.user.id));

			await tx
				.insert(adminAccounts)
				.values({
					id: crypto.randomUUID(),
					userId: result.user.id
				})
				.onConflictDoNothing();

			await tx
				.insert(ownerProfiles)
				.values({
					id: crypto.randomUUID(),
					userId: result.user.id,
					mail: email
				})
				.onConflictDoNothing();
		});

		// Re-check admin status after transaction
		// (handles race conditions where another request also created admin)
		await hasAnyAdmin();

		// Sign in to create a new session
		// (signUpEmail returns { token: null } when requireEmailVerification is true)
		try {
			const signInResult = await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/admin'
				}
			});

			const sessionRow = await db.query.session.findFirst({
				where: eq(authSession.token, signInResult.token)
			});

			if (!sessionRow) {
				return fail(500, { message: 'Failed to establish admin session.' });
			}

			issueAdminSessionCookie(
				event.cookies,
				result.user as User,
				sessionRow as Session,
				env.BETTER_AUTH_SECRET
			);
		} catch (caught) {
			if (caught instanceof APIError) {
				return fail(500, {
					message: 'Account created but auto-login failed. Please sign in manually.'
				});
			}
			throw caught;
		}

		redirect(303, '/admin');
	}
};
