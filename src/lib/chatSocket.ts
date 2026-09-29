import { io, type Socket } from "socket.io-client";
import { getToken } from "./auth";
import { getValidAccessToken } from "./authFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const SOCKET_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** Waits between recovery attempts after the server refuses the socket. */
const RETRY_DELAYS_MS = [1_000, 2_000, 5_000, 10_000, 30_000];

let socket: Socket | null = null;
let retryIndex = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Shared Socket.IO connection to the backend /ws namespace.
 *
 * Access tokens live 15 minutes. The handshake asks for a token that is
 * valid *now* (refreshing it if needed) on every connect and reconnect —
 * otherwise a socket that reconnects after a Wi-Fi blip or laptop sleep
 * would present an expired token, get refused, and go silent until the page
 * is reloaded.
 */
export function getChatSocket(): Socket {
  if (!socket) {
    const s = io(`${SOCKET_ORIGIN}/ws`, {
      auth: (cb) => {
        getValidAccessToken()
          .then((token) => cb({ token }))
          .catch(() => cb({ token: getToken() }));
      },
      withCredentials: true,
    });

    s.on("connect", () => {
      retryIndex = 0;
    });
    // socket.io retries dropped connections by itself, but NOT when the
    // server refused or kicked it (`active` is false then). Recover here.
    s.on("connect_error", () => {
      if (!s.active) scheduleRecovery(s);
    });
    s.on("disconnect", (reason) => {
      if (reason === "io server disconnect") scheduleRecovery(s);
    });

    if (typeof window !== "undefined") {
      // Coming back online or back to the tab is the moment users notice.
      const reconnectIfIdle = () => {
        if (socket === s && !s.connected && getToken()) s.connect();
      };
      window.addEventListener("online", reconnectIfIdle);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reconnectIfIdle();
      });
    }

    socket = s;
  }
  return socket;
}

function scheduleRecovery(s: Socket) {
  if (retryTimer || !getToken()) return; // already scheduled, or logged out
  const delay = RETRY_DELAYS_MS[Math.min(retryIndex, RETRY_DELAYS_MS.length - 1)];
  retryIndex++;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    if (socket === s && !s.connected) s.connect(); // handshake fetches a fresh token
  }, delay);
}

export function disconnectChatSocket(): void {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  retryIndex = 0;
  socket?.disconnect();
  socket = null;
}
