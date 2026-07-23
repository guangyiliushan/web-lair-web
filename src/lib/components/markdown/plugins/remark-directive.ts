import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { ContainerDirective } from 'mdast-util-directive';
import type { BlockContent } from 'mdast';

/**
 * remark-directive：将 remark-directive 解析的容器指令转换为 HTML 节点。
 *
 * 支持的指令语法：
 * - :::spoiler\n隐藏内容\n:::          → <div class="spoiler-container">隐藏内容</div>
 * - :::gallery\n![img](url)\n:::        → <div class="gallery">...</div>
 * - :::banner{variant="info"}\n文本\n::: → <div class="banner banner-info">文本</div>
 *
 * remark-directive 将 :::name ... ::: 解析为 ContainerDirective 节点，
 * 此插件负责将其转为 mdast html 节点，后续由 rehype-raw 解析为 HAST。
 */
export const remarkContainerDirective: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, (node, index, parent) => {
			if (node.type !== 'containerDirective' || !parent || index == null) return;

			const directive = node as unknown as ContainerDirective;
			const name = directive.name;

			// 仅处理已知的容器类型
			if (!['spoiler', 'gallery', 'banner'].includes(name)) return;

			// 提取子节点的文本内容
			const innerHtml = (directive.children as BlockContent[])
				.map((child: BlockContent) => {
					if (child.type === 'paragraph') {
						return child.children.map((c) => ('value' in c ? c.value : '')).join('');
					}
					return '';
				})
				.filter(Boolean)
				.join('<br>\n');

			const attributes = directive.attributes as Record<string, string> | undefined;
			const variant = attributes?.variant ?? '';

			let html = '';
			switch (name) {
				case 'spoiler':
					html = `<div class="spoiler-container">${innerHtml}</div>`;
					break;
				case 'gallery':
					html = `<div class="gallery">${innerHtml}</div>`;
					break;
				case 'banner':
					html = `<div class="banner banner-${variant || 'default'}">${innerHtml}</div>`;
					break;
			}

			// 替换为 html 节点（rehype-raw 会解析）
			parent.children.splice(index, 1, {
				type: 'html',
				value: html
			});
		});
	};
};
