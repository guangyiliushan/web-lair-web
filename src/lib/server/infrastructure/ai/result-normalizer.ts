// TODO: Normalize AI responses into consistent format

export interface NormalizedResult {
	type: 'summary' | 'translation' | 'tags' | 'title';
	content: string | string[];
}

export function normalizeSummary(raw: string): NormalizedResult {
	return { type: 'summary', content: raw.trim() };
}

export function normalizeTranslation(raw: string): NormalizedResult {
	return { type: 'translation', content: raw.trim() };
}

export function normalizeTags(raw: string): NormalizedResult {
	try {
		return { type: 'tags', content: JSON.parse(raw) };
	} catch {
		return { type: 'tags', content: raw.split(',').map((t) => t.trim()) };
	}
}

export function normalizeTitle(raw: string): NormalizedResult {
	return { type: 'title', content: raw.trim() };
}
