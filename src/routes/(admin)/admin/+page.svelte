<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import IconArticle from '@tabler/icons-svelte-runes/icons/article';
	import IconNotebook from '@tabler/icons-svelte-runes/icons/notebook';
	import IconQuote from '@tabler/icons-svelte-runes/icons/quote';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconChartBar from '@tabler/icons-svelte-runes/icons/chart-bar';
	import IconUsers from '@tabler/icons-svelte-runes/icons/users';
	import IconMessage from '@tabler/icons-svelte-runes/icons/message';
	import IconFiles from '@tabler/icons-svelte-runes/icons/files';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconTrendingUp from '@tabler/icons-svelte-runes/icons/trending-up';
	import IconActivity from '@tabler/icons-svelte-runes/icons/activity';
	import IconRefresh from '@tabler/icons-svelte-runes/icons/refresh';

	let { data }: { data: PageData } = $props();

	// 实时数据
	const realtimeStats = [
		{ label: '当前在线访客', value: 15, icon: IconActivity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
		{ label: '今日访客', value: 638, icon: IconUsers, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
		{ label: '今日最高在线', value: 24, icon: IconTrendingUp, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
	];

	// 快速操作
	const quickActions = [
		{ 
			title: '博文', 
			count: 167, 
			icon: IconArticle, 
			writeHref: '/admin/posts/new',
			manageHref: '/admin/posts'
		},
		{ 
			title: '日记', 
			count: 188, 
			icon: IconPencil, 
			writeHref: '/admin/notes/new?type=diary',
			manageHref: '/admin/notes?type=diary'
		},
		{ 
			title: '速记', 
			count: 88, 
			icon: IconNotebook, 
			writeHref: '/admin/notes/new?type=quick',
			manageHref: '/admin/notes?type=quick'
		},
		{ 
			title: '说说', 
			count: 38, 
			icon: IconQuote, 
			writeHref: '/admin/says/new',
			manageHref: '/admin/says'
		},
	];

	// 数据统计
	const dataStats = [
		{ label: '页面', value: 10, icon: IconFiles },
		{ label: '分类', value: 7, icon: IconChartBar },
		{ label: '全部评论', value: '2,418', icon: IconMessage },
		{ label: '未读评论', value: 1, icon: IconMessage, badge: true },
		{ label: '友链', value: 55, icon: IconUsers },
		{ label: '友链申请', value: 8, icon: IconUsers },
		{ label: 'API 调用', value: '15,696,939', icon: IconActivity },
		{ label: '今日 IP 访问', value: 345, icon: IconEye },
		{ label: '全站字符数', value: '1,193,363', icon: IconArticle },
		{ label: '总阅读量', value: '587,828', icon: IconEye },
		{ label: '文章点赞', value: '2,522', icon: IconTrendingUp },
		{ label: '站点点赞', value: '3,775', icon: IconTrendingUp },
	];

	// 发布趋势数据 (模拟)
	const publishTrend = [
		{ month: '1月', posts: 2, diaries: 3 },
		{ month: '2月', posts: 4, diaries: 2 },
		{ month: '3月', posts: 3, diaries: 4 },
		{ month: '4月', posts: 5, diaries: 3 },
		{ month: '5月', posts: 2, diaries: 5 },
		{ month: '6月', posts: 4, diaries: 2 },
	];

	// 分类分布数据 (模拟)
	const categoryData = [
		{ name: '归档', value: 45, color: '#3b82f6' },
		{ name: '编程', value: 25, color: '#10b981' },
		{ name: '技术', value: 15, color: '#f59e0b' },
		{ name: '折腾', value: 8, color: '#ef4444' },
		{ name: '开发日志', value: 5, color: '#8b5cf6' },
		{ name: '设计交互学', value: 2, color: '#ec4899' },
	];

	const lastUpdated = $state(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
</script>

<div class="flex flex-col gap-6">
	<!-- 欢迎标题 -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">欢迎回来</h1>
			<p class="text-sm text-muted-foreground">
				{data.profile?.displayName ?? data.user?.name ?? 'Admin'}，这是你的个人仪表盘
			</p>
		</div>
		<Button variant="outline" size="sm" onclick={() => location.reload()}>
			<IconRefresh data-icon="inline-start" />
			刷新
		</Button>
	</div>

	<!-- 实时数据 -->
	<section class="space-y-3">
		<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">实时数据</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each realtimeStats as stat (stat.label)}
				<Card.Root>
					<Card.Content class="flex items-center gap-4 p-6">
						<div class="flex size-12 items-center justify-center rounded-lg {stat.bgColor}">
							<stat.icon class="size-6 {stat.color}" />
						</div>
						<div>
							<p class="text-2xl font-bold">{stat.value}</p>
							<p class="text-sm text-muted-foreground">{stat.label}</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- 快速操作 -->
	<section class="space-y-3">
		<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">快速操作</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each quickActions as action (action.title)}
				<Card.Root>
					<Card.Content class="p-6">
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div class="flex size-10 items-center justify-center rounded-lg bg-muted">
									<action.icon class="size-5 text-muted-foreground" />
								</div>
								<div>
									<p class="text-sm font-medium text-muted-foreground">{action.title}</p>
									<p class="text-2xl font-bold">{action.count}</p>
								</div>
							</div>
						</div>
						<div class="mt-4 flex gap-2">
							<Button size="sm" variant="default" href={action.writeHref}>
								撰写
							</Button>
							<Button size="sm" variant="outline" href={action.manageHref}>
								管理
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- 数据统计 -->
	<section class="space-y-3">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">数据统计</h2>
			<span class="text-xs text-muted-foreground">更新于 {lastUpdated}</span>
		</div>
		<Card.Root>
			<Card.Content class="p-6">
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
					{#each dataStats as stat (stat.label)}
						<div class="flex items-center gap-3">
							<div class="flex size-9 items-center justify-center rounded-md bg-muted/50">
								<stat.icon class="size-4 text-muted-foreground" />
							</div>
							<div>
								<div class="flex items-center gap-1.5">
									<p class="text-lg font-semibold">{stat.value}</p>
									{#if stat.badge}
										<span class="flex size-2 rounded-full bg-red-500"></span>
									{/if}
								</div>
								<p class="text-xs text-muted-foreground">{stat.label}</p>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<!-- 数据图表 -->
	<section class="space-y-3">
		<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">数据图表</h2>
		<div class="grid gap-4 lg:grid-cols-2">
			<!-- 发布趋势 -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">发布趋势</Card.Title>
					<Card.Description>博文与日记的月度发布统计</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex h-50 items-end gap-2">
						{#each publishTrend as trend (trend.month)}
							<div class="flex flex-1 flex-col items-center gap-1">
								<div class="flex w-full gap-0.5">
									<div 
										class="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
										style="height: {trend.posts * 30}px"
										title="博文: {trend.posts}"
									></div>
									<div 
										class="flex-1 rounded-t bg-emerald-500/80 transition-all hover:bg-emerald-500"
										style="height: {trend.diaries * 30}px"
										title="日记: {trend.diaries}"
									></div>
								</div>
								<span class="text-xs text-muted-foreground">{trend.month}</span>
							</div>
						{/each}
					</div>
					<div class="mt-4 flex items-center justify-center gap-4 text-xs">
						<div class="flex items-center gap-1.5">
							<div class="size-3 rounded bg-primary"></div>
							<span>博文</span>
						</div>
						<div class="flex items-center gap-1.5">
							<div class="size-3 rounded bg-emerald-500"></div>
							<span>日记</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- 分类分布 -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">分类分布</Card.Title>
					<Card.Description>内容分类占比统计</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex h-50 items-center justify-center">
						<svg viewBox="0 0 100 100" class="size-40 -rotate-90">
							{#each categoryData as cat, i (cat.name)}
								{@const total = categoryData.reduce((a, b) => a + b.value, 0)}
								{@const offset = categoryData.slice(0, i).reduce((a, b) => a + b.value, 0) / total * 100}
								<circle
									cx="50"
									cy="50"
									r="40"
									fill="none"
									stroke={cat.color}
									stroke-width="20"
									stroke-dasharray="{cat.value / total * 100} {100 - cat.value / total * 100}"
									stroke-dashoffset="{-offset}"
									class="transition-all hover:opacity-80"
								/>
							{/each}
							<circle cx="50" cy="50" r="25" fill="hsl(var(--background))" />
						</svg>
					</div>
					<div class="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
						{#each categoryData as cat (cat.name)}
							<div class="flex items-center gap-1.5">
								<div class="size-3 rounded-full" style="background-color: {cat.color}"></div>
								<span>{cat.name}</span>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</div>
