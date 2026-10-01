import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { baseURL, liveSource, liveWords, textOf, words } from "../helpers";

// Every page: loads, one main heading, its canonical address, no embedded frames, nothing loaded
// from other sites, fits a phone, and still has every word of the live site (Steps 7–12).
// The only words allowed to disappear are approved fixes and planned removals, listed here.

type PageCase = { path: string; source?: string; allowed?: string[]; hiddenTitle?: boolean };

const articles = JSON.parse(
  fs.readFileSync("content/blog/articles.generated.ts", "utf8").match(/articles: ArticleMeta\[\] = (\[[\s\S]*\]);/)![1],
) as { slug: string; title: string }[];

const languagePages: [string, string, string[]][] = [
  // [address, html lang, approved fixes]
  ["rollnaegel-palettennaegel-lieferant-palettennagel", "de", ["palettnägel", "schkontingente"]],
  ["clous-en-rouleau-fournisseur", "fr", []],
  ["clavos-en-rollo-proveedor", "es", []],
  ["pregos-em-rolo-fornecedor", "pt-BR", []],
  ["chiodi-in-rotolo-fornitore", "it", []],
  ["gwozdzie-zwojowe-dostawca", "pl", []],
  ["coilnagels-leverancier", "nl", ["afwikkelingen", "kopdoorvaartwaarden", "laag", "koolstofstaaldraad", "salvagecontingenten"]],
  ["coil-nails-supplier-africa", "en", []],
];

const pages: PageCase[] = [
  { path: "/", source: "home", allowed: ["penalities"] }, // spelling fix
  { path: "/about-us" }, // new page
  {
    path: "/coil-nails-staples-bulk-nails-epal-certified-pallet-nails",
    // spelling fixes; table headings now shown as grouped lists ("Category", "Definition")
    allowed: ["guage", "galvanised", "ankernegle", "consulting", "operate", "under", "50x64", "50x65", "50x70", "4x65", "4x70", "4x90", "category", "definition"],
  },
  { path: "/low-carbon-steel-wire-rod-and-drawn-nail-wires" },
  { path: "/long-products-alloy-bars-carbon-bars-bright-bars", allowed: ["shape"] }, // table heading "Profile Shape"
  {
    path: "/cbam-europe",
    // fixes "Manages", "tCO_2e" → "tCO₂e"; the Google Form's "Loading…"; the live calculator's empty
    // "0.00" placeholders; its hidden page title "Kinzoku Trade - CBAM Steel Liability Calculator"
    allowed: ["manages", "tco", "2e", "loading", "00", "kinzoku"],
  },
  { path: "/contact-us", allowed: ["bank", "ing", "loading", "82559186"] }, // bank line removed (plan), Google Form, old phone format
  { path: "/job-openings", allowed: ["kpi", "stockiest", "graduated", "month", "why"] }, // KPI's→KPIs, Stockists, graduate, months, 5 Whys
  { path: "/privacy-policy" }, // checked character by character in privacy.spec.ts
  { path: "/blog" }, // new page
  ...articles.map((a) => ({ path: `/${a.slug}`, allowed: ["ankernegle"] })),
  ...languagePages.map(([slug, , allowed]) => ({ path: `/${slug}`, allowed, hiddenTitle: true })),
];

const sourceFor = (p: PageCase) => (p.path === "/" ? "home" : p.path.slice(1));
const hasSource = (p: PageCase) => !["/about-us", "/privacy-policy", "/blog"].includes(p.path);

test.describe("every page", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
  });

  for (const p of pages) {
    test(`${p.path}: basics and every live word`, async ({ page }) => {
      const external = new Set<string>();
      page.on("request", (r) => {
        const host = new URL(r.url()).hostname;
        if (r.url().startsWith("http") && host !== "localhost") external.add(host);
      });
      const response = await page.goto(p.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const canonical = await page.getAttribute('link[rel="canonical"]', "href");
      expect(new URL(canonical!).pathname).toBe(p.path);
      await expect(page.locator("iframe")).toHaveCount(0);

      if (hasSource(p)) {
        let markdown = liveSource(sourceFor(p)).replace(/<!--[\s\S]*?-->/g, " ");
        // Each language page's embed starts with its own hidden <title>, never visible on the live page.
        if (p.hiddenTitle) markdown = markdown.replace(markdown.trim().split("\n")[0], " ");
        // Only the Markdown loses its list numbers: on the page, "4. Quota Timing" is a heading.
        const rendered = words(await textOf(page.locator("main")));
        const missing = [...liveWords(markdown)].filter((w) => !rendered.has(w) && !(p.allowed ?? []).includes(w));
        expect(missing, "live words missing from the new page").toEqual([]);
      }
      expect([...external], "requests to other sites").toEqual([]);
    });
  }
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const p of pages) {
    test(`${p.path} fits 390 px without sideways scrolling`, async ({ page, context }) => {
      await context.addCookies([{ name: "kz_consent", value: "1.0", url: baseURL }]);
      await page.goto(p.path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
  }
});

test.describe("language pages", () => {
  const chrome: Record<string, [string, string]> = {
    de: ["Über uns", "Cookies auf dieser Website"],
    fr: ["À propos", "Cookies sur ce site"],
    es: ["Quiénes somos", "Cookies en este sitio web"],
    "pt-BR": ["Sobre nós", "Cookies neste site"],
    it: ["Chi siamo", "Cookie su questo sito"],
    pl: ["O nas", "Pliki cookie na tej stronie"],
    nl: ["Over ons", "Cookies op deze website"],
    en: ["About Us", "Cookies on this website"],
  };
  for (const [slug, lang] of languagePages) {
    test(`/${slug}: in ${lang}, menu and cookie banner translated, no broken quote buttons`, async ({ page }) => {
      await page.goto(`/${slug}`);
      expect(await page.getAttribute("html", "lang")).toBe(lang);
      await expect(page.locator('header nav a[href="/about-us"]').first()).toHaveText(chrome[lang][0]);
      await expect(page.locator(".cookie-banner h2")).toHaveText(chrome[lang][1]);
      await expect(page.locator('a[href*="contactus-sales"]')).toHaveCount(0);
      await expect(page.locator(`header a[href="/${slug}"][aria-current="page"]`)).not.toHaveCount(0);
    });
  }
});

test("blog: groups of article cards, every card opens", async ({ page, request }) => {
  await page.goto("/blog");
  const hrefs = await page.locator("main article a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(new Set(hrefs).size).toBe(articles.length);
  for (const href of new Set(hrefs)) expect((await request.get(href)).status(), href).toBe(200);
});

test("articles: title, wrapped tables and related articles that open", async ({ page, request }) => {
  for (const a of articles) {
    await page.goto(`/${a.slug}`);
    await expect(page.locator("h1")).toHaveText(a.title);
    expect(await page.locator("article table").count()).toBe(await page.locator("article .table-scroll > table").count());
    for (const href of await page.locator("main section article a").evaluateAll((as) => as.map((x) => x.getAttribute("href")!))) {
      expect((await request.get(href)).status(), `${a.slug} → ${href}`).toBe(200);
    }
  }
});
