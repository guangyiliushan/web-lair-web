/**
 * Markdown 组件模块统一导出。
 *
 * @module markdown
 * @description 基于 Unified (remark/rehype) 渲染管线 + Lexical 编辑器的 Markdown 组件层。
 */

export { default as MarkdownRenderer } from './MarkdownRenderer.svelte';
export { default as MarkdownEditor } from './MarkdownEditor.svelte';
export { default as EditorToolbar } from './EditorToolbar.svelte';
export { default as FloatingFormatToolbar } from './FloatingFormatToolbar.svelte';
export { default as EditorDebugDialog } from './EditorDebugDialog.svelte';
export { default as CodeModeToggle } from './CodeModeToggle.svelte';

export {
	renderMarkdownToHtmlSync,
	clearRendererCache,
	buildSanitizeSchema
} from './markdown-config';

export type {
	MarkdownFeatureFlags,
	MarkdownRenderOptions,
	MarkdownEditorProps,
	MarkdownEditorChangeDetail,
	MarkdownRendererProps
} from './markdown-config';

export { $createAlertNode, $isAlertNode, insertAlert } from './lexical-action';
export type { AlertType } from './alert-types';
export type { SerializedAlertNode } from './alert-node';

// 服务端渲染（仅在 server context 可用）
// 注：不要在这里 re-export src/lib/server/markdown.ts，
// 由调用方直接 import '$lib/server/markdown' 以确保 server-only 边界。
