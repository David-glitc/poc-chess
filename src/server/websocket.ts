import { Server } from 'socket.io';
import { type Server as HTTPServer } from 'http';

const createWebSocketServer = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingInterval: 2000, // Send ping every 2 seconds
    pingTimeout: 5000   // Consider connection dead after 5 seconds of no response
  });

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Handle room joining
    socket.on('join-room', async (room: string) => {
      try {
        await socket.join(room);
        console.log(`Player ${socket.id} joined room ${room}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error joining room: ${errorMessage}`);
      }
    });

    // Handle moves
    socket.on('move', (data: { room: string; move: string; state: string }) => {
      void io.to(data.room).emit('move', data);
    });

    // Handle ping/pong for latency measurement
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