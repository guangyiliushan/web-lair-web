<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { mergeProps } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { IconSunHigh, IconMoonStars, IconDeviceDesktop } from '@tabler/icons-svelte';

	const themes = [
		{ value: 'light' as const, label: m.theme_light, icon: IconSunHigh },
		{ value: 'dark' as const, label: m.theme_dark, icon: IconMoonStars },
		{ value: 'system' as const, label: m.theme_system, icon: IconDeviceDesktop }
	] as const;

	let current = $derived(themeStore.value);

	function setTheme(v: string) {
		if (v === 'light' || v === 'dark' || v === 'system') {
			themeStore.value = v;
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props: tooltipProps })}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props: dropdownProps })}
						{@const merged = mergeProps(tooltipProps, dropdownProps, { class: 'size-9 rounded-full' })}
						<Button
							variant="ghost"
							size="icon"
							aria-label={m.toggle_theme()}
							{...merged}
						>
							<IconSunHigh
								data-icon="inline-start"
								class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<IconMoonStars
								data-icon="inline-start"
								class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" sideOffset={8}>
				<DropdownMenu.Label>{m.toggle_theme()}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.RadioGroup value={current} onValueChange={setTheme}>
					{#each themes as { value, label, icon } (value)}
						{@const Icon = icon}
						<DropdownMenu.RadioItem {value}>
							<Icon />
							{label()}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Tooltip.Trigger>
	<Tooltip.Content>
		{m.toggle_theme()}
	</Tooltip.Content>
</Tooltip.Root>
