import { expect, test } from "@playwright/test";
import { baseURL } from "../helpers";

// Branded "Page not found" with search, and the error screens (Step 5).

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
});

test("unknown address: 404 with the site's header, footer, noindex and a working page search", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  expect(await page.getAttribute("html", "lang")).toBe("en");
  expect(await page.getAttribute('meta[name="robots"]', "content")).toContain("noindex");
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  const search = page.getByRole("searchbox", { name: "Search pages" });
  await search.fill("coil nails");
  await expect(page.locator("main ul a").first()).toBeVisible();
  await search.fill("japan");
  expect((await page.locator("main ul a").allInnerTexts()).join(" ")).toMatch(/Japan/i);
  await search.fill("deutsch");
  expect((await page.locator("main ul a").allInnerTexts()).join(" ")).toMatch(/Deutsch|Rollnägel/i);
  await search.fill("zzzz");
  await expect(page.getByText("No pages match your search.")).toBeVisible();
});

test("deep unknown address is also a 404", async ({ request }) => {
  expect((await request.get("/a/b/c")).status()).toBe(404);
});

test("phone: the 404 page fits", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  await page.goto("/missing");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test("a failing section shows a short message and recovers; a failing page keeps the header", async ({ page }) => {
  const response = await page.goto("/styleguide");
  test.skip(response?.status() === 404, "The /styleguide demo page is removed before launch.");
  page.on("pageerror", () => {}); // the demo throws on purpose
  await page.getByRole("button", { name: "Break this section" }).click();
  const alert = page.locator("main").getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(page.getByRole("button", { name: "Break the whole page" })).toBeVisible();
  await alert.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Break this section" })).toBeVisible();

  await page.getByRole("button", { name: "Break the whole page" }).click();
  await expect(page.locator("main h1")).toHaveText(/Something went wrong/i);
  await expect(page.locator("header")).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Break the whole page" })).toBeVisible();
});
