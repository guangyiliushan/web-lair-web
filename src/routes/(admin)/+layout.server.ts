import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/authz';

export const load: LayoutServerLoad = async ({ locals }) => {
	requireUser();

	return {
		auth: {
			user: locals.user,
			profile: locals.profile
		}
	};
};
