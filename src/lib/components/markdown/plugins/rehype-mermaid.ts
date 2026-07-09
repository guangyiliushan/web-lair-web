import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * rehype-mermaid：将 language-mermaid 代码块转换为 <pre class="mermaid"> 挂载点。
 *
 * 必须在 rehype-pretty-code 之后运行（否则 Shiki 会高亮 mermaid 代码）。
 * 客户端需加载 mermaid.js 并执行 mermaid.run({ querySelector: '.mermaid' })。
 *
 * V1 标记为可选：若页面未加载 mermaid.js，则显示原始代码文本。
 */
export const rehypeMermaid: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'element', (node: Element) => {
			if (node.tagName !== 'pre') return;

			// rehype-pretty-code 可能将代码块包裹在 figure 中，检查直接子节点
			const child = node.children?.find(
				(c): c is Element => c.type === 'element' && c.tagName === 'code'
			);
			if (!child) return;

			const className = child.properties?.className;
			const classList = Array.isArray(className)
				? className
				: typeof className === 'string'
					? [className]
					: [];
			if (!classList.includes('language-mermaid')) return;

			// 提取代码内容
			const codeContent = (child.children ?? [])
				.filter((c) => c.type === 'text')
				.map((c) => (c as { value: string }).value)
				.join('');

			// 替换为 mermaid 挂载点
			node.tagName = 'pre';
			node.properties = { className: ['mermaid'] };
			node.children = [{ type: 'text', value: codeContent }];
		});
	};
};
