import MarkdownIt from 'markdown-it';
import katex from 'katex';
import sanitizeHtml from 'sanitize-html';

// ── 类型定义 ──

/** 按需启用的 Markdown 特性开关 */
export interface MarkdownFeatureFlags {
	/** KaTeX 数学公式（块级 + 行内） */
	math?: boolean;
	/** GitHub Flavored Markdown 表格/任务列表/删除线 */
	gfm?: boolean;
	/** 围栏代码块高亮（预留，V1 不默认开启） */
	codeHighlight?: boolean;
	/** 是否允许原始 HTML 标签通过（默认 false，极度危险） */
	allowHtml?: boolean;
}

/** 渲染配置 */
export interface MarkdownRenderOptions {
	/** 特性开关 */
	features?: MarkdownFeatureFlags;
	/** 链接 target */
	linkTarget?: '_blank' | '_self';
	/** 渲染后是否做 HTML sanitize，默认 true */
	sanitize?: boolean;
}

/** MarkdownEditor.svelte props 类型 */
export interface MarkdownEditorProps {
	value?: string | null;
	initialMarkdown?: string;
	editable?: boolean;
	placeholder?: string;
	theme?: 'default' | 'compact';
	autofocus?: boolean;
	showToolbar?: boolean;
	showPreview?: boolean;
	class?: string;
}

/** 编辑器变更事件载荷 */
export interface MarkdownEditorChangeDetail {
	markdown: string;
	plainText: string;
	htmlPreview: string;
	isEmpty: boolean;
}

/** MarkdownRenderer.svelte props 类型 */
export interface MarkdownRendererProps {
	source?: string;
	html?: string;
	features?: MarkdownFeatureFlags;
	class?: string;
	prose?: boolean;
	sanitize?: boolean;
	/** 空态插槽 */
	children?: import('svelte').Snippet;
}

// ── 内部常量 ──

const DEFAULT_FEATURES: MarkdownFeatureFlags = {
	math: true,
	gfm: false,
	codeHighlight: false,
	allowHtml: false
};

/** sanitize-html 白名单：仅允许安全的内联/块级标签 */
const SANITIZE_ALLOWED_TAGS = [
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'p', 'br', 'hr',
	'ul', 'ol', 'li',
	'blockquote',
	'pre', 'code',
	'a', 'img',
	'table', 'thead', 'tbody', 'tr', 'th', 'td',
	'strong', 'em', 's', 'del', 'sub', 'sup',
	'span', 'div',
	// KaTeX 渲染输出的标签
	'section', 'annotation', 'semantics', 'math', 'menclose',
	'mfenced', 'mfrac', 'mi', 'mmultiscripts', 'mn', 'mo', 'mover',
	'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt',
	'mstyle', 'msub', 'msubsup', 'msup', 'mtable', 'mtd', 'mtext',
	'mtr', 'munder', 'munderover'
];

const SANITIZE_ALLOWED_ATTRS: Record<string, string[]> = {
	a: ['href', 'title', 'target', 'rel'],
	img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
	code: ['class'],
	pre: ['class'],
	span: ['class', 'style'],
	div: ['class', 'style'],
	td: ['colspan', 'rowspan', 'style'],
	th: ['colspan', 'rowspan', 'style'],
	table: ['class'],
	// KaTeX attributes
	annotation: ['encoding'],
	math: ['xmlns', 'display'],
	menclose: ['notation'],
	mspace: ['width'],
	mstyle: ['mathcolor', 'mathbackground', 'displaystyle', 'scriptlevel']
};

// ── 实例缓存（按特征组合 key 做有限缓存）──

const instanceCache = new Map<string, MarkdownIt>();

function buildCacheKey(options?: MarkdownRenderOptions): string {
	const f = options?.features ?? DEFAULT_FEATURES;
	return [
		f.math ?? true,
		f.gfm ?? false,
		f.codeHighlight ?? false,
		f.allowHtml ?? false
	].join('|');
}

// ── KaTeX 自定义 markdown-it 插件 ──

