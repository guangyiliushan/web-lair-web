import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Load note list from NoteService
	return {
		headerTitle: '手记',
		headerActions: [
			{ label: '新建', iconName: 'plus', variant: 'default', href: '/admin/notes/edit' },
			{ label: '专栏', iconName: 'external-link', href: '/admin/notes/topics' }
		],
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
