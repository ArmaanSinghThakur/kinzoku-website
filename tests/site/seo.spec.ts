import { expect, test } from "@playwright/test";
import { baseURL, tryRun } from "../helpers";

// Search engines and old addresses (Step 13).

const site = "https://www.kinzokutrade.com";
const ldTypes = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => [JSON.parse(m[1])].flat())
    .map((item: { "@type": string }) => item["@type"]);

test("every old address still opens the right page, and every internal link works", () => {
  const result = tryRun(`node scripts/check-urls.mjs ${baseURL}`);
  expect(result.ok, result.output).toBe(true);
  expect(result.output).toContain("All addresses and links OK.");
});

test("sitemap lists the public pages only", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length).toBe(27);
  expect(urls.every((u) => u.startsWith(site))).toBe(true);
  expect(xml).not.toMatch(/styleguide|\/admin|\/rfq\/|\/api\//);
});

test("robots.txt keeps private and temporary pages out of search", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  for (const path of ["/styleguide", "/api/", "/rfq/", "/admin"]) expect(robots).toContain(`Disallow: ${path}`);
  expect(robots).toContain(`Sitemap: ${site}/sitemap.xml`);
});

test("home: sharing image, summary card, company data with the right phone number", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/brand\/kinzoku-share\.jpg"/);
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
  expect(ldTypes(html)).toEqual(expect.arrayContaining(["Organization", "WebSite", "WholesaleStore", "Service"]));
  expect(html).not.toContain("zyrosite");
  expect(html).not.toMatch(/\+31[ -]?6[ -]?82[ -]?55[ -]?91[ -]?85/); // the wrong number on the live site
  const share = await request.get("/brand/kinzoku-share.jpg");
  expect(share.status()).toBe(200);
  expect(share.headers()["content-type"]).toBe("image/jpeg");
});

const alternates = (html: string) => [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)];

for (const path of ["/", "/rollnaegel-palettennaegel-lieferant-palettennagel"]) {
  test(`${path}: points search engines to all language versions`, async ({ request }) => {
    const languages = alternates(await (await request.get(path)).text()).map((m) => m[1]);
    expect(languages).toEqual(expect.arrayContaining(["x-default", "de", "fr", "es", "pt-BR", "it", "pl", "nl"]));
  });
}

test("the Africa page is English for another market, not a translation: no language versions", async ({ request }) => {
  expect(alternates(await (await request.get("/coil-nails-supplier-africa")).text())).toEqual([]);
  const home = alternates(await (await request.get("/")).text()).map((m) => m[2]);
  expect(home.some((href) => href.includes("africa"))).toBe(false);
});

test("articles and the CBAM page describe themselves to search engines", async ({ request }) => {
  const article = await (await request.get("/cbam-2026-complete-guide-steel-importers")).text();
  expect(ldTypes(article).some((t) => /Article|BlogPosting/.test(t))).toBe(true);
  expect(article).toContain('<meta property="og:type" content="article"');
  // The company's Service data is on the homepage (Step 13); the CBAM page has its breadcrumbs.
  expect(ldTypes(await (await request.get("/cbam-europe")).text())).toContain("BreadcrumbList");
});
