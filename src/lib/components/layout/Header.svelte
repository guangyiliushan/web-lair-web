<script lang="ts">
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { IconCodeCircle2 } from '@tabler/icons-svelte';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';

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

<header class="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
	<div class="pointer-events-auto flex items-center justify-between w-full max-w-5xl rounded-full border bg-background/70 backdrop-blur-md px-4 py-2 shadow-sm">
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2 font-bold">
				<IconCodeCircle2 class="size-6 text-primary" />
				<span class="hidden sm:inline">Lair</span>
			</a>
		</div>

		<div class="flex items-center gap-1">
			<nav class="hidden lg:flex items-center gap-1">
				{#each navItems as { key, href } (key)}
					<a
						{href}
						class={cn(
							'px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-primary',
							isActive(href) ? 'text-primary bg-primary/10' : 'text-muted-foreground'
						)}
					>
						{m[key]()}
					</a>
				{/each}
			</nav>
			<ThemeToggle />
		</div>
	</div>
</header>
