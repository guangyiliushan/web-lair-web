import {
	type LexicalEditor,
	type ElementFormatType,
	$getSelection,
	$isRangeSelection,
	$isElementNode,
	$getRoot,
	$createParagraphNode,
	$createTextNode
} from 'lexical';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import {
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND
} from '@lexical/list';
import { $createLinkNode } from '@lexical/link';
import { $createCodeNode } from '@lexical/code';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { $setBlocksType } from '@lexical/selection';
import { $createTagNode } from '$lib/components/markdown/tag/tag-node';
import { $createAlertNode, $isAlertNode } from '$lib/components/markdown/alert/alert-node';
import { DEFAULT_ALERT_TYPE, createDefaultAlertContent } from '$lib/components/markdown/alert/alert-types';
import type { AlertType } from '$lib/components/markdown/alert/alert-types';

/** 切换标题级别：已是该级别则降为段落 */
export function toggleHeading(editor: LexicalEditor, level: HeadingTagType) {
	editor.update(() => {
		const selection = $getSelection();
		if (!selection) return;
		const nodes = selection.getNodes();
		if (nodes.length === 0) return;
		// 从选中节点的第一个节点向上查找块级父节点
		let block = nodes[0];
		let parent = block.getParent();
		while (parent && parent.getType() !== 'root') {
			block = parent;
			parent = parent.getParent();
		}
		const currentType = block.getType?.() ?? '';
		const currentTag = (block as { getTag?: () => string })?.getTag?.() ?? '';

		if (currentType === 'heading' && currentTag === level) {
			$setBlocksType(selection, () => $createParagraphNode());
		} else {
			$setBlocksType(selection, () => $createHeadingNode(level));
		}
	});
}

/** 切换引用块 */
export function toggleBlockquote(editor: LexicalEditor) {
	editor.update(() => {
		const selection = $getSelection();
		if (!selection) return;
		const nodes = selection.getNodes();
		if (nodes.length === 0) return;
		let block = nodes[0];
		let parent = block.getParent();
		while (parent && parent.getType() !== 'root') {
			block = parent;
			parent = parent.getParent();
		}
		if (block.getType?.() === 'quote') {
			$setBlocksType(selection, () => $createParagraphNode());
		} else {
			$setBlocksType(selection, () => $createQuoteNode());
		}
	});
}

/** 切换无序列表 */
export function toggleBulletList(editor: LexicalEditor) {
	editor.update(() => {
		const children = $getRoot().getChildren();
		const firstChild = children[0];
		if (
			firstChild?.getType?.() === 'list' &&
			(firstChild as { getListType?: () => string })?.getListType?.() === 'bullet'
		) {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		}
	});
}

/** 切换有序列表 */
export function toggleOrderedList(editor: LexicalEditor) {
	editor.update(() => {
		const children = $getRoot().getChildren();
		const firstChild = children[0];
		if (
			firstChild?.getType?.() === 'list' &&
			(firstChild as { getListType?: () => string })?.getListType?.() === 'number'
		) {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		}
	});
}

/** 插入水平分割线 */
export function insertHorizontalRule(editor: LexicalEditor) {
	editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
}

// ── 插入辅助：链接 / 图片 / 表格 / 待办（markdown 语法 + Lexical 节点混合）──

/**
 * 插入链接。选中文本包裹为 LinkNode（WYSIWYG），
 * 未选中时以 URL 为文本创建链接。
 */
export function insertLink(editor: LexicalEditor, url: string) {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		const text = selection.isCollapsed() ? url : selection.getTextContent();
		const linkNode = $createLinkNode(url);
		linkNode.append($createTextNode(text));
		selection.insertNodes([linkNode]);
	});
}

/**
 * 插入图片（markdown 语法 !\[alt](url)）。
 * 编辑器内显示为文本，渲染管线会转为 <img>。
 */
export function insertImage(editor: LexicalEditor, url: string, alt: string = '') {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		selection.insertNodes([$createTextNode(`![${alt}](${url})`)]);
	});
}

/**
 * 插入 3×2 Markdown 表格模板。
 * 编辑器内显示为文本，渲染管线会转为 <table>。
 */
export function insertTable(editor: LexicalEditor) {
	const tableMd =
		'\n| 列 1 | 列 2 | 列 3 |\n| --- | --- | --- |\n|     |     |     |\n|     |     |     |\n';
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		selection.insertNodes([$createTextNode(tableMd)]);
	});
}

/**
 * 插入代码块（CodeNode，WYSIWYG）。
 * 使用 Lexical 原生 CodeNode，编辑器内即可见代码块样式。
 */
export function insertCodeBlock(editor: LexicalEditor, language: string = '') {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		const codeNode = $createCodeNode(language);
		codeNode.append($createTextNode(''));
		selection.insertNodes([codeNode]);
	});
}

