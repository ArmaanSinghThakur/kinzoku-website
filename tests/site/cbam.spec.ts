import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { baseURL } from "../helpers";

// The CBAM calculator gives exactly the live calculator's results (its saved original code is run
// side by side), updates as you type, and shows errors beside the field, never in a pop-up (Step 9).

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
});

test("same results as the live calculator", async ({ page, browser }) => {
  await page.goto("/cbam-europe");
  const calc = page.locator("#calculator");
  const live = await (await browser.newContext()).newPage();
  await live.setContent(fs.readFileSync("content/_source/embeds/cbam-europe--ziy1bb.html", "utf8"));

  for (const [route, tonnes, price] of [[0, 500, 75], [1, 1234.5, 80.5], [2, 1, 0], [3, 20000, 95], [0, 0.4, 70], [1, 987654, 123.45]]) {
    await calc.locator("select").selectOption(String(route));
    await calc.getByLabel("Import Volume (Metric Tons)").fill(String(tonnes));
    await calc.getByLabel("EU ETS Carbon Price (€ per tCO₂e)").fill(String(price));
    const row = (label: string) => calc.locator("dl div").filter({ hasText: label }).locator("dd").innerText();
    const ours = [await row("Total Embedded Emissions:"), await row("Certificates To Surrender:"), await row("Estimated CBAM Cost:")];

    await live.selectOption("#steelRoute", { index: route });
    await live.fill("#tonnage", String(tonnes));
    await live.fill("#etsPrice", String(price));
    await live.click(".calc-btn");
    const theirs = await live.evaluate(() => ["resEmissions", "resCertificates", "resCost"].map((id) => document.getElementById(id)!.innerText));
    expect(ours, `${route}/${tonnes}/${price}`).toEqual(theirs);
  }
});

test("errors beside the field, focus moves there, no pop-ups", async ({ page }) => {
  const popups: string[] = [];
  page.on("dialog", async (d) => {
    popups.push(d.message());
    await d.dismiss();
  });
  await page.goto("/cbam-europe");
  const calc = page.locator("#calculator");
  const tonnes = calc.getByLabel("Import Volume (Metric Tons)");
  await tonnes.fill("");
  await calc.getByRole("button", { name: "Calculate Financial Exposure" }).click();
  await expect(calc.getByText("Please enter a valid import volume.")).toBeVisible();
  await expect(tonnes).toHaveAttribute("aria-invalid", "true");
  await expect(tonnes).toHaveAttribute("aria-describedby", /.+/);
  await expect(tonnes).toBeFocused();
  await tonnes.fill("-5");
  await expect(calc.getByText("Please enter a valid import volume.")).toBeVisible();
  const price = calc.getByLabel("EU ETS Carbon Price (€ per tCO₂e)");
  await tonnes.fill("100");
  await price.fill("");
  await price.blur();
  await expect(calc.getByText("Please enter a valid carbon price.")).toBeVisible();
  expect(popups).toEqual([]);
});
