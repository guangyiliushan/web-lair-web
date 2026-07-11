<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { LexicalEditor, TextFormatType, LexicalCommand } from 'lexical';
	import {
		FORMAT_TEXT_COMMAND,
		UNDO_COMMAND,
		REDO_COMMAND,
		INSERT_UNORDERED_LIST_COMMAND,
		toggleHeading,
		toggleBulletList,
		toggleOrderedList,
		insertHorizontalRule,
		applyParagraph,
		readToolbarState,
		type ToolbarState
	} from './lexical-action';
	import EditorDebugDialog from './EditorDebugDialog.svelte';

	// ── 常用图标 ──
	import IconH1 from '@tabler/icons-svelte-runes/icons/h-1';
	import IconH2 from '@tabler/icons-svelte-runes/icons/h-2';
	import IconH3 from '@tabler/icons-svelte-runes/icons/h-3';
	import IconArrowBackUp from '@tabler/icons-svelte-runes/icons/arrow-back-up';
	import IconArrowForwardUp from '@tabler/icons-svelte-runes/icons/arrow-forward-up';
	import IconBold from '@tabler/icons-svelte-runes/icons/bold';
	import IconItalic from '@tabler/icons-svelte-runes/icons/italic';
	import IconList from '@tabler/icons-svelte-runes/icons/list';
	import IconListNumbers from '@tabler/icons-svelte-runes/icons/list-numbers';
	import IconCode from '@tabler/icons-svelte-runes/icons/code';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconEyeOff from '@tabler/icons-svelte-runes/icons/eye-off';
	import IconDots from '@tabler/icons-svelte-runes/icons/dots';
	import IconChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down';
	import IconBug from '@tabler/icons-svelte-runes/icons/bug';

	// ── 溢出菜单图标 ──
	import IconUnderline from '@tabler/icons-svelte-runes/icons/underline';
	import IconStrikethrough from '@tabler/icons-svelte-runes/icons/strikethrough';
	import IconHighlight from '@tabler/icons-svelte-runes/icons/highlight';
	import IconSeparator from '@tabler/icons-svelte-runes/icons/separator';
	import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle';
	import IconBulb from '@tabler/icons-svelte-runes/icons/bulb';
	import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle';
	import IconCodeDots from '@tabler/icons-svelte-runes/icons/code-dots';
	import IconPhoto from '@tabler/icons-svelte-runes/icons/photo';
	import IconMath from '@tabler/icons-svelte-runes/icons/math';
	import IconListCheck from '@tabler/icons-svelte-runes/icons/list-check';
	import IconBlockquote from '@tabler/icons-svelte-runes/icons/blockquote';
	import IconArticle from '@tabler/icons-svelte-runes/icons/article';

	// ── 块类型定义 ──
	type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'check' | 'quote';

	interface BlockOption {
		type: BlockType;
		label: string;
		icon: typeof IconArticle;
	}

	const BLOCK_OPTIONS: BlockOption[] = [
		{ type: 'paragraph', label: '正文', icon: IconArticle },
		{ type: 'h1', label: '标题 1', icon: IconH1 },
		{ type: 'h2', label: '标题 2', icon: IconH2 },
		{ type: 'h3', label: '标题 3', icon: IconH3 }
	];

	type Props = {
		editor: LexicalEditor | null;
		previewVisible: boolean;
		onTogglePreview: () => void;
		onInsertCallout: (type: 'info' | 'tip' | 'warning') => void;
		stickyToolbar?: boolean;
		class?: string;
	};

	let {
		editor,
		previewVisible,
		onTogglePreview,
		onInsertCallout,
		stickyToolbar = false,
		class: className
	}: Props = $props();

	// ── 工具栏状态追踪 ──
	let toolbarState = $state<ToolbarState>({
		isBold: false,
		isItalic: false,
		isUnderline: false,
		isStrikethrough: false,
		isCode: false,
		isHighlight: false,
		blockType: 'paragraph'
	});

	let debugOpen = $state(false);
	let debugJson = $state('');

	// 注册更新监听器追踪格式状态
	// 注意：readToolbarState 封装了 Lexical 的 $ 前缀函数，
	// 避免 .svelte 文件直接导入 $getSelection 等（Svelte 5 编译器会误解析为 store）
	$effect(() => {
		if (!editor) return;
		const unregister = editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				toolbarState = readToolbarState();
			});
		});
		return unregister;
	});

	function dispatchCmd(cmd: LexicalCommand<unknown>, payload?: unknown) {
		editor?.dispatchCommand(cmd, payload);
	}
	function formatText(format: TextFormatType) {
		editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format);
	}

	// 防止点击工具栏时丢失编辑器选区
	function preventSelectionLoss(e: MouseEvent) {
		e.preventDefault();
	}

	function applyBlockType(type: BlockType) {
		if (!editor) return;
		switch (type) {
			case 'paragraph':
				applyParagraph(editor);
				break;
			case 'h1':
				toggleHeading(editor, 'h1');
				break;
			case 'h2':
				toggleHeading(editor, 'h2');
				break;
			case 'h3':
				toggleHeading(editor, 'h3');
				break;
			case 'bullet':
				toggleBulletList(editor);
				break;
			case 'number':
				toggleOrderedList(editor);
				break;
			case 'check':
				dispatchCmd(INSERT_UNORDERED_LIST_COMMAND);
				break;
		}
	}

	function openDebug() {
		if (!editor) return;
		debugJson = JSON.stringify(editor.getEditorState().toJSON(), null, 2);
		debugOpen = true;
	}

	// 当前激活的块选项
	let activeBlock = $derived(
		BLOCK_OPTIONS.find((o) => o.type === toolbarState.blockType) ?? BLOCK_OPTIONS[0]
	);
