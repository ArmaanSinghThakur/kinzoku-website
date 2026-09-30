// The live connection's address, rooms and message shapes, shared by the server (lib/live/server.ts)
// and the browser. Kept free of server code so the browser can import it.

/** Two path segments, so no page route (such as /[slug]) can claim the connection. */
export const livePath = "/api/live";

export const rooms = {
  /** Every logged-in staff member: new-request alerts and status changes. */
  staff: "staff",
  /** One staff member's connections, to log them out everywhere at once. */
  staffMember: (id: string) => `staff:${id}`,
  /** Everyone following one request: its buyer and the staff who have it open. */
  rfq: (id: string) => `rfq:${id}`,
};

export type ChatSender = "buyer" | "staff";

export type ChatMessageView = {
  id: string;
  sender: ChatSender;
  staffName: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
  /** Made by the sender's browser; a resend after a dropped connection is saved only once. */
  clientMessageId: string | null;
};

export const maxChatLength = 2000;

export type NewRequestEvent = { reference: string; companyName: string; type: string };
export type StatusEvent = { reference: string; status: "received" | "in_review" | "quote_sent" | "closed" };
export type ChatJoinReply = { ok: true; messages: ChatMessageView[] } | { ok: false; error: string };
export type ChatSendReply = { ok: true; message: ChatMessageView } | { ok: false; error: "invalid" | "rate_limited" | "failed" | "unauthorized" };
