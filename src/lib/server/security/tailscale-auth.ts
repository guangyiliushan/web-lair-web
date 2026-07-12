import { isTailscaleRequest } from './tailscale';
import { db } from '$lib/server/db';
import { adminAccounts } from '$lib/server/db/account/admin-account.schema';
import { session as authSession, user as authUser } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';
import type { User, Session } from 'better-auth';

/**
 * 在 Tailscale 网络内且无 session 时，尝试为 admin 用户自动创建 session。
 * 返回 user + session 供 hooks 注入 locals。
 */
export async function tryTailscaleAutoLogin(): Promise<{
	user: User;
	session: Session;
} | null> {
	if (!isTailscaleRequest()) return null;

	// 查找唯一的 admin 用户
	const adminRow = await db.select({ userId: adminAccounts.userId }).from(adminAccounts).limit(1);

	if (adminRow.length === 0) return null;

	const adminUser = await db.query.user.findFirst({
		where: eq(authUser.id, adminRow[0].userId)
	});

	if (!adminUser || !adminUser.emailVerified) return null;

	// 创建 session 行
	const sessionId = crypto.randomUUID();
	const sessionToken = crypto.randomUUID();
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);

	await db.insert(authSession).values({
		id: sessionId,
		userId: adminUser.id,
		token: sessionToken,
		expiresAt,
		createdAt: now,
		updatedAt: now
	});

	return {
		user: adminUser,
		session: {
			id: sessionId,
			userId: adminUser.id,
			token: sessionToken,
			expiresAt,
			createdAt: now,
			updatedAt: now
		} as Session
	};
}
