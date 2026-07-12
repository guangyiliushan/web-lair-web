/**
 * Reusable hover delay hook with automatic cleanup.
 *
 * Manages hover-driven open/close state with a configurable close delay.
 * Automatically disposes timers on component teardown via $effect.
 *
 * @example
 * ```ts
 * const hover = useHoverDelay({ delay: 200 });
 * // hover.isOpen  → $state-backed boolean
 * // hover.open()  → opens immediately
 * // hover.close() → closes after delay
 * ```
 */
export function useHoverDelay(
	options: {
		/** Close delay in ms (default: 150) */
		delay?: number;
		/** Callback when opened */
		onOpen?: () => void;
		/** Callback when closed */
		onClose?: () => void;
	} = {}
) {
	const { delay = 150, onOpen, onClose } = options;

	let closeTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let isOpen = $state(false);

	function open() {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
		isOpen = true;
		onOpen?.();
	}

	function close() {
		closeTimer = setTimeout(() => {
			isOpen = false;
			closeTimer = null;
			onClose?.();
		}, delay);
	}

	function dispose() {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	// Auto-cleanup on component teardown
	$effect(() => {
		return dispose;
	});

	return {
		get isOpen() {
			return isOpen;
		},
		set isOpen(value: boolean) {
			isOpen = value;
		},
		open,
		close,
		dispose
	};
}
