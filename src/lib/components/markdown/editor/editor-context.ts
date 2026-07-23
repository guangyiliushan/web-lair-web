import { createContext } from 'svelte';
import type { LexicalEditor, EditorThemeClasses } from 'lexical';

export interface EditorRuntimeContext {
	/** 主编辑器实例（延迟就绪） */
	editor: LexicalEditor | null;
	/** 主题配置引用 */
	theme: EditorThemeClasses;
	/** 错误回调 */
	onError: (error: Error) => void;
}

const [getEditorContext, setEditorContext] = createContext<EditorRuntimeContext>();

export { getEditorContext, setEditorContext };
