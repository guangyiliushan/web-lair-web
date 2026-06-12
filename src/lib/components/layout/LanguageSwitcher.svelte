<script lang="ts">
	import { getLocale, locales } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Button from '$lib/components/ui/button';
	import { IconLanguage, IconCheck } from '@tabler/icons-svelte';
	import { m } from '$lib/paraglide/messages';

	const labels: Record<string, string> = {
		en: 'English',
		'zh-cn': '简体中文',
		ja: '日本語'
	};

	function switchLang(locale: string) {
		const segs = page.url.pathname.split('/').filter(Boolean);
		const head = segs[0] ?? '';

		if ((locales as readonly string[]).includes(head)) {
			segs[0] = locale;
		} else {
			segs.unshift(locale);
		}

		goto('/' + segs.join('/'), { replaceState: true });
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button.Root variant="ghost" size="icon" aria-label={m.language()}>
			<IconLanguage class="size-5" />
		</Button.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#each locales as lang (lang)}
			<DropdownMenu.Item onclick={() => switchLang(lang)}>
				<span class="mr-2">{labels[lang] ?? lang}</span>
				{#if lang === getLocale()}
					<IconCheck class="ml-auto size-4 text-primary" />
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
