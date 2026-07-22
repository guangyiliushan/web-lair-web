import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		headerTitle: '页面',
		headerActions: [
			{ label: '新建', iconName: 'plus', variant: 'default', href: '/admin/pages/new' }
		]
	};
};
