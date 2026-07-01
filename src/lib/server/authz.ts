import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { adminAccounts } from '$lib/server/db/account/admin-account.schema';
import { eq } from 'drizzle-orm';
import { getAdminConfig, isAllowedAdminEmail } from '$lib/server/config/admin';

export function requireUser() {
	const { locals, url } = getRequestEvent();
	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}
	return locals.user;
}

export function requireVerifiedUser() {
	const user = requireUser();
	if (!user.emailVerified) {
		redirect(303, '/verify-email');
	}
	return user;
}

export function requireAllowedAdminEmail() {
	const user = requireVerifiedUser();

	if (!isAllowedAdminEmail(user.email)) {
		error(403, {
			message: 'Your email is not authorized for admin access.'
		});
	}

	return user;
}

export function requireAdminSession() {
	const { locals, url } = getRequestEvent();
	const config = getAdminConfig();

	if (!locals.user || !locals.session || !locals.admin) {
		const redirectTo = url.pathname + url.search;
		redirect(303, `${config.loginPath}?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	return locals.admin;
}

export async function requireAdminOwner() {
	const { locals, url } = getRequestEvent();

	if (!locals.user) {
		const config = getAdminConfig();
		redirect(
			303,
			`${config.loginPath}?redirectTo=${encodeURIComponent(url.pathname + url.search)}`
		);
	}

	if (!locals.user.emailVerified) {
		redirect(303, '/verify-email');
	}

	const rows = await db
		.select({ userId: adminAccounts.userId })
		.from(adminAccounts)
		.where(eq(adminAccounts.userId, locals.user.id))
		.limit(1);

	if (rows.length === 0) {
		error(403, { message: 'Admin access required.' });
	}

	return locals.user;
}
