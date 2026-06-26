import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	// TODO: List notes with pagination
	return json({ data: [], meta: { total: 0, page: 1, limit: 10 } });
};

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Create note
	return json({ data: null }, { status: 201 });
};
