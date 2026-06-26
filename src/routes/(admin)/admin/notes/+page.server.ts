import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Load note list from NoteService
	return {
		notes: [] as {
			id: string;
			title: string;
			slug: string;
			series: string | null;
			status: string;
			updatedAt: string;
		}[],
		totalCount: 0
	};
};
