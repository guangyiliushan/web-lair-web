<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { m } from '$lib/paraglide/messages';
	import { IconPencil, IconMessageCircle, IconBulb } from '@tabler/icons-svelte';

	interface Item {
		id: number;
		type: 'post' | 'comment' | 'thought';
		title: string;
		description: string;
		time: string;
	}

	const items: Item[] = [
		{ id: 1, type: 'post', title: 'Svelte 5 Runes', description: 'Deep dive into reactivity', time: '5 minutes ago' },
		{ id: 2, type: 'comment', title: 'Real-time Apps', description: 'Great article, very helpful', time: '12 minutes ago' },
		{ id: 3, type: 'thought', title: 'Code Quality', description: 'The best code is the one you do not write', time: '1 hour ago' },
		{ id: 4, type: 'post', title: 'Drizzle ORM', description: 'Schema patterns that scale', time: '3 hours ago' },
		{ id: 5, type: 'comment', title: 'Tailwind v4', description: 'This saved me hours!', time: '5 hours ago' }
	];

	function label(type: Item['type']): string {
		switch (type) {
			case 'post': return m.activity_new_post();
			case 'comment': return m.activity_new_comment();
			case 'thought': return m.activity_new_thought();
		}
	}
</script>

<section class="container max-w-5xl px-4">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-2xl font-bold tracking-tight">{m.latest_activities()}</h2>
		<a href="/activities" class="text-sm text-muted-foreground hover:text-primary transition-colors">
			&#8594; {m.view_all()}
		</a>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each items as item (item.id)}
			<Card.Root class="transition-shadow hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header>
					<div class="flex items-start gap-3">
						<span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							{#if item.type === 'post'}
								<IconPencil class="size-5" />
							{:else if item.type === 'comment'}
								<IconMessageCircle class="size-5" />
							{:else}
								<IconBulb class="size-5" />
							{/if}
						</span>
						<div class="min-w-0 flex-1">
							<Badge variant="outline">{label(item.type)}</Badge>
							<Card.Title class="mt-1">{item.title}</Card.Title>
							<Card.Description>{item.description}</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Footer>
					<time class="text-xs text-muted-foreground">{item.time}</time>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</section>
