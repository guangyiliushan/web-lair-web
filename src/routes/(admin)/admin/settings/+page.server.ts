import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Load site settings grouped by category
	return {
		groups: {
			site: {},
			hero: {},
			footer: {},
			rss: {},
			seo: {},
			openpanel: {},
			activity: {},
			ai: {},
			integrations: {}
		},
		readiness: {
			ghTokenSet: false,
			tmdbApiKeySet: false,
			openaiApiKeySet: false,
			anthropicApiKeySet: false
		}
	};
};

export const actions = {} satisfies Actions;
