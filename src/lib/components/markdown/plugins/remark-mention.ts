import type { Plugin } from 'unified';
import type { Root, Text, PhrasingContent } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';

const MENTION_RE = /^(.*?)(GH|TW|TG)@(\w+)(.*)$/s;

const PREFIX_MAP: Record<string, string> = {
	GH: 'https://github.com/',
	TW: 'https://twitter.com/',
	TG: 'https://t.me/'
};

/**
 * remark-mention：将 GH@user / TW@user / TG@user 转为 mention 链接。
 *
 * 对齐 Shiro 的 mention 扩展语法。
 */
export const remarkMention: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'text', (node: Text, index, parent) => {
			if (!parent || index == null) return;
			const match = node.value.match(MENTION_RE);
			if (!match) return;

			const [, before, prefix, username, after] = match;
			const url = PREFIX_MAP[prefix];
			if (!url) return;

			const replacement: PhrasingContent[] = [];
			if (before) replacement.push({ type: 'text', value: before });
			replacement.push({
				type: 'html',
				value: `<a class="mention" target="_blank" rel="noreferrer nofollow" href="${url}${username}">${username}</a>`
			});
			if (after) replacement.push({ type: 'text', value: after });
			parent.children.splice(index, 1, ...replacement);
			return [SKIP, index + replacement.length] as const;
		});
	};
};
