<script lang="ts">
	import { setMode, resetMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Button from '$lib/components/ui/button';
	import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button.Root variant="ghost" size="icon" aria-label={m.toggle_theme()}>
			<IconSun class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<IconMoon class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode('light')}>
			<IconSun class="size-4" />
			<span class="ml-2">{m.theme_light()}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode('dark')}>
			<IconMoon class="size-4" />
			<span class="ml-2">{m.theme_dark()}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => resetMode()}>
			<IconDeviceDesktop class="size-4" />
			<span class="ml-2">{m.theme_system()}</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
