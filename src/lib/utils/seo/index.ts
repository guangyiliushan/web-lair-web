// TODO: SEO utility — build per-page meta tags from site settings + page data

export interface PageMeta {
	title: string;
	description: string;
	ogImage: string;
	canonical: string;
}

export function buildPageMeta(defaults: Partial<PageMeta>, overrides?: Partial<PageMeta>): PageMeta {
	return {
		title: overrides?.title ?? defaults.title ?? 'Lair',
		description: overrides?.description ?? defaults.description ?? '',
		ogImage: overrides?.ogImage ?? defaults.ogImage ?? '',
		canonical: overrides?.canonical ?? defaults.canonical ?? ''
	};
}
