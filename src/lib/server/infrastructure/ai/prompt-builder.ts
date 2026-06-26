// TODO: Build prompts for summarization, translation, tag generation, title generation

export function buildSummaryPrompt(content: string): string {
	return `Please summarize the following content:\n\n${content}`;
}

export function buildTranslationPrompt(content: string, targetLanguage: string): string {
	return `Translate the following text to ${targetLanguage}:\n\n${content}`;
}

export function buildTagsPrompt(content: string): string {
	return `Generate relevant tags for the following content. return as JSON array:\n\n${content}`;
}

export function buildTitlePrompt(content: string): string {
	return `Generate a concise title for the following content:\n\n${content}`;
}
