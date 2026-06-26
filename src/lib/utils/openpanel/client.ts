// TODO: OpenPanel client utility — custom event tracking

let opClient: { track?: (name: string, props?: Record<string, unknown>) => void } | null = null;

export function initOpenPanelClient() {
	// TODO: Initialize @openpanel/web client
	// import { OpenPanel } from '@openpanel/web';
	// opClient = new OpenPanel({ apiUrl, clientId });
}

export function trackOpenPanelEvent(name: string, props?: Record<string, unknown>) {
	opClient?.track?.(name, props);
}
