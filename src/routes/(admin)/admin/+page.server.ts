import type { PageServerLoad } from './$types';
import { requireAdminOwner } from '$lib/server/authz';

export const load: PageServerLoad = (event) => {
	requireAdminOwner();
	return { user: event.locals.user, profile: event.locals.profile };
};
