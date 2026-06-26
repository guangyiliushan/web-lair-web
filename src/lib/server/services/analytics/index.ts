// TODO: Analytics service for admin overview
export async function getAnalyticsOverview(): Promise<{
	todayPv: number;
	weekVisitors: number;
	topPages: { path: string; views: number }[];
	topOutgoingLinks: { url: string; clicks: number }[];
}> {
	return {
		todayPv: 0,
		weekVisitors: 0,
		topPages: [],
		topOutgoingLinks: []
	};
}

export async function getOpenPanelConfig(): Promise<{
	enabled: boolean;
	dashboardUrl: string;
}> {
	return { enabled: false, dashboardUrl: '' };
}
