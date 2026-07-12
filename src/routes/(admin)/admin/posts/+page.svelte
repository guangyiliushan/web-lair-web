<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Empty } from '$lib/components/ui/empty';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconExternalLink from '@tabler/icons-svelte-runes/icons/external-link';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconTrash from '@tabler/icons-svelte-runes/icons/trash';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconMessage from '@tabler/icons-svelte-runes/icons/message';
	import IconThumbUp from '@tabler/icons-svelte-runes/icons/thumb-up';
	import IconDots from '@tabler/icons-svelte-runes/icons/dots';
	import IconFilter from '@tabler/icons-svelte-runes/icons/filter';
	import IconSortAscending from '@tabler/icons-svelte-runes/icons/sort-ascending';

	// 模拟数据 - 实际应从 data.posts 获取
	const posts = [
		{
			id: '1',
			title: 'AI时代的效率悖论：当生产力提升反而带来焦虑',
			slug: 'ai-efficiency-paradox',
			status: 'published',
			category: 'Experience',
			tags: ['AI', '效率', '思考'],
			views: 1651,
			comments: 10,
			likes: 89,
			updatedAt: '1个月前'
		},
		{
			id: '2',
			title: 'AI 时代的重构方式：从 RFC 到五个 Plan',
			slug: 'ai-reconstruction-rfc-plan',
			status: 'published',
			category: 'Programming',
			tags: ['AI', 'RFC', '架构'],
			views: 1402,
			comments: 19,
			likes: 156,
			updatedAt: '29天前'
		},
		{
			id: '3',
			title: '记 LobeHub 的性能和 DX 优化',
			slug: 'lobehub-performance-dx',
			status: 'published',
			category: 'Technology',
			tags: ['React', '性能', 'DX'],
			views: 3193,
			comments: 30,
			likes: 234,
			updatedAt: '3个月前'
		},
		{
			id: '4',
			title: '我是如何使用 AI 辅助创作的',
			slug: 'ai-assisted-creation',
			status: 'published',
			category: 'Technology',
			tags: ['AI', '创作', '工具'],
			views: 1972,
			comments: 15,
			likes: 178,
			updatedAt: '3个月前'
		},
		{
			id: '5',
			title: 'Better Auth 的多租户用户鉴权的构想',
			slug: 'better-auth-multi-tenant',
			status: 'published',
			category: 'Technology',
			tags: ['Auth', '多租户', '架构'],
			views: 1383,
			comments: 16,
			likes: 145,
			updatedAt: '4个月前'
		},
		{
			id: '6',
			title: '写在离开 Folo 之后',
			slug: 'after-leaving-folo',
			status: 'published',
			category: 'Experience',
			tags: ['职业', '反思', '成长'],
			views: 685,
			comments: 9,
			likes: 67,
			updatedAt: '4个月前'
		},
		{
			id: '7',
			title: '回头看见自己',
			slug: 'looking-back-at-myself',
			status: 'published',
			category: 'Experience',
			tags: ['成长', '反思'],
			views: 10155,
			comments: 117,
			likes: 892,
			updatedAt: '4个月前'
		},
		{
			id: '8',
			title: 'TailwindCSS v4 全新颜色系统与主题切换',
			slug: 'tailwindcss-v4-colors',
			status: 'published',
			category: 'Technology',
			tags: ['TailwindCSS', 'CSS', '主题'],
			views: 3180,
			comments: 28,
			likes: 267,
			updatedAt: '8个月前'
		}
	];

	let searchQuery = $state('');
	let selectedStatus = $state('all');

	const filteredPosts = $derived(
		posts.filter((post) => {
			const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
			return matchesSearch && matchesStatus;
		})
	);

	function getStatusBadge(status: string) {
		switch (status) {
			case 'published':
				return { variant: 'default' as const, label: '已发布' };
			case 'draft':
				return { variant: 'secondary' as const, label: '草稿' };
			default:
				return { variant: 'outline' as const, label: status };
		}
	}
