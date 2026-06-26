// TODO: Event emitter for pushing events from SvelteKit server to Socket.IO
// Imported on the server side to emit ai:task:update, comment:new, etc.

export interface WsEvent {
	room: string;
	event: string;
	payload: unknown;
}

export async function emitEvent(_event: WsEvent): Promise<void> {
	// TODO: Import io from server.ts and emit via Redis adapter
	// This is a placeholder until the full WS infrastructure is in place
}
