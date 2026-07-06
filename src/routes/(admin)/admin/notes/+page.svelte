<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { Empty } from '$lib/components/ui/empty';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconExternalLink from '@tabler/icons-svelte-runes/icons/external-link';
	import IconBook from '@tabler/icons-svelte-runes/icons/book';

	// 模拟数据 - 手记/笔记列表
	const notes = [
		{
			id: 211,
			title: '26y: Health, Changes in the AI Industry, and Personal Reflection',
			slug: 'three-years-after-graduation-reflections-on-health-ai-industry-and-life',
			mood: '',
			weather: '',
			location: '',
			reads: 332,
		},
		{
			id: 210,
			title: 'Wrinkles in Monotony',
			slug: 'wrinkles-in-monotony',
			mood: '',
			weather: '',
			location: '',
			reads: 739,
		},
		{
			id: 208,
			title: 'Spring Festival on the Keyboard',
			slug: 'spring-festival-on-the-keyboard',
			mood: '',
			weather: '',
			location: '',
			reads: '1.3K',
		},
		{
			id: 207,
			title: 'Spring Festival Memories as the Flavor Fades',
			slug: 'fading-spring-festival-memories',
			mood: '',
			weather: 'Overcast',
			location: '',
			reads: 887,
		},
		{
			id: 206,
			title: 'Just Working: Work and Life in the AI Era',
			slug: 'just-going-to-work-ai-era-work-and-life',
			mood: 'Mixed Emotions',
			weather: '',
			location: '',
			reads: '2.3K',
		},
		{
			id: 205,
			title: '2025 - Still on the Road, Beyond the Radius',
			slug: '2025-still-on-the-road-beyond-the-radius',
			mood: '',
			weather: '',
			location: '',
			reads: '2.3K',
		},
		{
			id: 204,
			title: 'Seeking Survival in Stability',
			slug: 'seeking-survival-in-stability',
			mood: '',
			weather: '',
			location: '',
			reads: '2.7K',
		},
		{
			id: 200,
			title: 'Finding an Exit Between Anxiety and Creativity',
			slug: 'finding-outlet-between-anxiety-and-creativity',
			mood: 'Anxious',
			weather: '',
			location: '',
			reads: '2.5K',
		},
		{
			id: 199,
			title: 'A Five-Day Journey on the Edge of the Equator',
			slug: 'five-day-travel-diary-at-the-edge-of-the-equator-singapore',
			mood: 'Happy',
			weather: 'Sunny',
			location: '',
			reads: '1.6K',
		},
		{
			id: 198,
			title: 'The Interweaving of Calmness and Busyness',
			slug: 'interweaving-of-calm-and-busy-life',
			mood: '',
			weather: '',
			location: '',
			reads: '1.0K',
		},
	];

	let searchQuery = $state('');

	const filteredNotes = $derived(
		notes.filter(note => 
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.slug.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>手记管理 - Lair Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<!-- 页面标题 -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">手记</h1>
			<p class="text-sm text-muted-foreground">管理你的手记和随笔内容</p>
		</div>
		<Button href="/admin/notes/new">
			<IconPlus data-icon="inline-start" />
			新建手记
		</Button>
	</div>

	<!-- 搜索 -->
	<Card.Root>
		<Card.Content class="p-4">
			<div class="relative w-full max-w-sm">
				<IconSearch class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="搜索标题..."
					class="pl-9"
					bind:value={searchQuery}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- 手记列表 -->
	<Card.Root>
		<Card.Content class="p-0">
			{#if filteredNotes.length === 0}
				<Empty class="py-12">
					<div class="flex flex-col items-center gap-1">
						<h3 class="text-lg font-semibold tracking-tight">暂无手记</h3>
						<p class="text-sm text-muted-foreground">还没有创建任何手记，点击上方按钮开始创作吧</p>
					</div>
					<div class="mt-4">
						<Button href="/admin/notes/new">
							<IconPlus data-icon="inline-start" />
							新建手记
						</Button>
					</div>
				</Empty>
			{:else}
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-12.5">
									<input type="checkbox" class="size-4 rounded border" />
								</Table.Head>
								<Table.Head class="w-20">序号</Table.Head>
								<Table.Head>标题</Table.Head>
								<Table.Head class="hidden md:table-cell">心情</Table.Head>
								<Table.Head class="hidden lg:table-cell">Slug</Table.Head>
								<Table.Head class="hidden xl:table-cell">天气</Table.Head>
								<Table.Head class="hidden xl:table-cell">地点</Table.Head>
								<Table.Head class="w-20 text-center">
									<div class="flex justify-center">
										<IconBook class="size-4" />
									</div>
								</Table.Head>
								<Table.Head class="w-20 text-right">操作</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredNotes as note (note.id)}
								<Table.Row class="group">
									<Table.Cell>
										<input type="checkbox" class="size-4 rounded border" />
									</Table.Cell>
									<Table.Cell class="font-medium text-muted-foreground">
										{note.id}
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<a 
												href="/admin/notes/{note.id}/edit" 
												class="font-medium hover:text-primary line-clamp-1"
											>
												{note.title}
											</a>
											<div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
												<a 
													href="/notes/{note.slug}" 
													target="_blank"
													class="flex size-6 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
												>
													<IconExternalLink class="size-3.5" />
												</a>
											</div>
										</div>
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">
										{#if note.mood}
											<span class="text-sm">{note.mood}</span>
										{:else}
											<span class="text-sm text-muted-foreground">—</span>
										{/if}
									</Table.Cell>
									<Table.Cell class="hidden lg:table-cell text-muted-foreground text-sm font-mono">
										{note.slug}
									</Table.Cell>
									<Table.Cell class="hidden xl:table-cell">
										{#if note.weather}
											<span class="text-sm">{note.weather}</span>
										{:else}
											<span class="text-sm text-muted-foreground">—</span>
										{/if}
									</Table.Cell>
									<Table.Cell class="hidden xl:table-cell">
										{#if note.location}
											<span class="text-sm">{note.location}</span>
										{:else}
											<span class="text-sm text-muted-foreground">—</span>
										{/if}
									</Table.Cell>
									<Table.Cell class="text-center text-muted-foreground text-sm">
										{note.reads}
									</Table.Cell>
									<Table.Cell class="text-right">
										<Button 
											variant="ghost" 
											size="sm" 
											class="text-destructive hover:text-destructive hover:bg-destructive/10"
										>
											移除
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
