"use client";

import dynamic from "next/dynamic";
import { admin } from "@/content/admin";

// Only in the browser: the chat needs the live connection, and it restores messages that were
// still waiting in this tab.
const ChatBox = dynamic(() => import("@/components/live/chat-box").then((m) => m.ChatBox), {
  ssr: false,
  loading: () => <div className="h-[28rem] rounded-lg border border-line" />,
});

/** The sales team's side of a request's chat, on the admin request page. */
export function StaffChat({ reference, buyerName }: { reference: string; buyerName: string }) {
  return <ChatBox me="staff" reference={reference} otherName={buyerName} t={admin.chat} />;
}
