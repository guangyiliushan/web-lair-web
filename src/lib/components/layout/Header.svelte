<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import * as Button from '$lib/components/ui/button';
	import { IconMenu2, IconCodeCircle2 } from '@tabler/icons-svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { onMenuToggle }: { onMenuToggle: () => void } = $props();

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
			<Button.Root variant="ghost" size="icon" class="lg:hidden" onclick={onMenuToggle} aria-label={m.open_menu()}>
				<IconMenu2 class="size-5" />
			</Button.Root>

			<a href="/" class="flex items-center gap-2 font-bold pl-2">
				<IconCodeCircle2 class="size-6 text-primary" />
				<span class="hidden sm:inline">Lair</span>
			</a>
		</div>

		<nav class="hidden lg:flex items-center gap-1">
			{#each navItems as { key, href } (key)}
				<a
					{href}
					class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-primary {isActive(href) ? 'text-primary bg-primary/10' : 'text-muted-foreground'}"
				>
					{m[key]()}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-1">
			<LanguageSwitcher />
			<ThemeToggle />
		</div>
	</div>
</header>
