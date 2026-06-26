import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// TODO: Load post list with filters from PostService
	const status = url.searchParams.get('status') ?? undefined;
	const category = url.searchParams.get('category') ?? undefined;
	const keyword = url.searchParams.get('keyword') ?? undefined;
	const page = Number(url.searchParams.get('page') ?? '1');

	return {
		posts: [] as {
			id: string;
			title: string;
			slug: string;
			status: string;
			category: string | null;
			tags: string[];
			updatedAt: string;
		}[],
		filters: { status, category, keyword, page },
		totalCount: 0,
		categories: [] as { name: string; slug: string }[],
		tags: [] as { name: string; slug: string }[]
	};
};
