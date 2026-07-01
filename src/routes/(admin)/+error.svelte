<script lang="ts">
	import { page } from '$app/state';

	let status = $derived(page.status);
	let message = $derived(page.error?.message ?? 'Access denied');

	const isNotFound = $derived(status === 404);
	const isForbidden = $derived(status === 403);
	const isServerError = $derived(status >= 500);

	const heading = $derived(
		isNotFound ? 'Resource not found' : isForbidden ? 'Access denied' : isServerError ? 'Server error' : 'Something went wrong'
	);

	const description = $derived(
		isNotFound
			? 'The requested resource does not exist or has been removed.'
			: isForbidden
				? 'You do not have permission to access this area. Administrator access is required.'
				: isServerError
					? 'An internal error occurred while processing your request.'
					: message
	);
</script>

<svelte:head>
	<title>{status}: {heading} — Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
	<div class="max-w-sm space-y-5">
		<div class="space-y-2">
			<p class="text-6xl font-bold tracking-tighter text-muted-foreground/30">{status}</p>
			<h1 class="text-xl font-semibold tracking-tight">{heading}</h1>
			<p class="text-sm text-muted-foreground">{description}</p>
		</div>

		<div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
			<a
				href="/admin"
				class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Back to dashboard
			</a>
			<a
				href="/"
				class="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
			>
				Back to site
			</a>
		</div>
	</div>
</div>
