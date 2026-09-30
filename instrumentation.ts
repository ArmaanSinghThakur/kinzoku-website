// Runs once when the Next.js server starts (not during `next build`): starts the background
// sender for queued emails (lib/email-outbox.ts) and the nightly clean-up (lib/jobs.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { startEmailWorker } = await import("@/lib/email-outbox");
  const { startNightlyJobs } = await import("@/lib/jobs");
  startEmailWorker();
  startNightlyJobs();
}
