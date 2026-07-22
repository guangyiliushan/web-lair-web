import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// TODO: Load post list with filters from PostService
	const status = url.searchParams.get('status') ?? undefined;
	const category = url.searchParams.get('category') ?? undefined;
	const keyword = url.searchParams.get('keyword') ?? undefined;
	const page = Number(url.searchParams.get('page') ?? '1');

	return {
		headerTitle: '博文',
		headerActions: [
			{ label: '分类', iconName: 'category', href: '/admin/posts/categories' },
			{ label: '标签', iconName: 'tag', href: '/admin/posts/tags' },
			{ label: '新建', iconName: 'plus', variant: 'default', href: '/admin/posts/edit' }
		],
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
