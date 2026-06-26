<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { localeStore } from '$lib/stores/locale.svelte';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		themeStore.init();
		localeStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider>
	<div class="selection:bg-primary/30">
		{@render children()}
	</div>
</Tooltip.Provider>
