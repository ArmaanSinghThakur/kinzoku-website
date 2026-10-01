import { expect, test } from "@playwright/test";
import { baseURL } from "../helpers";

// Product pages: tabs that follow the address, the video link, in-page links (Step 8).

const coilNails = "/coil-nails-staples-bulk-nails-epal-certified-pallet-nails";

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
});

test("tabs: #staples opens the Staples tab; choosing a tab updates the address", async ({ page }) => {
  await page.goto(`${coilNails}#staples`);
  await expect(page.locator('[role="tab"][data-state="active"]')).toHaveText("Staples");
  await page.getByRole("tab", { name: "EPAL Nails" }).click();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe("#epal-nails");
  await expect(page.locator('[role="tabpanel"]:visible h2').first()).toContainText("EPAL");
});

test("video opens on YouTube in a new tab (no embedded player)", async ({ page }) => {
  await page.goto(coilNails);
  const video = page.locator('a[href^="https://youtu.be/"]');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("target", "_blank");
  await expect(video).toHaveAttribute("rel", /noopener/);
});

for (const path of [coilNails, "/low-carbon-steel-wire-rod-and-drawn-nail-wires", "/long-products-alloy-bars-carbon-bars-bright-bars"]) {
  test(`${path}: every in-page link has its target`, async ({ page }) => {
    await page.goto(path);
    const anchors = await page.locator("main a[href^='#']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    for (const anchor of anchors) await expect(page.locator(anchor), anchor).toHaveCount(1);
  });
}
