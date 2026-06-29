import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { userRole } from '$lib/server/db/app-role.schema';
import { eq } from 'drizzle-orm';
import { ADMIN_BASE_PATH, getAdminConfig, isAllowedAdminEmail } from '$lib/server/config/admin';

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

export async function requireRole(...roles: string[]) {
	const user = requireUser();

	const rows = await db
		.select({ role: userRoles.role })
		.from(userRoles)
		.where(eq(userRoles.userId, user.id));

	const assignedRoles = rows.map((r) => r.role) as string[];
	const hasRole = roles.some((r) => assignedRoles.includes(r));

	if (!hasRole) {
		redirect(303, ADMIN_BASE_PATH);
	}

	return { user, roles: assignedRoles };
}

export async function requireOwner() {
	return requireRole('owner');
}

export async function requireEditor() {
	return requireRole('owner', 'editor');
}

export function requireAllowedAdminEmail() {
	const user = requireVerifiedUser();

	if (!isAllowedAdminEmail(user.email)) {
		redirect(303, '/');
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
	const user = requireAllowedAdminEmail();
	const adminSession = requireAdminSession();
	const { roles } = await requireOwner();

	return { user, roles, adminSession };
}