</script>

<div
	class={cn(
		'flex w-full items-center gap-0.5 overflow-x-auto border-b px-1 py-1',
		stickyToolbar
			? 'sticky top-0 z-10 border-border bg-background/85 backdrop-blur'
			: 'border-border bg-background',
		className
	)}
	role="toolbar"
	aria-label="编辑器工具栏"
>
	<!-- BlockMenu：正文/H1/H2/H3 下拉选择 -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="sm" {...props} class="gap-1 text-xs font-medium">
					<activeBlock.icon data-icon="inline-start" />
					<span class="truncate">{activeBlock.label}</span>
					<IconChevronDown class="size-3 opacity-60" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-40">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>块类型</DropdownMenu.GroupHeading>
				{#each BLOCK_OPTIONS as option (option.type)}
					<DropdownMenu.Item onclick={() => applyBlockType(option.type)}>
						<option.icon data-icon="inline-start" />
						{option.label}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<Separator orientation="vertical" decorative />

	<!-- 撤销/重做 -->
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={() => dispatchCmd(UNDO_COMMAND)}
		onmousedown={preventSelectionLoss}
		aria-label="撤销"
		title="撤销 (⌘Z)"
	>
		<IconArrowBackUp data-icon="inline-start" />
	</Button>
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={() => dispatchCmd(REDO_COMMAND)}
		onmousedown={preventSelectionLoss}
		aria-label="重做"
		title="重做 (⌘⇧Z)"
	>
		<IconArrowForwardUp data-icon="inline-start" />
	</Button>

	<Separator orientation="vertical" decorative />

	<!-- 常用格式（带激活态） -->
	<Button
		variant={toolbarState.isBold ? 'secondary' : 'ghost'}
		size="icon-sm"
		onclick={() => formatText('bold')}
		onmousedown={preventSelectionLoss}
		aria-pressed={toolbarState.isBold}
		aria-label="粗体"
		title="粗体 (⌘B)"
	>
		<IconBold data-icon="inline-start" />
	</Button>
	<Button
		variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
		size="icon-sm"
		onclick={() => formatText('italic')}
		onmousedown={preventSelectionLoss}
		aria-pressed={toolbarState.isItalic}
		aria-label="斜体"
		title="斜体 (⌘I)"
	>
		<IconItalic data-icon="inline-start" />
	</Button>
	<Button
		variant={toolbarState.isCode ? 'secondary' : 'ghost'}
		size="icon-sm"
		onclick={() => formatText('code')}
		onmousedown={preventSelectionLoss}
		aria-pressed={toolbarState.isCode}
		aria-label="行内代码"
		title="行内代码"
	>
		<IconCode data-icon="inline-start" />
	</Button>

	<Separator orientation="vertical" decorative />

	<!-- 列表（带激活态） -->
	<Button
		variant={toolbarState.blockType === 'bullet' ? 'secondary' : 'ghost'}
		size="icon-sm"
		onclick={() => toggleBulletList(editor!)}
		onmousedown={preventSelectionLoss}
		aria-pressed={toolbarState.blockType === 'bullet'}
		aria-label="无序列表"
		title="无序列表"
	>
		<IconList data-icon="inline-start" />
	</Button>
	<Button
		variant={toolbarState.blockType === 'number' ? 'secondary' : 'ghost'}
		size="icon-sm"
		onclick={() => toggleOrderedList(editor!)}
		onmousedown={preventSelectionLoss}
		aria-pressed={toolbarState.blockType === 'number'}
		aria-label="有序列表"
		title="有序列表"
	>
		<IconListNumbers data-icon="inline-start" />
	</Button>

	<Separator orientation="vertical" decorative />

	<!-- 引用 + 分割线 -->
	<Button
		variant={toolbarState.blockType === 'quote' ? 'secondary' : 'ghost'}
		size="icon-sm"
		onmousedown={preventSelectionLoss}
		aria-label="引用"
		title="引用"
	>
		<IconBlockquote data-icon="inline-start" />
	</Button>
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={() => insertHorizontalRule(editor!)}
		onmousedown={preventSelectionLoss}
		aria-label="分割线"
		title="分割线"
	>
		<IconSeparator data-icon="inline-start" />
	</Button>

	<!-- ── 溢出菜单：低频功能 ── -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon-sm" {...props} onmousedown={preventSelectionLoss} aria-label="更多" title="更多">
					<IconDots data-icon="inline-start" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>格式</DropdownMenu.GroupHeading>
				<DropdownMenu.Item onclick={() => formatText('underline')}>
					<IconUnderline data-icon="inline-start" />
					下划线
					<span class="ml-auto text-xs text-muted-foreground">⌘U</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => formatText('strikethrough')}>
					<IconStrikethrough data-icon="inline-start" />
					删除线
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => formatText('highlight')}>
					<IconHighlight data-icon="inline-start" />
					高亮
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>列表</DropdownMenu.GroupHeading>
				<DropdownMenu.Item onclick={() => dispatchCmd(INSERT_UNORDERED_LIST_COMMAND)}>
					<IconListCheck data-icon="inline-start" />
					待办列表
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>插入</DropdownMenu.GroupHeading>
				<DropdownMenu.Item onclick={() => onInsertCallout('info')}>
					<IconInfoCircle data-icon="inline-start" />
					Callout
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => onInsertCallout('tip')}>
					<IconBulb data-icon="inline-start" />
					Tip
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => onInsertCallout('warning')}>
					<IconAlertTriangle data-icon="inline-start" />
					Warning
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => formatText('code')}>
					<IconCodeDots data-icon="inline-start" />
					代码块
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<IconPhoto data-icon="inline-start" />
					插入图片
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<IconMath data-icon="inline-start" />
					插入公式
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<div class="flex-1"></div>

	<!-- 调试：导出 Editor State JSON -->
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					variant="ghost"
					size="icon-sm"
					{...props}
					onmousedown={preventSelectionLoss}
					onclick={openDebug}
					aria-label="调试 · 导出 Editor State"
					title="调试 · 导出 Editor State"
				>
					<IconBug data-icon="inline-start" />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>调试 · 导出 Editor State</Tooltip.Content>
	</Tooltip.Root>

	<!-- 预览切换 -->
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={onTogglePreview}
		onmousedown={preventSelectionLoss}
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

<EditorDebugDialog bind:open={debugOpen} editorStateJson={debugJson} />
