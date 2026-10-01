import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import type pg from "pg";
import { baseURL, clearMail, connectDb, listMail, pdfBytes, pngBytes, postQuote, readMail, removeTestData, run, waitForMail } from "../helpers";

// Confirmation and sales emails, the buyer's status page, and retries when the mail server is
// down (Step 16). Emails are read from the local mail catcher (Mailpit).

test.describe.configure({ mode: "serial" });
let db: pg.Client;
test.beforeAll(async () => {
  db = await connectDb();
  await clearMail();
});
test.afterAll(async () => {
  await removeTestData(db);
  await db.end();
  await clearMail();
});

const valid = {
  type: "nails", companyName: "ACME <b>Steel</b> BV", contactName: "Jo Test", email: "jo@mail.invalid",
  phone: "+31 6 1234 5678", products: ["Coil Nails"], specification: "2.5 × 50 mm\nring shank", deliveryCountry: "Rotterdam, NL",
  deliveryTerms: "DDP", leadTime: "Within 30–60 Days", message: "Please quote <script>alert(1)</script>",
};
let reference = "";
let token = "";

test("a request sends the buyer's confirmation and the sales alert", async () => {
  const response = await postQuote(valid, [new File([pdfBytes], "drawing.pdf"), new File([pngBytes], "photo.png")], 20);
  expect(response.status).toBe(201);
  reference = (await response.json()).reference;
  const list = await waitForMail(2);
  expect(list).toHaveLength(2);

  const buyer = await readMail(list.find((m) => m.To[0].Address === "jo@mail.invalid")!.ID);
  expect(`${buyer.From.Name} <${buyer.From.Address}>`).toBe("Kinzoku Consultancy & Trade <info@kinzokutrade.com>");
  expect(buyer.Subject).toBe(`Your quote request ${reference} – Kinzoku`);
  token = buyer.Text.match(/https?:\/\/\S+\/rfq\/status\/([\w-]{43})/)![1];
  expect(buyer.HTML).toContain(`/rfq/status/${token}`);
  expect(buyer.Attachments).toHaveLength(0);
  expect(buyer.HTML).toContain("ACME &lt;b&gt;Steel&lt;/b&gt; BV");
  expect(buyer.HTML).not.toContain("<b>Steel</b>");
  expect(buyer.HTML).not.toContain("<script>alert");
  expect(buyer.Text).toMatch(/2\.5 × 50 mm\r?\n {2}ring shank/);

  const sales = await readMail(list.find((m) => m.To[0].Address === "info@kinzokutrade.com")!.ID);
  expect(sales.Subject).toBe(`New request ${reference}: Coil Nails, Staples, Bulk Nails, EPAL Nails – ACME <b>Steel</b> BV`);
  expect(sales.ReplyTo[0].Address).toBe("jo@mail.invalid");
  expect(sales.Attachments.map((a) => a.FileName).sort()).toEqual(["drawing.pdf", "photo.png"]);
  for (const line of ["Delivery terms (Incoterms): DDP", "Delivery Postcode / Country: Rotterdam, NL", "Products: Coil Nails"]) expect(sales.Text).toContain(line);
  expect(sales.Text).toContain(`${baseURL}/admin/requests/${reference}`);
});

test("only the link's hash is stored; the secret is nowhere in the database", async () => {
  const row = (await db.query("SELECT id, status_token_hash, specification FROM rfqs WHERE reference = $1", [reference])).rows[0];
  expect(row.status_token_hash).toBe(createHash("sha256").update(token).digest("hex"));
  expect(row.specification).toBe("2.5 × 50 mm\nring shank"); // line breaks stored as \n
  const found = await db.query("SELECT 1 FROM rfqs, email_outbox WHERE position($1 in rfqs::text || email_outbox::text) > 0", [token]);
  expect(found.rowCount).toBe(0);
  const outbox = (await db.query("SELECT kind, attempts, sent_at FROM email_outbox WHERE rfq_id = $1", [row.id])).rows;
  expect(outbox.every((e) => e.sent_at && e.attempts === 1)).toBe(true);
});

test("the status page: private, not indexed, not cached, 404 for unknown links", async ({ request, page, context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
  const response = await request.get(`/rfq/status/${token}`);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(`<span class="whitespace-nowrap">${reference}</span>`);
  expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
  expect(html).toMatch(/<meta name="referrer" content="no-referrer"/);
  expect(html).not.toContain("BreadcrumbList");
  expect(response.headers()["cache-control"]).not.toMatch(/public|max-age=[1-9]/);
  expect((await request.get(`/rfq/status/${"A".repeat(43)}`)).status()).toBe(404);
  expect((await request.get("/rfq/status/short")).status()).toBe(404);
  await page.goto(`/rfq/status/${token}`);
  await expect(page.locator('li[aria-current="step"]')).toContainText("Received");
});

test("line breaks in a name can't add recipients to an email", async () => {
  await clearMail();
  const response = await postQuote({ type: "other", companyName: "Evil\r\nBcc: attacker@evil.invalid", contactName: "Eve\r\nBcc: attacker@evil.invalid", email: "eve@mail.invalid", message: "hi" }, [], 21);
  expect(response.status).toBe(201);
  const mails = await Promise.all((await waitForMail(2)).map((m) => readMail(m.ID)));
  expect(mails).toHaveLength(2);
  for (const m of mails) {
    expect(m.Bcc ?? []).toEqual([]);
    expect(m.To.some((t) => t.Address.includes("evil.invalid"))).toBe(false);
  }
  expect(mails.some((m) => m.Subject.endsWith("Evil Bcc: attacker@evil.invalid"))).toBe(true);
});

test("mail server down: the request is saved, its emails wait and go out once it is back", async () => {
  test.setTimeout(240_000);
  await clearMail();
  run("docker compose stop mail");
  let late = "";
  try {
    const response = await postQuote({ ...valid, companyName: "Mail Down BV", email: "down@mail.invalid" }, [], 22);
    expect(response.status).toBe(201);
    late = (await response.json()).reference;
    await new Promise((r) => setTimeout(r, 3000));
    const waiting = (await db.query("SELECT e.attempts, e.sent_at, e.last_error, e.next_attempt_at > now() AS later FROM email_outbox e JOIN rfqs r ON r.id = e.rfq_id WHERE r.reference = $1", [late])).rows;
    expect(waiting).toHaveLength(2);
    expect(waiting.every((e) => !e.sent_at && e.attempts === 1 && e.last_error && e.later)).toBe(true);
  } finally {
    run("docker compose up -d --wait mail");
  }
  expect(await waitForMail(2, 120)).toHaveLength(2);
  await new Promise((r) => setTimeout(r, 35_000)); // one more round of the sender: nothing twice
  expect(await listMail()).toHaveLength(2);
  const sent = (await db.query("SELECT e.attempts, e.sent_at FROM email_outbox e JOIN rfqs r ON r.id = e.rfq_id WHERE r.reference = $1", [late])).rows;
  expect(sent.every((e) => e.sent_at && e.attempts === 2)).toBe(true);
});

test("deleting a request deletes its email records too", async () => {
  const ids = (await db.query("SELECT id FROM rfqs WHERE email LIKE '%@mail.invalid'")).rows.map((r) => r.id);
  await removeTestData(db);
  expect(Number((await db.query("SELECT count(*) FROM email_outbox WHERE rfq_id = ANY($1)", [ids])).rows[0].count)).toBe(0);
});
