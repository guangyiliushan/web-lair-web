<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import IconBrandGithub from '@tabler/icons-svelte-runes/icons/brand-github';
	import IconMail from '@tabler/icons-svelte-runes/icons/mail';
	import IconAlertCircle from '@tabler/icons-svelte-runes/icons/alert-circle';

	let { form }: { form: ActionData } = $props();

	const redirectParam = $derived(
		$page.url.searchParams.get('redirectTo')
			? `?redirectTo=${encodeURIComponent($page.url.searchParams.get('redirectTo')!)}`
			: ''
	);
</script>

<div class="flex w-full flex-col items-center justify-center">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Welcome back</Card.Title>
			<Card.Description>Sign in to your account to continue</Card.Description>
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

			<form method="post" action="?/signIn" use:enhance>
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
					<Field.Field>
						<Field.FieldLabel for="password">Password</Field.FieldLabel>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							placeholder="Your password"
							required
						/>
					</Field.Field>
					<Button type="submit" class="w-full">
						<IconMail data-icon="inline-start" />
						Sign in with Email
					</Button>
				</Field.FieldGroup>
			</form>

			<div class="mt-4 text-center">
				<a
					href="/forgot-password"
					class="text-sm text-muted-foreground underline-offset-2 hover:underline"
				>
					Forgot password?
				</a>
			</div>

			<div class="relative my-6">
				<Separator />
				<span
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground"
				>
					or continue with
				</span>
			</div>

			<form method="post" action="?/signInSocial" use:enhance>
				<input type="hidden" name="provider" value="github" />
				<input
					type="hidden"
					name="redirectTo"
					value={$page.url.searchParams.get('redirectTo') ?? '/admin'}
				/>
				<Button variant="outline" type="submit" class="w-full">
					<IconBrandGithub data-icon="inline-start" />
					GitHub
				</Button>
			</form>
		</Card.Content>
		<Card.Footer class="justify-center">
			<p class="text-sm text-muted-foreground">
				Don't have an account?
				<a href="/register{redirectParam}" class="font-medium underline-offset-2 hover:underline"> Sign up </a>
			</p>
		</Card.Footer>
	</Card.Root>
</div>
