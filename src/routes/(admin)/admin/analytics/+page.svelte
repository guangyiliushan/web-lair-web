<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Analytics - Lair Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">Analytics</h2>
			<p class="text-sm text-muted-foreground">Site traffic and engagement overview.</p>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<p class="text-xs tracking-wide text-muted-foreground uppercase">Today Views</p>
			<p class="mt-1 text-2xl font-bold">{data.overview.todayPv}</p>
		</div>
	</div>

	{#if data.dashboardUrl}
		<div class="rounded-lg border bg-card p-4">
			<p class="text-sm text-muted-foreground">
				OpenPanel Dashboard:
				<a href={data.dashboardUrl} target="_blank" rel="noopener noreferrer" class="underline">
					Open in new tab
				</a>
			</p>
		</div>
	{/if}
</div>
