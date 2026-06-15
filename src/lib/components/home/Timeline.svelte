<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { m } from '$lib/paraglide/messages';

	interface Item {
		slug: string;
		title: string;
		description: string;
		type: 'post' | 'note';
		date: string;
		year: number;
		readTime: number;
		tags: string[];
	}

	const items: Item[] = [
		{ slug: '#', title: 'Svelte 5 Runes: A Complete Guide', description: 'Everything you need to know about the new reactivity primitives', type: 'post', date: '2026-06-10', year: 2026, readTime: 8, tags: ['Svelte', 'Runes'] },
		{ slug: '#', title: 'Building a Blog with SvelteKit', description: 'Step-by-step guide to creating a modern blog', type: 'post', date: '2026-05-28', year: 2026, readTime: 12, tags: ['SvelteKit', 'Blog'] },
		{ slug: '#', title: 'Drizzle ORM Tips', description: 'Collection of useful patterns for Drizzle', type: 'note', date: '2026-05-15', year: 2026, readTime: 5, tags: ['Drizzle', 'Database'] },
		{ slug: '#', title: 'WebSocket in SvelteKit', description: 'Real-time communication made easy', type: 'post', date: '2025-12-20', year: 2025, readTime: 10, tags: ['WebSocket', 'SvelteKit'] },
		{ slug: '#', title: 'TypeScript Patterns', description: 'Advanced TypeScript patterns for better code', type: 'note', date: '2025-11-05', year: 2025, readTime: 6, tags: ['TypeScript'] }
	];

	let yearValue = $state<string[]>(['all']);
	let typeValue = $state<string[]>(['all']);

	const year = $derived(yearValue[0] ?? 'all');
	const type = $derived(typeValue[0] ?? 'all');

	const yearOptions = $derived(
		[...new Set(items.map((i) => i.year))].sort((a, b) => b - a)
	);

	const filtered = $derived(
		items.filter((item) => {
			if (year !== 'all' && item.year !== Number(year)) return false;
			if (type !== 'all' && item.type !== type) return false;
			return true;
		})
	);

	function onYearChange(v: string[]) {
		yearValue = v;
	}
	function onTypeChange(v: string[]) {
		typeValue = v;
	}

	const displayedYear = $derived(
		yearOptions.some((y) => String(y) === year) ? year : m.filter_by_year()
	);

	const displayedType = $derived(
		type === 'all' ? m.filter_by_type() : type === 'post' ? m.type_post() : m.type_note()
	);
</script>

<section class="container max-w-5xl px-4">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h2 class="text-2xl font-bold tracking-tight">{m.content_timeline()}</h2>

		<div class="flex flex-wrap gap-3">
			<Select.Root type="multiple" value={yearValue} onValueChange={onYearChange}>
				<Select.Trigger class="w-36">
					{displayedYear}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all">{m.type_all()}</Select.Item>
						{#each yearOptions as y (y)}
							<Select.Item value={String(y)}>{y}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root type="multiple" value={typeValue} onValueChange={onTypeChange}>
				<Select.Trigger class="w-28">
					{displayedType}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all">{m.type_all()}</Select.Item>
						<Select.Item value="post">{m.type_post()}</Select.Item>
						<Select.Item value="note">{m.type_note()}</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

		<div class="flex flex-col gap-6">
		{#each filtered as item, i (item.slug + i)}
			<Card.Root class="transition-shadow hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header>
					<div class="flex items-center gap-3 text-sm text-muted-foreground">
						<Badge variant="outline">
							{item.type === 'post' ? m.type_post() : m.type_note()}
						</Badge>
						<time datetime={item.date}>{item.date}</time>
						<span>&middot;</span>
						<span>{item.readTime} {m.minutes_read()}</span>
					</div>

					<Card.Title>
						<a href={item.slug} class="hover:text-primary hover:underline underline-offset-4 transition-colors">
							{item.title}
						</a>
					</Card.Title>

					<Card.Description>{item.description}</Card.Description>
				</Card.Header>

				<Card.Content>
					<div class="flex flex-wrap items-center gap-2">
						{#each item.tags as tag (tag)}
							<Badge variant="secondary">{tag}</Badge>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
				<p>{m.no_activities()}</p>
			</div>
		{/each}
	</div>

	{#if filtered.length > 0}
		<div class="mt-10 flex justify-center">
			<Button variant="outline" size="lg" class="rounded-full">
				{m.view_all()}
			</Button>
		</div>
	{/if}
</section>
