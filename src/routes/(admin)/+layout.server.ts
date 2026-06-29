import type { LayoutServerLoad } from './$types';
import { requireAdminOwner } from '$lib/server/authz';

export const load: LayoutServerLoad = async (event) => {
	await requireAdminOwner();

	return {
		auth: {
			user: event.locals.user,
			profile: event.locals.profile
		}
	};
};
