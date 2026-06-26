import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	// TODO: Trigger AI summary generation
	const body = await request.json();
	return json({ taskId: '', status: 'queued' });
};
