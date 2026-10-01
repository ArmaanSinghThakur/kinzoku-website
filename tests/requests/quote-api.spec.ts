import fs from "node:fs";
import http from "node:http";
import { expect, test } from "@playwright/test";
import type pg from "pg";
import { baseURL, connectDb, pdfBytes, pngBytes, postQuote, removeTestData, run, uploadsDir } from "../helpers";

// The quote form's server side, /api/quote (Step 15): who may send, checks, files, spam trap,
// rate limit, and nothing half-saved when the database fails.

test.describe.configure({ mode: "serial" });
let db: pg.Client;
test.beforeAll(async () => {
  db = await connectDb();
});
test.afterAll(async () => {
  await removeTestData(db);
  await db.end();
});

const valid = {
  type: "nails", companyName: "Test Buyer BV", contactName: "Jo Test", email: "jo@api.invalid",
  phone: "+31 6 1234 5678", products: ["Coil Nails", "Staples"], finishes: "Hot-Dip Galvanized",
  specification: "2.5 × 50 mm ring shank", quantity: "23 t", deliveryCountry: "1012 AB Amsterdam, NL",
  deliveryTerms: "DAP", leadTime: "Within 30–60 Days", message: "Test request",
};
const pdf = () => new File([pdfBytes], "drawing.pdf", { type: "application/pdf" });
const png = () => new File([pngBytes], "photo.png", { type: "image/png" });
const filesOnDisk = () => (fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir, { recursive: true }).filter((f) => /\.\w+$/.test(String(f))).length : 0);

test("other sites can't send the form", async () => {
  expect((await postQuote(valid, [], 1, "https://evil.example")).status).toBe(403);
  const noOrigin = await fetch(`${baseURL}/api/quote`, { method: "POST", body: new FormData() });
  expect(noOrigin.status).toBe(403);
});

test("an oversized request is refused before it is read", async () => {
  const status = await new Promise((resolve) => {
    const req = http.request(`${baseURL}/api/quote`, { method: "POST", headers: { Origin: baseURL, "Content-Type": "multipart/form-data; boundary=x", "Content-Length": 40 * 1024 * 1024 } }, (res) => resolve(res.statusCode));
    req.on("error", () => resolve("error"));
    req.write("--x\r\n");
  });
  expect(status).toBe(413);
});

test("missing answers → 422 with a message for each field", async () => {
  const response = await postQuote({ type: "nails" }, [], 2);
  expect(response.status).toBe(422);
  const { errors } = await response.json();
  expect(Object.keys(errors)).toEqual(expect.arrayContaining(["companyName", "contactName", "email", "phone", "specification", "deliveryCountry"]));
});

test("a file is judged by its contents: a renamed program is refused", async () => {
  const fake = new File([Buffer.from("MZ\x90\x00this is a program")], "invoice.pdf", { type: "application/pdf" });
  const response = await postQuote(valid, [fake], 3);
  expect(response.status).toBe(422);
  expect((await response.json()).errors.files).toContain("invoice.pdf");
});

test("a valid request is saved with its answers, files and first status entry", async () => {
  const before = filesOnDisk();
  const response = await postQuote(valid, [pdf(), png()], 4);
  expect(response.status).toBe(201);
  const { reference } = await response.json();
  expect(reference).toMatch(/^KZ-\d{4}-\d{4}$/);
  const row = (await db.query("SELECT * FROM rfqs WHERE reference = $1", [reference])).rows[0];
  expect(row).toMatchObject({ type: "nails", delivery_terms: "DAP", status: "received", quantity: "23 t" });
  expect(row.details).toEqual({ products: ["Coil Nails", "Staples"], finishes: ["Hot-Dip Galvanized"], leadTime: "Within 30–60 Days" });
  expect(row.status_token_hash).toMatch(/^[0-9a-f]{64}$/);
  const files = (await db.query("SELECT * FROM rfq_files WHERE rfq_id = $1 ORDER BY file_name", [row.id])).rows;
  expect(files.map((f) => `${f.file_name}:${f.mime_type}`)).toEqual(["drawing.pdf:application/pdf", "photo.png:image/png"]);
  for (const f of files) {
    expect(f.storage_path).toMatch(/^\d{4}\/\d{2}\/[0-9a-f-]{36}\.(pdf|png)$/);
    expect(fs.existsSync(`${uploadsDir}/${f.storage_path}`)).toBe(true);
  }
  expect(filesOnDisk()).toBe(before + 2);
  const history = (await db.query("SELECT from_status, to_status FROM rfq_status_history WHERE rfq_id = $1", [row.id])).rows;
  expect(history).toEqual([{ from_status: null, to_status: "received" }]);
});

test("CBAM advisory needs no product or delivery answers", async () => {
  const response = await postQuote({ type: "cbam_advisory", companyName: "EU Importer GmbH", contactName: "Kim", email: "kim@api.invalid", message: "Need help with CBAM reporting" }, [], 5);
  expect(response.status).toBe(201);
  const row = (await db.query("SELECT type, delivery_country, details FROM rfqs WHERE reference = $1", [(await response.json()).reference])).rows[0];
  expect(row).toEqual({ type: "cbam_advisory", delivery_country: null, details: {} });
});

test("spam trap: a normal-looking answer, nothing saved", async () => {
  const count = async () => Number((await db.query("SELECT count(*) FROM rfqs WHERE email = 'jo@api.invalid'")).rows[0].count);
  const before = await count();
  const response = await postQuote({ ...valid, website: "http://spam.example" }, [], 6);
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true, reference: null });
  expect(await count()).toBe(before);
});

test("5 requests per visitor per hour; mistakes don't count; others are not affected", async () => {
  for (let i = 0; i < 3; i++) await postQuote({ type: "other" }, [], 7); // invalid: not counted
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) {
    statuses.push((await postQuote({ type: "other", companyName: "Rate BV", contactName: "R", email: "rate@api.invalid", message: `Try ${i}` }, [], 7)).status);
  }
  expect(statuses).toEqual([201, 201, 201, 201, 201, 429]);
  const blocked = await postQuote({ type: "other" }, [], 7);
  expect(blocked.status).toBe(429);
  expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(3000);
  expect(blocked.headers.get("cache-control")).toBe("no-store");
  expect((await postQuote({ type: "other", companyName: "Other BV", contactName: "O", email: "other@api.invalid", message: "Hi" }, [], 8)).status).toBe(201);
});

test("database down: 500, no orphan file, and the attempt doesn't count towards the limit", async () => {
  const before = filesOnDisk();
  run("docker compose stop db");
  let response: Response;
  try {
    response = await postQuote(valid, [pdf()], 9);
  } finally {
    run("docker compose up -d --wait db");
  }
  expect(response.status).toBe(500);
  expect((await response.json()).error).toBe("failed");
  expect(filesOnDisk()).toBe(before);
  await db.end();
  db = await connectDb();
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) statuses.push((await postQuote({ type: "other", companyName: "Refund BV", contactName: "R", email: "refund@api.invalid", message: `m${i}` }, [], 9)).status);
  expect(statuses).toEqual([201, 201, 201, 201, 201, 429]);
});
