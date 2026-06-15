<script lang="ts">
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { IconCodeCircle2 } from '@tabler/icons-svelte';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import LangSwitcher from '$lib/components/layout/LangSwitcher.svelte';
	import UserNav from '$lib/components/layout/UserNav.svelte';

	type AuthData = {
		user: {
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image: string | null;
		} | null;
		profile: {
			displayName: string;
			avatarUrl: string | null;
		} | null;
	} | null;

	let { auth }: { auth?: AuthData } = $props();

	const navItems = [
		{ key: 'nav_home', href: '/' },
		{ key: 'nav_thinking', href: '/thinking' },
		{ key: 'nav_categories', href: '/categories' },
		{ key: 'nav_about', href: '/about' }
	] as const;

	const currentPath = $derived(page.url.pathname);

	function isActive(path: string): boolean {
		if (path === '/') {
			return currentPath === '/' || currentPath.startsWith('/en') === false;
		}
		return currentPath.startsWith(path);
	}
</script>

<header class="pointer-events-none fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
	<div
		class="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border bg-background/70 px-4 py-2 shadow-sm backdrop-blur-md"
	>
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2 font-bold">
				<IconCodeCircle2 class="size-6 text-primary" />
				<span class="hidden sm:inline">Lair</span>
			</a>
		</div>

		<div class="flex items-center gap-1">
			<nav class="hidden items-center gap-1 lg:flex">
				{#each navItems as { key, href } (key)}
					<a
						{href}
						class={cn(
							'rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary',
							isActive(href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
						)}
					>
						{m[key]()}
					</a>
				{/each}
			</nav>
		</div>

		<div class="flex items-center gap-2">
			<LangSwitcher />
			<ThemeToggle />
			<UserNav {auth} />
		</div>
	</div>
</header>
