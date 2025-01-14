import { io } from "socket.io-client";

export const getWebSocketURL = () => {
  if (typeof window === "undefined") return ""; // Server-side
  
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = process.env.NEXT_PUBLIC_WEBSOCKET_URL || window.location.host;
  
  return process.env.NODE_ENV === "production"
    ? `${protocol}//${host}`
    : "http://localhost:3000";
};

export const createSocket = () => {
  const url = getWebSocketURL();
  return io(url, {
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 10,
  });
}; 