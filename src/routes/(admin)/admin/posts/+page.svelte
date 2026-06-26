<svelte:head>
	<title>Posts - Lair Admin</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">Posts</h2>
			<p class="text-sm text-muted-foreground">Manage your published and draft content here.</p>
		</div>
		<a
			href="/admin/posts/new"
			class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
		>
			New post
		</a>
	</div>

	<div class="rounded-xl border bg-background p-6">
		<p class="text-sm text-muted-foreground">Post management UI will be implemented in a follow-up step.</p>
	</div>
</div>
