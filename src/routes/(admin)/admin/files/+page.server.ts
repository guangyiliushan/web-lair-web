import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		headerTitle: '文件',
		headerActions: [
			{ label: '上传文件', iconName: 'upload', variant: 'default', href: '/admin/files/upload' },
			{ label: '访问站点', iconName: 'external-link', href: '/' }
		]
	};
};
