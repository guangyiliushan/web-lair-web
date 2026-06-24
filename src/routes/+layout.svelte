<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { localeStore } from '$lib/stores/locale.svelte';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	onMount(() => {
		themeStore.init();
		localeStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider>
	<div class="flex min-h-screen flex-col selection:bg-primary/30">
		<Header auth={data.auth} postsData={data.postsData} notesData={data.notesData} timelineData={data.timelineData} />
		<div class="flex flex-1 pt-24">
			<main class="min-w-0 flex-1">
				{@render children()}
			</main>
		</div>
		<Footer />
	</div>
</Tooltip.Provider>
