// TODO: Markdown renderer using remark/rehype

/**
 * Converts raw Markdown string to HTML.
 * Will integrate remark-gfm, rehype-highlight, rehype-stringify.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
	// TODO: Use remark().use(remarkGfm).use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(markdown)
	return `<p>${markdown}</p>`;
}
