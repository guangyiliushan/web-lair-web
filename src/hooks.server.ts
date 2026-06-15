import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { db } from '$lib/server/db';
import { appUserProfile } from '$lib/server/db/app-profile.schema';
import { eq } from 'drizzle-orm';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		const profile = await db.query.appUserProfile.findFirst({
			where: eq(appUserProfile.userId, session.user.id)
		});

		if (profile?.status === 'suspended') {
			return new Response('Account suspended', { status: 403 });
		}

		event.locals.session = session.session;
		event.locals.user = session.user;
		if (profile) {
			event.locals.profile = {
				displayName: profile.displayName,
				slug: profile.slug,
				bio: profile.bio,
				avatarUrl: profile.avatarUrl,
				status: profile.status
			};
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
