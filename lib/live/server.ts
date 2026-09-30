import type { IncomingMessage, Server as HttpServer } from "node:http";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { Server } from "socket.io";
import { auth } from "@/lib/auth";
import { chatHistory, markChatRead, saveChatMessage } from "@/lib/chat";
import { db } from "@/lib/db";
import { setLiveServer } from "@/lib/live/emit";
import { livePath, maxChatLength, rooms, type ChatJoinReply, type ChatSendReply } from "@/lib/live/protocol";
import { hashStatusToken } from "@/lib/rfq";

// The live connection (plan: "WebSockets: what updates live"): new-request alerts for staff, live
// status and chat for buyers. Runs inside the website's program (server.ts). Rules:
// - Buyers connect with the secret from their private link and only ever reach their own request.
// - Staff connect with their login; a logged-out or switched-off account is cut off.
// - A chat message is saved in the database before it is sent on; resending it saves no copy.

type Who =
  | { kind: "buyer"; rfqId: string; reference: string }
  | { kind: "staff"; staffId: string; cookie: string; joined: Map<string, string> };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** 20 messages a minute per buyer (request) or staff member. */
const chatLimiter = new RateLimiterMemory({ keyPrefix: "chat", points: 20, duration: 60 });
/** Read marks write to the database: 60 a minute per connection is far above normal use. */
const readLimiter = new RateLimiterMemory({ keyPrefix: "read", points: 60, duration: 60 });

/** Pages of other sites always send Origin; the site's own long-polling requests may send none. */
function fromOwnSite(req: IncomingMessage) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function staffFromCookie(cookie: string) {
  const session = await auth.api.getSession({ headers: new Headers({ cookie }) });
  const user = session?.user;
  return user && user.active && !user.mustChangePassword ? user : null;
}

export function attachLive(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    path: livePath,
    serveClient: false,
    destroyUpgrade: false, // leave other upgrade requests (Next.js reload in development) alone
    maxHttpBufferSize: 64 * 1024,
    // Notice a silently dropped connection within about 20 seconds (default: 45).
    pingInterval: 10_000,
    pingTimeout: 10_000,
    allowRequest: (req, callback) => callback(null, fromOwnSite(req)),
  });
  setLiveServer(io);

  io.use(async (socket, next) => {
    try {
      const token: unknown = socket.handshake.auth?.token;
      if (typeof token === "string") {
        const rfq = /^[\w-]{43}$/.test(token)
          ? await db.rfq.findUnique({ where: { statusTokenHash: hashStatusToken(token) }, select: { id: true, reference: true } })
          : null;
        if (!rfq) return next(new Error("unauthorized"));
        socket.data = { kind: "buyer", rfqId: rfq.id, reference: rfq.reference } satisfies Who;
        return next();
      }
      const cookie = socket.handshake.headers.cookie ?? "";
      const staff = cookie ? await staffFromCookie(cookie) : null;
      if (!staff) return next(new Error("unauthorized"));
      socket.data = { kind: "staff", staffId: staff.id, cookie, joined: new Map() } satisfies Who;
      next();
    } catch (error) {
      console.error("Live connection: login check failed:", error);
      next(new Error("unavailable"));
    }
  });

  io.on("connection", (socket) => {
    const who = socket.data as Who;
    const sender = who.kind;
    if (who.kind === "staff") void socket.join([rooms.staff, rooms.staffMember(who.staffId)]);
    else void socket.join(rooms.rfq(who.rfqId));

    /** The request a message is about: the buyer's own, or one the staff member has opened. */
    const requestFor = (reference: unknown) =>
      who.kind === "buyer" ? who.rfqId : typeof reference === "string" ? who.joined.get(reference) : undefined;

    socket.on("chat:join", async (payload: { reference?: unknown } | undefined, reply: (r: ChatJoinReply) => void) => {
      if (typeof reply !== "function") return;
      try {
        let rfqId = who.kind === "buyer" ? who.rfqId : undefined;
        if (who.kind === "staff" && typeof payload?.reference === "string" && payload.reference.length <= 20) {
          rfqId = (await db.rfq.findUnique({ where: { reference: payload.reference }, select: { id: true } }))?.id;
          if (rfqId) who.joined.set(payload.reference, rfqId);
        }
        if (!rfqId) return reply({ ok: false, error: "not_found" });
        await socket.join(rooms.rfq(rfqId));
        reply({ ok: true, messages: await chatHistory(rfqId) });
      } catch (error) {
        console.error("Live chat: loading messages failed:", error);
        reply({ ok: false, error: "failed" });
      }
    });

    socket.on(
      "chat:send",
      async (payload: { reference?: unknown; body?: unknown; clientMessageId?: unknown } | undefined, reply: (r: ChatSendReply) => void) => {
        if (typeof reply !== "function") return;
        try {
          const body = typeof payload?.body === "string" ? payload.body.replace(/\r\n?/g, "\n").trim() : "";
          const clientMessageId = payload?.clientMessageId;
          const rfqId = requestFor(payload?.reference);
          if (!body || body.length > maxChatLength || typeof clientMessageId !== "string" || !uuid.test(clientMessageId) || !rfqId) {
            return reply({ ok: false, error: "invalid" });
          }
          if (who.kind === "staff" && !(await staffFromCookie(who.cookie))) {
            reply({ ok: false, error: "unauthorized" });
            socket.disconnect(true);
            return;
          }
          try {
            await chatLimiter.consume(who.kind === "staff" ? who.staffId : who.rfqId);
          } catch {
            return reply({ ok: false, error: "rate_limited" });
          }
          const { message, duplicate } = await saveChatMessage({
            rfqId,
            sender,
            staffUserId: who.kind === "staff" ? who.staffId : undefined,
            body,
            clientMessageId,
          });
          if (!duplicate) {
            io.to(rooms.rfq(rfqId)).emit("chat:message", message);
            if (who.kind === "buyer") io.to(rooms.staff).emit("chat:new", { reference: who.reference });
          }
          reply({ ok: true, message });
        } catch (error) {
          console.error("Live chat: saving a message failed:", error);
          reply({ ok: false, error: "failed" });
        }
      },
    );

    socket.on("chat:typing", (payload: { reference?: unknown } | undefined) => {
      const rfqId = requestFor(payload?.reference);
      if (rfqId) socket.to(rooms.rfq(rfqId)).emit("chat:typing", { sender });
    });

    socket.on("chat:read", async (payload: { reference?: unknown } | undefined) => {
      const rfqId = requestFor(payload?.reference);
      if (!rfqId) return;
      try {
        await readLimiter.consume(socket.id);
      } catch {
        return;
      }
      try {
        const at = await markChatRead(rfqId, sender);
        if (at) io.to(rooms.rfq(rfqId)).emit("chat:read", { reader: sender, at });
      } catch (error) {
        console.error("Live chat: read mark failed:", error);
      }
    });
  });

  return io;
}
