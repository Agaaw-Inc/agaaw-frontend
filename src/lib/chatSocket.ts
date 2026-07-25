import { io, type Socket } from "socket.io-client";
import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const SOCKET_ORIGIN = API_URL.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

/**
 * Shared Socket.IO connection to the backend /ws namespace.
 * The auth callback re-reads the JWT on every (re)connect attempt, so a
 * token refreshed by authFetch is picked up automatically.
 */
export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(`${SOCKET_ORIGIN}/ws`, {
      auth: (cb) => cb({ token: getToken() }),
      withCredentials: true,
    });
  }
  return socket;
}

export function disconnectChatSocket(): void {
  socket?.disconnect();
  socket = null;
}
