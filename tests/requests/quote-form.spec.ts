import { expect, test, type Page } from "@playwright/test";
import type pg from "pg";
import { baseURL, connectDb, pdfBytes, removeTestData, visitor } from "../helpers";

// The quote form in the browser (Step 15).

test.describe.configure({ mode: "serial" });
let db: pg.Client;
test.beforeAll(async () => {
  db = await connectDb();
});
test.afterAll(async () => {
  await removeTestData(db);
  await db.end();
});
test.use({ extraHTTPHeaders: { "X-Forwarded-For": visitor(300) } });
// The cookie settings panel is a form on every page too.
const quoteForm = 'form[action="/api/quote"]';
const send = `${quoteForm} button[type=submit]`;
test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
});

async function fillNails(page: Page, company = "Browser Test BV") {
  await page.selectOption("#quote-type", "nails");
  await page.fill("#quote-companyName", company);
  await page.fill("#quote-contactName", "Sam Tester");
  await page.fill("#quote-email", "sam@form.invalid");
  await page.fill("#quote-phone", "+31 6 1234 5678");
  await page.check("input[name=products][value='Bulk Nails']");
  await page.check("input[name=finishes][value='Bright']");
  await page.fill("#quote-specification", "3.1 × 80 mm smooth shank");
  await page.fill("#quote-quantity", "2 containers");
  await page.fill("#quote-deliveryCountry", "Hamburg, Germany");
  await page.selectOption("#quote-deliveryTerms", "CIF");
  await page.check("input[name=leadTime][value='Within 90–120 Days (Future Mill Rolling Program Allocation)']");
  await page.setInputFiles("#quote-files", [{ name: "spec sheet.pdf", mimeType: "application/pdf", buffer: Buffer.from(pdfBytes) }]);
}

test("a link from the wire page chooses the product and its own questions", async ({ page }) => {
  await page.goto("/contact-us?product=wire#quote");
  await expect(page.locator("#quote-type")).toHaveValue("wire");
  expect(await page.$$eval("input[name=products]", (els) => els.map((e) => (e as HTMLInputElement).value))).toEqual(["Wire Rod", "Drawn Nail Wire"]);
  await expect(page.locator("input[name=finishes]")).toHaveCount(0);
  await expect(page.locator("label[for=quote-specification]")).toContainText("Required Grade and Diameter");
});

test("sending it empty: a summary, a message beside each field, focus on the first", async ({ page }) => {
  await page.goto("/contact-us?product=wire#quote");
  await page.click(send);
  await expect(page.locator(`${quoteForm} [role=alert]`)).toHaveText("Please check the 6 fields marked below.");
  await expect(page.locator("#quote-companyName")).toBeFocused();
  await expect(page.locator("#quote-email")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#quote-email-error")).toContainText("valid email");
  await expect(page.locator("#quote-email")).toHaveAttribute("aria-describedby", "quote-email-error");
  await page.fill("#quote-email", "fixed@form.invalid");
  await expect(page.locator("#quote-email-error")).toHaveCount(0);

  await page.selectOption("#quote-type", "cbam_advisory");
  await expect(page.locator("#quote-specification")).toHaveCount(0);
  await expect(page.locator("#quote-deliveryCountry")).toHaveCount(0);
  await expect(page.locator("label[for=quote-message]")).toContainText("How can we help with CBAM?");
  await expect(page.locator("#quote-email")).toHaveValue("fixed@form.invalid");
});

test("no connection: everything stays and the button offers Try again; the retry is saved", async ({ page }) => {
  await page.goto("/contact-us#quote");
  await fillNails(page);
  await page.route("**/api/quote", (route) => route.abort("internetdisconnected"));
  await page.click(send);
  await expect(page.getByText("could not be sent")).toBeVisible();
  await expect(page.locator(send)).toHaveText("Try again");
  await expect(page.locator("#quote-companyName")).toHaveValue("Browser Test BV");
  await expect(page.locator("#quote-specification")).toHaveValue(/^3\.1/);
  expect(await page.locator("#quote-files").evaluate((i) => (i as HTMLInputElement).files!.length)).toBe(1);
  await expect(page.locator("input[value='Bulk Nails']")).toBeChecked();

  await page.unroute("**/api/quote");
  await page.click(send);
  await expect(page.getByText("your request has been received")).toBeVisible();
  const reference = (await page.locator("[role=status] strong").innerText()).trim();
  expect(reference).toMatch(/^KZ-\d{4}-\d{4}$/);
  await expect(page.locator("[role=status] h3")).toBeFocused();
  const row = (await db.query("SELECT r.company_name, r.delivery_terms, (SELECT json_agg(file_name) FROM rfq_files WHERE rfq_id = r.id) AS files FROM rfqs r WHERE reference = $1", [reference])).rows[0];
  expect(row).toEqual({ company_name: "Browser Test BV", delivery_terms: "CIF", files: ["spec sheet.pdf"] });

  await page.click("text=Send another request");
  await expect(page.locator("#quote-companyName")).toHaveValue("");
});

test("a double click sends one request", async ({ page }) => {
  await page.goto("/contact-us#quote");
  await fillNails(page, "TEST Double Click BV");
  await page.dblclick(send);
  await expect(page.getByText("your request has been received")).toBeVisible();
  await page.waitForTimeout(500);
  expect(Number((await db.query("SELECT count(*) FROM rfqs WHERE company_name = 'TEST Double Click BV'")).rows[0].count)).toBe(1);
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the form fits, and the floating WhatsApp button stays away while typing", async ({ page }) => {
    await page.goto("/contact-us?product=nails#quote");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.focus("#quote-companyName");
    await expect(page.locator(".whatsapp-button")).toBeHidden();
  });
});
