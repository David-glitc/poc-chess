import { Server } from 'socket.io';
import { type Server as HTTPServer } from 'http';

const createWebSocketServer = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingInterval: 2000,
    pingTimeout: 5000
  });

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('join-room', async (room: string) => {
      try {
        await socket.join(room);
        console.log(`Player ${socket.id} joined room ${room}`);
      } catch (error) {
        console.error('Error joining room:', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    socket.on('move', (data: { room: string; state: string }) => {
      try {
        socket.to(data.room).emit('move', { state: data.state });
      } catch (error) {
        console.error('Error broadcasting move:', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
    });
  });

  return io;
};

export default createWebSocketServer; 