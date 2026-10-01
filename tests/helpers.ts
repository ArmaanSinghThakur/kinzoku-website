import { execSync, type ExecSyncOptions } from "node:child_process";
import { randomInt } from "node:crypto";
import fs from "node:fs";
import type { Locator } from "@playwright/test";
import pg from "pg";

// Shared helpers for the tests: the live copy for content checks, the database, the mail catcher,
// Docker, and making test requests and staff accounts. Test data always uses email addresses
// ending in ".invalid" and company names starting with "TEST ", and is removed afterwards.

if (fs.existsSync(".env")) process.loadEnvFile(".env");

export const baseURL = "http://localhost:3100";
export const mailpit = "http://127.0.0.1:8025/api/v1";
export const uploadsDir = "storage/uploads";

// ---- Content: every word of the live site must still be on the new page ----

export const words = (text: string) =>
  new Set((text.normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? []).map((w) => w.toLowerCase()));

/** A page of the live site as copied in content/_source (without its front matter). */
export const liveSource = (file: string) =>
  fs.readFileSync(`content/_source/${file}.md`, "utf8").split(/^---$/m).slice(2).join("---");

/** The words a visitor saw: no comments, image names, link addresses or list numbers. */
export const liveWords = (markdown: string) =>
  words(
    markdown
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\[Video:[^\]]*\]\([^)]*\)/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\]\([^)]*\)/g, "]")
      .replace(/\\_/g, "_")
      .replace(/^\s*\d+\\?\.\s+/gm, ""), // ordered-list numbers are drawn by the browser
  );

/** All text in an element, including closed tabs and folded sections (what search engines read). */
export const textOf = (locator: Locator) =>
  locator.evaluate((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const parts: string[] = [];
    while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? "");
    return parts.join(" "); // node by node: textContent would glue neighbouring words
  });

// ---- Database ----

export async function connectDb() {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  db.on("error", () => {}); // some tests stop the database on purpose
  await db.connect();
  return db;
}

/** Removes every request, company, staff member and estimate made by tests, with their files. */
export async function removeTestData(db: pg.Client) {
  const files = await db.query<{ storage_path: string }>(
    "SELECT f.storage_path FROM rfq_files f JOIN rfqs r ON r.id = f.rfq_id WHERE r.email LIKE '%.invalid'",
  );
  for (const { storage_path } of files.rows) fs.rmSync(`${uploadsDir}/${storage_path}`, { force: true });
  await db.query("DELETE FROM rfqs WHERE email LIKE '%.invalid' OR reference LIKE 'KZ-1990-%'");
  await db.query("DELETE FROM companies WHERE name LIKE 'TEST %'");
  await db.query("DELETE FROM staff_users WHERE email LIKE '%.invalid'");
  await db.query("DELETE FROM cbam_estimates WHERE email LIKE '%.invalid'");
  // Reference numbers restart when no real requests exist (development database only).
  const { rows } = await db.query<{ count: string }>("SELECT count(*) FROM rfqs");
  if (Number(rows[0].count) === 0) await db.query("DELETE FROM rfq_reference_counters");
}

// ---- Mail catcher (Mailpit) ----

type MailSummary = { ID: string; To: { Address: string }[]; Subject: string };
export type Mail = MailSummary & {
  From: { Name: string; Address: string };
  ReplyTo: { Address: string }[];
  Bcc: { Address: string }[] | null;
  Text: string;
  HTML: string;
  Attachments: { FileName: string; ContentType: string }[];
};

export const clearMail = () => fetch(`${mailpit}/messages`, { method: "DELETE" });
export const listMail = async () => ((await (await fetch(`${mailpit}/messages`)).json()).messages ?? []) as MailSummary[];
export const readMail = async (id: string) => (await (await fetch(`${mailpit}/message/${id}`)).json()) as Mail;

