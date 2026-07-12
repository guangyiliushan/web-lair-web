import {
	createEditor,
	type LexicalEditor,
	type LexicalCommand,
	type EditorThemeClasses
} from 'lexical';
import { registerRichText } from '@lexical/rich-text';
import { registerHistory, createEmptyHistoryState } from '@lexical/history';
import {
	registerMarkdownShortcuts,
	TRANSFORMERS,
	$convertToMarkdownString,
	$convertFromMarkdownString,
	type Transformer
} from '@lexical/markdown';
import {
	HeadingNode,
	QuoteNode,
	$createHeadingNode,
	$createQuoteNode,
	type HeadingTagType
} from '@lexical/rich-text';
import {
	ListNode,
	ListItemNode,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND
} from '@lexical/list';
import { LinkNode, $createLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode, $createCodeNode } from '@lexical/code';
import { HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { $setBlocksType } from '@lexical/selection';
import { TagNode, $createTagNode } from './tag-node';
import { AlertNode, $createAlertNode, $isAlertNode } from './alert-node';
import { DEFAULT_ALERT_TYPE, createDefaultAlertContent } from './alert-types';
import type { AlertType } from './alert-types';
import {
	$getRoot,
	$createParagraphNode,
	$createTextNode,
	$getSelection,
	$isRangeSelection,
	$isElementNode,
	FORMAT_TEXT_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	SELECTION_CHANGE_COMMAND,
	CLEAR_EDITOR_COMMAND,
	UNDO_COMMAND,
	REDO_COMMAND,
	type TextFormatType,
	type ElementFormatType
} from 'lexical';

export interface LexicalActionOptions {
	/** 初始 markdown（当无 editorState 时使用） */
	initialMarkdown?: string;
	/** 是否可编辑 */
	editable: boolean;
	/** 占位文本 */
	placeholder: string;
	/** 自动聚焦 */
	autofocus: boolean;
	/** 自定义 transformer（覆盖默认 TRANSFORMERS） */
	transformers?: Transformer[];
	/** 内容变化回调 */
	onChange?: (detail: {
		editorStateJson: string;
		markdown: string;
		plainText: string;
		isEmpty: boolean;
	}) => void;
	/** 将 editor 实例抛出给 Svelte $state */
	onEditorReady?: (editor: LexicalEditor) => void;
}

/** 编辑器节点注册列表 */
const EDITOR_NODES = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	CodeNode,
	CodeHighlightNode,
	LinkNode,
	HorizontalRuleNode,
	TagNode,
	AlertNode
];

/** 嵌套编辑器节点子集（不含 AlertNode 和 TagNode，防止无限嵌套） */
export const NESTED_EDITOR_NODES = [
	HeadingNode,
	ListNode,
	ListItemNode,
	QuoteNode,
	CodeNode,
	CodeHighlightNode,
	LinkNode,
	HorizontalRuleNode
];

/**
 * Lexical 编辑器 Theme 配置。
 *
 * 将各节点类型映射到语义化 CSS 类名，由组件层 CSS 提供实际样式。
 * 参考 Mx Space Admin 的 rich-heading-h1/h2/h3 命名惯例。
 *
 * 注意：类名通过 `:global()` 定义在 MarkdownEditor.svelte 的 scoped style 中，
 * 支持 Tailwind `@apply` 以确保与设计系统一致。
 */
export const EDITOR_THEME: EditorThemeClasses = {
	heading: {
		h1: 'rich-editor-h1',
		h2: 'rich-editor-h2',
		h3: 'rich-editor-h3',
		h4: 'rich-editor-h4',
		h5: 'rich-editor-h5',
		h6: 'rich-editor-h6'
	},
	list: {
		ul: 'rich-editor-ul',
		ol: 'rich-editor-ol',
		listitem: 'rich-editor-li',
		nested: {
			listitem: 'rich-editor-nested-li'
		}
	},
	quote: 'rich-editor-quote',
	code: 'rich-editor-code-block',
	text: {
		bold: 'rich-editor-bold',
		italic: 'rich-editor-italic',
		underline: 'rich-editor-underline',
		strikethrough: 'rich-editor-strikethrough',
		code: 'rich-editor-inline-code',
		highlight: 'rich-editor-highlight'
	}
};

/**
 * Svelte 5 Action：将 HTMLElement 绑定为 Lexical 编辑器。
 *
 * @example
 * ```svelte
 * <div use:lexicalEditor={{ editable, placeholder, onChange, onEditorReady }}></div>
 * ```
 */
