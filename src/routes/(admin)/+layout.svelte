<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import IconDashboard from '@tabler/icons-svelte-runes/icons/layout-dashboard';
	import IconArticle from '@tabler/icons-svelte-runes/icons/article';
	import IconNotebook from '@tabler/icons-svelte-runes/icons/notebook';
	import IconMessage from '@tabler/icons-svelte-runes/icons/message';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconFileText from '@tabler/icons-svelte-runes/icons/file-text';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconQuote from '@tabler/icons-svelte-runes/icons/quote';
	import IconWriting from '@tabler/icons-svelte-runes/icons/writing';
	import IconFolders from '@tabler/icons-svelte-runes/icons/folders';
	import IconUsers from '@tabler/icons-svelte-runes/icons/users';
	import IconSparkles from '@tabler/icons-svelte-runes/icons/sparkles';
	import IconChartBar from '@tabler/icons-svelte-runes/icons/chart-bar';
	import IconSettings from '@tabler/icons-svelte-runes/icons/settings';
	import IconPuzzle from '@tabler/icons-svelte-runes/icons/puzzle';
	import IconTool from '@tabler/icons-svelte-runes/icons/tool';
	import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right';
	import IconLogout from '@tabler/icons-svelte-runes/icons/logout';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';
	import IconExternalLink from '@tabler/icons-svelte-runes/icons/external-link';
	import { page } from '$app/state';

	let { children, data }: LayoutProps = $props();

	const navItems = [
		{ title: '仪表盘', href: '/admin', icon: IconDashboard },
		{ title: '博文', href: '/admin/posts', icon: IconArticle },
		{ title: '手记', href: '/admin/notes', icon: IconNotebook },
		{ title: '评论', href: '/admin/comments', icon: IconMessage },
		{ title: '草稿箱', href: '/admin/drafts', icon: IconPencil },
		{ title: '页面', href: '/admin/pages', icon: IconFileText },
		{ title: '读者', href: '/admin/readers', icon: IconEye },
		{ title: '说说', href: '/admin/says', icon: IconQuote },
		{ title: '速记', href: '/admin/shorthand', icon: IconWriting },
		{ title: '项目', href: '/admin/projects', icon: IconFolders },
		{ title: '朋友们', href: '/admin/friends', icon: IconUsers },
		{ title: 'AI', href: '/admin/ai', icon: IconSparkles },
		{ title: '数据', href: '/admin/analytics', icon: IconChartBar },
		{ title: '设定', href: '/admin/settings', icon: IconSettings },
		{ title: '附加功能', href: '/admin/addons', icon: IconPuzzle },
		{ title: '维护', href: '/admin/maintenance', icon: IconTool },
	];

	const user = $derived(data.auth?.user);
	const profile = $derived(data.auth?.profile);
	const displayName = $derived(profile?.displayName ?? user?.name ?? 'Admin');
	const email = $derived(user?.email ?? '');
	const avatarSrc = $derived(profile?.avatarUrl ?? user?.image ?? '');
	const avatarFallback = $derived(displayName.charAt(0).toUpperCase());
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" variant="sidebar">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton size="lg" class="group/menu-button" {...props}>
									<span class="flex size-8 shrink-0 items-center justify-center">
										<Avatar.Root class="size-6 rounded-md">
											<Avatar.Image src={avatarSrc} alt={displayName} />
											<Avatar.Fallback class="rounded-md bg-primary text-primary-foreground text-xs">
												{avatarFallback}
											</Avatar.Fallback>
										</Avatar.Root>
									</span>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-semibold">{displayName}</span>
										<span class="truncate text-xs text-muted-foreground">{email}</span>
									</div>
									<IconChevronRight class="ml-auto transition-transform group-data-[state=open]/menu-button:rotate-90" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" side="right" class="w-56">
							<DropdownMenu.Label>我的账号</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<IconUser data-icon="inline-start" />
									个人资料
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => window.open('/', '_blank')}>
									<IconExternalLink data-icon="inline-start" />
									访问站点
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<form method="post" action="/auth/sign-out">
								<DropdownMenu.Item class="text-destructive focus:text-destructive" onclick={(e) => { e.currentTarget.closest('form')?.submit(); }}>
									<IconLogout data-icon="inline-start" />
									退出登录
								</DropdownMenu.Item>
							</form>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>

		<Sidebar.Content class="px-2">
				<Sidebar.Menu class="gap-1">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`)}
				<Sidebar.MenuItem>
						<Sidebar.MenuButton {isActive} tooltipContent={item.title}>
						{#snippet child({ props })}
							<a href={item.href} {...props}>
								<span class="flex size-8 shrink-0 items-center justify-center group-data-[collapsible=icon]:size-4">
										<item.icon />
									</span>
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Content>

		<Sidebar.Rail />
	</Sidebar.Root>

	<Sidebar.Inset class="flex min-h-screen flex-col">
		<header class="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="h-6" />
			<div class="flex flex-1 items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium text-muted-foreground">管理后台</span>
				</div>
				<div class="flex items-center gap-2">
					<Button variant="ghost" size="sm" onclick={() => window.open('/', '_blank')}>
						<IconExternalLink data-icon="inline-start" />
						访问站点
					</Button>
				</div>
			</div>
		</header>

		<main class="flex-1 p-4 sm:p-6 lg:p-8">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
