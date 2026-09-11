<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		renderMarkdownToHtmlSync,
		type MarkdownRendererProps
	} from '$lib/components/markdown/editor/markdown-config';

	let {
		source,
		html: htmlProp,
		class: className,
		prose = false,
		children
	}: MarkdownRendererProps = $props();

	// 优先使用预渲染 HTML（SSR 场景由 +page.server.ts 传入）
	// 否则客户端同步渲染（无 Shiki 高亮）
	const renderedHtml = $derived(htmlProp ?? (source ? renderMarkdownToHtmlSync(source) : ''));
	const isEmpty = $derived(!renderedHtml);
</script>

{#if isEmpty}
	{@render children?.()}
{:else}
	<article
		class={cn(
			prose && 'prose max-w-none',
			'markdown-body',
			'[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/50 [&_pre]:p-4',
			'[&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm',
			'[&_pre_code]:bg-transparent [&_pre_code]:p-0',
			'[&_table]:block [&_table]:w-full [&_table]:overflow-x-auto',
			'[&_img]:max-w-full [&_img]:rounded-lg',
			'[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic',
			'[&_ul]:list-disc [&_ul]:pl-6',
			'[&_ol]:list-decimal [&_ol]:pl-6',
			'[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden',
			'[&_.katex]:text-base',
			'[&_.mermaid]:rounded-lg [&_.mermaid]:bg-muted/30 [&_.mermaid]:p-4',
			className
		)}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: HTML is sanitized by rehype-sanitize -->
		{@html renderedHtml}
	</article>
{/if}
