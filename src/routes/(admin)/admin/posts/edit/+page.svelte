<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Dialog from '$lib/components/ui/dialog';
	import { MarkdownEditor } from '$lib/components/markdown';
	import IconDeviceFloppy from '@tabler/icons-svelte-runes/icons/device-floppy';
	import IconSend from '@tabler/icons-svelte-runes/icons/send';
	import IconSettings from '@tabler/icons-svelte-runes/icons/settings';
	import IconCategory from '@tabler/icons-svelte-runes/icons/category';
	import IconTag from '@tabler/icons-svelte-runes/icons/tag';
	import IconFileDescription from '@tabler/icons-svelte-runes/icons/file-description';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconX from '@tabler/icons-svelte-runes/icons/x';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let title = $state('');
	let slug = $state('');
	let categoryId = $state('');
	let summary = $state('');
	let tags = $state('');
	let contentMarkdown = $state('');
	let isPublished = $state(true);
	let slugDialogOpen = $state(false);
	let settingsOpen = $state(false);

	// Sync state when form returns with validation errors
	$effect(() => {
		const v = form?.values;
		if (v) {
			title = v.title ?? '';
			slug = v.slug ?? '';
			categoryId = v.categoryId ?? '';
			summary = v.summary ?? '';
			tags = v.tags ?? '';
			contentMarkdown = v.content ?? '';
			isPublished = v.isPublished ?? true;
		}
	});

	// Auto-generate slug from title
	function onTitleInput(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		title = input.value;
		if (!form?.values?.slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		}
	}
</script>

<svelte:head>
	<title>{title ? `${title} - Lair Admin` : 'New Post - Lair Admin'}</title>
</svelte:head>

<form method="POST" use:enhance class="flex h-full min-h-0 flex-col">
	<!-- Main content area -->
	<main class="flex min-h-full min-w-0 flex-col bg-background">
		<!-- Header area: title + slug + separator -->
		<div class="mx-auto w-full max-w-5xl shrink-0 px-3 pt-8">
			<!-- Status bar -->
			<div
				class="group mb-3 flex min-h-7 items-center justify-between opacity-60 transition-opacity duration-200 hover:opacity-100"
			>
				<div class="flex min-w-0 items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
					<span
						aria-hidden="true"
						class="inline-block size-1.5 shrink-0 rounded-full bg-emerald-500"
					></span>
					<span class="truncate">草稿 · 新文章</span>
				</div>
				<div class="flex shrink-0 items-center gap-1">
					<!-- Settings button -->
					<button
						type="button"
						onclick={() => (settingsOpen = true)}
						class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
						aria-label="文章设置"
						title="文章设置"
					>
						<IconSettings class="size-3.5" />
					</button>

					<!-- Publish button -->
					<Button type="submit" size="sm" class="h-7 gap-1 px-2.5 text-xs">
						<IconSend class="size-3" />
						发布
					</Button>
				</div>
			</div>

			<!-- Title input -->
			<div class="group">
				<input
					name="title"
					class="w-full border-0 bg-transparent px-0 py-0 text-3xl font-semibold tracking-tight text-neutral-950 outline-none placeholder:font-medium placeholder:text-neutral-300 dark:text-neutral-50 dark:placeholder:text-neutral-700"
					placeholder="输入标题..."
					required
					bind:value={title}
					oninput={onTitleInput}
				/>
				<!-- Slug button -->
				<button
					type="button"
					class="mt-1 -ml-1 inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-opacity duration-150 outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-accent/15"
					onclick={() => (slugDialogOpen = true)}
					aria-label="添加 slug"
				>
					<span class="truncate">{slug ? `/${slug}` : '+ 添加 slug'}</span>
					<IconPencil class="size-3 shrink-0" />
				</button>
			</div>

			<hr class="my-4 border-0 border-t border-neutral-100 dark:border-neutral-800" />
		</div>

		<!-- Editor area -->
		<div class="flex min-h-0 flex-1 flex-col">
			<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3">
				<MarkdownEditor
					initialMarkdown={contentMarkdown}
					placeholder="输入正文..."
					stickyToolbar={true}
					borderless={true}
					class="min-h-[70vh] flex-1"
					onChange={(detail) => {
						contentMarkdown = detail.markdown;
					}}
				/>
			</div>
		</div>
	</main>

	<!-- Hidden fields -->
	<input type="hidden" name="content" value={contentMarkdown} />
	<input type="hidden" name="slug" value={slug} />
	<input type="hidden" name="categoryId" value={categoryId} />
	<input type="hidden" name="summary" value={summary} />
	<input type="hidden" name="tags" value={tags} />
	<input type="hidden" name="isPublished" value={String(isPublished)} />
