import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	// TODO: List posts with pagination and filters
	return json({ data: [], meta: { total: 0, page: 1, limit: 10 } });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// TODO: Create a new post
	const body = await request.json();
	return json({ data: null }, { status: 201 });
};
