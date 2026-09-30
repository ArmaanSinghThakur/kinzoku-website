import { io, type Socket } from "socket.io-client";
import { livePath } from "@/lib/live/protocol";

// The browser's live connection: one per page, shared by every component that needs it (staff
// login, or a buyer's status link secret). Socket.IO reconnects by itself after a network drop
// and falls back to plain requests where WebSockets are blocked (plan).

const sockets = new Map<string, Socket>();

export function liveSocket(token?: string) {
  const key = token ?? "staff";
  let socket = sockets.get(key);
  if (!socket) {
    socket = io({ path: livePath, auth: token ? { token } : undefined });
    const connection = socket;
    // The server closes staff connections when sessions change (e.g. after a password change on
    // this page). Try once more: a still-valid login reconnects, an ended one is refused.
    connection.on("disconnect", (reason) => {
      if (reason === "io server disconnect") setTimeout(() => connection.connect(), 1000);
    });
    sockets.set(key, connection);
  }
  return socket;
}
