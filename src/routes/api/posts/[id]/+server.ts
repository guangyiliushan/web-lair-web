import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	// TODO: Get single post by ID
	return json({ data: null });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	// TODO: Update post
	const body = await request.json();
	return json({ data: null });
};

export const DELETE: RequestHandler = async ({ params }) => {
	// TODO: Delete post
	return json({ data: null });
};