export function lexicalEditor(node: HTMLElement, initialOptions: LexicalActionOptions) {
	// 可变引用容器：闭包始终读取 current，update 时只更新 current
	const optionsRef = { current: initialOptions };

	// 注意：不要在 createEditor 中设置 editable，否则后续 setEditable(true) 会是 no-op，
	// 导致 contenteditable 属性不会被写入 DOM，编辑器无法输入。
	const editor: LexicalEditor = createEditor({
		namespace: 'markdown-editor',
		nodes: EDITOR_NODES,
		theme: EDITOR_THEME,
		onError: (error: Error) => console.error('Lexical editor error:', error)
	});

	// 挂载 DOM
	editor.setRootElement(node);

	// 必须在 registerRichText 之前调用 setEditable，否则 RichTextPlugin
	// 初始化时看不到 editable=true，不会设置 contenteditable 属性。
	editor.setEditable(optionsRef.current.editable);

	// 注册插件并保存清理函数
	const unregisterRichText = registerRichText(editor);

	// 安全网：确保 contenteditable 属性已写入 DOM。
	// 某些 Lexical 版本中 setEditable 不会触发 DOM 属性更新，
	// 因此手动设置作为后备方案。
	if (optionsRef.current.editable && !node.hasAttribute('contenteditable')) {
		node.setAttribute('contenteditable', 'true');
	}

	// 注册 Markdown 快捷输入（# / > / - / ``` / 1. 等自动转换）
	const transformers = optionsRef.current.transformers ?? TRANSFORMERS;
	const unregisterMarkdownShortcuts = registerMarkdownShortcuts(editor, transformers);

	// 注册历史
	const unregisterHistory = registerHistory(editor, createEmptyHistoryState(), 300);

	// 加载初始内容
	editor.update(
		() => {
			const root = $getRoot();
			const md = optionsRef.current.initialMarkdown;
			if (md) {
				try {
					$convertFromMarkdownString(md, transformers);
				} catch {
					root.clear();
					const p = $createParagraphNode();
					p.append($createTextNode(md));
					root.append(p);
				}
			} else {
				root.clear();
				root.append($createParagraphNode());
			}
		},
		{ discrete: true }
	);

	// 注册更新监听——闭包通过 optionsRef.current 读取最新 options
	const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => {
		let markdown = '';
		let plainText = '';
		let isEmpty = false;
		editorState.read(() => {
			markdown = $convertToMarkdownString(transformers);
			plainText = $getRoot().getTextContent();
			const children = $getRoot().getChildren();
			isEmpty =
				children.length === 1 &&
				children[0].getType() === 'paragraph' &&
				children[0].getTextContent().trim() === '';
		});
		// 始终读取最新的 onChange 回调
		optionsRef.current.onChange?.({
			editorStateJson: JSON.stringify(editorState.toJSON()),
			markdown,
			plainText,
			isEmpty
		});
	});

	// 抛出 editor 实例
	optionsRef.current.onEditorReady?.(editor);

	// 自动聚焦
	if (optionsRef.current.autofocus) {
		setTimeout(() => node.focus(), 0);
	}

	// 焦点事件代理
	const focusListener = () => node.dispatchEvent(new CustomEvent('lexfocus'));
	const blurListener = () => node.dispatchEvent(new CustomEvent('lexblur'));
	node.addEventListener('focus', focusListener, true);
	node.addEventListener('blur', blurListener, true);

	return {
		update(newOptions: LexicalActionOptions) {
			// 更新引用容器——闭包自动读取最新值
			optionsRef.current = newOptions;
			// 同步 editable 状态（不重建 editor）
			if (editor.isEditable() !== newOptions.editable) {
				editor.setEditable(newOptions.editable);
				// 同步 contenteditable DOM 属性
				if (newOptions.editable) {
					node.setAttribute('contenteditable', 'true');
				} else {
					node.removeAttribute('contenteditable');
				}
			}
		},
		destroy() {
			unregisterUpdate();
			unregisterRichText();
			unregisterMarkdownShortcuts();
			unregisterHistory();
			node.removeEventListener('focus', focusListener, true);
			node.removeEventListener('blur', blurListener, true);
			editor.setRootElement(null);
		}
	};
}

// ── 导出供 toolbar 使用 ──
export {
	FORMAT_TEXT_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	SELECTION_CHANGE_COMMAND,
	CLEAR_EDITOR_COMMAND,
	UNDO_COMMAND,
	REDO_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
	INSERT_HORIZONTAL_RULE_COMMAND
};
export type { LexicalEditor, TextFormatType, LexicalCommand, HeadingTagType };

// ── Toolbar 辅助函数 ──

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

// ── 重导出 $ 前缀函数（供嵌套编辑器 .svelte 文件使用）──
// Svelte 5 不允许 .svelte 文件中直接 import $ 前缀的函数
// 通过别名重导出，使嵌套编辑器组件可以安全引用
export {
	$getRoot as getLexicalRoot,
	$createParagraphNode as createLexicalParagraph,
	$getSelection as getLexicalSelection,
	$isRangeSelection as isLexicalRangeSelection,
	$getNodeByKey as getLexicalNodeByKey
} from 'lexical';

// 来自 alert-node.ts 的 $ 前缀函数也需要别名
export { $isAlertNode as isAlertNode };
