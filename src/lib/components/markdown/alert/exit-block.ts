import { type LexicalEditor, KEY_DOWN_COMMAND, COMMAND_PRIORITY_HIGH } from 'lexical';
import {
	$getRoot,
	$getSelection,
	$isRangeSelection,
	$getNodeByKey,
	$createParagraphNode
} from 'lexical';

export function registerExitBlock(
	nestedEditor: LexicalEditor,
	parentEditor: LexicalEditor,
	nodeKey: string
): () => void {
	return nestedEditor.registerCommand(
		KEY_DOWN_COMMAND,
		(event: KeyboardEvent) => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) return false;

			const isAtEnd = isSelectionAtEnd(selection);

			if (isAtEnd && (event.key === 'Tab' || event.key === 'ArrowDown')) {
				event.preventDefault();
				parentEditor.update(() => {
					const alertNode = $getNodeByKey(nodeKey);
					if (!alertNode) return;
					const paragraph = $createParagraphNode();
					alertNode.insertAfter(paragraph);
					paragraph.selectStart();
				});
				parentEditor.focus();
				return true;
			}

			return false;
		},
		COMMAND_PRIORITY_HIGH
	);
}

function isSelectionAtEnd(selection: ReturnType<typeof $getSelection>): boolean {
	if (!$isRangeSelection(selection)) return false;
	const root = $getRoot();
	const lastChild = root.getLastChild();
	if (!lastChild) return true;

	const anchor = selection.anchor;
	const anchorNode = anchor.getNode();
	const isLastBlock = anchorNode === lastChild || anchorNode.getTopLevelElement?.() === lastChild;
	const textContent = lastChild.getTextContent?.() ?? '';
	return isLastBlock && anchor.offset >= textContent.length;
}
