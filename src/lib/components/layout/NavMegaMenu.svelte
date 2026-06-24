<script lang="ts">
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { IconChevronRight } from '@tabler/icons-svelte-runes';
	import type { MegaMenu } from '$lib/config/navigation.config';
	import type { Snippet } from 'svelte';

	/**
	 * Reusable hover mega menu component.
	 *
	 * Usage:
	 * ```svelte
	 * <NavMegaMenu bind:open menu={item.megaMenu} delay={150}>
	 *   {#snippet trigger()}
	 *     <a href={item.href}>{item.label}</a>
	 *   {/snippet}
	 * </NavMegaMenu>
	 * ```
	 */

	interface Props {
		/** The mega menu data to render */
		menu: MegaMenu;
		/** Bindable open state �?drive externally or let the component handle hover */
		open?: boolean;
		/** Hover close delay in ms (default 150) */
		delay?: number;
		/** Additional classes on the outer wrapper */
		class?: string;
		/** Snippet for the trigger element */
		trigger: Snippet;
	}

	let {
		menu,
		open = $bindable(false),
		delay = 150,
		class: className,
		trigger
	}: Props = $props();

	// ── Internal hover logic ──
	let closeTimer: ReturnType<typeof setTimeout> | null = null;

	function handleEnter() {
		if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
		open = true;
	}

	function handleLeave() {
		closeTimer = setTimeout(() => { open = false; }, delay);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn('relative', className)}
	onmouseenter={handleEnter}
	onmouseleave={handleLeave}
>
	<!-- Trigger (caller-provided) -->
	{@render trigger()}

	<!-- Dropdown panel -->
	{#if open}
		<div
			class={cn(
				'absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2',
				menu.width ?? 'w-80'
			)}
			onmouseenter={handleEnter}
			onmouseleave={handleLeave}
		>
			<div class="rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg">
				{#each menu.columns as column, i (i)}
					{#if column.title}
						<p class="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
							{column.title}
						</p>
					{/if}
					<div class="flex flex-col gap-0.5">
						{#each column.items as child (child.href)}
							<a
								href={child.href}
								class="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted/50"
							>
								{#if child.icon}
									<span class="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
										<child.icon class="size-4" />
									</span>
								{/if}
								<div class="min-w-0 flex-1">
									<div class="flex items-center justify-between gap-2">
										<span class="truncate font-medium">{child.label}</span>
										{#if child.badge}
											<span class="shrink-0 text-xs text-muted-foreground">{child.badge}</span>
										{/if}
									</div>
									{#if child.description}
										<p class="text-xs text-muted-foreground">{child.description}</p>
									{/if}
								</div>
							</a>
						{/each}
					</div>
					{#if i < menu.columns.length - 1}
						<Separator class="my-2" />
					{/if}
				{/each}

				{#if menu.footer}
					<Separator class="my-2" />
					<div class="flex items-center justify-between px-2.5 py-1">
						<a
							href={menu.footer.href}
							class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							{menu.footer.label}
							<IconChevronRight class="size-3" />
						</a>
						{#if menu.footer.secondary}
							<a
								href={menu.footer.secondary.href}
								class="text-xs text-muted-foreground transition-colors hover:text-foreground"
							>
								{menu.footer.secondary.label}
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
