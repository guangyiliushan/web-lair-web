import { createEditor, type LexicalEditor, type LexicalCommand } from 'lexical';
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
import { LinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { $setBlocksType } from '@lexical/selection';
import {
	$getRoot,
	$createParagraphNode,
	$createTextNode,
	$getSelection,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	CLEAR_EDITOR_COMMAND,
	UNDO_COMMAND,
	REDO_COMMAND,
	type TextFormatType
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
	HorizontalRuleNode
];

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
		if (firstChild?.getType?.() === 'list' && (firstChild as { getListType?: () => string })?.getListType?.() === 'bullet') {
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
		if (firstChild?.getType?.() === 'list' && (firstChild as { getListType?: () => string })?.getListType?.() === 'number') {
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

// ── 工具栏状态读取（封装 $ 前缀函数，避免 .svelte 文件直接导入）──

/** 工具栏需要追踪的格式状态 */
export interface ToolbarState {
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isStrikethrough: boolean;
	isCode: boolean;
	isHighlight: boolean;
	blockType: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'quote';
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
		isCode: false,
		isHighlight: false,
		blockType: 'paragraph'
	};

	if ($isRangeSelection(selection)) {
		state.isBold = selection.hasFormat('bold');
		state.isItalic = selection.hasFormat('italic');
		state.isUnderline = selection.hasFormat('underline');
		state.isStrikethrough = selection.hasFormat('strikethrough');
		state.isCode = selection.hasFormat('code');
		state.isHighlight = selection.hasFormat('highlight');
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
