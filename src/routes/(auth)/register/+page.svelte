<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import IconMail from '@tabler/icons-svelte/icons/mail';
	import IconUser from '@tabler/icons-svelte/icons/user';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconAlertCircle from '@tabler/icons-svelte/icons/alert-circle';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-svh flex-col items-center justify-center px-4 py-12">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Create your account</Card.Title>
			<Card.Description>Join the community and start reading</Card.Description>
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

			<form method="post" action="?/signUp" use:enhance>
				<Field.FieldGroup>
					<Field.Field>
						<Field.FieldLabel for="name">Name</Field.FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							placeholder="Your name"
							required
						/>
					</Field.Field>
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
					<Field.Field>
						<Field.FieldLabel for="password">Password</Field.FieldLabel>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							placeholder="At least 8 characters"
							required
						/>
						<Field.FieldDescription>Must be at least 8 characters</Field.FieldDescription>
					</Field.Field>
					<Field.Field>
						<Field.FieldLabel for="confirmPassword">Confirm Password</Field.FieldLabel>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autocomplete="new-password"
							placeholder="Repeat your password"
							required
						/>
					</Field.Field>
					<Button type="submit" class="w-full">
						<IconMail data-icon="inline-start" />
						Create account
					</Button>
				</Field.FieldGroup>
			</form>
		</Card.Content>
		<Card.Footer class="justify-center">
			<p class="text-sm text-muted-foreground">
				Already have an account?
				<a href="/login" class="font-medium underline-offset-2 hover:underline"> Sign in </a>
			</p>
		</Card.Footer>
	</Card.Root>
</div>
