import { expect, test } from "@playwright/test";
import { baseURL, liveSource, textOf } from "../helpers";

// The Privacy Policy is the live text, character for character (spaces aside) (Step 10).

test("Privacy Policy matches the live text exactly", async ({ page, context }) => {
  await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
  await page.goto("/privacy-policy");
  const live = liveSource("privacy-policy")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^# /m, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\\\./g, ".")
    .replace(/^\s*-\s+/gm, "");
  const ours = [
    await page.locator("h1").innerText(),
    await page.locator("main header, main section p").first().innerText(),
    await textOf(page.locator("main article")),
  ].join(" ");
  const squash = (s: string) => s.normalize("NFC").replace(/\s+/g, "");
  expect(squash(ours)).toBe(squash(live));
});

test("its table of contents links all have targets", async ({ page }) => {
  await page.goto("/privacy-policy");
  const links = page.locator('nav[aria-label="Sections"] a');
  expect(await links.count()).toBeGreaterThan(5);
  expect(await links.evaluateAll((as) => as.every((a) => document.querySelector(a.getAttribute("href")!)))).toBe(true);
});
