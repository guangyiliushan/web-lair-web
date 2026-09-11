import {
	DecoratorNode,
	type EditorConfig,
	type LexicalEditor,
	type LexicalNode,
	type NodeKey,
	type SerializedLexicalNode
} from 'lexical';

export interface SerializedImageNode extends SerializedLexicalNode {
	type: 'image';
	src: string;
	alt: string;
}

/**
 * 块级图片节点（WYSIWYG）。
 *
 * 参考 HorizontalRuleNode 的纯 DOM DecoratorNode 模式：
 * createDOM 直接构建 figure > img，不需要 Svelte decorator。
 * isKeyboardSelectable 使节点可被方向键选中、Backspace/Delete 删除。
 *
 * Markdown 往返由 imageTransformer（markdown-transformers.ts）负责：
 * `![alt](src)` ↔ ImageNode。
 */
export class ImageNode extends DecoratorNode<HTMLElement> {
	__src: string;
	__alt: string;

	constructor(src = '', alt = '', key?: NodeKey) {
		super(key);
		this.__src = src;
		this.__alt = alt;
	}

	static getType(): string {
		return 'image';
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(node.__src, node.__alt, node.__key);
	}

	static importJSON(serialized: SerializedLexicalNode & Record<string, unknown>): ImageNode {
		const s = serialized as unknown as SerializedImageNode;
		return new ImageNode(s.src ?? '', s.alt ?? '');
	}

	exportJSON(): SerializedImageNode {
		return {
			...super.exportJSON(),
			type: 'image',
			src: this.__src,
			alt: this.__alt
		};
	}

	// ── DOM ──
	createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
		void config;
		void editor;
		const figure = document.createElement('figure');
		figure.className = 'rich-editor-image';
		figure.contentEditable = 'false';
		figure.appendChild(this.buildImage());
		return figure;
	}

	updateDOM(prevNode: ImageNode, dom: HTMLElement, config: EditorConfig): boolean {
		void config;
		if (prevNode.__src === this.__src && prevNode.__alt === this.__alt) return false;
		const img = dom.querySelector('img');
		if (img) {
			img.setAttribute('src', this.__src);
			img.setAttribute('alt', this.__alt);
			return false;
		}
		return true;
	}

	// ── Decorator ──
	// 纯 DOM 模式：decorate 不返回组件（基类返回 null），内容由 createDOM 呈现
	decorate(): null {
		return null;
	}

	// ── 行为 ──
	isInline(): boolean {
		return false;
	}

	isKeyboardSelectable(): boolean {
		return true;
	}

	getTextContent(): string {
		return '';
	}

	// ── 数据写回 ──
	setSrc(src: string): void {
		const writable = this.getWritable();
		writable.__src = src;
	}

	setAlt(alt: string): void {
		const writable = this.getWritable();
		writable.__alt = alt;
	}

	private buildImage(): HTMLImageElement {
		const img = document.createElement('img');
		img.src = this.__src;
		img.alt = this.__alt;
		img.loading = 'lazy';
		img.draggable = false;
		return img;
	}
}

export function $createImageNode(src = '', alt = ''): ImageNode {
	return new ImageNode(src, alt);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
	return node instanceof ImageNode;
}
