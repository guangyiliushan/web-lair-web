import type { Action } from 'svelte/action';

/**
 * Renders an element inside a different DOM node (default: document.body)
 * Useful for modals, tooltips, and popovers to escape overflow:hidden containers.
 */
export const portal: Action<HTMLElement, HTMLElement | string | undefined> = (
	node,
	target = 'body'
) => {
	let targetNode: HTMLElement | null = null;

	function updateTarget(newTarget: HTMLElement | string | undefined) {
		if (typeof newTarget === 'string') {
			targetNode = document.querySelector(newTarget);
		} else if (newTarget instanceof HTMLElement) {
			targetNode = newTarget;
		} else {
			targetNode = document.body;
		}

		if (targetNode) {
			targetNode.appendChild(node);
			node.hidden = false;
		}
	}

	updateTarget(target);

	return {
		update(newTarget) {
			updateTarget(newTarget);
		},
		destroy() {
			node.remove();
		}
	};
};
