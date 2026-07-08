<script lang="ts">
	import { page } from '$app/state';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';
	import IconExternalLink from '@tabler/icons-svelte-runes/icons/external-link';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconArrowLeft from '@tabler/icons-svelte-runes/icons/arrow-left';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconUpload from '@tabler/icons-svelte-runes/icons/upload';
	import IconUserPlus from '@tabler/icons-svelte-runes/icons/user-plus';

	/** 单个操作按钮的定义 */
	interface HeaderAction {
		label: string;
		icon: Component;
		variant?: 'default' | 'outline' | 'ghost';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		/** 优先使用 href 做链接跳转 */
		href?: string;
		/** 否则使用 onclick 回调 */
		onclick?: () => void;
	}

	interface Props {
		/** 自定义标题，不传则根据路由自动推断 */
		title?: string;
		/** 自定义操作按钮，不传则根据路由自动推断 */
		actions?: HeaderAction[];
		/** 附加 CSS 类 */
		class?: string;
	}

	let { title, actions, class: className }: Props = $props();

	// ── 路由感知：页面标题 ──
	const pageTitle = $derived(
		title ?? resolveTitle(page.url.pathname)
	);

	// ── 路由感知：操作按钮 ──
	const pageActions = $derived(
		actions ?? resolveActions(page.url.pathname)
	);

	// ── 工具函数 ──

	function resolveTitle(pathname: string): string {
		if (pathname === '/admin') return '仪表盘';
		if (pathname.startsWith('/admin/posts')) return '博文';
		if (pathname.startsWith('/admin/notes')) return '手记';
		if (pathname.startsWith('/admin/says')) return '说说';
		if (pathname.startsWith('/admin/comments')) return '评论';
		if (pathname.startsWith('/admin/drafts')) return '草稿箱';
		if (pathname.startsWith('/admin/pages')) return '页面';
		if (pathname.startsWith('/admin/reader')) return '读者';
		if (pathname.startsWith('/admin/friends')) return '朋友们';
		if (pathname.startsWith('/admin/files')) return '文件';
		if (pathname.startsWith('/admin/analytics')) return '数据';
		if (pathname.startsWith('/admin/settings')) return '设定';
		if (pathname.startsWith('/admin/setup')) return '设定向导';
		if (pathname.startsWith('/admin/maintenance')) return '维护';
		if (pathname.startsWith('/admin/ai')) return 'AI';
		if (pathname.startsWith('/admin/addons')) return '附加功能';
		if (pathname.startsWith('/admin/enrichment')) return '内容增强';
		if (pathname.startsWith('/admin/debug')) return '调试';
		if (pathname.startsWith('/admin/project')) return '项目';
		return '管理后台';
	}

	function resolveActions(pathname: string): HeaderAction[] {
		// 博文相关
		if (pathname.startsWith('/admin/posts/new') || pathname.match(/^\/admin\/posts\/[^/]+\/edit$/)) {
			return [
				{ label: '返回列表', icon: IconArrowLeft, variant: 'outline', size: 'sm', href: '/admin/posts' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}
		if (pathname.startsWith('/admin/posts')) {
			return [
				{ label: '新建博文', icon: IconPlus, variant: 'default', size: 'sm', href: '/admin/posts/new' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 手记相关
		if (pathname.startsWith('/admin/notes/new') || pathname.match(/^\/admin\/notes\/[^/]+\/edit$/)) {
			return [
				{ label: '返回列表', icon: IconArrowLeft, variant: 'outline', size: 'sm', href: '/admin/notes' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}
		if (pathname.startsWith('/admin/notes')) {
			return [
				{ label: '新建手记', icon: IconPlus, variant: 'default', size: 'sm', href: '/admin/notes/new' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 说说相关
		if (pathname.startsWith('/admin/says/new') || pathname.match(/^\/admin\/says\/[^/]+\/edit$/)) {
			return [
				{ label: '返回列表', icon: IconArrowLeft, variant: 'outline', size: 'sm', href: '/admin/says' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}
		if (pathname.startsWith('/admin/says')) {
			return [
				{ label: '新建说说', icon: IconPlus, variant: 'default', size: 'sm', href: '/admin/says/new' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 页面管理
		if (pathname.startsWith('/admin/pages')) {
			return [
				{ label: '新建页面', icon: IconPlus, variant: 'default', size: 'sm', href: '/admin/pages/new' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 文件管理
		if (pathname.startsWith('/admin/files')) {
			return [
				{ label: '上传文件', icon: IconUpload, variant: 'default', size: 'sm', href: '/admin/files/upload' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 友链管理
		if (pathname.startsWith('/admin/friends')) {
			return [
				{ label: '添加友链', icon: IconUserPlus, variant: 'default', size: 'sm', href: '/admin/friends/new' },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 草稿箱 / 读者管理
		if (pathname.startsWith('/admin/drafts')) {
			return [
				{ label: '预览站点', icon: IconEye, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') },
				{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
			];
		}

		// 默认：仅访问站点
		return [
			{ label: '访问站点', icon: IconExternalLink, variant: 'ghost', size: 'sm', onclick: () => window.open('/', '_blank') }
		];
	}
</script>

<header class={cn(
	'sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6',
	className
)}>
	<Sidebar.Trigger class="-ml-1" />
	<Separator orientation="vertical" class="h-6" />
	<div class="flex flex-1 items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-muted-foreground">{pageTitle}</span>
		</div>
		<div class="flex items-center gap-2">
			{#each pageActions as action (action.label)}
				{@const variant = action.variant ?? 'ghost'}
				{@const size = action.size ?? 'sm'}
				{#if action.href}
					<Button {variant} {size} href={action.href}>
						<action.icon data-icon="inline-start" />
						{action.label}
					</Button>
				{:else}
					<Button {variant} {size} onclick={action.onclick}>
						<action.icon data-icon="inline-start" />
						{action.label}
					</Button>
				{/if}
			{/each}
		</div>
	</div>
</header>
