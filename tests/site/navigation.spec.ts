import { expect, test, type Page } from "@playwright/test";
import { baseURL } from "../helpers";

// Header, menus, footer and the WhatsApp button (Steps 3, 3b and 8).

const noBanner = [{ name: "kz_consent", value: "1.0", url: baseURL }];
const productsOpen = (page: Page) => page.locator(".nav-popover").first().evaluate((el) => el.matches(":popover-open"));

test.describe("desktop", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies(noBanner);
  });

  test("Products menu: in the page when closed, opens under its button, keyboard and outside click close it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/long-products-alloy-bars-carbon-bars-bright-bars"]').first()).toBeAttached();
    expect(await productsOpen(page)).toBe(false);
    const products = page.getByRole("button", { name: "Products" });
    await products.click();
    expect(await productsOpen(page)).toBe(true);
    const underButton = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.trim() === "Products")!.getBoundingClientRect();
      const p = document.querySelector(".nav-popover")!.getBoundingClientRect();
      return Math.abs(p.left - b.left) < 2 && p.top > b.bottom && p.top - b.bottom < 16;
    });
    expect(underButton).toBe(true);
    await page.keyboard.press("Escape");
    expect(await productsOpen(page)).toBe(false);
    await expect(products).toBeFocused();
    await products.click();
    await page.mouse.click(640, 600);
    expect(await productsOpen(page)).toBe(false);
  });

  test("language menu lists all 9 versions; only one menu is open at a time", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Language/ }).click();
    await expect(page.locator(".nav-popover:popover-open a")).toHaveCount(9);
    await page.getByRole("button", { name: "Products" }).click();
    await expect(page.locator(".nav-popover:popover-open")).toHaveCount(1);
  });

  test("choosing a menu link closes the menu", async ({ page }) => {
    await page.goto("/about-us");
    await page.getByRole("button", { name: /Language/ }).click();
    await page.locator(".nav-popover:popover-open").getByRole("link", { name: "English", exact: true }).click();
    await page.waitForURL(`${baseURL}/`);
    await expect(page.locator(".nav-popover:popover-open")).toHaveCount(0);
  });

  test("first Tab reaches the skip link", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.textContent)).toMatch(/Skip to/i);
  });

  test("footer: email, phone, no bank name", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="mailto:info@kinzokutrade.com"]')).toHaveCount(1);
    await expect(footer.locator('a[href="tel:+31682559186"]')).toHaveCount(1);
    expect(await footer.innerText()).not.toMatch(/BANK|\bING\b/);
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test.beforeEach(async ({ context }) => {
    await context.addCookies(noBanner);
  });

  test("menu opens as a dialog, locks scrolling, closes with Esc and a tap outside", async ({ page }) => {
    await page.goto("/");
    // Both the desktop menu and the one inside the closed dialog are hidden.
    await expect(page.locator('nav[aria-label="Main"]:visible')).toHaveCount(0);
    const open = page.getByRole("button", { name: "Open menu" });
    await open.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await open.tap();
    await page.mouse.click(2, 400); // the strip of backdrop left of the panel
    await expect(dialog).toBeHidden();
  });

  test("a menu link navigates and the menu is closed", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).tap();
    await page.getByRole("dialog").getByRole("link", { name: "Contact" }).tap();
    await page.waitForURL("**/contact-us");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("WhatsApp", () => {
  for (const width of [390, 1280]) {
    test(`at ${width} px it is an icon in the header, not floating over content`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addCookies(noBanner);
      const page = await context.newPage();
      await page.goto("/");
      await expect(page.locator('header a[href^="https://wa.me/"]').first()).toBeVisible();
      await expect(page.locator(".whatsapp-button")).toBeHidden();
      await context.close();
    });
  }

  test("on wide screens it floats beside the content, never over it, and hides while typing in a form", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    await context.addCookies(noBanner);
    const page = await context.newPage();
    await page.goto("/contact-us");
    const button = page.locator(".whatsapp-button");
    await expect(button).toBeVisible();
    const clear = await page.evaluate(() => {
      const b = document.querySelector(".whatsapp-button")!.getBoundingClientRect();
      const box = document.querySelector("main .site-container")!;
      const c = box.getBoundingClientRect();
      return b.left >= c.right - parseFloat(getComputedStyle(box).paddingRight);
    });
    expect(clear).toBe(true);
    await page.locator("#quote-companyName").focus();
    await expect(button).toBeHidden();
    await context.close();
  });
});