</script>

<svelte:head>
	<title>博文管理 - Lair Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<!-- 页面标题 -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">博文管理</h1>
			<p class="text-sm text-muted-foreground">管理你的博文内容，包括发布、编辑和删除操作</p>
		</div>
		<Button href="/admin/posts/new">
			<IconPlus data-icon="inline-start" />
			新建博文
		</Button>
	</div>

	<!-- 搜索和筛选 -->
	<Card.Root>
		<Card.Content class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<IconSearch class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input type="search" placeholder="搜索标题..." class="pl-9" bind:value={searchQuery} />
			</div>
			<div class="flex gap-2">
				<Button variant="outline" size="sm">
					<IconFilter data-icon="inline-start" />
					筛选
				</Button>
				<Button variant="outline" size="sm">
					<IconSortAscending data-icon="inline-start" />
					排序
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- 博文列表 -->
	<Card.Root>
		<Card.Content class="p-0">
			{#if filteredPosts.length === 0}
				<Empty class="py-12">
					<div class="flex flex-col items-center gap-1">
						<h3 class="text-lg font-semibold tracking-tight">暂无博文</h3>
						<p class="text-sm text-muted-foreground">还没有创建任何博文，点击上方按钮开始创作吧</p>
					</div>
					<div class="mt-4">
						<Button href="/admin/posts/new">
							<IconPlus data-icon="inline-start" />
							新建博文
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
								<Table.Head>标题</Table.Head>
								<Table.Head class="hidden md:table-cell">分类</Table.Head>
								<Table.Head class="hidden lg:table-cell">数据</Table.Head>
								<Table.Head class="hidden sm:table-cell">更新时间</Table.Head>
								<Table.Head class="w-25 text-right">操作</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredPosts as post (post.id)}
								{@const status = getStatusBadge(post.status)}
								<Table.Row class="group">
									<Table.Cell>
										<input type="checkbox" class="size-4 rounded border" />
									</Table.Cell>
									<Table.Cell>
										<div class="flex flex-col gap-1">
											<a
												href="/admin/posts/{post.id}/edit"
												class="line-clamp-1 font-medium hover:text-primary"
											>
												{post.title}
											</a>
											<div class="flex items-center gap-2">
												<Badge variant={status.variant} class="text-xs">{status.label}</Badge>
												<span class="text-xs text-muted-foreground md:hidden">{post.category}</span>
											</div>
										</div>
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">
										<Badge variant="outline" class="text-xs">{post.category}</Badge>
									</Table.Cell>
									<Table.Cell class="hidden lg:table-cell">
										<div class="flex items-center gap-3 text-sm text-muted-foreground">
											<span class="flex items-center gap-1">
												<IconEye class="size-3.5" />
												{post.views}
											</span>
											<span class="flex items-center gap-1">
												<IconMessage class="size-3.5" />
												{post.comments}
											</span>
											<span class="flex items-center gap-1">
												<IconThumbUp class="size-3.5" />
												{post.likes}
											</span>
										</div>
									</Table.Cell>
									<Table.Cell class="hidden text-muted-foreground sm:table-cell">
										{post.updatedAt}
									</Table.Cell>
									<Table.Cell class="text-right">
										<div class="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												class="size-8 opacity-0 transition-opacity group-hover:opacity-100"
												onclick={() => window.open(`/${post.slug}`, '_blank')}
											>
												<IconExternalLink class="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												class="size-8 opacity-0 transition-opacity group-hover:opacity-100"
												href="/admin/posts/{post.id}/edit"
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
														<DropdownMenu.Item
															onclick={() => window.open(`/${post.slug}`, '_blank')}
														>
															<IconExternalLink data-icon="inline-start" />
															查看
														</DropdownMenu.Item>
														<DropdownMenu.Item>
															{#snippet child({ props })}
																<a href="/admin/posts/{post.id}/edit" {...props}>
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
