import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Load categories, tags, AI model availability
	return {
		categories: [] as { id: string; name: string; slug: string }[],
		tags: [] as { id: string; name: string; slug: string }[],
		aiAvailable: false
	};
};

export const actions = {} satisfies Actions;
