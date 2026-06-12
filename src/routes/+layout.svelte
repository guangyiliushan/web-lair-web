<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
	let mobileOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col selection:bg-primary/30">
	<Header onMenuToggle={() => mobileOpen = !mobileOpen} />
	<div class="flex flex-1 pt-24">
		<main class="flex-1 min-w-0">
			{@render children()}
		</main>
	</div>
	<MobileNav open={mobileOpen} onOpenChange={(v) => mobileOpen = v} />
</div>
