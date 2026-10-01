import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs";
import { expect, test } from "@playwright/test";
import type pg from "pg";
import { connectDb, removeTestData, run, tryRun, uploadsDir } from "../helpers";

// The nightly clean-up (Privacy Policy deletion rules) and the nightly backup (Step 19).
// Tagged @ops: it stops the database for a moment; `npm test -- --grep-invert @ops` leaves it out.

test.describe.configure({ mode: "serial" });
let db: pg.Client;
const ago = (days: number) => new Date(Date.now() - days * 86_400_000);
const summary = (output: string) => JSON.parse(output.match(/\{.*\}/)![0]) as Record<string, number>;
const testDir = `${uploadsDir}/test-retention`;
const ids: Record<string, string> = {};
let staffId = "";

test.beforeAll(async () => {
  db = await connectDb();
  const company = async (name: string, since: Date) =>
    (await db.query("INSERT INTO companies (id, name, country, client_since, updated_at) VALUES ($1, $2, 'NL', $3, now()) RETURNING id", [randomUUID(), name, since])).rows[0].id as string;
  const X = await company("TEST X client 8 years", ago(8 * 366));
  const Y = await company("TEST Y client 2 years", ago(2 * 366));
  const W = await company("TEST W client 6 years", ago(6 * 366));
  await company("TEST Z client 8 years, no requests", ago(8 * 366));
  let n = 0;
  const rfq = async (label: string, createdAt: Date, companyId: string | null) => {
    const id = randomUUID();
    await db.query(
      "INSERT INTO rfqs (id, reference, type, company_name, contact_name, email, status_token_hash, company_id, created_at, updated_at) VALUES ($1, $2, 'other', $3, 'T', 't@retention.invalid', $4, $5, $6, now())",
      [id, `KZ-1990-${String(++n).padStart(4, "0")}`, label, randomBytes(32).toString("hex"), companyId, createdAt],
    );
    return id;
  };
  ids.A = await rfq("A 13 months, no client", ago(396), null);
  ids.B = await rfq("B 11 months, no client", ago(335), null);
  ids.C = await rfq("C 8 years, client", ago(8 * 366), X);
  ids.D = await rfq("D 13 months, client", ago(396), Y);
  ids.E = await rfq("E 6 years, client", ago(6 * 366), W);
  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(`${testDir}/a.pdf`, "%PDF-1.4 A");
  await db.query("INSERT INTO rfq_files (id, rfq_id, file_name, storage_path, mime_type, size_bytes) VALUES ($1, $2, 'a.pdf', 'test-retention/a.pdf', 'application/pdf', 10)", [randomUUID(), ids.A]);
  await db.query("INSERT INTO chat_messages (id, rfq_id, sender, body) VALUES ($1, $2, 'buyer', 'old message')", [randomUUID(), ids.A]);
  await db.query("INSERT INTO rfq_status_history (id, rfq_id, to_status) VALUES ($1, $2, 'received')", [randomUUID(), ids.A]);
  await db.query("INSERT INTO email_outbox (id, rfq_id, kind, sent_at) VALUES ($1, $2, 'buyer_confirmation', now())", [randomUUID(), ids.A]);
  for (const days of [396, 335]) {
    await db.query(
      "INSERT INTO cbam_estimates (id, email, product_type, tonnes, emission_factor, phase_in_rate, carbon_price, estimated_cost, created_at) VALUES ($1, 'c@retention.invalid', 'BF-BOF', 10, 2, 0.025, 80, 40, $2)",
      [randomUUID(), ago(days)],
    );
  }
  staffId = randomUUID();
  await db.query("INSERT INTO staff_users (id, email, name, updated_at) VALUES ($1, 's@retention.invalid', 'S', now())", [staffId]);
  for (const days of [-1, 2]) await db.query("INSERT INTO staff_sessions (id, token, user_id, expires_at, updated_at) VALUES ($1, $2, $3, $4, now())", [randomUUID(), randomUUID(), staffId, ago(days)]);
  fs.writeFileSync(`${testDir}/orphan-old.pdf`, "old");
  fs.utimesSync(`${testDir}/orphan-old.pdf`, ago(2), ago(2));
  fs.writeFileSync(`${testDir}/orphan-new.pdf`, "new");
});
test.afterAll(async () => {
  await db.end().catch(() => {}); // broken by the database stop above
  const fresh = await connectDb();
  await removeTestData(fresh);
  await fresh.end();
  fs.rmSync(testDir, { recursive: true, force: true });
});

