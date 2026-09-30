"use client";

import dynamic from "next/dynamic";
import { statusPage } from "@/content/rfq-status";

// Only in the browser: the chat needs the live connection, and it restores messages that were
// still waiting in this tab.
const ChatBox = dynamic(() => import("@/components/live/chat-box").then((m) => m.ChatBox), {
  ssr: false,
  loading: () => <div className="h-[28rem] rounded-lg border border-line" />,
});

/** The buyer's chat and live status on their private status page. */
export function BuyerChat({ token, reference }: { token: string; reference: string }) {
  return <ChatBox me="buyer" token={token} reference={reference} t={statusPage.chat} />;
}
