/**
 * 编辑器自定义 Markdown Transformer 集合。
 *
 * Lexical 的 markdown 往返（$convertToMarkdownString / $convertFromMarkdownString）
 * 只认识已注册 Transformer 的节点——缺少 Transformer 的自定义节点在往返中会丢失。
 *
 * 本模块为 TagNode（`#text#`）与 AlertNode（`:::info ... :::`）提供：
 * - 导出（Lexical 树 → Markdown）
 * - 导入（Markdown → Lexical 树）
 * - Alert 嵌套内容的 editorState JSON ↔ Markdown 互转助手
 *
 * 参考：
 * - https://lexical.dev/docs/packages/lexical-markdown
 * - @lexical/markdown@0.46.0 MultilineElementTransformer（regExpStart/regExpEnd/linesInBetween）
 */
import {
	createEditor,
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	type LexicalEditor
} from 'lexical';
import {
	TRANSFORMERS,
	$convertFromMarkdownString,
	$convertToMarkdownString,
	type MultilineElementTransformer,
	type TextMatchTransformer,
	type Transformer
} from '@lexical/markdown';
import { TagNode, $createTagNode, $isTagNode } from '$lib/components/markdown/tag/tag-node';
import {
	AlertNode,
	$createAlertNode,
	$isAlertNode
} from '$lib/components/markdown/alert/alert-node';
import type { AlertType } from '$lib/components/markdown/alert/alert-types';
import { DEFAULT_ALERT_TYPE } from '$lib/components/markdown/alert/alert-types';
import { EDITOR_THEME, NESTED_EDITOR_NODES } from '$lib/components/markdown/editor/editor-shared';

// ── Tag：`#内容#` → TagNode ──

/**
 * 行内标签 Transformer。
 *
 * 语法约束（有意为之，见设计文档 §8）：
 * - 标签内容不允许空白符与 `#`，不允许跨行
 * - 与标题语法不冲突：HEADING 要求 `#` 后跟空格，而标签内容首字符非空白
 */
export const tagTransformer: TextMatchTransformer = {
	dependencies: [TagNode],
	importRegExp: /#([^#\s]+)#/,
	regExp: /#([^#\s]+)#$/,
	trigger: '#',
	replace: (textNode, match) => {
		const tagNode = $createTagNode(match[1]);
		textNode.replace(tagNode);
	},
	export: (node) => {
		if (!$isTagNode(node)) return null;
		return `#${node.getTextContent()}#`;
	},
	type: 'text-match'
};

// ── Alert：`:::info ... :::` → AlertNode ──

/** Alert 容器起始行，如 `:::info` / `:::tip` / `:::warning` */
const ALERT_START_REGEX = /^:::(info|tip|warning)\s*$/;
/** Alert 容器结束行 `:::` */
const ALERT_END_REGEX = /^:::\s*$/;

/**
 * 嵌套编辑器内容使用的 transformer 子集。
 *
 * 嵌套编辑器不注册 TagNode/AlertNode（防无限嵌套），
 * 因此 alert 内部的 markdown 使用标准 transformer 解析。
 */
export const NESTED_EDITOR_TRANSFORMERS: Transformer[] = [...TRANSFORMERS];

// 复用的临时嵌套编辑器（headless，无 DOM）。
// 每次导出新建编辑器开销过大，这里模块级缓存一个实例（见设计文档 §8 升级点标注）。
let nestedTempEditor: LexicalEditor | null = null;

function getNestedTempEditor(): LexicalEditor {
	if (!nestedTempEditor) {
		nestedTempEditor = createEditor({
			namespace: 'markdown-nested-temp',
			nodes: NESTED_EDITOR_NODES,
			theme: EDITOR_THEME,
			onError: (error: Error) => console.error('Nested temp editor error:', error)
		});
	}
	return nestedTempEditor;
}

/** Markdown → Alert 嵌套编辑器 editorState JSON（解析失败时降级为纯文本段落） */
export function markdownToAlertJson(markdown: string): string {
	const editor = getNestedTempEditor();
	editor.update(
		() => {
			const root = $getRoot();
			root.clear();
			try {
				$convertFromMarkdownString(markdown, NESTED_EDITOR_TRANSFORMERS);
			} catch {
				root.clear();
				const p = $createParagraphNode();
				p.append($createTextNode(markdown));
				root.append(p);
			}
		},
		{ discrete: true }
	);
	return JSON.stringify(editor.getEditorState().toJSON());
}

/** Alert 嵌套编辑器 editorState JSON → Markdown（JSON 非法时返回空串） */
export function alertJsonToMarkdown(json: string): string {
	if (!json?.trim()) return '';
	const editor = getNestedTempEditor();
	try {
		const state = editor.parseEditorState(json);
		let markdown = '';
		state.read(() => {
			markdown = $convertToMarkdownString(NESTED_EDITOR_TRANSFORMERS);
		});
		return markdown;
	} catch {
		return '';
	}
}

/**
 * Alert 容器 Transformer（多行块）。
 *
 * - 导入：`:::info` 行与 `:::` 行之间的内容（linesInBetween）作为 markdown
 *   解析进嵌套编辑器 JSON，生成 AlertNode。
 * - 导出：将嵌套 JSON 反解为 markdown，包回 `:::type ... :::` 围栏。
 *
 * 已知限制：内容中若出现行首 `:::` 会提前终止容器（与代码围栏同理）。
 */
export const alertTransformer: MultilineElementTransformer = {
	dependencies: [AlertNode],
	regExpStart: ALERT_START_REGEX,
	regExpEnd: ALERT_END_REGEX,
	replace: (rootNode, children, startMatch, _endMatch, linesInBetween, isImport) => {
		// 仅处理 markdown 导入；编辑器内打字快捷输入不触发（多行块需要显式插入）
		if (!isImport || children) return false;
		const type = (startMatch[1] ?? DEFAULT_ALERT_TYPE) as AlertType;
		const markdown = (linesInBetween ?? []).join('\n').trim();
		rootNode.append($createAlertNode(type, markdownToAlertJson(markdown)));
	},
	export: (node) => {
		if (!$isAlertNode(node)) return null;
		const inner = alertJsonToMarkdown(node.__jsonContent);
		return `:::${node.__alertType}\n${inner}\n:::`;
	},
	type: 'multiline-element'
};

// ── 聚合 ──

/**
 * 编辑器完整 transformer 列表：核心语法 + Tag + Alert。
 *
 * 顺序约定：自定义 transformer 在前（multiline 导入逐 transformer 尝试，
 * text-match 导出逐 transformer 尝试，靠前者优先），核心 TRANSFORMERS 在后。
 */
export const EDITOR_TRANSFORMERS: Transformer[] = [
	tagTransformer,
	alertTransformer,
	...TRANSFORMERS
];
