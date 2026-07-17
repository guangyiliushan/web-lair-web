<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		selected = false,
		children,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> & {
		selected?: boolean;
	} = $props();
</script>

<button
	bind:this={ref}
	type="button"
	data-slot="master-detail-item"
	data-selected={selected || undefined}
	class={cn(
		'flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors',
		selected ? 'bg-accent' : 'hover:bg-muted/50',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</button>
