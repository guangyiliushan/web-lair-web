import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Load comments for moderation
	return {
		comments: [] as {
			id: string;
			author: string;
			content: string;
			targetTitle: string;
			status: 'pending' | 'approved' | 'spam';
			createdAt: string;
		}[],
		pendingCount: 0,
		spamCount: 0
	};
};
