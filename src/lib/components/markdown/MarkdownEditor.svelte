<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { createEditor } from 'lexical';
	import {
		$getRoot as lexGetRoot,
		$createParagraphNode as lexCreateParagraphNode,
		$createTextNode as lexCreateTextNode,
		CLEAR_EDITOR_COMMAND,
		$getSelection as lexGetSelection,
		$isRangeSelection as lexIsRangeSelection,
		FORMAT_TEXT_COMMAND,
		UNDO_COMMAND,
		REDO_COMMAND,
		type LexicalCommand,
		type LexicalEditor,
		type TextFormatType,
	} from 'lexical';
	import {
		$convertToMarkdownString as lexConvertToMarkdownString,
		$convertFromMarkdownString as lexConvertFromMarkdownString,
		TRANSFORMERS
	} from '@lexical/markdown';
	import { registerHistory, createEmptyHistoryState } from '@lexical/history';
	import {
		ListNode,
		ListItemNode,
		INSERT_UNORDERED_LIST_COMMAND,
		INSERT_ORDERED_LIST_COMMAND
	} from '@lexical/list';
	import { LinkNode } from '@lexical/link';
	import { CodeNode, CodeHighlightNode } from '@lexical/code';
	import {
		HeadingNode,
		QuoteNode,
		$createHeadingNode as lexCreateHeadingNode,
		$createQuoteNode as lexCreateQuoteNode
	} from '@lexical/rich-text';
	import {
		HorizontalRuleNode,
		$createHorizontalRuleNode as lexCreateHorizontalRuleNode
	} from '@lexical/extension';
	import { renderMarkdownToHtml, type MarkdownEditorProps, type MarkdownEditorChangeDetail } from './markdown-config';

	// Tabler icons
	import IconBold from '@tabler/icons-svelte-runes/icons/bold';
	import IconItalic from '@tabler/icons-svelte-runes/icons/italic';
	import IconUnderline from '@tabler/icons-svelte-runes/icons/underline';
	import IconCode from '@tabler/icons-svelte-runes/icons/code';
	import IconH1 from '@tabler/icons-svelte-runes/icons/h-1';
	import IconH2 from '@tabler/icons-svelte-runes/icons/h-2';
	import IconH3 from '@tabler/icons-svelte-runes/icons/h-3';
	import IconList from '@tabler/icons-svelte-runes/icons/list';
	import IconListNumbers from '@tabler/icons-svelte-runes/icons/list-numbers';
	import IconBlockquote from '@tabler/icons-svelte-runes/icons/blockquote';
	import IconMath from '@tabler/icons-svelte-runes/icons/math';
	import IconClearFormatting from '@tabler/icons-svelte-runes/icons/clear-formatting';
	import IconArrowBackUp from '@tabler/icons-svelte-runes/icons/arrow-back-up';
	import IconArrowForwardUp from '@tabler/icons-svelte-runes/icons/arrow-forward-up';
	import IconSeparatorHorizontal from '@tabler/icons-svelte-runes/icons/separator-horizontal';

	// ── Props ──

	let {
		value,
		initialMarkdown,
		editable = true,
		placeholder = '开始输入...',
		theme = 'default',
		autofocus = false,
		showToolbar = true,
		showPreview = false,
		class: className,
		onChange,
		onBlur,
		onFocus
	}: MarkdownEditorProps & {
		onChange?: (detail: MarkdownEditorChangeDetail) => void;
		onBlur?: () => void;
		onFocus?: () => void;
	} = $props();

	// ── State ──

	let editorContainer = $state<HTMLDivElement>();
	let editorInstance = $state<LexicalEditor | null>(null);
	let previewHtml = $state('');

	// ── Editor initialization ──

	$effect(() => {
		const container = editorContainer;
		if (!container) return;

		const editor = createEditor({
			namespace: 'markdown-editor',
			nodes: [
				HeadingNode,
				ListNode,
				ListItemNode,
				QuoteNode,
				CodeNode,
				CodeHighlightNode,
				LinkNode,
				HorizontalRuleNode
			],
			onError: (error: Error) => {
				console.error('Lexical editor error:', error);
			},
			editable
		});

		editor.setRootElement(container);

		// Load initial content
		editor.update(() => {
			const root = lexGetRoot();
			const markdown = value ?? initialMarkdown;
			if (markdown) {
				try {
					lexConvertFromMarkdownString(markdown, TRANSFORMERS);
				} catch {
					root.clear();
					const p = lexCreateParagraphNode();
					p.append(lexCreateTextNode(markdown));
					root.append(p);
				}
			} else {
				root.clear();
				const p = lexCreateParagraphNode();
				root.append(p);
			}
		}, { discrete: true });

		// Register history
		registerHistory(editor, createEmptyHistoryState(), 300);

		// Content change listener
		const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => {
			let markdown = '';
			editorState.read(() => {
				markdown = lexConvertToMarkdownString(TRANSFORMERS);
			});

			const plainText = editorState.read(() => lexGetRoot().getTextContent());
			const isEmpty = editorState.read(() => {
				const root = lexGetRoot();
				const children = root.getChildren();
				return children.length === 1 &&
					children[0].getType() === 'paragraph' &&
					children[0].getTextContent().trim() === '';
			});

			const html = renderMarkdownToHtml(markdown);
			previewHtml = html;

			onChange?.({
				markdown,
				plainText,
				htmlPreview: html,
				isEmpty
			});
		});

		container.addEventListener('focus', () => onFocus?.(), true);
		container.addEventListener('blur', () => onBlur?.(), true);

		editorInstance = editor;

		if (autofocus) {
			setTimeout(() => container.focus(), 0);
		}

		return () => {
			unregisterUpdate();
			editor.setRootElement(null);
			editorInstance = null;
		};
	});

	// ── Toolbar helpers ──

	function dispatchCmd(editor: LexicalEditor | null, command: LexicalCommand<unknown>, payload?: unknown) {
		if (!editor) return;
		editor.dispatchCommand(command, payload);
	}

	function formatText(format: TextFormatType) {
		dispatchCmd(editorInstance, FORMAT_TEXT_COMMAND, format);
	}

	function setHeading(level: 1 | 2 | 3) {
		const ed = editorInstance;
		if (!ed) return;
		ed.update(() => {
			const selection = lexGetSelection();
			if (!lexIsRangeSelection(selection)) return;
			const heading = lexCreateHeadingNode(`h${level}` as 'h1' | 'h2' | 'h3');
			selection.insertNodes([heading]);
		});
	}
