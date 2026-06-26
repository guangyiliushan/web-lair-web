<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen bg-muted/20">
	<aside class="hidden w-64 flex-col border-r bg-background lg:flex">
		<div class="border-b px-6 py-5">
			<a href="/admin" class="text-lg font-semibold tracking-tight">Lair Admin</a>
		</div>
		<nav class="flex flex-1 flex-col gap-1 p-4 text-sm">
			<a class="rounded-md px-3 py-2 transition-colors hover:bg-muted" href="/admin">Overview</a>
			<a class="rounded-md px-3 py-2 transition-colors hover:bg-muted" href="/admin/posts">Posts</a>
			<a class="rounded-md px-3 py-2 transition-colors hover:bg-muted" href="/admin/settings">Settings</a>
		</nav>
	</aside>

	<div class="flex min-h-screen min-w-0 flex-1 flex-col">
		<header class="border-b bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Admin</p>
					<h1 class="text-lg font-semibold tracking-tight">Content workspace</h1>
				</div>
				<a
					href="/"
					class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back to site
				</a>
			</div>
		</header>

		<main class="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
</div>
