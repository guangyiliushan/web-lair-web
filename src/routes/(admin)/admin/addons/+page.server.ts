import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		headerTitle: '附加功能'
	};
};
