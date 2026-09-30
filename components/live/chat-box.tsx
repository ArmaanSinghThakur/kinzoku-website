"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldStyles } from "@/components/ui/field-styles";
import { cn } from "@/lib/cn";
import { liveSocket } from "@/lib/live/client";
import { maxChatLength, type ChatJoinReply, type ChatMessageView, type ChatSendReply, type ChatSender } from "@/lib/live/protocol";

export type ChatText = {
  title: string;
  intro: string;
  empty: string;
  you: string;
  them: (name: string | null) => string;
  typing: string;
  placeholder: string;
  label: string;
  send: string;
  sending: string;
  waiting: string;
  sent: string;
  read: string;
  live: string;
  offline: string;
  tooLong: (max: number) => string;
  rateLimited: string;
  failed: string;
  hint: string;
};

/** A message not yet confirmed by the server: `waiting` once a send went unanswered (connection lost). */
type Pending = { clientMessageId: string; body: string; createdAt: string; error?: string; waiting?: boolean };

const time = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
const byTime = (a: ChatMessageView, b: ChatMessageView) => a.createdAt.localeCompare(b.createdAt);
const merge = (list: ChatMessageView[], more: ChatMessageView[]) => {
  const byId = new Map(list.map((m) => [m.id, m]));
  for (const m of more) byId.set(m.id, { ...byId.get(m.id), ...m });
  return [...byId.values()].sort(byTime);
};

/**
 * Chat about one request, for the buyer (status page) or staff (admin). Nothing typed is lost:
 * messages waiting for a connection are kept in this tab (sessionStorage) and sent, once, when it
 * returns; after every reconnect the full conversation is loaded again from the database.
 */
