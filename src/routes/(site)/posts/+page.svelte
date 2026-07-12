<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Pagination from '$lib/components/ui/pagination';
	import { cn } from '$lib/utils';
	import {
		IconEye,
		IconHeart,
		IconSearch,
		IconHash,
		IconArrowLeft,
		IconArrowRight
	} from '@tabler/icons-svelte-runes';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const pinnedPost = $derived(data.pinnedPost);
	const posts = $derived(data.posts);
	const totalCount = $derived(data.totalCount);
	const tags = $derived(data.tags);

	// Sort state
	let sortMode = $state<'latest' | 'oldest' | 'updated'>('latest');
	const sortOptions = [
		{ key: 'latest' as const, label: 'Latest' },
		{ key: 'oldest' as const, label: 'Oldest' },
		{ key: 'updated' as const, label: 'Recently updated' }
	];

	function translateLabel(from: string, to: string): string {
		return `${from} → ${to}`;
	}
</script>

<div class="mx-auto mt-14 max-w-5xl px-4 lg:mt-20 lg:px-0 2xl:max-w-6xl">
	<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] xl:gap-16">
		<!-- ══ Main content ══ -->
		<div class="min-w-0">
			<!-- Page header -->
			<div class="text-xs font-medium tracking-[4px] text-muted-foreground uppercase">Blog</div>
			<h1 class="mt-2.5 text-3xl font-normal">Posts</h1>

			<!-- Pinned post -->
			{#if pinnedPost}
				<Card.Root
					class="mt-5 rounded-lg border bg-card/50 p-5 transition-all duration-200 hover:-translate-y-px hover:bg-card/70 hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:border-white/5 dark:bg-white/4 dark:hover:bg-white/6"
				>
					<a href={`/posts/${pinnedPost.slug}`} class="block">
						<Card.Header class="p-0">
							<div class="mb-2 text-xs font-medium tracking-[1px] text-primary">Pinned</div>
							<Card.Title class="text-lg font-medium">{pinnedPost.title}</Card.Title>
						</Card.Header>
						<Card.Content class="mt-2 p-0">
							<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
								{pinnedPost.excerpt}
							</p>
						</Card.Content>
						<Card.Footer class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 p-0 text-xs">
							<span class="whitespace-nowrap text-muted-foreground">{pinnedPost.date}</span>
							<span class="text-muted-foreground/40">·</span>
							<span class="text-primary">{pinnedPost.category}</span>
							{#each pinnedPost.tags as tag, i (tag)}
								<span class="text-muted-foreground/40">{i === 0 ? '/' : ','}</span>
								<span class="text-primary">{tag}</span>
							{/each}
							{#if pinnedPost.translated}
								<span
									class="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary/80"
								>
									{translateLabel(pinnedPost.translated.from, pinnedPost.translated.to)}
								</span>
							{/if}
						</Card.Footer>
					</a>
					<!-- Stats row -->
					<div
						class="mt-3 flex justify-end gap-2.5 border-t border-dashed border-border pt-2 text-xs text-muted-foreground"
					>
						<span class="flex items-center gap-1">
							<IconEye class="size-3.5" />
							<span>{pinnedPost.views}</span>
						</span>
						<span class="flex items-center gap-1">
							<IconHeart class="size-3.5" />
							<span>{pinnedPost.likes}</span>
						</span>
					</div>
				</Card.Root>
			{/if}

			<!-- Sort controls -->
			<div class="mt-5 flex items-center justify-between border-b border-border/50 pb-3">
				<span class="text-xs text-muted-foreground">{totalCount} posts</span>
				<div class="flex gap-4">
					{#each sortOptions as opt (opt.key)}
						<button
							onclick={() => (sortMode = opt.key)}
							class={cn(
								'text-xs transition-colors hover:text-primary',
								sortMode === opt.key
									? 'font-medium text-primary underline underline-offset-[3px]'
									: 'text-muted-foreground'
							)}
						>
							{opt.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Mobile: Search + Tags buttons -->
			<div class="mt-2 mb-5 border-b border-border/50 pb-3 lg:hidden">
				<div class="grid grid-cols-2 gap-2">
					<Button variant="ghost" class="justify-center rounded-lg bg-muted/40 py-2 text-xs">
						<IconSearch data-icon="inline-start" class="opacity-70" />
						Search
					</Button>
					<Button variant="ghost" class="justify-center rounded-lg bg-muted/40 py-2 text-xs">
						<IconHash data-icon="inline-start" class="opacity-70" />
						All tags
					</Button>
				</div>
			</div>

			<!-- Post list -->
			<div class="flex flex-col">
				{#each posts as post (post.slug)}
					<a
						href={`/posts/${post.slug}`}
						class="-mx-4 my-1 block rounded-lg px-4 py-3.5 transition-all duration-200 hover:-translate-y-px hover:bg-card/70 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.03)] dark:hover:bg-white/5"
					>
						<div class="flex items-baseline gap-2">
							<h3 class="text-base font-medium">{post.title}</h3>
						</div>
						<p class="mt-1 line-clamp-1 text-sm leading-normal text-muted-foreground">
							{post.excerpt}
						</p>
						<div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
							<span class="whitespace-nowrap text-muted-foreground">{post.date}</span>
							<span class="text-muted-foreground/40">·</span>
							<span class="text-primary">{post.category}</span>
							{#each post.tags as tag, i (tag)}
								<span class="text-muted-foreground/40">{i === 0 ? '/' : ','}</span>
								<span class="text-primary">{tag}</span>
							{/each}
							{#if post.tags.length > 3}
								<span class="text-muted-foreground tabular-nums hover:text-primary"
									>+{post.tags.length - 3}</span
								>
							{/if}
							{#if post.translated}
								<span
									class="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary/80"
								>
									{translateLabel(post.translated.from, post.translated.to)}
								</span>
							{/if}
						</div>
						<!-- Stats -->
						<div
							class="mt-2 flex justify-end gap-2.5 border-t border-dashed border-border pt-2 text-xs text-muted-foreground"
						>
							<span class="flex items-center gap-1">
								<IconEye class="size-3.5" />
								<span>{post.views}</span>
							</span>
							<span class="flex items-center gap-1">
								<IconHeart class="size-3.5" />
								<span>{post.likes}</span>
							</span>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			<nav class="mt-20 border-t border-border/40 pt-5" aria-label="Pagination">
				<Pagination.Root count={180} perPage={10} page={1}>
					<Pagination.Content class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						<Pagination.Item class="list-none">
							<Button
								variant="ghost"
								disabled
								class="inline-flex cursor-default items-center gap-1.5 text-xs font-medium tracking-[2.5px] text-muted-foreground/60 uppercase"
							>
								<IconArrowLeft data-icon="inline-start" class="shrink-0" />
								<span>Previous page</span>
							</Button>
						</Pagination.Item>

						<Pagination.Item class="list-none text-center">
							<span aria-hidden="true" class="text-muted-foreground/40">·</span>
						</Pagination.Item>

						<Pagination.Item class="list-none justify-self-end">
							<Button
								variant="ghost"
								href="/posts?page=2"
								class="inline-flex items-center gap-1.5 text-xs font-medium tracking-[2.5px] text-muted-foreground uppercase transition-colors hover:text-primary"
							>
								<span>Next page</span>
								<IconArrowRight data-icon="inline-end" class="shrink-0" />
							</Button>
						</Pagination.Item>

						<div
							class="col-span-full mt-2 text-center text-xs tracking-[3px] text-muted-foreground uppercase tabular-nums"
						>
							Page 1 of 18
						</div>
					</Pagination.Content>
				</Pagination.Root>
			</nav>
		</div>

		<!-- ══ Sidebar (desktop only) ══ -->
		<aside class="relative hidden h-full lg:block">
			<div class="sticky top-43 mt-24">
				<Card.Root
					class="ml-auto w-full rounded-md border bg-card/40 p-3.5 dark:border-white/5 dark:bg-white/4"
				>
					<!-- Search -->
					<Button
						variant="ghost"
						class="flex w-full items-center justify-start gap-3 rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
					>
						<IconSearch data-icon="inline-start" class="shrink-0 opacity-70" />
						<span class="truncate">Search</span>
					</Button>

					<Separator class="my-3 border-border/50 dark:border-white/6" />

					<!-- Tag cloud -->
					<div class="flex flex-wrap gap-2">
						{#each tags as tag (tag.name)}
							<Badge
								variant="outline"
								class="cursor-pointer border-border/40 bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
							>
								{tag.name}
								<span class="ml-1.5 text-xs text-muted-foreground">({tag.count})</span>
							</Badge>
						{/each}
					</div>

					<Button
						variant="link"
						size="sm"
						class="mt-3 text-xs text-muted-foreground underline decoration-border/40 underline-offset-4 hover:text-foreground"
					>
						All tags
					</Button>
				</Card.Root>
			</div>
		</aside>
	</div>
</div>