test("@ops clean-up dry run counts what would go and deletes nothing", async () => {
  expect(summary(run("npm run -s retention:now -- --dry-run"))).toEqual({ requests: 2, files: 1, companies: 1, cbamEstimates: 1, staffSessions: 1, orphanFiles: 1 });
  expect(Number((await db.query("SELECT count(*) FROM rfqs WHERE reference LIKE 'KZ-1990-%'")).rows[0].count)).toBe(5);
  expect(fs.existsSync(`${testDir}/a.pdf`)).toBe(true);
});

test("@ops clean-up deletes exactly what the Privacy Policy says must go", async () => {
  expect(summary(run("npm run -s retention:now"))).toEqual({ requests: 2, files: 1, companies: 2, cbamEstimates: 1, staffSessions: 1, orphanFiles: 1 });
  const kept = (await db.query("SELECT company_name FROM rfqs WHERE reference LIKE 'KZ-1990-%' ORDER BY company_name")).rows.map((r) => r.company_name[0]);
  expect(kept).toEqual(["B", "D", "E"]); // 13 months without a client and 8 years with one are gone
  for (const table of ["rfq_files", "chat_messages", "rfq_status_history", "email_outbox"]) {
    expect(Number((await db.query(`SELECT count(*) FROM ${table} WHERE rfq_id = $1`, [ids.A])).rows[0].count), table).toBe(0);
  }
  expect(fs.existsSync(`${testDir}/a.pdf`)).toBe(false);
  const companies = (await db.query("SELECT name FROM companies WHERE name LIKE 'TEST % client %' ORDER BY name")).rows.map((r) => r.name.split(" ")[1]);
  expect(companies).toEqual(["W", "Y"]);
  expect(Number((await db.query("SELECT count(*) FROM cbam_estimates WHERE email = 'c@retention.invalid'")).rows[0].count)).toBe(1);
  expect(Number((await db.query("SELECT count(*) FROM staff_sessions WHERE user_id = $1", [staffId])).rows[0].count)).toBe(1);
  expect(fs.existsSync(`${testDir}/orphan-old.pdf`)).toBe(false);
  expect(fs.existsSync(`${testDir}/orphan-new.pdf`)).toBe(true);
  expect(Object.values(summary(run("npm run -s retention:now"))).every((v) => v === 0)).toBe(true);
});

test("@ops clean-up and backup are scheduled at 03:00 and 03:30 Amsterdam time", () => {
  expect(run("docker compose exec -T backup crontab -l")).toContain("30 3 * * * sh /backup-scripts/backup.sh");
  expect(fs.readFileSync("lib/jobs.ts", "utf8")).toContain('new Cron("0 3 * * *", { timezone: "Europe/Amsterdam"');
});

test("@ops backup: database, files and checksums; older than 14 days removed; restore test passes", () => {
  run(`docker compose run --rm -T backup "mkdir -p /backups/2026-01-01_033000 /backups/test-recent && touch -d '2026-01-01 03:30' /backups/2026-01-01_033000"`);
  expect(run("npm run -s backup:now")).toMatch(/Backup \S+ done/);
  const listing = run(`docker compose run --rm -T backup "ls -1 /backups; ls -1 /backups/$(ls -1 /backups | grep ^20 | tail -1)"`);
  expect(listing).not.toContain("2026-01-01_033000");
  for (const name of ["database.dump", "uploads.tar.gz", "SHA256SUMS", "LAST_SUCCESS"]) expect(listing).toContain(name);
  run(`docker compose run --rm -T backup "rm -rf /backups/test-recent"`);
  const restore = tryRun("npm run -s backup:restore-test");
  expect(restore.output).toContain("checksums OK");
  expect(restore.output).toMatch(/uploads: \d+ files, identical/);
  expect(restore.ok, restore.output).toBe(true);
});

test("@ops a failed backup fails loudly and leaves nothing half-written", () => {
  run("docker compose stop db");
  let failed;
  try {
    failed = tryRun(`docker compose run --rm -T --no-deps backup "sh /backup-scripts/backup.sh"`);
  } finally {
    run("docker compose up -d --wait db");
  }
  expect(failed.ok).toBe(false);
  expect(run(`docker compose run --rm -T backup "ls -1a /backups"`)).not.toContain(".incomplete");
});
