import { db, isUniqueViolation } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { ChatMessageView, ChatSender } from "@/lib/live/protocol";

// Chat messages between a buyer and the sales team about one request (chat_messages). Every
// message is saved before it is sent on, so a dropped connection never loses one.

const select = {
  id: true,
  sender: true,
  body: true,
  createdAt: true,
  readAt: true,
  clientMessageId: true,
  staffUser: { select: { name: true } },
} satisfies Prisma.ChatMessageSelect;

function view(message: Prisma.ChatMessageGetPayload<{ select: typeof select }>): ChatMessageView {
  return {
    id: message.id,
    sender: message.sender,
    staffName: message.staffUser?.name ?? null,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
    clientMessageId: message.clientMessageId,
  };
}

/** All messages of a request, oldest first (loaded again on every reconnect). */
export async function chatHistory(rfqId: string) {
  const messages = await db.chatMessage.findMany({ where: { rfqId }, orderBy: { createdAt: "asc" }, take: 1000, select });
  return messages.map(view);
}

/**
 * Saves a message. Sending the same message again (same clientMessageId, e.g. after a dropped
 * connection) returns the stored one instead of saving a copy.
 */
export async function saveChatMessage(input: {
  rfqId: string;
  sender: ChatSender;
  staffUserId?: string;
  body: string;
  clientMessageId: string;
}) {
  try {
    const message = await db.chatMessage.create({
      data: {
        rfqId: input.rfqId,
        sender: input.sender,
        staffUserId: input.staffUserId,
        body: input.body,
        clientMessageId: input.clientMessageId,
      },
      select,
    });
    return { message: view(message), duplicate: false };
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    const existing = await db.chatMessage.findUniqueOrThrow({
      where: { rfqId_clientMessageId: { rfqId: input.rfqId, clientMessageId: input.clientMessageId } },
      select,
    });
    return { message: view(existing), duplicate: true };
  }
}

/** Marks the other side's messages as read by `reader`; returns when, or null if none were unread. */
export async function markChatRead(rfqId: string, reader: ChatSender) {
  const at = new Date();
  const { count } = await db.chatMessage.updateMany({
    where: { rfqId, sender: reader === "buyer" ? "staff" : "buyer", readAt: null },
    data: { readAt: at },
  });
  return count > 0 ? at.toISOString() : null;
}
