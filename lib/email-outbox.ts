import { db } from "@/lib/db";
import { mailSettings, sendMail } from "@/lib/mailer";
import { newStatusToken } from "@/lib/rfq";
import { buyerConfirmation, salesAlert } from "@/lib/rfq-emails";

// Sends the emails queued with each quote request (email_outbox). Runs right after a request is
// saved and every 30 seconds in the background (instrumentation.ts), so an email that could not be
// sent (mail server down) goes out later instead of being lost.

/** Waiting time after each failed attempt, in minutes; after the last one the email is given up. */
const retryMinutes = [1, 5, 15, 30, 60, 120, 240, 360, 720, 720, 1440];
const maxAttempts = retryMinutes.length + 1;
/** A claimed email is not picked up again for this long, even if its sender stops midway. */
const leaseMinutes = 5;

/** Sends every email that is due. Safe to run from several places at once. */
export async function sendDueEmails(limit = 20) {
  // Claim in one statement: rows locked by another run are skipped, so no email goes out twice.
  const claimed = await db.$queryRaw<{ id: string }[]>`
    UPDATE email_outbox
    SET attempts = attempts + 1, next_attempt_at = now() + make_interval(mins => ${leaseMinutes})
    WHERE id IN (
      SELECT id FROM email_outbox
      WHERE sent_at IS NULL AND next_attempt_at <= now() AND attempts < ${maxAttempts}
      ORDER BY created_at
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id`;
  for (const { id } of claimed) await sendOne(id);
  return claimed.length;
}

async function sendOne(id: string) {
  const email = await db.emailOutbox.findUniqueOrThrow({ where: { id }, include: { rfq: { include: { files: true } } } });
  const { rfq } = email;
  try {
    if (email.kind === "buyer_confirmation") {
      // The status link's secret is made now and only its hash is stored, so the secret itself
      // exists only in this email. A repeated attempt makes a new one (the older link stops working).
      const { token, hash } = newStatusToken();
      await db.rfq.update({ where: { id: rfq.id }, data: { statusTokenHash: hash } });
      await sendMail(buyerConfirmation(rfq, `${mailSettings.siteUrl}/rfq/status/${token}`));
    } else {
      await sendMail(salesAlert(rfq));
    }
    await db.emailOutbox.update({ where: { id }, data: { sentAt: new Date(), lastError: null } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const wait = retryMinutes[email.attempts - 1];
    await db.emailOutbox
      .update({
        where: { id },
        data: {
          lastError: message.slice(0, 500),
          // After the last attempt the lease simply runs out; attempts >= maxAttempts stops retries.
          ...(wait ? { nextAttemptAt: new Date(Date.now() + wait * 60_000) } : {}),
        },
      })
      .catch(() => {});
    console.error(
      `Email "${email.kind}" for ${rfq.reference} failed (attempt ${email.attempts} of ${maxAttempts})${wait ? `; next try in ${wait} min` : "; giving up"}:`,
      message,
    );
  }
}

/** Starts the background sender once per server process. */
export function startEmailWorker() {
  const state = globalThis as unknown as { kzEmailWorker?: NodeJS.Timeout };
  if (state.kzEmailWorker) return;
  const run = () => sendDueEmails().catch((error) => console.error("Email worker:", error instanceof Error ? error.message : error));
  state.kzEmailWorker = setInterval(run, 30_000);
  void run();
}
