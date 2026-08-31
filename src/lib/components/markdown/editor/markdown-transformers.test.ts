import { describe, it, expect } from 'vitest';
import { createEditor, type LexicalEditor } from 'lexical';
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import { TagNode } from '$lib/components/markdown/tag/tag-node';
import { AlertNode } from '$lib/components/markdown/alert/alert-node';
import { EDITOR_NODES } from './editor-nodes';
import {
	EDITOR_TRANSFORMERS,
	tagTransformer,
	alertTransformer,
	alertJsonToMarkdown,
	markdownToAlertJson
} from './markdown-transformers';

/**
 * 编辑器 Markdown 往返辅助：markdown → Lexical 树 → markdown。
 * 使用与生产 lexicalEditor action 相同的节点注册与 transformer 列表。
 */
function roundtrip(markdown: string): string {
	const editor: LexicalEditor = createEditor({
		namespace: 'markdown-transformers-test',
		nodes: EDITOR_NODES,
		onError: (error: Error) => {
			throw error;
		}
	});
	editor.update(
		() => {
			$convertFromMarkdownString(markdown, EDITOR_TRANSFORMERS);
		},
		{ discrete: true }
	);
	let out = '';
	editor.getEditorState().read(() => {
		out = $convertToMarkdownString(EDITOR_TRANSFORMERS);
	});
	return out;
}

/** 从导出的 markdown 中提取 callout 容器内容，用于验证嵌套 JSON 转换 */
function extractAlertMarkdown(exported: string): string {
	const match = exported.match(/:::(?:info|tip|warning)\n([\s\S]*?)\n:::/);
	return match?.[1] ?? '';
}

describe('markdown transformers roundtrip', () => {
	it('resolves transformer dependencies under editor-nodes-first import order', () => {
		expect(tagTransformer.dependencies).toEqual([TagNode]);
		expect(alertTransformer.dependencies).toEqual([AlertNode]);
	});

	it('preserves headings, paragraphs, tags and alert containers', () => {
		const md = '# 标题\n\n正文 #tag#\n\n:::info\n- 项一\n- 项二\n:::';
		const out = roundtrip(md);

		expect(out).toContain('# 标题');
		expect(out).toContain('#tag#');
		expect(out).toContain(':::info');
		expect(out).toContain('- 项一');
		expect(out).toContain('- 项二');
	});

	it('is stable on a second roundtrip (idempotent)', () => {
		const md = '# 标题\n\n正文 #tag#\n\n:::info\n- 项一\n- 项二\n:::';
		const once = roundtrip(md);
		const twice = roundtrip(once);
		expect(twice).toBe(once);
	});

	it('exports TagNode as #text#', () => {
		const out = roundtrip('前文 #svelte# 后文');
		expect(out).toContain('#svelte#');
		expect(out).not.toContain('前文 #svelte# 后文 #svelte#');
	});

	it('exports alert with its type intact', () => {
		const out = roundtrip(':::warning\n注意内容\n:::');
		expect(out).toContain(':::warning');
		expect(out).toContain('注意内容');
		expect(out).toContain(':::');
	});

	it('keeps nested lists and headings inside alert containers', () => {
		const out = roundtrip(':::tip\n### 小节\n\n- a\n- b\n:::');
		const inner = extractAlertMarkdown(out);
		expect(inner).toContain('### 小节');
		expect(inner).toContain('- a');
		expect(inner).toContain('- b');
	});

	it('does not treat headings as tags', () => {
		const out = roundtrip('# 标题一');
		expect(out).toContain('# 标题一');
	});

	it('handles multiple tags in one paragraph', () => {
		const out = roundtrip('同时使用 #alpha# 与 #beta#');
		expect(out).toContain('#alpha#');
		expect(out).toContain('#beta#');
	});
});

describe('alert json <-> markdown helpers', () => {
	it('converts markdown to alert json and back', () => {
		const json = markdownToAlertJson('- 项一\n- 项二\n\n段落');
		const md = alertJsonToMarkdown(json);
		expect(md).toContain('- 项一');
		expect(md).toContain('- 项二');
		expect(md).toContain('段落');
	});

	it('roundtrips alert json stably', () => {
		const json = markdownToAlertJson('### 标题\n\n内容 #tag#');
		const md = alertJsonToMarkdown(json);
		const json2 = markdownToAlertJson(md);
		expect(json2).toBe(json);
	});

	it('returns empty string for invalid json', () => {
		expect(alertJsonToMarkdown('not-json')).toBe('');
		expect(alertJsonToMarkdown('')).toBe('');
	});
});