function katexPlugin(md: MarkdownIt): void {
	// 行内公式：$...$
	const inlineRule = md.renderer.rules.code_inline;
	if (!inlineRule) return;

	const defaultTextRenderer = md.renderer.rules.text;

	// 覆写 text 规则以支持行内 $...$ 公式
	md.renderer.rules.text = function (tokens, idx, options, _env, self) {
		const content = tokens[idx].content;
		// 检测行内公式模式 $...$（需至少两个 $ 包围，且不成对换行）
		const match = content.match(/^\$(.+?)\$$/);
		if (match) {
			try {
				return katex.renderToString(match[1], { throwOnError: false, displayMode: false });
			} catch {
				return content;
			}
		}
		if (defaultTextRenderer) {
			return defaultTextRenderer(tokens, idx, options, _env, self);
		}
		return self.renderToken(tokens, idx, options);
	};

	// 块级公式：$$...$$ 作为独立段落
	const defaultParagraphRenderer = md.renderer.rules.paragraph_open;
	md.renderer.rules.paragraph_open = function (tokens, idx, options, _env, self) {
		const nextToken = tokens[idx + 1];
		if (
			nextToken &&
			nextToken.type === 'inline' &&
			typeof nextToken.content === 'string' &&
			nextToken.content.startsWith('$$') &&
			nextToken.content.endsWith('$$')
		) {
			const formula = nextToken.content.slice(2, -2);
			try {
				return katex.renderToString(formula, { throwOnError: false, displayMode: true });
			} catch {
				return `<p class="text-destructive text-sm">LaTeX 渲染失败</p>`;
			}
		}
		if (defaultParagraphRenderer) {
			return defaultParagraphRenderer(tokens, idx, options, _env, self);
		}
		return '';
	};
}

// ── 公共 API ──

/**
 * 获取 markdown-it 渲染器实例（内部有缓存，按特性组合复用）。
 * @param options 渲染选项
 * @returns MarkdownIt 实例
 */
export function getMarkdownRenderer(options?: MarkdownRenderOptions): MarkdownIt {
	const key = buildCacheKey(options);
	const cached = instanceCache.get(key);
	if (cached) return cached;

	const features = options?.features ?? DEFAULT_FEATURES;
	const md = new MarkdownIt({
		html: features.allowHtml ?? false,
		linkify: true,
		typographer: true,
		breaks: true
	});

	// GFM 扩展（strikethrough、table、task lists 等）
	if (features.gfm) {
		md.enable(['strikethrough', 'table', 'task_lists']);
	}

	// 数学公式
	if (features.math) {
		md.use(katexPlugin);
	}

	// 链接安全属性
	const linkTargetPref = options?.linkTarget ?? '_blank';

	const defaultLinkRender = md.renderer.rules.link_open ??
		function (tokens, idx, opts, _env, self) {
			return self.renderToken(tokens, idx, opts);
		};

	md.renderer.rules.link_open = function (tokens, idx, _options, _env, self) {
		const token = tokens[idx];
		const href = token.attrGet('href') ?? '';
		const isExternal = /^https?:\/\//.test(href);

		if (isExternal) {
			token.attrSet('rel', 'nofollow noopener noreferrer');
		}
		if (isExternal && linkTargetPref === '_blank') {
			token.attrSet('target', '_blank');
		}
		return defaultLinkRender(tokens, idx, _options, _env, self);
	};

	instanceCache.set(key, md);
	return md;
}

/**
 * 将 Markdown 文本渲染为安全 HTML。
 * @param markdown 原始 Markdown 字符串
 * @param options 渲染选项
 * @returns 已清洗的安全 HTML 字符串
 */
export function renderMarkdownToHtml(markdown: string, options?: MarkdownRenderOptions): string {
	if (!markdown) return '';
	const md = getMarkdownRenderer(options);
	const raw = md.render(markdown);
	const shouldSanitize = options?.sanitize ?? true;
	return shouldSanitize ? sanitizeRenderedHtml(raw) : raw;
}

/**
 * 清洗渲染后的 HTML，移除所有危险内容。
 * @param html 待清洗的 HTML 字符串
 * @returns 安全 HTML
 */
export function sanitizeRenderedHtml(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: SANITIZE_ALLOWED_TAGS,
		allowedAttributes: SANITIZE_ALLOWED_ATTRS,
		allowedSchemes: ['http', 'https', 'mailto'],
		// 允许安全的 data URI（用于 KaTeX 等场景）
		allowedSchemesByTag: {
			img: ['http', 'https', 'data']
		}
	});
}

/**
 * 清除实例缓存（主要用于测试场景）。
 */
export function clearRendererCache(): void {
	instanceCache.clear();
}
