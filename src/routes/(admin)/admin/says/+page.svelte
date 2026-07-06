<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Empty } from '$lib/components/ui/empty';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconQuote from '@tabler/icons-svelte-runes/icons/quote';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconTrash from '@tabler/icons-svelte-runes/icons/trash';
	import IconDots from '@tabler/icons-svelte-runes/icons/dots';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';
	import IconBook from '@tabler/icons-svelte-runes/icons/book';
	import IconClock from '@tabler/icons-svelte-runes/icons/clock';

	// 模拟数据 - 说说/引用列表
	const says = [
		{
			id: '1',
			content: '胆小鬼连幸福都害怕，碰到棉花也会受伤，有时还被幸福所伤。',
			author: '太宰治',
			source: '人间失格',
			createdAt: '2年前',
		},
		{
			id: '2',
			content: '以前啊，我们都向往着，可以拥有更好的未来；现在啊，我们回头看，曾经的岁月竟然就是我们的巅峰了。',
			author: '',
			source: '你也走了很远的路吧',
			createdAt: '3年前',
		},
		{
			id: '3',
			content: '我们今天生活的时代是一个慕强的时代，作为弱者是很痛苦的，因为周边的人都比你强。狮子和兔子，兔子想说话，狮子说，你的牙齿呢，你闭嘴。可是狮子在大象面前，狮子又变成了那个弱者。一个慕强的人，生活在恐惧之中，因为他生怕自己不够强。接受有限性，才能过得充足，才能原谅别人的不足。人最大的功课就是和解，跟他人和解，跟自己和解，跟命运和解。',
			author: '罗翔',
			source: '如何在阅读中超越有限的今生',
			createdAt: '3年前',
		},
		{
			id: '4',
			content: '世事无常，生命是短暂的，我们都活在生死边缘，哪怕只有一天，一刹那，我们都想要活下去。',
			author: '铃芽户缔',
			source: '',
			createdAt: '3年前',
		},
		{
			id: '5',
			content: '每逢你想要批评任何人的时候，你就记住，这个世界上所有的人，并不是个个都有过你拥有的那些优越条件。',
			author: '弗朗西斯·斯科特·菲茨杰拉德',
			source: '了不起的盖茨比',
			createdAt: '4年前',
		},
		{
			id: '6',
			content: '生活不可能像你想象得那么好，但也不会像你想象得那么糟。我觉得人的脆弱和坚强都超乎自己的想象。有时，我可能脆弱得一句话就泪流满面；有时，也发现自己咬着牙走了很长的路。',
			author: '莫泊桑',
			source: '一生',
			createdAt: '4年前',
		},
	];

	let searchQuery = $state('');

	const filteredSays = $derived(
		says.filter(say => 
			say.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			say.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			say.source.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>说说管理 - Lair Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<!-- 页面标题 -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">说说</h1>
			<p class="text-sm text-muted-foreground">管理你的说说和引用内容</p>
		</div>
		<Button href="/admin/says/new">
			<IconPlus data-icon="inline-start" />
			新建说说
		</Button>
	</div>

	<!-- 搜索 -->
	<Card.Root>
		<Card.Content class="p-4">
			<div class="relative">
				<IconSearch class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="搜索内容、作者或出处..."
					class="pl-9"
					bind:value={searchQuery}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- 说说列表 -->
	{#if filteredSays.length === 0}
		<Empty class="py-12">
			<div class="flex flex-col items-center gap-1">
				<h3 class="text-lg font-semibold tracking-tight">暂无说说</h3>
				<p class="text-sm text-muted-foreground">还没有创建任何说说，点击上方按钮开始创作吧</p>
			</div>
			<div class="mt-4">
				<Button href="/admin/says/new">
					<IconPlus data-icon="inline-start" />
					新建说说
				</Button>
			</div>
		</Empty>
	{:else}
		<div class="grid gap-4">
			{#each filteredSays as say (say.id)}
				<Card.Root class="group transition-colors hover:border-primary/20">
					<Card.Content class="p-5">
						<div class="flex gap-4">
							<!-- 引用图标 -->
							<div class="flex shrink-0">
								<div class="flex size-10 items-center justify-center rounded-lg bg-muted">
									<IconQuote class="size-5 text-muted-foreground" />
								</div>
							</div>

							<!-- 内容 -->
							<div class="flex-1 min-w-0">
								<blockquote class="text-base leading-relaxed text-foreground">
									{say.content}
								</blockquote>

								<!-- 作者和出处 -->
								<div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
									{#if say.author}
										<div class="flex items-center gap-1.5">
											<IconUser class="size-3.5" />
											<span>{say.author}</span>
										</div>
									{/if}
									{#if say.source}
										<div class="flex items-center gap-1.5">
											<IconBook class="size-3.5" />
											<span class="italic">{say.source}</span>
										</div>
									{/if}
									<div class="flex items-center gap-1.5">
										<IconClock class="size-3.5" />
										<span>{say.createdAt}</span>
									</div>
								</div>
							</div>

							<!-- 操作 -->
							<div class="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
								<Button 
									variant="ghost" 
									size="icon" 
									class="size-8"
									href="/admin/says/{say.id}/edit"
								>
									<IconPencil class="size-4" />
								</Button>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button variant="ghost" size="icon" class="size-8" {...props}>
												<IconDots class="size-4" />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Group>
											<DropdownMenu.Item>
												{#snippet child({ props })}
													<a href="/admin/says/{say.id}/edit" {...props}>
														<IconPencil data-icon="inline-start" />
														编辑
													</a>
												{/snippet}
											</DropdownMenu.Item>
										</DropdownMenu.Group>
										<DropdownMenu.Separator />
										<DropdownMenu.Group>
											<DropdownMenu.Item class="text-destructive focus:text-destructive">
												<IconTrash data-icon="inline-start" />
												删除
											</DropdownMenu.Item>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
