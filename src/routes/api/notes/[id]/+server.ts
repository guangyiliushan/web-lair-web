import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	return json({ data: null });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	return json({ data: null });
};

export const DELETE: RequestHandler = async ({ params }) => {
	return json({ data: null });
};
