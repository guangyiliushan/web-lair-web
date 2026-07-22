import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		headerTitle: '说说',
		headerActions: [
			{ label: '新建', iconName: 'plus', variant: 'default', href: '/admin/says/new' }
		]
	};
};