</script>

<div class={cn('flex flex-col gap-2', className)}>
	<!-- Toolbar -->
	{#if showToolbar && editable}
		<div class="flex flex-wrap items-center gap-1 rounded-lg border bg-background p-1">
			<Button variant="ghost" size="icon" onclick={() => dispatchCmd(editorInstance, UNDO_COMMAND)} aria-label="撤销">
				<IconArrowBackUp />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => dispatchCmd(editorInstance, REDO_COMMAND)} aria-label="重做">
				<IconArrowForwardUp />
			</Button>

			<Separator orientation="vertical" class="mx-1 h-6" />

			<Button variant="ghost" size="icon" onclick={() => setHeading(1)} aria-label="一级标题">
				<IconH1 />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => setHeading(2)} aria-label="二级标题">
				<IconH2 />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => setHeading(3)} aria-label="三级标题">
				<IconH3 />
			</Button>

			<Separator orientation="vertical" class="mx-1 h-6" />

			<Button variant="ghost" size="icon" onclick={() => formatText('bold')} aria-label="粗体">
				<IconBold />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => formatText('italic')} aria-label="斜体">
				<IconItalic />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => formatText('underline')} aria-label="下划线">
				<IconUnderline />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => formatText('code')} aria-label="行内代码">
				<IconCode />
			</Button>

			<Separator orientation="vertical" class="mx-1 h-6" />

			<Button variant="ghost" size="icon" onclick={() => dispatchCmd(editorInstance, INSERT_UNORDERED_LIST_COMMAND)} aria-label="无序列表">
				<IconList />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => dispatchCmd(editorInstance, INSERT_ORDERED_LIST_COMMAND)} aria-label="有序列表">
				<IconListNumbers />
			</Button>

			<Separator orientation="vertical" class="mx-1 h-6" />

			<Button variant="ghost" size="icon" onclick={() => {
				const ed = editorInstance;
				if (!ed) return;
				ed.update(() => {
					const selection = lexGetSelection();
					if (!lexIsRangeSelection(selection)) return;
					selection.insertNodes([lexCreateQuoteNode()]);
				});
			}} aria-label="引用块">
				<IconBlockquote />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => {
				const ed = editorInstance;
				if (!ed) return;
				const formula = prompt('输入 LaTeX 公式:', 'x^2 + y^2 = z^2');
				if (!formula) return;
				ed.update(() => {
					const selection = lexGetSelection();
					if (lexIsRangeSelection(selection)) {
						selection.insertRawText(`$${formula}$`);
					}
				});
			}} aria-label="插入公式">
				<IconMath />
			</Button>
			<Button variant="ghost" size="icon" onclick={() => {
				const ed = editorInstance;
				if (!ed) return;
				ed.update(() => {
					const selection = lexGetSelection();
					if (lexIsRangeSelection(selection)) {
						selection.insertNodes([lexCreateHorizontalRuleNode()]);
					}
				});
			}} aria-label="分隔线">
				<IconSeparatorHorizontal />
			</Button>

			<div class="flex-1"></div>

			<Button variant="ghost" size="icon" onclick={() => dispatchCmd(editorInstance, CLEAR_EDITOR_COMMAND)} aria-label="清除格式">
				<IconClearFormatting />
			</Button>
		</div>
	{/if}

	<!-- Editor + Preview layout -->
	<div class={cn('flex gap-4', showPreview ? '' : '')}>
		<div
			bind:this={editorContainer}
			role="textbox"
			aria-multiline="true"
			aria-label={placeholder}
			contenteditable={editable}
			class={cn(
				'min-h-48 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none',
				'focus-visible:ring-1 focus-visible:ring-ring',
				theme === 'compact' && 'min-h-32 px-3 py-2 text-xs',
				!editable && 'cursor-default opacity-70',
				showPreview ? 'flex-1' : ''
			)}
			data-placeholder={placeholder}
		></div>

		{#if showPreview && previewHtml}
			<div class="flex-1 overflow-y-auto rounded-lg border bg-background p-4">
				<div class="prose prose-sm max-w-none markdown-body
					[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/50 [&_pre]:p-4
					[&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5
					[&_pre_code]:bg-transparent [&_pre_code]:p-0
					[&_img]:max-w-full [&_img]:rounded-lg
					[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
					[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden
				">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html previewHtml}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	[data-placeholder]:empty::before {
		content: attr(data-placeholder);
		color: hsl(var(--muted-foreground));
		pointer-events: none;
	}
</style>
