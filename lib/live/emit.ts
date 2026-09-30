import type { Server } from "socket.io";
import { rooms } from "@/lib/live/protocol";

// Lets the website's own code (forms, admin actions) send live updates. The Socket.IO server is
// created by server.ts in the same program and shared here; under plain `next start` there is
// none and these calls do nothing. Only the type is imported, so socket.io stays out of Next's bundles.

const state = globalThis as unknown as { kzLive?: Server };

export function setLiveServer(io: Server) {
  state.kzLive = io;
}

export function liveEmit(room: string, event: string, payload: unknown) {
  state.kzLive?.to(room).emit(event, payload);
}

/** True while at least one staff member has the admin area open. */
export function staffOnline() {
  return (state.kzLive?.sockets.adapter.rooms.get(rooms.staff)?.size ?? 0) > 0;
}

/** Closes a staff member's live connections (logged out, switched off or password reset). */
export function disconnectStaff(staffId: string) {
  state.kzLive?.in(rooms.staffMember(staffId)).disconnectSockets(true);
}
