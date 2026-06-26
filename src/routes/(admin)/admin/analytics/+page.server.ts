import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Aggregate analytics overview from OpenPanel API
	return {
		overview: {
			todayPv: 0,
			weekVisitors: 0,
			topPages: [] as { path: string; views: number }[],
			topOutgoingLinks: [] as { url: string; clicks: number }[]
		},
		dashboardUrl: ''
	};
};
