<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconArrowLeft from '@tabler/icons-svelte/icons/arrow-left';

	let formError = $state('');
</script>

<div class="flex min-h-svh flex-col items-center justify-center px-4 py-12">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl">Set new password</Card.Title>
			<Card.Description>Enter your new password below.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" action="?/reset">
				<Field.FieldGroup>
					<Field.Field>
						<Field.FieldLabel for="password">New Password</Field.FieldLabel>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							placeholder="At least 8 characters"
							required
						/>
					</Field.Field>
					<Field.Field>
						<Field.FieldLabel for="confirmPassword">Confirm Password</Field.FieldLabel>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autocomplete="new-password"
							required
						/>
					</Field.Field>
					<Button type="submit" class="w-full">
						<IconLock data-icon="inline-start" />
						Reset password
					</Button>
				</Field.FieldGroup>
			</form>
		</Card.Content>
		<Card.Footer class="justify-center">
			<a
				href="/login"
				class="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-2 hover:underline"
			>
				<IconArrowLeft class="size-4" />
				Back to login
			</a>
		</Card.Footer>
	</Card.Root>
</div>
