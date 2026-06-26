// TODO: AI provider adapter — abstracts OpenAI/Anthropic/etc.

export interface AiProviderConfig {
	provider: 'openai' | 'anthropic';
	apiKey: string;
	model: string;
}

export interface AiCompletionResult {
	content: string;
	usage: { promptTokens: number; completionTokens: number };
}

export async function complete(
	config: AiProviderConfig,
	prompt: string
): Promise<AiCompletionResult> {
	// TODO: Route to correct provider
	throw new Error('Not implemented');
}
