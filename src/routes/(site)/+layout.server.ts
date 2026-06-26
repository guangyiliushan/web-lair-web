import { loadNotesMegaData, loadPostsMegaData, loadTimelineMegaData } from '$lib/server/nav-data';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { auth } = await parent();
	const [postsData, notesData, timelineData] = await Promise.all([
		loadPostsMegaData(),
		loadNotesMegaData(),
		loadTimelineMegaData()
	]);

	return {
		auth,
		postsData,
		notesData,
		timelineData
	};
};
