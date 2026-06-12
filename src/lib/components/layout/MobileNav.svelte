<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import { IconCodeCircle2 } from '@tabler/icons-svelte';
	import Sidebar from './Sidebar.svelte';

	let { open = false, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void } = $props();

	const navItems = [
		{ key: 'nav_home', href: '/' },
		{ key: 'nav_thinking', href: '/thinking' },
		{ key: 'nav_categories', href: '/categories' },
		{ key: 'nav_about', href: '/about' }
	] as const;

	function close() {
		onOpenChange(false);
	}
</script>

<Sheet.Root bind:open {onOpenChange}>
	<Sheet.Content side="left" class="w-72 p-0 flex flex-col">
		<Sheet.Header class="sr-only">
			<Sheet.Title>{m.open_menu()}</Sheet.Title>
			<Sheet.Description>Site navigation</Sheet.Description>
		</Sheet.Header>

		<div class="flex items-center gap-2 p-6 pb-2">
			<IconCodeCircle2 class="size-6 text-primary" />
			<span class="font-bold text-lg">Lair</span>
		</div>

		<div class="flex-1 overflow-y-auto flex flex-col gap-6 p-6 pt-4">
			<nav class="flex flex-col gap-1">
				{#each navItems as { key, href } (key)}
					<a {href} class="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent" onclick={close}>
						{m[key]()}
					</a>
				{/each}
			</nav>

			<Separator />
			<Sidebar class="p-0" />
		</div>
	</Sheet.Content>
</Sheet.Root>
