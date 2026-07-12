<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<section
	class="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</section>
