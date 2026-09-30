import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { deleteUploads, uploadDir } from "@/lib/uploads";

// Nightly clean-up that keeps the Privacy Policy's promises (plan: "Keeping to the Privacy Policy"):
// - requests not linked to a client: deleted 12 months after they arrived;
// - requests linked to a client: deleted after 7 years;
//   (with a request go its files, messages, status history and email records)
// - client companies: deleted once they have no requests left and became clients over 7 years ago;
// - CBAM estimates sent by email: deleted after 12 months;
// - expired staff sessions and codes; uploaded files that no request refers to any more.

export type RetentionSummary = {
  requests: number;
  files: number;
  companies: number;
  cbamEstimates: number;
  staffSessions: number;
  orphanFiles: number;
};

const monthsAgo = (now: Date, months: number) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, now.getUTCDate()));
/** Files younger than this are never treated as orphans: their request may still be being saved. */
const orphanGraceMs = 24 * 60 * 60 * 1000;

/** Runs the clean-up. With `dryRun` only counts what would be deleted. */
export async function runRetention({ now = new Date(), dryRun = false } = {}): Promise<RetentionSummary> {
  const year = monthsAgo(now, 12);
  const sevenYears = monthsAgo(now, 7 * 12);
  const expiredRequests = {
    OR: [
      { companyId: null, createdAt: { lt: year } },
      { companyId: { not: null }, createdAt: { lt: sevenYears } },
    ],
  };
  const summary: RetentionSummary = { requests: 0, files: 0, companies: 0, cbamEstimates: 0, staffSessions: 0, orphanFiles: 0 };

  // Requests in batches: rows first (files, messages, history and emails go with them), then the
  // files on disk. A file whose deletion fails is caught by the orphan sweep the next night.
  for (;;) {
    const batch = await db.rfq.findMany({
      where: expiredRequests,
      select: { id: true, files: { select: { storagePath: true } } },
      take: dryRun ? undefined : 200,
    });
    if (batch.length === 0) break;
    const paths = batch.flatMap((r) => r.files.map((f) => f.storagePath));
    summary.requests += batch.length;
    summary.files += paths.length;
    if (dryRun) break;
    await db.rfq.deleteMany({ where: { id: { in: batch.map((r) => r.id) } } });
    await deleteUploads(paths).catch((error) => console.error("Clean-up: some files could not be deleted:", error));
  }

  const oldCompanies = { clientSince: { lt: sevenYears }, rfqs: { none: {} } };
  const oldEstimates = { createdAt: { lt: year } };
  const expiredSessions = { expiresAt: { lt: now } };
  if (dryRun) {
    summary.companies = await db.company.count({ where: oldCompanies });
    summary.cbamEstimates = await db.cbamEstimate.count({ where: oldEstimates });
    summary.staffSessions = await db.staffSession.count({ where: expiredSessions });
  } else {
    summary.companies = (await db.company.deleteMany({ where: oldCompanies })).count;
    summary.cbamEstimates = (await db.cbamEstimate.deleteMany({ where: oldEstimates })).count;
    summary.staffSessions = (await db.staffSession.deleteMany({ where: expiredSessions })).count;
    await db.authVerification.deleteMany({ where: { expiresAt: { lt: now } } });
  }

  summary.orphanFiles = await sweepOrphanFiles(now, dryRun);
  return summary;
}

/** Uploaded files older than a day that no request refers to (e.g. left by a crash). */
async function sweepOrphanFiles(now: Date, dryRun: boolean) {
  const onDisk = await readdir(uploadDir, { recursive: true, withFileTypes: true }).catch(() => []);
  const candidates: string[] = [];
  for (const entry of onDisk) {
    if (!entry.isFile()) continue;
    const full = path.join(entry.parentPath, entry.name);
    const { mtimeMs } = await stat(full);
    if (now.getTime() - mtimeMs > orphanGraceMs) candidates.push(path.relative(uploadDir, full).split(path.sep).join("/"));
  }
  if (candidates.length === 0) return 0;
  const known = new Set(
    (await db.rfqFile.findMany({ where: { storagePath: { in: candidates } }, select: { storagePath: true } })).map((f) => f.storagePath),
  );
  const orphans = candidates.filter((p) => !known.has(p));
  if (!dryRun) await deleteUploads(orphans);
  return orphans.length;
}
