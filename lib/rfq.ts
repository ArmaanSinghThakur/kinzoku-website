import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { QuoteRequest } from "@/lib/quote-validation";

/**
 * Secret for the buyer's private status link (/rfq/status/<token>). 32 random bytes; the token is
 * only sent in the buyer's email, the database keeps its SHA-256 hash. A copied database therefore
 * can't be used to open anyone's request.
 */
export function newStatusToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashStatusToken(token) };
}

export function hashStatusToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Next request reference for the year, e.g. KZ-2026-0001. Call it inside the transaction that
 * creates the request, so a failed request doesn't use up a number. The counter update is a single
 * INSERT … ON CONFLICT statement, so requests sent at the same moment never get the same number.
 */
export async function nextRfqReference(tx: Prisma.TransactionClient, year = new Date().getUTCFullYear()) {
  const { lastNumber } = await tx.rfqCounter.upsert({
    where: { year },
    create: { year, lastNumber: 1 },
    update: { lastNumber: { increment: 1 } },
  });
  return `KZ-${year}-${String(lastNumber).padStart(4, "0")}`;
}

type SavedFile = { fileName: string; storagePath: string; mimeType: string; sizeBytes: number };

/**
 * Saves a checked quote request with its first status entry, its files' records and its two
 * queued emails, all or nothing. The status link's secret is made when the buyer's email is
 * sent (lib/email-outbox.ts); until then the request holds the hash of an unused random one.
 */
export async function createRfq(request: QuoteRequest, files: SavedFile[]) {
  const { hash } = newStatusToken();
  const { type, companyName, contactName, email, phone, message } = request;
  const product =
    "specification" in request
      ? {
          deliveryCountry: request.deliveryCountry,
          specification: request.specification,
          quantity: request.quantity,
          deliveryTerms: request.deliveryTerms,
          details: withoutEmpty({
            products: request.products,
            finishes: request.finishes,
            dimensions: request.dimensions,
            targetPrice: request.targetPrice,
            leadTime: request.leadTime,
          }),
        }
      : {};
  const { reference } = await db.$transaction(async (tx) =>
    tx.rfq.create({
      data: {
        reference: await nextRfqReference(tx),
        type,
        companyName,
        contactName,
        email,
        phone,
        message,
        ...product,
        statusTokenHash: hash,
        statusHistory: { create: { toStatus: "received" } },
        files: { create: files },
        emails: { create: [{ kind: "buyer_confirmation" }, { kind: "sales_alert" }] },
      },
      select: { reference: true },
    }),
  );
  return reference;
}

/** Leaves out unanswered questions (and empty lists) so details only holds real answers. */
function withoutEmpty(answers: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(answers).filter(([, value]) => value !== undefined && value.length > 0),
  ) as Record<string, string | string[]>;
}
