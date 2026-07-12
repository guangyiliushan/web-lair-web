export type AlertType = 'info' | 'tip' | 'warning';

export const ALERT_LABELS: Record<AlertType, string> = {
	info: '信息',
	tip: '提示',
	warning: '警告'
};

export const DEFAULT_ALERT_TYPE: AlertType = 'info';

/**
 * 默认空段落 editor state JSON。
 * 嵌套编辑器初始化时使用此值。
 */
export function createDefaultAlertContent(): string {
	return JSON.stringify({
		root: {
			children: [
				{
					children: [],
					direction: null,
					format: '',
					indent: 0,
					type: 'paragraph',
					version: 1
				}
			],
			direction: null,
			format: '',
			indent: 0,
			type: 'root',
			version: 1
		}
	});
}
