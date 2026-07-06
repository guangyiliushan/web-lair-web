<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import IconArrowLeft from '@tabler/icons-svelte-runes/icons/arrow-left';
	import IconHome from '@tabler/icons-svelte-runes/icons/home';

	let status = $derived(page.status);
	let message = $derived(page.error?.message ?? '访问被拒绝');

	const isNotFound = $derived(status === 404);
	const isForbidden = $derived(status === 403);
	const isServerError = $derived(status >= 500);

	const heading = $derived(
		isNotFound ? '页面未找到' : isForbidden ? '访问被拒绝' : isServerError ? '服务器错误' : '发生了一些错误'
	);

	const description = $derived(
		isNotFound
			? '请求的页面不存在或已被移除。'
			: isForbidden
				? '您没有权限访问此区域，需要管理员权限。'
				: isServerError
					? '处理您的请求时发生了内部错误。'
					: message
	);
</script>

<svelte:head>
	<title>{status}: {heading} — Lair Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
	<div class="max-w-md space-y-8">
		<div class="space-y-3">
			<p class="text-8xl font-bold tracking-tighter text-muted-foreground/20">{status}</p>
			<h1 class="text-2xl font-bold tracking-tight">{heading}</h1>
			<p class="text-base text-muted-foreground">{description}</p>
		</div>

		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<Button href="/admin" size="lg">
				<IconArrowLeft data-icon="inline-start" />
				返回控制台
			</Button>
			<Button href="/" variant="outline" size="lg">
				<IconHome data-icon="inline-start" />
				返回站点
			</Button>
		</div>
	</div>
</div>
