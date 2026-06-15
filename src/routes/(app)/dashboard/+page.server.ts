import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireUser } from '$lib/server/authz';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = (event) => {
	requireUser();
	return { user: event.locals.user, profile: event.locals.profile };
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		redirect(302, '/login');
	}
};