</form>

<!-- Slug Dialog -->
<Dialog.Root open={slugDialogOpen} onOpenChange={(v) => (slugDialogOpen = v)}>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>设置 Slug</Dialog.Title>
				<Dialog.Description>URL 友好的标识符，用于文章链接。</Dialog.Description>
			</Dialog.Header>
			<div class="px-6 pb-2">
				<Input name="slug-input" placeholder="my-post-slug" bind:value={slug} />
				{#if slug}
					<p class="mt-1.5 font-mono text-xs text-muted-foreground">
						预览: /posts/{slug}
					</p>
				{/if}
				{#if form?.errors?.slug}
					<p class="mt-1 text-sm text-destructive">{form.errors.slug}</p>
				{/if}
			</div>
			<Dialog.Footer>
				<Dialog.Close>取消</Dialog.Close>
				<Button onclick={() => (slugDialogOpen = false)}>确定</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<!-- Settings Sheet -->
<Sheet.Root open={settingsOpen} onOpenChange={(v) => (settingsOpen = v)}>
	<Sheet.Portal>
		<Sheet.Overlay />
		<Sheet.Content side="right" class="w-full sm:max-w-sm">
			<Sheet.Header>
				<Sheet.Title>文章设置</Sheet.Title>
				<Sheet.Description>配置文章的元数据信息。</Sheet.Description>
				<Sheet.Close
					class="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
				>
					<IconX class="size-4" />
					<span class="sr-only">关闭</span>
				</Sheet.Close>
			</Sheet.Header>
			<div class="flex flex-col gap-5 px-6 py-4">
				<!-- Category -->
				<div class="flex flex-col gap-1.5">
					<label for="settings-category" class="flex items-center gap-1.5 text-sm font-medium">
						<IconCategory class="size-4 text-muted-foreground" />
						分类
					</label>
					<Select.Root type="single" bind:value={categoryId as never}>
						<Select.Trigger id="settings-category" class="w-full">
							{categoryId
								? (data.categories.find((c) => c.id === categoryId)?.name ?? '选择分类')
								: '选择分类'}
						</Select.Trigger>
						<Select.Portal>
							<Select.Content>
								<Select.Group>
									<Select.Label>分类</Select.Label>
									{#each data.categories as cat (cat.id)}
										<Select.Item value={cat.id}>{cat.name}</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
					{#if form?.errors?.categoryId}
						<p class="text-sm text-destructive">{form.errors.categoryId}</p>
					{/if}
				</div>

				<!-- Tags -->
				<div class="flex flex-col gap-1.5">
					<label for="settings-tags" class="flex items-center gap-1.5 text-sm font-medium">
						<IconTag class="size-4 text-muted-foreground" />
						标签
					</label>
					<Input id="settings-tags" placeholder="svelte, typescript, tutorial" bind:value={tags} />
					<p class="text-xs text-muted-foreground">逗号分隔。</p>
				</div>

				<!-- Summary -->
				<div class="flex flex-col gap-1.5">
					<label for="settings-summary" class="flex items-center gap-1.5 text-sm font-medium">
						<IconFileDescription class="size-4 text-muted-foreground" />
						摘要
					</label>
					<Textarea
						id="settings-summary"
						placeholder="文章简短描述..."
						bind:value={summary}
						rows={4}
					/>
				</div>

				<!-- Publish toggle -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium" id="publish-status-label">发布状态</span>
					<button
						type="button"
						role="switch"
						aria-checked={isPublished}
						aria-labelledby="publish-status-label"
						class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors {isPublished
							? 'bg-primary'
							: 'bg-muted'}"
						onclick={() => (isPublished = !isPublished)}
					>
						<span
							class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform {isPublished
								? 'translate-x-4.5'
								: 'translate-x-0.5'}"
						></span>
					</button>
				</div>

				<!-- Save as draft button -->
				<Button type="submit" variant="outline" class="w-full" name="isPublished" value="false">
					<IconDeviceFloppy class="size-4" />
					保存为草稿
				</Button>
			</div>
		</Sheet.Content>
	</Sheet.Portal>
</Sheet.Root>
