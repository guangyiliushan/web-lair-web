<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { LexicalEditor, TextFormatType, LexicalCommand } from 'lexical';
	import {
		lexicalEditor,
		FORMAT_TEXT_COMMAND,
		UNDO_COMMAND,
		REDO_COMMAND,
		INSERT_UNORDERED_LIST_COMMAND,
		toggleHeading,
		toggleBulletList,
		toggleOrderedList,
		insertHorizontalRule
	} from './lexical-action';
	import {
		renderMarkdownToHtmlSync,
		type MarkdownEditorProps,
		type MarkdownEditorChangeDetail
	} from './markdown-config';

	// Tabler icons
	import IconBold from '@tabler/icons-svelte-runes/icons/bold';
	import IconItalic from '@tabler/icons-svelte-runes/icons/italic';
	import IconUnderline from '@tabler/icons-svelte-runes/icons/underline';
	import IconStrikethrough from '@tabler/icons-svelte-runes/icons/strikethrough';
	import IconCode from '@tabler/icons-svelte-runes/icons/code';
	import IconMath from '@tabler/icons-svelte-runes/icons/math';
	import IconArrowBackUp from '@tabler/icons-svelte-runes/icons/arrow-back-up';
	import IconArrowForwardUp from '@tabler/icons-svelte-runes/icons/arrow-forward-up';
	import IconList from '@tabler/icons-svelte-runes/icons/list';
	import IconListNumbers from '@tabler/icons-svelte-runes/icons/list-numbers';
	import IconListCheck from '@tabler/icons-svelte-runes/icons/list-check';
	import IconBlockquote from '@tabler/icons-svelte-runes/icons/blockquote';
	import IconSeparator from '@tabler/icons-svelte-runes/icons/separator';
	import IconH1 from '@tabler/icons-svelte-runes/icons/h-1';
	import IconH2 from '@tabler/icons-svelte-runes/icons/h-2';
	import IconH3 from '@tabler/icons-svelte-runes/icons/h-3';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconEyeOff from '@tabler/icons-svelte-runes/icons/eye-off';
	import IconHighlight from '@tabler/icons-svelte-runes/icons/highlight';
	import IconPhoto from '@tabler/icons-svelte-runes/icons/photo';
	import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle';
	import IconBulb from '@tabler/icons-svelte-runes/icons/bulb';
	import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle';
	import IconCodeDots from '@tabler/icons-svelte-runes/icons/code-dots';
	import {
		$getRoot as getLexicalRoot,
		$createParagraphNode as createLexicalParagraph,
		$createTextNode as createLexicalText
	} from 'lexical';

	let {
		value,
		initialMarkdown,
		editable = true,
		placeholder = '开始输入...',
		theme = 'default',
		autofocus = false,
		showToolbar = true,
		showPreview = false,
		stickyToolbar = false,
		borderless = false,
		class: className,
		onChange,
		onBlur,
		onFocus
	}: MarkdownEditorProps & {
		onChange?: (detail: MarkdownEditorChangeDetail) => void;
		onBlur?: () => void;
		onFocus?: () => void;
		stickyToolbar?: boolean;
		borderless?: boolean;
	} = $props();

	let editor: LexicalEditor | null = $state(null);
	let previewHtml = $state('');
	let previewVisible = $state(false);

	let _pvInit = false;
	$effect(() => {
		if (!_pvInit) {
			previewVisible = showPreview;
			_pvInit = true;
		}
	});

	function handleEditorReady(e: LexicalEditor) {
		editor = e;
	}

	function handleChange(detail: {
		editorStateJson: string;
		markdown: string;
		plainText: string;
		isEmpty: boolean;
	}) {
		const html = renderMarkdownToHtmlSync(detail.markdown);
		previewHtml = html;
		onChange?.({ ...detail, htmlPreview: html });
	}

	// ── 工具栏操作 ──
	function dispatchCmd(cmd: LexicalCommand<unknown>, payload?: unknown) {
		editor?.dispatchCommand(cmd, payload);
	}
	function formatText(format: TextFormatType) {
		editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format);
	}

	function insertCallout(type: string) {
		const calloutMd =
			type === 'info' ? '\n> **ℹ️ 注意**\n> \n'
			: type === 'tip' ? '\n> **💡 提示**\n> \n'
			: type === 'warning' ? '\n> **⚠️ 警告**\n> \n'
			: '';
		editor?.update(() => {
			const root = getLexicalRoot();
			const p = createLexicalParagraph();
			p.append(createLexicalText(calloutMd));
			root.append(p);
		});
	}
</script>

