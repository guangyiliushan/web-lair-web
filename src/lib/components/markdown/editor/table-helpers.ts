import {
	$getSelection,
	$getNodeByKey,
	$isRangeSelection,
	type LexicalNode,
	type LexicalEditor
} from 'lexical';
import {
	$isTableSelection,
	$isTableCellNode,
	TableCellHeaderStates,
	$insertTableRowAtSelection,
	$insertTableColumnAtSelection,
	$deleteTableRowAtSelection,
	$deleteTableColumnAtSelection,
	type TableCellNode
} from '@lexical/table';

// ── 表格行列操作辅助（供 TableCellMenu.svelte 使用）──
// 与 lexical-helpers.ts 同理：封装 $ 前缀函数，避免 .svelte 直接导入。

/** 表格选区上下文（浮动菜单定位依据） */
export interface TableCellMenuContext {
	cellKey: string;
}

/** 获取选区所在的表格单元格（TableSelection 时取 anchor 单元格） */
function $getSelectedCell(): TableCellNode | null {
	const selection = $getSelection();
	if ($isTableSelection(selection)) {
		// TableSelection 的 anchor.key 即 TableCellNode 的 key
		const cell = $getNodeByKey(selection.anchor.key);
		return $isTableCellNode(cell) ? cell : null;
	}
	if ($isRangeSelection(selection)) {
		let node: LexicalNode | null = selection.anchor.getNode();
		while (node !== null) {
			if ($isTableCellNode(node)) return node;
			node = node.getParent();
		}
	}
	return null;
}

/**
 * 在 editorState.read() 上下文中读取浮动菜单上下文。
 * 光标/选区不在表格内时返回 null。
 */
export function readTableCellContext(): TableCellMenuContext | null {
	const cell = $getSelectedCell();
	return cell ? { cellKey: cell.getKey() } : null;
}

/** 获取单元格 DOM 矩形（用于浮动菜单定位） */
export function getCellRect(editor: LexicalEditor, cellKey: string): DOMRect | null {
	return editor.getElementByKey(cellKey)?.getBoundingClientRect() ?? null;
}

/** 在当前单元格上方/下方插入行 */
export function tableInsertRow(editor: LexicalEditor, after: boolean) {
	editor.update(() => {
		$insertTableRowAtSelection(after);
	});
}

/** 在当前单元格左侧/右侧插入列 */
export function tableInsertColumn(editor: LexicalEditor, after: boolean) {
	editor.update(() => {
		$insertTableColumnAtSelection(after);
	});
}

/** 删除当前行 */
export function tableDeleteRow(editor: LexicalEditor) {
	editor.update(() => {
		$deleteTableRowAtSelection();
	});
}

/** 删除当前列 */
export function tableDeleteColumn(editor: LexicalEditor) {
	editor.update(() => {
		$deleteTableColumnAtSelection();
	});
}

/**
 * 切换当前行表头态（以 anchor 单元格是否为表头为准，整行统一切换）。
 */
export function tableToggleHeader(editor: LexicalEditor) {
	editor.update(() => {
		const cell = $getSelectedCell();
		if (!cell) return;
		const row = cell.getParent();
		if (!row) return;
		const makeHeader = !cell.hasHeader();
		for (const child of row.getChildren()) {
			if ($isTableCellNode(child) && child.hasHeader() !== makeHeader) {
				child.toggleHeaderStyle(TableCellHeaderStates.ROW);
			}
		}
	});
}
