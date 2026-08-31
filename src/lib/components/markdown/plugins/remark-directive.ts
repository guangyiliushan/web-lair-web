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
 * - :::info\n任意嵌套 Markdown\n:::      → <div class="callout callout-info">…</div>
 * - :::tip / :::warning                  → <div class="callout callout-tip|warning">…</div>
 *
 * info/tip/warning（callout）通过 data.hName/hProperties 转换为 hast 元素，
 * 嵌套子节点（列表/标题/代码块等）由 remark-rehype 正常递归渲染——
 * 这是 remark-directive 官方推荐做法，避免手工拼接 HTML 丢失嵌套内容。
 *
 * 其余指令（spoiler/gallery/banner）沿用「替换为 mdast html 节点」的旧路径，
 * 由后续 rehype-raw 解析为 HAST。
 */
export const remarkContainerDirective: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, (node, index, parent) => {
			if (node.type !== 'containerDirective' || !parent || index == null) return;

			const directive = node as unknown as ContainerDirective;
			const name = directive.name;

			// ── callout 类指令：保留嵌套子节点 ──
			if (['info', 'tip', 'warning'].includes(name)) {
				const data = directive.data ?? (directive.data = {});
				data.hName = 'div';
				data.hProperties = { class: `callout callout-${name}` };
				return; // 不替换节点，子节点走正常渲染管线
			}

			// ── 旧路径指令：仅处理已知的容器类型 ──
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
