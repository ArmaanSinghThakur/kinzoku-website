import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { baseURL } from "../helpers";

// Google Analytics only after "Accept", never after "Reject"; the settings panel and cookie
// clean-up (Step 4). The test build has the ID G-TEST000000; requests to Google are recorded
// and then blocked, so nothing reaches Google.

const GA_ID = "G-TEST000000";

async function recordGoogle(page: Page) {
  const requests: string[] = [];
  await page.route(/google|googletagmanager|doubleclick/, (route) => {
    requests.push(route.request().url());
    return route.abort();
  });
  return requests;
}
const consent = async (context: BrowserContext) => (await context.cookies()).find((c) => c.name === "kz_consent")?.value;
const gaCookies = async (context: BrowserContext) => (await context.cookies()).filter((c) => c.name.startsWith("_ga"));

test("first visit: banner, nothing from Google; Reject keeps it that way, also after reload", async ({ page, context }) => {
  const google = await recordGoogle(page);
  await page.goto("/");
  const banner = page.locator(".cookie-banner");
  await expect(banner).toBeVisible();
  await expect(page.locator(".whatsapp-button")).toBeHidden();
  const accept = banner.getByRole("button", { name: "Accept", exact: true });
  const reject = banner.getByRole("button", { name: "Reject", exact: true });
  expect(await accept.getAttribute("class")).toBe(await reject.getAttribute("class")); // equal choice
  await page.waitForTimeout(1000);
  expect(google).toEqual([]);
  expect(await gaCookies(context)).toEqual([]);

  await reject.click();
  await page.reload();
  await page.waitForTimeout(1000);
  await expect(banner).toBeHidden();
  expect(await consent(context)).toBe("1.0");
  expect(google).toEqual([]);
});

test("Accept loads Google Analytics (only then), also after reload", async ({ page, context }) => {
  const google = await recordGoogle(page);
  await page.goto("/");
  await page.waitForTimeout(800);
  expect(google).toEqual([]);
  await page.locator(".cookie-banner").getByRole("button", { name: "Accept", exact: true }).click();
  await expect.poll(() => google.some((u) => u.includes(`gtag/js?id=${GA_ID}`))).toBe(true);
  expect(await consent(context)).toBe("1.1");
  const count = google.length;
  await page.reload();
  await expect.poll(() => google.length).toBeGreaterThan(count);
});

test("Cookie settings: shows the choice; switching off deletes Google's cookies and stops it", async ({ page, context }) => {
  const google = await recordGoogle(page);
  await context.addCookies([{ name: "kz_consent", value: "1.1", url: baseURL }]);
  await page.goto("/");
  const host = new URL(baseURL).hostname;
  await context.addCookies([
    { name: "_ga", value: "GA1.1.123.456", domain: host, path: "/" },
    { name: "_ga_TEST000000", value: "GS1.1.789", domain: host, path: "/" },
  ]);
  await page.getByRole("link", { name: "Cookie settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Cookie settings" });
  await expect(dialog).toBeVisible();
  expect(page.url()).not.toContain("#");
  const toggle = dialog.getByRole("switch");
  await expect(toggle).toBeChecked();
  await expect(dialog.locator("tbody tr")).toHaveCount(3);
  await toggle.uncheck({ force: true });
  await dialog.getByRole("button", { name: "Save choices" }).click();
  await expect(dialog).toBeHidden();
  expect(await consent(context)).toBe("1.0");
  expect(await gaCookies(context)).toEqual([]);
  expect(await page.evaluate((id) => (window as unknown as Record<string, unknown>)[`ga-disable-${id}`], GA_ID)).toBe(true);
  const before = google.length;
  await page.reload();
  await page.waitForTimeout(1000);
  expect(google.length).toBe(before);
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

  test("banner fits; settings open from a #cookie-settings link and close with Esc", async ({ page }) => {
    await recordGoogle(page);
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.goto("/about-us#cookie-settings");
    const dialog = page.getByRole("dialog", { name: "Cookie settings" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("switch")).not.toBeChecked();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator(".cookie-banner")).toBeVisible();
  });
});
