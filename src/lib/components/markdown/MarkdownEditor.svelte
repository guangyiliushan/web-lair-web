<script lang="ts">
	import { cn } from '$lib/utils';
	import { Textarea } from '$lib/components/ui/textarea';
	import { mount, unmount } from 'svelte';
	import type { LexicalEditor } from 'lexical';
	import { lexicalEditor, EDITOR_THEME } from './lexical-action';
	import {
		renderMarkdownToHtmlSync,
		type MarkdownEditorProps,
		type MarkdownEditorChangeDetail
	} from './markdown-config';
	import EditorToolbar from './EditorToolbar.svelte';
	import FloatingFormatToolbar from './FloatingFormatToolbar.svelte';
	import BlockHandleToolbar from './BlockHandleToolbar.svelte';
	import CodeModeToggle from './CodeModeToggle.svelte';
	import { setEditorContext } from './editor-context';

	// Lexical 编辑器全局样式（由 PostCSS 处理 @apply / Tailwind 指令）
	import './lexical-editor.css';

	import {
		$getRoot as getLexicalRoot,
		$createParagraphNode as createLexicalParagraph,
		$createTextNode as createLexicalText
	} from 'lexical';
	import {
		$convertToMarkdownString as convertToMarkdown,
		$convertFromMarkdownString as convertFromMarkdown,
		TRANSFORMERS
	} from '@lexical/markdown';

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

	// ── Editor Context ──
	const editorRuntime = {
		editor: null as LexicalEditor | null,
		theme: EDITOR_THEME,
		onError: (error: Error) => console.error('Lexical editor error:', error)
	};
	setEditorContext(editorRuntime);

	let editor: LexicalEditor | null = $state(null);
	let previewHtml = $state('');
	let previewVisible = $state(false);
	let codeMode = $state(false);
	let codeModeText = $state('');

	// 同步 codeModeText 与 Lexical 内容
	let _pvInit = false;
	$effect(() => {
		if (!_pvInit) {
			previewVisible = showPreview;
			_pvInit = true;
		}
	});

	function handleEditorReady(e: LexicalEditor) {
		editor = e;
		editorRuntime.editor = e;
	}

	// ── Block Handle Toolbar: portal to document.body ──
	let blockHandleApp: Record<string, any> | null = null;

	$effect(() => {
		// 当 editor 就绪且 editable 时挂载 block handle
		if (editor && editable) {
			blockHandleApp = mount(BlockHandleToolbar, {
				target: document.body,
				props: { editor: editor as LexicalEditor }
			});
		}

		return () => {
			if (blockHandleApp) {
				unmount(blockHandleApp);
				blockHandleApp = null;
			}
		};
	});

	function handleChange(detail: {
		editorStateJson: string;
		markdown: string;
		plainText: string;
		isEmpty: boolean;
	}) {
		codeModeText = detail.markdown;
		const html = renderMarkdownToHtmlSync(detail.markdown);
		previewHtml = html;
		onChange?.({ ...detail, htmlPreview: html });
	}

	// 代码模式 → 切换回富文本时，将编辑后的 markdown 同步回 Lexical
	function toggleCodeMode() {
		if (!codeMode) {
			// 进入代码模式：从 Lexical 导出 markdown（保留标题/列表等格式）
			editor?.getEditorState().read(() => {
				codeModeText = convertToMarkdown(TRANSFORMERS);
			});
		} else {
			// 退出代码模式：将编辑后的 markdown 解析回 Lexical 节点树
			editor?.update(
				() => {
					const root = getLexicalRoot();
					root.clear();
					try {
						convertFromMarkdown(codeModeText, TRANSFORMERS);
					} catch {
						// 解析失败时作为纯文本回退
						const p = createLexicalParagraph();
						p.append(createLexicalText(codeModeText));
						root.append(p);
					}
				},
				{ discrete: true }
			);
		}
		codeMode = !codeMode;
	}

	// 代码模式下手动输入时同步 onChange
	function onCodeModeInput(e: Event) {
		const target = e.currentTarget as HTMLTextAreaElement;
		codeModeText = target.value;
		const html = renderMarkdownToHtmlSync(target.value);
		previewHtml = html;
		onChange?.({
			editorStateJson: '',
			markdown: target.value,
			plainText: target.value,
			htmlPreview: html,
			isEmpty: !target.value.trim()
		});
	}
</script>

<div class={cn('flex flex-col', className)}>
	<!-- Toolbar -->
	{#if showToolbar && editable}
		<div class={cn('flex min-w-0 items-center gap-0.5', stickyToolbar && 'sticky top-14 z-10 border-b border-border bg-background/80 backdrop-blur-sm')}>
			<EditorToolbar
				{editor}
				{previewVisible}
				onTogglePreview={() => (previewVisible = !previewVisible)}
				class="min-w-0 flex-1"
			/>
			<CodeModeToggle {codeMode} onToggle={toggleCodeMode} />
		</div>

		<!-- 浮动格式工具栏：选中文本时出现 -->
		<FloatingFormatToolbar {editor} />
	{/if}

	<!-- Editor area -->
	<div class="min-h-0 flex-1">
		{#if codeMode}
			<!-- 代码模式：纯文本编辑 -->
			<Textarea
				bind:value={codeModeText}
				oninput={onCodeModeInput}
				{placeholder}
				class={cn(
					'h-full min-h-48 w-full resize-none font-mono text-sm leading-6',
					!borderless && 'rounded-lg border border-border bg-background'
				)}
			/>
		{:else}
			<!-- 富文本模式：Lexical 编辑器 -->
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
		{/if}
	</div>

	<!-- Preview area -->
	{#if previewVisible && previewHtml}
		<div
			class="prose max-w-none overflow-y-auto rounded-lg border border-border bg-background p-4 prose-neutral dark:prose-invert"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: HTML is sanitized by rehype-sanitize -->
			{@html previewHtml}
		</div>
	{/if}
</div>
