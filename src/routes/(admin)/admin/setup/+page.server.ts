import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { adminAccounts } from '$lib/server/db/account/admin-account.schema';
import { ownerProfiles } from '$lib/server/db/account/owner-profile.schema';
import { user } from '$lib/server/db/auth.schema';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { isAllowedAdminEmail } from '$lib/server/config/admin';
import { issueAdminSessionCookie } from '$lib/server/security/admin-cookie';
import { env } from '$env/dynamic/private';

async function hasAnyAdmin(): Promise<boolean> {
	const rows = await db
		.select({ id: adminAccounts.id })
		.from(adminAccounts)
		.limit(1);
	return rows.length > 0;
}

export const load: PageServerLoad = async () => {
	if (await hasAnyAdmin()) {
		redirect(303, '/admin');
	}
	return {};
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

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		if (!isAllowedAdminEmail(email)) {
			return fail(400, { message: 'Email is not in the admin allowlist.' });
		}

		// 创建用户
		const result = await auth.api.signUpEmail({
			body: { email, password, name }
		});

		// 标记邮箱已验证
		await db.update(user)
			.set({ emailVerified: true })
			.where(eq(user.id, result.user.id));

		// 标记为管理员
		await db.insert(adminAccounts).values({
			id: crypto.randomUUID(),
			userId: result.user.id
		});

		// 创建 owner profile
		await db.insert(ownerProfiles).values({
			id: crypto.randomUUID(),
			userId: result.user.id,
			mail: email
		});

		// 自动登录并签发 admin session
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (session) {
			issueAdminSessionCookie(
				event.cookies,
				result.user,
				session.session,
				env.BETTER_AUTH_SECRET
			);
		}

		redirect(303, '/admin');
	}
};
