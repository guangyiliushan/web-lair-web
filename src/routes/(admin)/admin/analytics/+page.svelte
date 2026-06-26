<script lang="ts">
	import type { PageServerData } from './$types';
	import { AnalyticsSummaryCard } from '$lib/components/admin/analytics/AnalyticsSummaryCard.svelte';
	import { OpenPanelQuickLinkCard } from '$lib/components/admin/analytics/OpenPanelQuickLinkCard.svelte';

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
		<AnalyticsSummaryCard title="Today Views" value={data.overview.todayPv} />
	</div>

	<OpenPanelQuickLinkCard url={data.dashboardUrl} />
</div>
