import type { PageServerLoad } from './$types';
import { requireUser } from '$lib/server/authz';

export const load: PageServerLoad = (event) => {
	requireUser();
	return { user: event.locals.user, profile: event.locals.profile };
};
