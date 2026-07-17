<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type PaneSide = 'master' | 'detail';

	let {
		ref = $bindable(null),
		side = 'master',
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		side?: PaneSide;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="master-detail-pane"
	data-side={side}
	class={cn(
		'flex min-w-0 flex-col',
		side === 'master' && 'border-r',
		side === 'detail' && 'flex-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
