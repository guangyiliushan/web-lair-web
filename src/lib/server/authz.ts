import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { userRole } from '$lib/server/db/app-role.schema';
import { eq } from 'drizzle-orm';

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
		.select({ role: userRole.role })
		.from(userRole)
		.where(eq(userRole.userId, user.id));

	const userRoles = rows.map((r) => r.role) as string[];
	const hasRole = roles.some((r) => userRoles.includes(r));

	if (!hasRole) {
		redirect(303, '/dashboard');
	}

	return { user, roles: userRoles };
}

export async function requireOwner() {
	return requireRole('owner');
}

export async function requireEditor() {
	return requireRole('owner', 'editor');
}
