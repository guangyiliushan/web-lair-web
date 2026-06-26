import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Generate RSS feed from published posts
	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Lair</title>
    <link>https://example.com</link>
    <description>Personal blog</description>
  </channel>
</rss>`;

	return new Response(rss, {
		headers: { 'Content-Type': 'application/rss+xml' }
	});
};
