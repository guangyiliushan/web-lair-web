<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import IconLogout from '@tabler/icons-svelte-runes/icons/logout';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-svh flex-col items-center justify-center px-4 py-12">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">
				Welcome, {data.profile?.displayName ?? data.user.name}!
			</Card.Title>
			<Card.Description>This is your personal dashboard.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col items-center gap-4">
			<div class="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm">
				<IconUser class="size-4" />
				<span>{data.user.email}</span>
			</div>
		</Card.Content>
		<Card.Footer class="justify-center">
			<form method="post" action="?/signOut" use:enhance>
				<Button variant="outline" type="submit">
					<IconLogout data-icon="inline-start" />
					Sign out
				</Button>
			</form>
		</Card.Footer>
	</Card.Root>
</div>
