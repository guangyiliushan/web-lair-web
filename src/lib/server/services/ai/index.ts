// TODO: AI service for summary, translation, tags, title generation

export interface AiTaskResult {
	taskId: string;
	status: 'queued' | 'processing' | 'completed' | 'failed';
}

export async function summarizePost(postId: string, content: string): Promise<AiTaskResult> {
	throw new Error('Not implemented');
}

export async function translatePost(postId: string, content: string, targetLanguage: string): Promise<AiTaskResult> {
	throw new Error('Not implemented');
}

export async function generatePostTags(postId: string, content: string): Promise<AiTaskResult> {
	throw new Error('Not implemented');
}

export async function generatePostTitle(content: string): Promise<AiTaskResult> {
	throw new Error('Not implemented');
}