/**
 * 插入待办列表项。
 * 利用 Lexical ListNode + ListItemNode 的 checklist 变体。
 */
export function insertCheckList(editor: LexicalEditor) {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		// 通过 markdown 语法 `- [ ] ` 插入，由 TRANSFORMERS 转为 checklist
		selection.insertNodes([$createTextNode('- [ ] ')]);
	});
}

/**
 * 插入 Tag（内联彩色标签，TextNode 子类）。
 * 选中文本则转为 Tag，否则插入默认文本 "tag"。
 */
export function insertTag(editor: LexicalEditor) {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		const text = selection.isCollapsed() ? 'tag' : selection.getTextContent();
		const tagNode = $createTagNode(text);
		selection.insertNodes([tagNode]);
	});
}

export { $createAlertNode, $isAlertNode };

/**
 * 插入 Alert/Callout 结构化块（DecoratorNode）。
 * 替代原来的 markdown 文本 Callout 插入方式。
 */
export function insertAlert(editor: LexicalEditor, type: AlertType = DEFAULT_ALERT_TYPE) {
	editor.update(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;
		const alertNode = $createAlertNode(type, createDefaultAlertContent());
		selection.insertNodes([alertNode]);
	});
}

// ── 工具栏状态读取（封装 $ 前缀函数，避免 .svelte 文件直接导入）──

/** 工具栏需要追踪的格式状态 */
export interface ToolbarState {
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isStrikethrough: boolean;
	isSuperscript: boolean;
	isSubscript: boolean;
	isCode: boolean;
	isHighlight: boolean;
	blockType: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'check' | 'quote';
	/** 当前块级元素的对齐方式 */
	alignment: ElementFormatType | '';
}

/**
 * 在 editorState.read() 上下文中读取当前选区的格式状态。
 *
 * 封装 Lexical 的 $ 前缀函数，使 .svelte 文件无需直接导入它们
 * （Svelte 5 编译器会误将 $ 前缀解析为 store 自动订阅）。
 */
export function readToolbarState(): ToolbarState {
	const selection = $getSelection();
	const state: ToolbarState = {
		isBold: false,
		isItalic: false,
		isUnderline: false,
		isStrikethrough: false,
		isSuperscript: false,
		isSubscript: false,
		isCode: false,
		isHighlight: false,
		blockType: 'paragraph',
		alignment: ''
	};

	if ($isRangeSelection(selection)) {
		state.isBold = selection.hasFormat('bold');
		state.isItalic = selection.hasFormat('italic');
		state.isUnderline = selection.hasFormat('underline');
		state.isStrikethrough = selection.hasFormat('strikethrough');
		state.isSuperscript = selection.hasFormat('superscript');
		state.isSubscript = selection.hasFormat('subscript');
		state.isCode = selection.hasFormat('code');
		state.isHighlight = selection.hasFormat('highlight');

		// 读取当前块的对齐方式
		const anchorNode = selection.anchor.getNode();
		let el = anchorNode;
		while (el.getParent() !== null && $isElementNode(el.getParent())) {
			el = el.getParent()!;
		}
		if ($isElementNode(el)) {
			state.alignment = el.getFormatType() || '';
		}
	}

	const root = $getRoot();
	const firstChild = root.getChildren()[0];
	const type = firstChild?.getType?.() ?? 'paragraph';
	if (type === 'heading') {
		const tag = (firstChild as { getTag?: () => string }).getTag?.() ?? 'h1';
		state.blockType = tag as ToolbarState['blockType'];
	} else if (type === 'list') {
		const listType = (firstChild as { getListType?: () => string }).getListType?.() ?? 'bullet';
		state.blockType = listType === 'number' ? 'number' : 'bullet';
	} else if (type === 'quote') {
		state.blockType = 'quote';
	}

	return state;
}

/** 将当前块转换为段落（用于 BlockMenu 的"正文"选项） */
export function applyParagraph(editor: LexicalEditor) {
	editor.update(() => {
		const root = $getRoot();
		const children = root.getChildren();
		if (children[0]?.getType?.() !== 'paragraph') {
			root.clear();
			root.append($createParagraphNode());
		}
	});
}

/**
 * 获取当前文本选区的 DOM 矩形，用于浮动工具栏定位。
 * 返回 null 表示无有效选区。
 */
export function getSelectionRect(): DOMRect | null {
	const sel = window.getSelection();
	if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
	const range = sel.getRangeAt(0);
	// 忽略编辑器外的选区
	const editorRoot = document.querySelector('[data-lexical-editor="true"]');
	if (editorRoot && !editorRoot.contains(range.commonAncestorContainer)) return null;
	return range.getBoundingClientRect();
}

// 来自 alert-node.ts 的 $ 前缀函数也需要别名
export { $isAlertNode as isAlertNode };
