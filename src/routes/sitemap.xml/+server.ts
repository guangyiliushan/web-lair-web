import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Generate dynamic sitemap from all published content
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com</loc>
  </url>
</urlset>`;

	return new Response(sitemap, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
