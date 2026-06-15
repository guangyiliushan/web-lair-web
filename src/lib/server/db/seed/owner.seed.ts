import { db } from '$lib/server/db';
import { userRole } from '$lib/server/db/app-role.schema';
import { sql } from 'drizzle-orm';

interface BetterAuthInstance {
	api: {
		signUpEmail: (opts: {
			body: { email: string; password: string; name: string };
		}) => Promise<{ user: { id: string } }>;
	};
}

interface SeedContext {
	auth: BetterAuthInstance;
	env: {
		OWNER_EMAIL: string;
		OWNER_PASSWORD: string;
	};
}

export async function seedOwner({ auth, env }: SeedContext) {
	const { OWNER_EMAIL, OWNER_PASSWORD } = env;

	if (!OWNER_EMAIL || !OWNER_PASSWORD) {
		console.log('[seed] OWNER_EMAIL / OWNER_PASSWORD not set, skipping');
		return;
	}

	const existing = await db
		.select()
		.from(userRole)
		.where(sql`role = 'owner'`);

	if (existing.length > 0) {
		console.log('[seed] Owner already exists, skipping');
		return;
	}

	try {
		const result = await auth.api.signUpEmail({
			body: {
				email: OWNER_EMAIL,
				password: OWNER_PASSWORD,
				name: 'Owner'
			}
		});

		await db
			.update(userRole)
			.set({ role: 'owner' })
			.where(sql`user_id = ${result.user.id}`);

		console.log(`[seed] Owner created: ${OWNER_EMAIL}`);
	} catch (error) {
		console.error('[seed] Failed to create owner:', error);
		throw error;
	}
}
