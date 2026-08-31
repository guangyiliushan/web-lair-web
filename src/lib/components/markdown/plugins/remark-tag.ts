import type { Plugin } from 'unified';
import type { Root, Html, Text } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * remark-tag：将行内 `#内容#` 语法转换为彩色标签。
 *
 * 语法约束（与编辑器 tagTransformer 保持一致）：
 * - 标签内容不允许空白符与 `#`，不允许跨行
 * - 与 atx 标题不冲突：标题要求 `#` 后跟空格；且本插件只处理
 *   remark 已解析出的 text 节点（标题已被解析为 heading）
 *
 * 输出 `<span class="tag">内容</span>`（mdast html 节点），
 * 由后续 rehype-raw 解析为 HAST，class 在 sanitize 白名单内。
 */
const TAG_REGEX = /#([^#\s]+)#/g;

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const remarkTag: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'text', (node: Text, index, parent) => {
			if (!parent || index == null) return;

			const value = node.value;
			if (!value || !value.includes('#')) return;

			TAG_REGEX.lastIndex = 0;
			if (!TAG_REGEX.test(value)) return;
			TAG_REGEX.lastIndex = 0;

			const children: Array<Text | Html> = [];
			let last = 0;
			let match: RegExpExecArray | null;
			while ((match = TAG_REGEX.exec(value))) {
				if (match.index > last) {
					children.push({ type: 'text', value: value.slice(last, match.index) });
				}
				children.push({
					type: 'html',
					value: `<span class="tag">${escapeHtml(match[1])}</span>`
				});
				last = match.index + match[0].length;
			}
			if (last < value.length) {
				children.push({ type: 'text', value: value.slice(last) });
			}

			parent.children.splice(index, 1, ...children);
			// 跳过刚插入的节点（html 节点无需再访问）
			return index + children.length;
		});
	};
};
