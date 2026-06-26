<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import IconMailForward from '@tabler/icons-svelte-runes/icons/mail-forward';
</script>

<div class="flex w-full flex-col items-center justify-center">
	<Card.Root class="w-full max-w-md text-center">
		<Card.Header>
			<Card.Title class="text-2xl">Check your email</Card.Title>
			<Card.Description>
				We've sent a verification link to your email address. Please check your inbox and click the
				link to verify your account.
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col items-center gap-4">
			<IconMailForward class="size-12 text-muted-foreground" />
			<p class="text-sm text-muted-foreground">
				Didn't receive the email? Check your spam folder or try again later.
			</p>
		</Card.Content>
		<Card.Footer class="justify-center">
			<a href="/login">
				<Button variant="outline">Back to login</Button>
			</a>
		</Card.Footer>
	</Card.Root>
</div>
