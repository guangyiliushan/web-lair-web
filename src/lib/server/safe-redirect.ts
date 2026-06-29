const FALLBACK = '/admin';

interface SafeRedirectOptions {
	allowedPrefix?: string;
}

export function safeRedirect(
	url: string | null | undefined,
	fallback = FALLBACK,
	options?: SafeRedirectOptions
): string {
	if (!url) return fallback;
	const trimmed = url.trim();

	// 拒绝以 http://, https://, //, \ 开头的外部 URL
	if (
		trimmed.startsWith('http://') ||
		trimmed.startsWith('https://') ||
		trimmed.startsWith('//') ||
		trimmed.startsWith('\\')
	) {
		return fallback;
	}

	// 只允许以 / 开头且不含 // 的相对路径
	if (trimmed.startsWith('/') && !trimmed.includes('//')) {
		if (options?.allowedPrefix && !trimmed.startsWith(options.allowedPrefix)) {
			return fallback;
		}

		return trimmed;
	}

	return fallback;
}
