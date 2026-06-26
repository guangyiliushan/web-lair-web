const FALLBACK = '/admin';

export function safeRedirect(url: string | null | undefined, fallback = FALLBACK): string {
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
		return trimmed;
	}

	return fallback;
}
