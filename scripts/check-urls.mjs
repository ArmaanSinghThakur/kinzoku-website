#!/usr/bin/env node
// Address check (plan: "every current web address still opens the right page" and "automatic check
// of every internal link before each release"). Run against a running build:
//   node scripts/check-urls.mjs http://localhost:3000
// Checks: every address the live site had (content/_source/_index.json) plus /contactus-sales,
// every sitemap entry, robots.txt, and every internal link on every page. Exits 1 on any failure.
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://www.kinzokutrade.com";
const failures = [];
const results = { oldAddresses: [], sitemap: 0, links: 0 };

/** Fetch without following redirects, then follow them by hand (max 5) to report the final page. */
async function resolve(url) {
  let current = url;
  const hops = [];
  for (let i = 0; i < 5; i++) {
    const res = await fetch(current, { redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      const next = new URL(res.headers.get("location"), current).toString();
      hops.push(res.status);
      current = next;
      continue;
    }
    return { status: res.status, final: current.replace(base, ""), hops, body: res.headers.get("content-type")?.includes("text/html") ? await res.text() : "" };
  }
  return { status: 0, final: current, hops, body: "" };
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn));
}

// 1) Every address of the live site
const index = JSON.parse(fs.readFileSync(path.resolve("content/_source/_index.json"), "utf8"));
const oldPaths = [...new Set([...index.map((p) => p.path), "/contactus-sales"])].sort();
await inBatches(oldPaths, 8, async (p) => {
  const r = await resolve(`${base}${p}`);
  results.oldAddresses.push({ path: p, status: r.status, to: r.hops.length ? r.final : "" });
  if (r.status !== 200) failures.push(`old address ${p} → ${r.status}`);
});

// 2) robots.txt and sitemap
const robots = await fetch(`${base}/robots.txt`);
const robotsText = await robots.text();
if (robots.status !== 200 || !robotsText.includes("Sitemap:")) failures.push("robots.txt missing or without Sitemap line");
const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
const pagePaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => u.replace(SITE, "") || "/");
results.sitemap = pagePaths.length;
const pageBodies = new Map();
await inBatches(pagePaths, 8, async (p) => {
  const r = await resolve(`${base}${p}`);
  if (r.status !== 200 || r.hops.length) failures.push(`sitemap page ${p} → ${r.status}${r.hops.length ? " (redirects)" : ""}`);
  pageBodies.set(p, r.body);
});

// 3) Every internal link on every page
const links = new Map(); // href → first page it was seen on
for (const [page, html] of pageBodies) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    const clean = href.replace(/&amp;/g, "&");
    if (!clean.startsWith("/_next") && !links.has(clean)) links.set(clean, page);
  }
}
results.links = links.size;
await inBatches([...links.keys()], 8, async (href) => {
  const r = await resolve(`${base}${href}`);
  if (r.status !== 200) failures.push(`link ${href} (on ${links.get(href)}) → ${r.status}`);
});

// Report
const redirected = results.oldAddresses.filter((a) => a.to);
console.log(`Old addresses: ${results.oldAddresses.length} checked, ${results.oldAddresses.length - redirected.length} open directly, ${redirected.length} redirect:`);
for (const a of redirected.sort((x, y) => x.path.localeCompare(y.path))) console.log(`  ${a.path}  →  ${a.to}`);
console.log(`Sitemap: ${results.sitemap} pages | Internal links: ${results.links} unique | robots.txt: ${robots.status}`);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exitCode = 1;
} else {
  console.log("\nAll addresses and links OK.");
}
