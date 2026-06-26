// TODO: Standalone Socket.IO server process
// Start with: tsx src/lib/server/infrastructure/websocket/server.ts

import { createServer } from 'node:http';
import { Server } from 'socket.io';

const PORT = Number(process.env.WS_PORT) || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: { origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }
});

io.on('connection', (socket) => {
	console.log('WebSocket client connected:', socket.id);

	socket.on('join', (room: string) => {
		socket.join(room);
	});

	socket.on('disconnect', () => {
		console.log('WebSocket client disconnected:', socket.id);
	});
});

httpServer.listen(PORT, () => {
	console.log(`WebSocket server running on port ${PORT}`);
});

export { io };
