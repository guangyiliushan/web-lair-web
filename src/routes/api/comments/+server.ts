import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	// TODO: List comments for moderation
	return json({ data: [], meta: { pendingCount: 0, spamCount: 0 } });
};
