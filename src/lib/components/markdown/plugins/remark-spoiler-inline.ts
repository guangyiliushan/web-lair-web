import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';
import type { PhrasingContent } from 'mdast';

/**
 * remark-spoiler-inline：将 ||text|| 转为 <span class="spoiler">text</span>。
 *
 * 这是 :::spoiler 容器指令的行内简写形式，对齐 Shiro 的 ||text|| 语法。
 * 操作 MDAST text 节点，通过正则匹配后拆分为 text + html 节点。
 */
export const remarkSpoilerInline: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'text', (node: Text, index, parent) => {
			if (!parent || index == null) return;
			// 匹配 ||text||（非贪婪，不跨行）
			const match = node.value.match(/^(.*?)(\|\|)(.+?)(\|\|)(.*)$/s);
			if (!match) return;

			const [, before, , inner, , after] = match;
			const replacement: PhrasingContent[] = [];
			if (before) replacement.push({ type: 'text', value: before });
			replacement.push({ type: 'html', value: '<span class="spoiler">' });
			replacement.push({ type: 'text', value: inner });
			replacement.push({ type: 'html', value: '</span>' });
			if (after) replacement.push({ type: 'text', value: after });
			parent.children.splice(index, 1, ...replacement);
			return [SKIP, index + replacement.length] as const;
		});
	};
};
