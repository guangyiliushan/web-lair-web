<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import IconMail from '@tabler/icons-svelte-runes/icons/mail';
	import IconAlertCircle from '@tabler/icons-svelte-runes/icons/alert-circle';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-svh flex-col items-center justify-center px-4 py-12">
	<Card.Root class="w-full max-w-md text-center">
		<Card.Header>
			<Card.Title class="text-2xl">Reset your password</Card.Title>
			<Card.Description>Enter your email address and we'll send you a reset link.</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if form?.message}
				<div
					class="mb-6 flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
					role="alert"
				>
					<IconAlertCircle class="size-4 shrink-0" />
					<span>{form.message}</span>
				</div>
			{/if}

			{#if form?.success}
				<div
					class="mb-6 flex items-center gap-2 rounded-md bg-primary/10 px-4 py-3 text-sm text-primary"
					role="status"
				>
					<IconMail class="size-4 shrink-0" />
					<span>If an account with that email exists, we've sent a reset link.</span>
				</div>
			{/if}

			<form method="post" action="?/sendReset" use:enhance>
				<Field.FieldGroup>
					<Field.Field>
						<Field.FieldLabel for="email">Email</Field.FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="you@example.com"
							required
						/>
					</Field.Field>
					<Button type="submit" class="w-full">
						<IconMail data-icon="inline-start" />
						Send reset link
					</Button>
				</Field.FieldGroup>
			</form>
		</Card.Content>
		<Card.Footer class="justify-center">
			<a href="/login" class="text-sm text-muted-foreground underline-offset-2 hover:underline">
				Back to login
			</a>
		</Card.Footer>
	</Card.Root>
</div>
