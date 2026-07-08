<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		label: string;
		value: string;
		description?: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		icon: Icon,
		label,
		value,
		description,
		class: className,
		children
	}: Props = $props();
</script>

<div class={cn('bg-card p-4', className)}>
	<Icon class="mb-3 size-5 text-muted-foreground" aria-hidden="true" />
	<div class="text-sm text-muted-foreground">{label}</div>
	<div class="mt-1 text-lg font-semibold">{value}</div>
	{#if description}
		<p class="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
	{/if}
	{#if children}
		<div class="mt-3 flex flex-wrap gap-2">
			{@render children()}
		</div>
	{/if}
</div>
