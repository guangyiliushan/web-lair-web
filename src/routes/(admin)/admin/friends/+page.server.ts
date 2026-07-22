import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		headerTitle: '朋友们',
		headerActions: [
			{ label: '添加友链', iconName: 'user-plus', variant: 'default', href: '/admin/friends/new' },
			{ label: '访问站点', iconName: 'external-link', href: '/' }
		]
	};
};
