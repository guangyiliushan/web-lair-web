import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const allowAll = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;

	return new Response(allowAll, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
