import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Return site configs
	return json({ data: {} });
};

export const PATCH: RequestHandler = async ({ request }) => {
	// TODO: Update configs
	return json({ data: null });
};
