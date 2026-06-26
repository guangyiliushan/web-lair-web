import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// TODO: Generate Atom feed from published posts
	const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Lair</title>
  <link href="https://example.com/atom.xml" rel="self" />
</feed>`;

	return new Response(atom, {
		headers: { 'Content-Type': 'application/atom+xml' }
	});
};
