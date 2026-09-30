import { after } from "next/server";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { maxFileMb, maxFiles, quoteForm as t } from "@/content/quote-form";
import { sendDueEmails } from "@/lib/email-outbox";
import { validateQuote } from "@/lib/quote-validation";
import { clientIp, isSameOrigin } from "@/lib/request";
import { createRfq } from "@/lib/rfq";
import { deleteUploads, inspectUpload, saveUploads, type Upload } from "@/lib/uploads";

// Quote form submissions (Step 15). A fixed address rather than a Server Action: a page left open
// during a release can still send (action IDs change with every build), and uploads can be
// larger than the 1 MB Server Action limit.
export const dynamic = "force-dynamic";

// Every file at its largest, plus room for the text fields.
const maxBodyBytes = (maxFiles * maxFileMb + 1) * 1024 * 1024;

// Plan: "limits on how often one visitor can send the form". 5 requests per address per hour,
// counted in memory (the site runs as one server process).
const limiter = new RateLimiterMemory({ keyPrefix: "quote", points: 5, duration: 60 * 60 });

function reply(body: object, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

const rateLimited = (msBeforeNext: number) =>
  reply({ error: "rate_limited" }, 429, { "Retry-After": String(Math.ceil(msBeforeNext / 1000)) });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply({ error: "forbidden" }, 403);

  // Refuse oversized requests before reading them.
  const length = Number(request.headers.get("content-length"));
  if (!length) return reply({ error: "length_required" }, 411);
  if (length > maxBodyBytes) return reply({ error: "too_large" }, 413);

  const ip = clientIp(request);
  const used = await limiter.get(ip);
  if (used && used.remainingPoints <= 0) return rateLimited(used.msBeforeNext);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ error: "bad_request" }, 400);
  }

  // Hidden spam trap: people never see this field, robots fill it in. They get a normal-looking
  // answer and nothing is saved.
  if (form.get("website")) {
    await limiter.consume(ip).catch(() => {});
    return reply({ ok: true, reference: null }, 201);
  }

  const checked = validateQuote(form);
  if (!checked.ok) return reply({ errors: checked.errors }, 422);

  // The browser only checked file names; here each file's contents decide.
  const inspected = await Promise.all(checked.files.map(inspectUpload));
  const rejected = checked.files.find((_, i) => !inspected[i]);
  if (rejected) return reply({ errors: { files: t.files.wrongType(rejected.name) } }, 422);

  try {
    await limiter.consume(ip);
  } catch (error) {
    if (error instanceof RateLimiterRes) return rateLimited(error.msBeforeNext);
    throw error;
  }

  let saved: Awaited<ReturnType<typeof saveUploads>> = [];
  try {
    saved = await saveUploads(inspected as Upload[]);
    const reference = await createRfq(checked.data, saved);
    // Emails go out right after the answer is sent; if that fails, the background sender retries.
    after(() => sendDueEmails().catch((error) => console.error("Sending emails after a request:", error)));
    return reply({ ok: true, reference }, 201);
  } catch (error) {
    // Nothing half-saved: without the request, its files go too. Our failure doesn't count
    // towards the visitor's limit, so "Try again" keeps working.
    await deleteUploads(saved.map((file) => file.storagePath)).catch(() => {});
    await limiter.reward(ip, 1).catch(() => {});
    console.error("Quote request could not be saved:", error);
    return reply({ error: "failed" }, 500);
  }
}
