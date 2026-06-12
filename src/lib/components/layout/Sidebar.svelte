<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Separator } from '$lib/components/ui/separator';
	import { IconRss } from '@tabler/icons-svelte';

	let { class: className = '' }: { class?: string } = $props();

	const tags = [
		'Svelte 5', 'TypeScript', 'Drizzle', 'Tailwind',
		'WebSocket', 'Runes', 'PostgreSQL', 'Paraglide'
	];
</script>

<aside class="flex flex-col gap-8 p-6 {className}">
	<nav class="flex flex-col gap-3">
		<h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
			{m.trending_now()}
		</h4>
		<div class="flex flex-wrap gap-2">
			{#each tags as tag (tag)}
				<a
					href="/categories/{tag.toLowerCase().replace(/\s+/g, '-')}"
					class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
				>
					{tag}
				</a>
			{/each}
		</div>
	</nav>

	<Separator />

	<nav class="flex flex-col gap-3">
		<h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
			{m.nav_archive()}
		</h4>
		<a href="/archive" class="text-sm text-muted-foreground hover:text-primary transition-colors">
			&#8594; {m.view_all()}
		</a>
	</nav>

	<Separator />

	<nav class="flex flex-col gap-3">
		<h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
			{m.nav_rss()}
		</h4>
		<a
			href="/rss.xml"
			class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
			target="_blank"
			rel="noopener noreferrer"
		>
			<IconRss class="size-4" />
			Subscribe via RSS
		</a>
	</nav>
</aside>
