import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Validate PROCESS_REPORTER_SECRET and ingest activity
	const secret = env.PROCESS_REPORTER_SECRET;
	if (!secret) {
		return json({ error: 'Not configured' }, { status: 501 });
	}

	const auth = request.headers.get('authorization');
	if (auth !== `Bearer ${secret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	// TODO: Store activity_event via ActivityService

	return json({ ok: true });
};
