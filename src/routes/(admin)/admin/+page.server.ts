import type { PageServerLoad } from './$types';
import { requireAdminOwner } from '$lib/server/authz';

export const load: PageServerLoad = async (event) => {
	await requireAdminOwner();
	return { user: event.locals.user, profile: event.locals.profile };
};
