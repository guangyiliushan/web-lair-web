<script lang="ts">
	import { cn } from '$lib/utils';
	import { renderMarkdownToHtml, type MarkdownRendererProps } from './markdown-config';

	let {
		source,
		html: htmlProp,
		features,
		class: className,
		prose = false,
		sanitize = true,
		children
	}: MarkdownRendererProps = $props();

	const renderedHtml = $derived(
		htmlProp ?? (source ? renderMarkdownToHtml(source, { features, sanitize }) : '')
	);

	const isEmpty = $derived(!renderedHtml);
</script>

{#if isEmpty}
	{@render children?.()}
{:else}
	<article
		class={cn(
			prose && 'prose max-w-none',
			'markdown-body',
			// 响应式溢出处理
			'[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/50 [&_pre]:p-4',
			'[&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm',
			'[&_pre_code]:bg-transparent [&_pre_code]:p-0',
			'[&_table]:w-full [&_table]:overflow-x-auto [&_table]:block',
			'[&_img]:max-w-full [&_img]:rounded-lg',
			'[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
			'[&_ul]:list-disc [&_ul]:pl-6',
			'[&_ol]:list-decimal [&_ol]:pl-6',
			// KaTeX 块级公式溢出滚动
			'[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden',
			'[&_.katex]:text-base',
			className
		)}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html renderedHtml}
	</article>
{/if}
