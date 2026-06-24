import { loadPostsMegaData, loadNotesMegaData, loadTimelineMegaData } from '$lib/server/nav-data';

export const load = async ({ locals }: Parameters<import('./$types').LayoutServerLoad>[0]) => {
	const { user, profile } = locals;

	const [postsData, notesData, timelineData] = await Promise.all([
		loadPostsMegaData(),
		loadNotesMegaData(),
		loadTimelineMegaData()
	]);

	if (!user) {
		return { auth: null, postsData, notesData, timelineData };
	}

	return {
		auth: {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				image: user.image ?? null
			},
			profile: profile
				? {
						displayName: profile.displayName,
						avatarUrl: profile.avatarUrl ?? null
					}
				: null
		},
		postsData,
		notesData,
		timelineData
	};
};
