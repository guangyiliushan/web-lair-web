<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Notes - Lair Admin</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">Notes</h2>
			<p class="text-sm text-muted-foreground">Manage your notes and series.</p>
		</div>
	</div>

	<div class="rounded-xl border bg-background p-6">
		<p class="text-sm text-muted-foreground">Notes management — planned for a future release.</p>
	</div>
</div>