/** Waits until `count` emails have arrived (or the time is up) and returns them. */
export async function waitForMail(count: number, seconds = 15) {
  for (let i = 0; i < seconds * 2; i++) {
    const list = await listMail();
    if (list.length >= count) return list;
    await new Promise((r) => setTimeout(r, 500));
  }
  return listMail();
}

/** The private status link secret from a buyer's confirmation email. */
export async function statusToken(buyerEmail: string, seconds = 15) {
  for (let i = 0; i < seconds * 2; i++) {
    const found = (await listMail()).find((m) => m.To[0]?.Address === buyerEmail);
    if (found) return (await readMail(found.ID)).Text.match(/\/rfq\/status\/([\w-]{43})/)![1];
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`No confirmation email for ${buyerEmail}`);
}

// ---- Commands (Docker, npm scripts) ----

const dockerBin = "C:\\Program Files\\Docker\\Docker\\resources\\bin";
const shellEnv = {
  ...process.env,
  PATH: fs.existsSync(dockerBin) ? `${dockerBin}${process.platform === "win32" ? ";" : ":"}${process.env.PATH}` : process.env.PATH,
  SITE_URL: baseURL,
};

export const run = (command: string, options: ExecSyncOptions = {}) =>
  (execSync(command, { env: shellEnv, stdio: "pipe", ...options }) ?? "").toString();

/** Runs a command that may fail; returns its output either way. */
export function tryRun(command: string) {
  try {
    return { ok: true, output: run(command) };
  } catch (error) {
    const e = error as { stdout?: Buffer; stderr?: Buffer };
    return { ok: false, output: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

// ---- Requests and staff ----

/** A different "visitor address" per test run and caller, so rate limits never mix between tests. */
const runId = randomInt(1, 250);
export const visitor = (n: number) => `10.${runId}.${Math.floor(n / 250)}.${n % 250}`;

/** Sends a quote request the way the form does. */
export function postQuote(fields: Record<string, string | string[]>, files: File[] = [], from = 1, origin = baseURL) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) for (const v of [value].flat()) form.append(key, v);
  for (const file of files) form.append("files", file);
  return fetch(`${baseURL}/api/quote`, { method: "POST", body: form, headers: { Origin: origin, "X-Forwarded-For": visitor(from) } });
}

export const pdfBytes = "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF";
export const pngBytes = Buffer.from(
  "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D4944415478DA63F8CFC0F01F0005000201A5E2C2A50000000049454E44AE426082",
  "hex",
);

/** Adds a staff member with the real command and returns the temporary password it prints. */
export function addStaff(name: string, email: string, role: "admin" | "sales") {
  const output = run(`npx tsx --env-file=.env scripts/add-staff.mts --name "${name}" --email ${email} --role ${role}`);
  return output.match(/Temporary password \(shown only now\): (\S+)/)![1];
}

export const knownPassword = "test password for staff 2026";

/** A staff member who already chose `knownPassword`, logged in: returns the session cookie. */
export async function loggedInStaff(db: pg.Client, name: string, email: string, role: "admin" | "sales", from: number) {
  addStaff(name, email, role);
  const hash = run(`npx tsx -e "import('better-auth/crypto').then(async (m) => console.log(await m.hashPassword('${knownPassword}')))"`).trim();
  await db.query("UPDATE staff_accounts SET password = $1 WHERE user_id = (SELECT id FROM staff_users WHERE email = $2)", [hash, email]);
  await db.query("UPDATE staff_users SET must_change_password = false WHERE email = $1", [email]);
  const response = await fetch(`${baseURL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseURL, "X-Forwarded-For": visitor(from) },
    body: JSON.stringify({ email, password: knownPassword }),
  });
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error(`Login failed for ${email}: ${response.status}`);
  return cookie;
}

/** The cookie in the form Playwright's browser context wants. */
export const cookieForBrowser = (cookie: string) => ({
  name: cookie.slice(0, cookie.indexOf("=")),
  value: cookie.slice(cookie.indexOf("=") + 1),
  url: baseURL,
});
