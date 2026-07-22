<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as MasterDetail from '$lib/components/admin/master-detail';
	import IconSettings from '@tabler/icons-svelte-runes/icons/settings';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';
	import IconMail from '@tabler/icons-svelte-runes/icons/mail';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconDatabase from '@tabler/icons-svelte-runes/icons/database';
	import IconSparkles from '@tabler/icons-svelte-runes/icons/sparkles';
	import IconPuzzle from '@tabler/icons-svelte-runes/icons/puzzle';
	import IconShield from '@tabler/icons-svelte-runes/icons/shield';
	import IconList from '@tabler/icons-svelte-runes/icons/list';
	import IconArrowLeft from '@tabler/icons-svelte-runes/icons/arrow-left';
	import type { Component, Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	type SectionId = 'user' | 'site' | 'content' | 'notification' | 'search' | 'storage' | 'ai' | 'integrations' | 'system' | 'account' | 'meta-preset';

	const sections: { id: SectionId; label: string; desc: string; icon: Component }[] = [
		{ id: 'user', label: '用户', desc: '个人资料', icon: IconUser },
		{ id: 'site', label: 'Site', desc: 'Site URL, SEO', icon: IconSettings },
		{ id: 'content', label: 'Content', desc: 'Comments, friend links', icon: IconMail },
		{ id: 'notification', label: 'Notifications', desc: 'Email, Bark push', icon: IconMail },
		{ id: 'search', label: 'Search push', desc: 'Search engines, full-text search', icon: IconSearch },
		{ id: 'storage', label: 'Storage', desc: 'Backup, image hosting, comment image uploads', icon: IconDatabase },
		{ id: 'ai', label: 'AI', desc: 'AI summary, writing assistant', icon: IconSparkles },
		{ id: 'integrations', label: 'Third-party integrations', desc: 'GitHub, TMDB, Bangumi, etc.', icon: IconPuzzle },
		{ id: 'system', label: 'System', desc: 'Admin settings, feature toggles', icon: IconSettings },
		{ id: 'account', label: '账号安全', desc: '登录、认证、凭证', icon: IconShield },
		{ id: 'meta-preset', label: 'Meta 预设', desc: '预设模板', icon: IconList }
	];

	const isRoot = $derived(page.url.pathname === '/admin/settings');

	function sectionHref(id: SectionId): string {
		return `/admin/settings/${id}`;
	}

	function isActive(id: SectionId): boolean {
		return page.url.pathname === sectionHref(id);
	}

	function activeSection() {
		return sections.find((s) => isActive(s.id));
	}
</script>

<svelte:head>
	<title>设定 - Lair Admin</title>
</svelte:head>

<MasterDetail.Root>
	<!-- 侧边栏导航 -->
	<MasterDetail.Pane side="master" class={'w-80 shrink-0' + (isRoot ? '' : ' max-lg:hidden')}>
		<MasterDetail.Header icon={IconSettings} title="设定" count={sections.length}>
			{#if !isRoot}
				<!-- 移动端返回按钮 -->
				<Button
					variant="ghost"
					size="icon"
					class="size-8 lg:hidden"
					onclick={() => goto('/admin/settings')}
					aria-label="返回设置列表"
				>
					<IconArrowLeft data-icon="inline-start" />
				</Button>
			{/if}
		</MasterDetail.Header>
		<MasterDetail.List>
			{#each sections as section (section.id)}
				<MasterDetail.Item
					selected={isActive(section.id)}
					onclick={() => goto(sectionHref(section.id))}
				>
					<span class="flex size-9 shrink-0 items-center justify-center rounded {isActive(section.id) ? 'bg-muted-foreground/15' : 'bg-muted'}">
						<section.icon class="size-4" />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-sm font-medium">{section.label}</span>
						<span class="mt-0.5 block truncate text-xs text-muted-foreground">{section.desc}</span>
					</span>
				</MasterDetail.Item>
			{/each}
		</MasterDetail.List>
	</MasterDetail.Pane>

	<!-- 内容区 -->
	<MasterDetail.Pane side="detail" class={isRoot ? 'max-lg:hidden' : ''}>
		{#if !isRoot}
			<!-- 移动端：返回侧边栏按钮 -->
			<div class="flex h-12 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
				<Button
					variant="ghost"
					size="icon"
					class="size-8"
					onclick={() => goto('/admin/settings')}
					aria-label="返回设置列表"
				>
					<IconArrowLeft data-icon="inline-start" />
				</Button>
				<span class="text-sm font-medium">{activeSection()?.label ?? ''}</span>
			</div>
			<!-- 桌面端：面包屑头部 -->
			<div class="hidden h-12 shrink-0 items-center gap-2 border-b px-4 lg:flex">
				<h1 class="truncate text-sm font-medium">{activeSection()?.label ?? ''}</h1>
				<span class="text-xs text-muted-foreground">{activeSection()?.desc ?? ''}</span>
			</div>
		{/if}
		<div class="min-h-0 flex-1 overflow-auto">
			<div class="min-h-full p-4">
				{@render children()}
			</div>
		</div>
	</MasterDetail.Pane>
</MasterDetail.Root>
