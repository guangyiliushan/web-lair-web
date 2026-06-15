import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { appUserProfile } from '$lib/server/db/app-profile.schema';
import { userRole } from '$lib/server/db/app-role.schema';

function generateSlug(name: string): string {
	return (
		name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '') +
		'-' +
		crypto.randomUUID().slice(0, 6)
	);
}

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true
	},

	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},

	session: {
		expiresIn: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60 // refresh every 24 hours when active
	},

	databaseHooks: {
		user: {
			create: {
				after: async (newUser) => {
					await db.insert(appUserProfile).values({
						userId: newUser.id,
						displayName: newUser.name,
						slug: generateSlug(newUser.name)
					});

					await db.insert(userRole).values({
						id: crypto.randomUUID(),
						userId: newUser.id,
						role: 'reader'
					});
				}
			}
		}
	},

	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
