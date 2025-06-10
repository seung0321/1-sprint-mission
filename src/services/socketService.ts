// socket.ts

import { Server, Socket } from 'socket.io';
import http from 'http';
import { verifyAccessToken } from '../lib/token';
import { prismaClient } from '../lib/prismaClient';
import { User } from '@prisma/client';

interface SocketData {
  user: User;
}

interface ServerToClientEvents {
  notification: (data: { type: string; payload: any }) => void;
}

interface ClientToServerEvents {}

export const userSockets = new Map<number, string>(); // ✅ 외부 사용 가능
export let io: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>; // ✅ 외부 사용 가능

export function createSocketServer(httpServer: http.Server) {
  io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  io.use(
    async (socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>, next) => {
      const accessToken = socket.handshake.auth?.accessToken;
      if (!accessToken) return next(new Error('Access token missing'));

      try {
        const { userId } = verifyAccessToken(accessToken);
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) return next(new Error('Unauthorized'));

        socket.data.user = user;
        next();
      } catch {
        return next(new Error('Invalid token'));
      }
    },
  );

  io.on('connection', (socket) => {
    const user = socket.data.user;
    userSockets.set(user.id, socket.id);
    console.log(`✅ [Socket] Connected: ${user.nickname} (ID: ${user.id})`);

    socket.on('disconnect', () => {
      userSockets.delete(user.id);
      console.log(`❌ [Socket] Disconnected: ${user.nickname}`);
    });
  });

  return io;
}
