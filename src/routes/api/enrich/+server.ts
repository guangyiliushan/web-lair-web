import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Enrich a URL and return structured card data
	const body = await request.json();
	return json({ data: null });
};
