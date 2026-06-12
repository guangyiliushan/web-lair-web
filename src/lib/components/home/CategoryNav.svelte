<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	const categories = [
		{ label: 'Svelte', href: '/categories/svelte', count: 12 },
		{ label: 'SvelteKit', href: '/categories/sveltekit', count: 8 },
		{ label: 'TypeScript', href: '/categories/typescript', count: 15 },
		{ label: 'Database', href: '/categories/database', count: 6 },
		{ label: 'WebSocket', href: '/categories/websocket', count: 3 },
		{ label: 'DevOps', href: '/categories/devops', count: 4 }
	];
</script>

<section class="container max-w-5xl px-4">
	<div class="mb-8">
		<h2 class="text-2xl font-bold tracking-tight">{m.trending_now()}</h2>
	</div>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		{#each categories as cat (cat.label)}
			<a
				href={cat.href}
				class="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
			>
				<span class="text-sm font-medium group-hover:text-primary transition-colors">{cat.label}</span>
				<span class="text-xs text-muted-foreground">{cat.count} articles</span>
			</a>
		{/each}
	</div>
</section>
