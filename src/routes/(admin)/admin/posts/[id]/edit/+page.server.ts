import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// TODO: Load single post + translations + AI task status
	return {
		post: null as {
			id: string;
			title: string;
			slug: string;
			content: string;
			status: string;
			categoryId: string | null;
			tagIds: string[];
		} | null,
		categories: [] as { id: string; name: string; slug: string }[],
		tags: [] as { id: string; name: string; slug: string }[],
		translations: [] as { id: string; language: string }[],
		aiTasks: [] as { id: string; type: string; status: string }[]
	};
};

export const actions = {} satisfies Actions;
