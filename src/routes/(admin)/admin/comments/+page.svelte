<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Comments - Lair Admin</title>
</svelte:head>

<div class="space-y-4">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Comments</h2>
		<p class="text-sm text-muted-foreground">Comment moderation will be available here.</p>
	</div>

	<div class="rounded-xl border bg-background p-6">
		<p class="text-sm text-muted-foreground">Comments module — planned for a future release.</p>
		{#if data.pendingCount > 0}
			<p class="mt-2 text-sm">{data.pendingCount} comment(s) pending review.</p>
		{/if}
	</div>
</div>