<div class={cn('flex flex-col', className)}>
	<!-- Toolbar -->
	{#if showToolbar && editable}
		<div
			class={cn(
				'flex w-full items-center gap-0.5 overflow-x-auto border-b px-1 py-1',
				stickyToolbar
					? 'sticky top-0 z-10 border-border bg-background/85 backdrop-blur'
					: 'border-border bg-background'
			)}
			role="toolbar"
			aria-label="编辑器工具栏"
		>
			<!-- Heading levels -->
			<Button variant="ghost" size="icon-sm" onclick={() => toggleHeading(editor!, 'h1')} aria-label="一级标题" title="一级标题">
				<IconH1 data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => toggleHeading(editor!, 'h2')} aria-label="二级标题" title="二级标题">
				<IconH2 data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => toggleHeading(editor!, 'h3')} aria-label="三级标题" title="三级标题">
				<IconH3 data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Undo / Redo -->
			<Button variant="ghost" size="icon-sm" onclick={() => dispatchCmd(UNDO_COMMAND)} aria-label="撤销" title="撤销">
				<IconArrowBackUp data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => dispatchCmd(REDO_COMMAND)} aria-label="重做" title="重做">
				<IconArrowForwardUp data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Inline formatting -->
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('bold')} aria-label="粗体" title="粗体">
				<IconBold data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('italic')} aria-label="斜体" title="斜体">
				<IconItalic data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('underline')} aria-label="下划线" title="下划线">
				<IconUnderline data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('strikethrough')} aria-label="删除线" title="删除线">
				<IconStrikethrough data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('code')} aria-label="行内代码" title="行内代码">
				<IconCode data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Highlight -->
			<Button variant="ghost" size="icon-sm" onclick={() => formatText('highlight')} aria-label="高亮" title="高亮">
				<IconHighlight data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Lists -->
			<Button variant="ghost" size="icon-sm" onclick={() => toggleBulletList(editor!)} aria-label="无序列表" title="无序列表">
				<IconList data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => toggleOrderedList(editor!)} aria-label="有序列表" title="有序列表">
				<IconListNumbers data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => dispatchCmd(INSERT_UNORDERED_LIST_COMMAND)} aria-label="待办列表" title="待办列表">
				<IconListCheck data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Blockquote -->
			<Button variant="ghost" size="icon-sm" aria-label="引用" title="引用">
				<IconBlockquote data-icon="inline-start" />
			</Button>

			<!-- Horizontal rule -->
			<Button variant="ghost" size="icon-sm" onclick={() => insertHorizontalRule(editor!)} aria-label="分割线" title="分割线">
				<IconSeparator data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Insert blocks -->
			<Button variant="ghost" size="icon-sm" onclick={() => insertCallout('info')} aria-label="Callout" title="Callout">
				<IconInfoCircle data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => insertCallout('tip')} aria-label="Tip" title="Tip">
				<IconBulb data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => insertCallout('warning')} aria-label="Warning" title="Warning">
				<IconAlertTriangle data-icon="inline-start" />
			</Button>
			<Button variant="ghost" size="icon-sm" aria-label="代码块" title="代码块">
				<IconCodeDots data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Image -->
			<Button variant="ghost" size="icon-sm" aria-label="插入图片" title="插入图片">
				<IconPhoto data-icon="inline-start" />
			</Button>

			<Separator orientation="vertical" decorative />

			<!-- Math -->
			<Button variant="ghost" size="icon-sm" aria-label="插入公式" title="插入公式">
				<IconMath data-icon="inline-start" />
			</Button>

			<div class="flex-1"></div>

			<!-- Toggle preview -->
			<Button
				variant="ghost"
				size="icon-sm"
				onclick={() => (previewVisible = !previewVisible)}
				aria-label={previewVisible ? '关闭预览' : '开启预览'}
				title={previewVisible ? '关闭预览' : '开启预览'}
			>
				{#if previewVisible}
					<IconEyeOff data-icon="inline-start" />
				{:else}
					<IconEye data-icon="inline-start" />
				{/if}
			</Button>
		</div>
	{/if}

	<!-- Editor area: wrapped in non-flex container to avoid Chrome bug where
	     contentEditable inside a flex container blocks typing -->
	<div class="min-h-0 flex-1">
		<div
			use:lexicalEditor={{
				initialMarkdown: value ?? initialMarkdown,
				editable,
				placeholder,
				autofocus,
				onChange: handleChange,
				onEditorReady: handleEditorReady
			}}
			role="textbox"
			aria-multiline="true"
			aria-label={placeholder}
			class={cn(
				'h-full min-h-48 w-full px-4 py-3 text-base leading-7 outline-none',
				'text-foreground',
				!borderless && 'rounded-lg border border-border bg-background',
				theme === 'compact' && 'min-h-32 px-3 py-2 text-sm',
				!editable && 'cursor-default opacity-70'
			)}
			data-placeholder={placeholder}
			onfocus={() => onFocus?.()}
			onblur={() => onBlur?.()}
		></div>
	</div>

	<!-- Preview area -->
	{#if previewVisible && previewHtml}
		<div class="overflow-y-auto rounded-lg border border-border bg-background p-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: HTML is sanitized by rehype-sanitize -->
			{@html previewHtml}
		</div>
	{/if}
</div>

<style>
	[data-placeholder]:empty::before {
		content: attr(data-placeholder);
		color: hsl(var(--muted-foreground) / 0.5);
		pointer-events: none;
	}
</style>
