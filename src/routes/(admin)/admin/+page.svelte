<script lang="ts">
	import type { Component } from 'svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import IconLogout from '@tabler/icons-svelte-runes/icons/logout';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';
	import IconBrain from '@tabler/icons-svelte-runes/icons/brain';
	import IconChartBar from '@tabler/icons-svelte-runes/icons/chart-bar';
	import IconMessages from '@tabler/icons-svelte-runes/icons/messages';
	import IconLayoutDashboard from '@tabler/icons-svelte-runes/icons/layout-dashboard';
	import IconBug from '@tabler/icons-svelte-runes/icons/bug';
	import IconFilePencil from '@tabler/icons-svelte-runes/icons/file-pencil';
	import IconSparkles from '@tabler/icons-svelte-runes/icons/sparkles';
	import IconPuzzle from '@tabler/icons-svelte-runes/icons/puzzle';
	import IconTool from '@tabler/icons-svelte-runes/icons/tool';
	import IconFiles from '@tabler/icons-svelte-runes/icons/files';
	import IconUsers from '@tabler/icons-svelte-runes/icons/users';
	import IconNotebook from '@tabler/icons-svelte-runes/icons/notebook';
	import IconFileText from '@tabler/icons-svelte-runes/icons/file-text';
	import IconPencil from '@tabler/icons-svelte-runes/icons/pencil';
	import IconPackage from '@tabler/icons-svelte-runes/icons/package';
	import IconQuote from '@tabler/icons-svelte-runes/icons/quote';
	import IconBook from '@tabler/icons-svelte-runes/icons/book';
	import IconSettings from '@tabler/icons-svelte-runes/icons/settings';
	import IconApi from '@tabler/icons-svelte-runes/icons/api';
	import IconAdjustmentsCog from '@tabler/icons-svelte-runes/icons/adjustments-cog';

	let { data }: { data: PageData } = $props();

	interface Shortcut {
		label: string;
		href: string;
		icon: Component;
		available: boolean;
	}

	const shortcuts: Shortcut[] = [
		{ label: 'AI', href: '/admin/ai', icon: IconBrain, available: true },
		{ label: 'Analyze', href: '/admin/analytics', icon: IconChartBar, available: true },
		{ label: 'Comments', href: '/admin/comments', icon: IconMessages, available: true },
		{ label: 'Dashboard', href: '/admin', icon: IconLayoutDashboard, available: true },
		{ label: 'Debug', href: '/admin/debug', icon: IconBug, available: true },
		{ label: 'Drafts', href: '/admin/drafts', icon: IconFilePencil, available: true },
		{ label: 'Enrichment', href: '/admin/enrichment', icon: IconSparkles, available: true },
		{ label: 'Extra Features', href: '/admin/extra-features', icon: IconPuzzle, available: true },
		{ label: 'Maintenance', href: '/admin/maintenance', icon: IconTool, available: true },
		{ label: 'Files', href: '/admin/files', icon: IconFiles, available: true },
		{ label: 'Friends', href: '/admin/friends', icon: IconUsers, available: true },
		{ label: 'Notes', href: '/admin/notes', icon: IconNotebook, available: true },
		{ label: 'Pages', href: '/admin/pages', icon: IconFileText, available: true },
		{ label: 'Posts', href: '/admin/posts', icon: IconPencil, available: true },
		{ label: 'Project', href: '/admin/project', icon: IconPackage, available: true },
		{ label: 'Says', href: '/admin/says', icon: IconQuote, available: true },
		{ label: 'Reader', href: '/admin/reader', icon: IconBook, available: true },
		{ label: 'Settings', href: '/admin/settings', icon: IconSettings, available: true },
		{ label: 'Setup API', href: '/admin/setup-api', icon: IconApi, available: true },
		{ label: 'Setup', href: '/admin/setup', icon: IconAdjustmentsCog, available: true }
	];
</script>

<div class="flex w-full flex-col gap-8 px-4 py-8">
	<!-- Welcome Card -->
	<Card.Root class="mx-auto w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">
				Welcome, {data.profile?.displayName ?? data.user?.name ?? 'Admin'}!
			</Card.Title>
			<Card.Description>This is your personal dashboard.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col items-center gap-4">
			<div class="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm">
				<IconUser class="size-4" />
				<span>{data.user?.email ?? '—'}</span>
			</div>
		</Card.Content>
		<Card.Footer class="justify-center">
			<form method="post" action="/auth/sign-out">
				<Button variant="outline" type="submit">
					<IconLogout data-icon="inline-start" />
					Sign out
				</Button>
			</form>
		</Card.Footer>
	</Card.Root>

	<!-- Shorthand Navigation -->
	<section>
		<h2 class="mb-4 text-lg font-semibold tracking-tight">Shorthand</h2>
		<div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each shortcuts as shortcut (shortcut.label)}
				{@const Icon = shortcut.icon}
				<a
					href={shortcut.available ? shortcut.href : undefined}
					class={[
						'group flex items-center gap-3 rounded-xl border bg-background p-4 transition-colors',
						shortcut.available
							? 'hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
							: 'cursor-not-allowed opacity-50'
					].join(' ')}
					aria-disabled={!shortcut.available}
				>
					<div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
						<Icon class="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
					</div>
					<div class="min-w-0">
						<p class="truncate text-sm font-medium">{shortcut.label}</p>
						<p class="text-xs text-muted-foreground">
							{shortcut.available ? 'Available' : 'Soon'}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>
