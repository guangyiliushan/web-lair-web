/**
 * Markdown 组件模块统一导出。
 * 
 * @module markdown
 * @description 提供基于 Lexical 的 WYSIWYG 编辑器与基于 markdown-it 的安全渲染器。
 */

export { default as MarkdownRenderer } from './MarkdownRenderer.svelte';
export { default as MarkdownEditor } from './MarkdownEditor.svelte';

export {
	getMarkdownRenderer,
	renderMarkdownToHtml,
	sanitizeRenderedHtml,
	clearRendererCache
} from './markdown-config';

export type {
	MarkdownFeatureFlags,
	MarkdownRenderOptions,
	MarkdownEditorProps,
	MarkdownEditorChangeDetail,
	MarkdownRendererProps
} from './markdown-config';