export function ChatBox({
  me,
  token,
  reference,
  otherName,
  t,
}: {
  me: ChatSender;
  /** Buyer: the status link secret. Staff: omitted (their login is used). */
  token?: string;
  reference: string;
  /** Staff view: the buyer's name. */
  otherName?: string;
  t: ChatText;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageView[]>([]);
  const storageKey = `kz-chat-pending:${reference}`;
  // Messages still waiting from before a reload in this tab (the box only renders in the browser).
  const [pending, setPending] = useState<Pending[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) ?? "[]") as Pending[];
    } catch {
      return [];
    }
  });
  const [connected, setConnected] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLOListElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTyping = useRef(0);
  const payload = me === "staff" ? { reference } : {};

  useEffect(() => {
    try {
      if (pending.length) sessionStorage.setItem(storageKey, JSON.stringify(pending));
      else sessionStorage.removeItem(storageKey);
    } catch {}
  }, [pending, storageKey]);

  const send = useCallback(
    (item: Pending) => {
      const socket = liveSocket(token);
      if (!socket.connected) return;
      socket
        .timeout(10_000)
        .emit("chat:send", { ...payload, body: item.body, clientMessageId: item.clientMessageId }, (err: Error | null, reply?: ChatSendReply) => {
          if (err || !reply) {
            // No answer: kept and sent again after reconnecting (the server saves it only once).
            setPending((list) => list.map((p) => (p.clientMessageId === item.clientMessageId ? { ...p, waiting: true } : p)));
            return;
          }
          if (reply.ok) {
            setMessages((list) => merge(list, [reply.message]));
            setPending((list) => list.filter((p) => p.clientMessageId !== item.clientMessageId));
          } else {
            const error = reply.error === "rate_limited" ? t.rateLimited : t.failed;
            setPending((list) => list.map((p) => (p.clientMessageId === item.clientMessageId ? { ...p, error } : p)));
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, reference, t],
  );

  const markRead = useCallback(() => {
    if (document.visibilityState === "visible") liveSocket(token).emit("chat:read", payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reference]);

  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    const socket = liveSocket(token);
    const join = () => {
      setConnected(true);
      socket.emit("chat:join", payload, (reply: ChatJoinReply) => {
        if (!reply?.ok) return;
        setMessages(reply.messages);
        const stored = new Set(reply.messages.map((m) => m.clientMessageId));
        setPending((list) => list.filter((p) => !stored.has(p.clientMessageId)));
        for (const item of pendingRef.current) if (!stored.has(item.clientMessageId)) send(item);
        markRead();
      });
    };
    const onDisconnect = () => setConnected(false);
    const onMessage = (message: ChatMessageView) => {
      setMessages((list) => merge(list, [message]));
      setPending((list) => list.filter((p) => p.clientMessageId !== message.clientMessageId));
      if (message.sender !== me) {
        setOtherTyping(false);
        markRead();
      }
    };
    const onTyping = ({ sender }: { sender: ChatSender }) => {
      if (sender === me) return;
      setOtherTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setOtherTyping(false), 4000);
    };
    const onRead = ({ reader, at }: { reader: ChatSender; at: string }) => {
      if (reader === me) return;
      setMessages((list) => list.map((m) => (m.sender === me && !m.readAt && m.createdAt <= at ? { ...m, readAt: at } : m)));
    };
    const onStatus = () => router.refresh();
    const onVisible = () => markRead();

    socket.on("connect", join);
    socket.on("disconnect", onDisconnect);
    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:read", onRead);
    socket.on("status", onStatus);
    document.addEventListener("visibilitychange", onVisible);
    if (socket.connected) join();
    return () => {
      socket.off("connect", join);
      socket.off("disconnect", onDisconnect);
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:read", onRead);
      socket.off("status", onStatus);
      document.removeEventListener("visibilitychange", onVisible);
      clearTimeout(typingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reference, me]);

  // Keep the newest message in view.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages.length, pending.length]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || body.length > maxChatLength) return;
    const item: Pending = { clientMessageId: crypto.randomUUID(), body, createdAt: new Date().toISOString() };
    setPending((list) => [...list, item]);
    setDraft("");
    send(item);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  function onType(value: string) {
    setDraft(value);
    const now = Date.now();
    if (value && now - lastTyping.current > 2000) {
      lastTyping.current = now;
      liveSocket(token).emit("chat:typing", payload);
    }
  }

  const lastOwn = [...messages].reverse().find((m) => m.sender === me);
  const tooLong = draft.trim().length > maxChatLength;

  return (
    <section aria-labelledby="chat-title" className="rounded-lg border border-line">
      <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <h2 id="chat-title" className="text-lg">{t.title}</h2>
          <p className="text-sm text-muted">{t.intro}</p>
        </div>
        <span className={cn("mt-1 flex shrink-0 items-center gap-1.5 text-xs", connected ? "text-emerald-700" : "text-muted")}>
          <span aria-hidden className={cn("size-2 rounded-full", connected ? "bg-emerald-500" : "bg-line")} />
          {connected ? t.live : t.offline}
        </span>
      </header>

      <ol ref={logRef} role="log" aria-live="polite" className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && pending.length === 0 && <li className="text-sm text-muted">{t.empty}</li>}
        {messages.map((m) => {
          const own = m.sender === me;
          const name = own && me === "buyer" ? t.you : m.sender === "staff" ? t.them(m.staffName) : t.them(otherName ?? null);
          return (
            <li key={m.id} className={cn("flex flex-col", own ? "items-end" : "items-start")}>
              <span className="text-xs text-muted">
                {me === "staff" && own ? (m.staffName ?? t.you) : name} · {time.format(new Date(m.createdAt))}
              </span>
              <p className={cn("mt-1 max-w-[85%] rounded-lg px-3 py-2 break-words whitespace-pre-line", own ? "bg-charcoal text-white" : "bg-mist")}>
                {m.body}
              </p>
              {m === lastOwn && <span className="mt-0.5 text-xs text-muted">{m.readAt ? t.read : t.sent}</span>}
            </li>
          );
        })}
        {pending.map((p) => (
          <li key={p.clientMessageId} className="flex flex-col items-end">
            <p className="mt-1 max-w-[85%] rounded-lg bg-charcoal/70 px-3 py-2 break-words whitespace-pre-line text-white">{p.body}</p>
            <span className={cn("mt-0.5 text-xs", p.error ? "font-semibold text-danger" : "text-muted")}>
              {p.error ?? (connected && !p.waiting ? t.sending : t.waiting)}
            </span>
          </li>
        ))}
      </ol>

      <p aria-live="polite" className="h-5 px-4 text-xs text-muted">{otherTyping ? t.typing : ""}</p>

      <form onSubmit={submit} className="border-t border-line p-4">
        <label htmlFor="chat-message" className="sr-only">{t.label}</label>
        <textarea
          id="chat-message"
          rows={2}
          value={draft}
          onChange={(e) => onType(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          aria-describedby="chat-hint"
          aria-invalid={tooLong ? true : undefined}
          className={cn(fieldStyles(tooLong), "mt-0 resize-y")}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p id="chat-hint" className={cn("text-xs", tooLong ? "font-semibold text-danger" : "text-muted")}>
            {tooLong ? t.tooLong(maxChatLength) : t.hint}
          </p>
          <button type="submit" disabled={!draft.trim() || tooLong} className={buttonStyles({ size: "sm" })}>{t.send}</button>
        </div>
      </form>
    </section>
  );
}
