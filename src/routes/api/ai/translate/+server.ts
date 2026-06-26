import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	// TODO: Trigger AI translation
	const body = await request.json();
	return json({ taskId: '', status: 'queued' });
};
