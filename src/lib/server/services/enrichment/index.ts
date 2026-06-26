// TODO: Enrichment service for LinkCard parsing

export interface EnrichmentResult {
	provider: string;
	title: string;
	description: string | null;
	imageUrl: string | null;
	url: string;
}

export async function enrichUrl(url: string): Promise<EnrichmentResult | null> {
	// TODO: Detect provider, call provider API, cache result
	return null;
}

export async function resolveLinkCardsForMarkdown(markdown: string): Promise<Record<string, EnrichmentResult>> {
	// TODO: Parse LinkCard markers from markdown, enrich each URL
	return {};
}
