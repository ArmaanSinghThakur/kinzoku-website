import { expect, test, type Browser, type Page } from "@playwright/test";
import type pg from "pg";
import { addStaff, baseURL, clearMail, connectDb, listMail, pdfBytes, postQuote, readMail, removeTestData, visitor } from "../helpers";

// Staff login and the admin area (Step 17). One admin goes through the first login, the request
// list and page, status changes, linking a client and managing staff; a sales colleague is used
// for the role and logout checks.

test.describe.configure({ mode: "serial" });
let db: pg.Client;
let adminPage: Page;
let adminTemp = "";
let salesTemp = "";
let refA = "";
let refB = "";
let fileId = "";
const adminPassword = "copper coil harbour 42";
const salesPassword = "nail wire drawn 2026";

const signIn = (email: string, password: string, from: number) =>
  fetch(`${baseURL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseURL, "X-Forwarded-For": visitor(from) },
    body: JSON.stringify({ email, password }),
  });

async function loginAs(browser: Browser, email: string, password: string, from: number) {
  const context = await browser.newContext({ extraHTTPHeaders: { "X-Forwarded-For": visitor(from) } });
  const page = await context.newPage();
  await page.goto("/admin/login");
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.click("main button[type=submit]");
  await page.waitForURL((url) => !url.pathname.endsWith("/login"), { timeout: 8000 }).catch(() => {});
  return page;
}

test.beforeAll(async () => {
  db = await connectDb();
  await clearMail();
  adminTemp = addStaff("Alex Admin", "alex@admin.invalid", "admin");
  salesTemp = addStaff("Sam Sales", "sam@admin.invalid", "sales");
  refA = (await (await postQuote({ type: "bars", companyName: "TEST Steel Buyer GmbH", contactName: "Ute Käufer", email: "ute@admin.invalid", phone: "+49 30 1234567", specification: "42CrMo4, Ø 80 mm", deliveryCountry: "Berlin, DE" }, [new File([pdfBytes], "Zeichnung Ø80.pdf")], 40)).json()).reference;
  refB = (await (await postQuote({ type: "other", companyName: "TEST Other Co", contactName: "Olle", email: "olle@admin.invalid", message: "Hello" }, [], 41)).json()).reference;
  fileId = (await db.query("SELECT f.id FROM rfq_files f JOIN rfqs r ON r.id = f.rfq_id WHERE r.reference = $1", [refA])).rows[0].id;
});
test.afterAll(async () => {
  await removeTestData(db);
  await db.end();
  await clearMail();
});

test("staff:add prints a temporary password; only its hash is stored", async () => {
  expect(adminTemp).toMatch(/^[A-Za-z0-9]{4}(-[A-Za-z0-9]{4}){3}$/);
  const row = (await db.query("SELECT a.password, u.must_change_password FROM staff_accounts a JOIN staff_users u ON u.id = a.user_id WHERE u.email = 'alex@admin.invalid'")).rows[0];
  expect(row.password).not.toBe(adminTemp);
  expect(row.password.length).toBeGreaterThan(60);
  expect(row.must_change_password).toBe(true);
});

test("logged out: every admin page and download leads to the login", async ({ request }) => {
  for (const path of ["/admin", "/admin/staff", `/admin/requests/${refA}`, "/admin/account", `/admin/files/${fileId}`]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(307);
    expect(response.headers().location, path).toContain("/admin/login");
  }
});

test("no public sign-up; admin pages are noindex and kept out of search", async ({ request }) => {
  const signUp = await request.post("/api/auth/sign-up/email", { headers: { Origin: baseURL }, data: { email: "x@admin.invalid", password: "a-long-enough-password", name: "X" } });
  expect(signUp.status()).toBeGreaterThanOrEqual(400);
  expect((await db.query("SELECT 1 FROM staff_users WHERE email = 'x@admin.invalid'")).rowCount).toBe(0);
  expect(await (await request.get("/admin/login")).text()).toMatch(/noindex/);
});

test("guessing passwords: blocked after 5 tries in 15 minutes, even with the right one", async () => {
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) statuses.push((await signIn("alex@admin.invalid", `wrong-${i}`, 42)).status);
  expect(statuses).toEqual([401, 401, 401, 401, 401, 429]);
  expect((await signIn("alex@admin.invalid", adminTemp, 42)).status).toBe(429);
  const ok = await signIn("alex@admin.invalid", adminTemp, 43);
  expect(ok.status).toBe(200);
  expect(ok.headers.get("set-cookie")).toMatch(/kz\.session_token=.*HttpOnly.*SameSite=Lax/i);
});

test("first login: wrong password message, then the temporary password must be replaced", async ({ browser }) => {
  adminPage = await loginAs(browser, "alex@admin.invalid", "not-the-password", 44);
  await expect(adminPage.locator("main [role=alert]")).toContainText("Wrong email or password");
  await adminPage.fill("#login-password", adminTemp);
  await adminPage.click("main button[type=submit]");
  await adminPage.waitForURL("**/admin/account");
  await expect(adminPage.locator("main [role=status]")).toContainText("choose your own password");
  await expect(adminPage.locator("nav[aria-label=Admin]")).toHaveCount(0);
  await adminPage.goto("/admin");
  expect(adminPage.url()).toContain("/admin/account");

  await adminPage.fill("#password-current", adminTemp);
  await adminPage.fill("#password-new", "short");
  await adminPage.fill("#password-confirm", "short");
  await adminPage.evaluate(() => document.querySelectorAll("input").forEach((i) => i.removeAttribute("minlength")));
  await adminPage.click("main button[type=submit]");
  await expect(adminPage.locator("main [role=alert]")).toContainText("at least 12");
  await adminPage.fill("#password-current", adminTemp);
  await adminPage.fill("#password-new", adminPassword);
  await adminPage.fill("#password-confirm", adminPassword);
  await adminPage.click("main button[type=submit]");
  await adminPage.waitForURL(`${baseURL}/admin`);
  expect((await db.query("SELECT must_change_password FROM staff_users WHERE email = 'alex@admin.invalid'")).rows[0].must_change_password).toBe(false);
  // The earlier login (from the password-guessing test) is logged out by the change.
  expect(Number((await db.query("SELECT count(*) FROM staff_sessions s JOIN staff_users u ON u.id = s.user_id WHERE u.email = 'alex@admin.invalid'")).rows[0].count)).toBe(1);
});

test("requests list: search and status filter", async () => {
  await expect(adminPage.locator("main")).toContainText(refA);
  await expect(adminPage.locator("main")).toContainText(refB);
  await adminPage.fill("#search", "steel buyer");
  await adminPage.click("form[action='/admin'] button");
  await adminPage.waitForURL(/q=steel/);
  await expect(adminPage.locator("tbody")).toContainText(refA);
  await expect(adminPage.locator("tbody")).not.toContainText(refB);
  await adminPage.goto("/admin?status=closed");
  await expect(adminPage.locator("main")).toContainText("No requests found");
});

test("request page: answers, files, history and emails; downloads are attachments, not cached", async () => {
  await adminPage.goto(`/admin/requests/${refA}`);
  for (const text of ["42CrMo4, Ø 80 mm", "Berlin, DE", "Ute Käufer", "Zeichnung Ø80.pdf", "Request arrived", "Confirmation to the buyer"]) {
    await expect(adminPage.locator("main")).toContainText(text);
  }
  const download = await adminPage.request.get(`/admin/files/${fileId}`);
  expect(download.status()).toBe(200);
  expect(await download.text()).toBe(pdfBytes);
  expect(download.headers()["content-disposition"]).toMatch(/^attachment; .*filename\*=UTF-8''Zeichnung%20%C3%9880\.pdf/);
  expect(download.headers()["cache-control"]).toMatch(/no-store/);
});

test("status change records who did it; a click from an outdated page changes nothing", async () => {
  const stale = await adminPage.context().newPage();
  await stale.goto(`/admin/requests/${refA}`);
  await adminPage.click("form:has(input[name=to][value=in_review]) button");
  await expect(adminPage.getByText("Received → In review")).toBeVisible();
  await expect(adminPage.locator("main")).toContainText("by Alex Admin");
  // Open pages refresh themselves (live updates), so make this one outdated on purpose.
  await stale.waitForTimeout(1000);
  await stale.evaluate(() => {
    (document.querySelector("form:has(input[name=to][value=quote_sent]) input[name=from]") as HTMLInputElement).value = "received";
  });
  await stale.click("form:has(input[name=to][value=quote_sent]) button");
  await stale.waitForTimeout(1500);
  const history = (await db.query("SELECT from_status, to_status FROM rfq_status_history h JOIN rfqs r ON r.id = h.rfq_id WHERE r.reference = $1 ORDER BY h.created_at", [refA])).rows;
  expect(history.map((h) => `${h.from_status}→${h.to_status}`)).toEqual(["null→received", "received→in_review"]);
  await stale.close();
});

test("mark as client: links the request to a new client company", async () => {
  await adminPage.click("summary:has-text('Mark as client')");
  await adminPage.fill("#country", "Germany");
  await adminPage.fill("#vat", "DE123456789");
  await adminPage.click("form:has(#country) button[type=submit]");
  await expect(adminPage.getByText("Kept 7 years")).toBeVisible();
  const linked = (await db.query("SELECT c.name, c.country, c.vat_number FROM rfqs r JOIN companies c ON c.id = r.company_id WHERE r.reference = $1", [refA])).rows[0];
  expect(linked).toEqual({ name: "TEST Steel Buyer GmbH", country: "Germany", vat_number: "DE123456789" });
});

test("sales staff: no Staff section, and it can't be opened", async ({ browser }) => {
  const sales = await loginAs(browser, "sam@admin.invalid", salesTemp, 45);
  await sales.fill("#password-current", salesTemp);
  await sales.fill("#password-new", salesPassword);
  await sales.fill("#password-confirm", salesPassword);
  await sales.click("main button[type=submit]");
  await sales.waitForURL(`${baseURL}/admin`);
  await expect(sales.locator("a[href='/admin/staff']")).toHaveCount(0);
  expect((await sales.goto("/admin/staff"))?.status()).toBe(404);
  await sales.context().close();
});

test("admins add staff, switch accounts off and on, and log people out everywhere", async ({ browser }) => {
  await adminPage.goto("/admin/staff");
  await adminPage.fill("#staff-name", "Nina New");
  await adminPage.fill("#staff-email", "nina@admin.invalid");
  await adminPage.click("form:has(#staff-name) button[type=submit]");
  await expect(adminPage.getByText("Account made for nina@admin.invalid")).toBeVisible();
  await expect(adminPage.locator(".font-mono")).toHaveText(/^[A-Za-z0-9]{4}(-[A-Za-z0-9]{4}){3}$/);

  const sales = await loginAs(browser, "sam@admin.invalid", salesPassword, 46);
  const samRow = () => adminPage.locator("tr", { hasText: "sam@admin.invalid" });
  await samRow().locator("button[value=off]").click();
  await expect(samRow()).toContainText("Switched off");
  await sales.goto("/admin");
  expect(sales.url()).toContain("/admin/login");
  await sales.fill("#login-email", "sam@admin.invalid");
  await sales.fill("#login-password", salesPassword);
  await sales.click("main button[type=submit]");
  await expect(sales.locator("main [role=alert]")).toContainText("Wrong email or password");

  await samRow().locator("button[value=on]").click();
  await expect(samRow()).toContainText("Active");
  await sales.fill("#login-password", salesPassword);
  await sales.click("main button[type=submit]");
  await sales.waitForURL(`${baseURL}/admin`);
  await samRow().locator("button[value=end]").click();
  await expect(adminPage.getByText("Logged out on all devices")).toBeVisible();
  await sales.goto("/admin");
  expect(sales.url()).toContain("/admin/login");
  await expect(adminPage.locator("tr", { hasText: "alex@admin.invalid" }).locator("button")).toHaveCount(0);
  await sales.context().close();
});

test("log out", async () => {
  await adminPage.click("text=Log out");
  await adminPage.waitForURL("**/admin/login");
  await adminPage.goto("/admin");
  expect(adminPage.url()).toContain("/admin/login");
});

test("the sales alert links to the request in the admin area", async () => {
  const alert = (await listMail()).find((m) => m.Subject.startsWith("New request") && m.Subject.includes(refA));
  expect(alert).toBeTruthy();
  expect((await readMail(alert!.ID)).Text).toContain(`${baseURL}/admin/requests/${refA}`);
});
