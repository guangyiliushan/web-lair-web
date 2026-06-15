<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		themeStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider>
	<div class="flex min-h-screen flex-col selection:bg-primary/30">
		<Header />
		<div class="flex flex-1 pt-24">
			<main class="flex-1 min-w-0">
				{@render children()}
			</main>
		</div>
	</div>
</Tooltip.Provider>
