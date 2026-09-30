#!/usr/bin/env node
// Copies every public page of the live kinzokutrade.com (Hostinger Website Builder) into
// content/_source/ as Markdown, word for word, so the rebuilt pages can be made from it.
// Re-run before launch to pick up late edits:  node scripts/extract-live-content.mjs
//
// The builder renders most content (tables, FAQs, articles, language pages) client-side from
// data embedded in each page, so this reads that data rather than the visible HTML.

import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const SITE = "https://www.kinzokutrade.com";
const OUT = path.resolve("content/_source");
const HEADERS = { "User-Agent": "Mozilla/5.0 (Kinzoku website rebuild: content copy)" };
const today = new Date().toLocaleDateString("sv-SE"); // local YYYY-MM-DD

// ---------------------------------------------------------------- reading the builder's data

const decodeAttr = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Astro serialises island props as [type, value] pairs: 0 = plain value/object, 1 = array.
function revive(value) {
  if (!Array.isArray(value) || value.length !== 2 || typeof value[0] !== "number") return value;
  const [type, data] = value;
  if (type === 1) return data.map(revive);
  if (type === 0 && data && typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, revive(v)]));
  }
  return data;
}

function readPageData(html) {
  for (const [, url, props] of html.matchAll(/<astro-island[^>]*?component-url="([^"]*)"[^>]*?props="([^"]*)"/g)) {
    if (!url.includes("/Page.")) continue;
    const raw = JSON.parse(decodeAttr(props));
    return revive(raw.pageData);
  }
  throw new Error("page data not found");
}

function readHead(html) {
  const root = parse(html);
  const meta = (sel) => root.querySelector(sel)?.getAttribute("content") ?? null;
  return {
    title: root.querySelector("title")?.text.trim() ?? null,
    description: meta('meta[name="description"]'),
    ogImage: meta('meta[property="og:image"]'),
    canonical: root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    htmlLang: root.querySelector("html")?.getAttribute("lang") ?? null,
    noindex: /noindex/i.test(meta('meta[name="robots"]') ?? ""),
    assetsBase: html.match(/https:\/\/assets\.zyrosite\.com\/([A-Za-z0-9]+)\//)?.[1] ?? null,
  };
}

// ---------------------------------------------------------------- converting to Markdown

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
turndown.use(gfm);
turndown.remove(["style", "script", "noscript", "meta", "link"]);
// Keep every table cell on one line: the live tables use <br>/<p> inside cells ("Size<br>(Ø×L)"),
// which would otherwise split a Markdown table row. Same output format as turndown-plugin-gfm.
turndown.addRule("tableCellOneLine", {
  filter: ["th", "td"],
  replacement(content, node) {
    const index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
    const text = content.replace(/\s*\n+\s*/g, " ").replace(/\|/g, "\\|").trim();
    return `${index === 0 ? "| " : " "}${text} |`;
  },
});

const hasCode = (html) => /<script(?![^>]*application\/ld\+json)|<iframe|<form/i.test(html);

function elementToMarkdown(el, assetsBase) {
  switch (el.type) {
    case "GridTextBox":
    case "GridEmbed":
      return turndown.turndown(el.content ?? "");
    case "GridButton":
      return `[${el.content}](${el.href ?? ""})`;
    case "GridImage": {
      const s = el.settings ?? {};
      const src = s.origin === "assets" && assetsBase ? `https://assets.zyrosite.com/${assetsBase}/${s.path}` : s.path;
      return `![${s.alt ?? ""}](${src})`;
    }
    case "GridVideo":
      return `[Video: ${el.settings?.initialSrc ?? el.settings?.src}](${el.settings?.initialSrc ?? el.settings?.src})`;
    case "GridSocialIcons":
      return "";
    default:
      return `<!-- element type ${el.type} not converted -->`;
  }
}

// ---------------------------------------------------------------- word-for-word check

// Words and numbers only, so the check ignores Markdown syntax but catches any changed,
// missing or extra word.
const words = (text) => text.normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];

function htmlWords(html) {
  const root = parse(html);
  root.querySelectorAll("style, script, noscript").forEach((n) => n.remove());
  // structuredText breaks at block elements (<p>, <h1>, <td>…), so "Wire</h1><p>Delivered"
  // doesn't read as one word "WireDelivered".
  return words(root.structuredText);
}

function markdownWords(md) {
  const plain = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images (their alt text isn't visible text)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^\s*\d+\.\s+/gm, "") // ordered-list numbers (the browser draws these, they aren't page text)
    .replace(/<[^>]+>/g, " ") // leftover HTML (tables turndown kept as HTML)
    .replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, "$1"); // turndown escapes
  return words(parse(plain).structuredText);
}

function compareWords(expected, actual) {
  const n = Math.min(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    if (expected[i] !== actual[i]) {
      return `differs at word ${i}: live "${expected.slice(i, i + 6).join(" ")}" vs copy "${actual.slice(i, i + 6).join(" ")}"`;
    }
  }
  return expected.length === actual.length ? null : `length differs: live ${expected.length} words, copy ${actual.length}`;
}

// ---------------------------------------------------------------- main

const fetchText = async (url) => {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
  return { status: res.status, html: await res.text() };
};

const yamlString = (v) => (v === null ? "null" : JSON.stringify(v));

async function main() {
  await fs.mkdir(path.join(OUT, "embeds"), { recursive: true });

  // Every page the builder knows about, plus everything in the sitemap.
  const home = await fetchText(`${SITE}/`);
  const siteData = readPageData(home.html);
  const sitemap = (await fetchText(`${SITE}/sitemap.xml`)).html;
  const sitemapPaths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => new URL(u).pathname.replace(/\/$/, "") || "/"));
  const builderPaths = Object.entries(siteData.pages).map(([id, p]) => (id === siteData.homePageId ? "/" : `/${p.slug}`));
  const allPaths = [...new Set([...sitemapPaths, ...builderPaths])].sort();

  const index = [];
  for (const pagePath of allPaths) {
    const { status, html } = pagePath === "/" ? home : await fetchText(`${SITE}${pagePath}`);
    const entry = { path: pagePath, status, inSitemap: sitemapPaths.has(pagePath) };
    index.push(entry);
    if (status !== 200) {
      console.log(`skip  ${status} ${pagePath}`);
      continue;
    }

    const head = readHead(html);
    const data = readPageData(html);
    const page = data.pages[data.currentPageId];
    const blocks = (page.blocks ?? []).map((id) => [id, data.blocks[id]]).filter(([, b]) => b && b.slot !== "header" && b.slot !== "footer");

    const parts = [];
    const expected = [];
    const actual = [];
    const images = [];
    const embeds = [];
    for (const [blockId, block] of blocks) {
      const elements = (block.components ?? [])
        .map((id) => [id, data.elements[id]])
        .filter(([, el]) => el)
        .sort(([, a], [, b]) => (a.desktop?.top ?? a.mobile?.top ?? 0) - (b.desktop?.top ?? b.mobile?.top ?? 0) || (a.desktop?.left ?? 0) - (b.desktop?.left ?? 0));
      const bg = block.background?.image;
      parts.push(`<!-- block ${blockId}${bg ? ` | background image: ${bg.split("?")[0]} (${block.background.alt ?? "no alt"})` : ""} -->`);
      for (const [elId, el] of elements) {
        const md = elementToMarkdown(el, head.assetsBase).trim();
        if (md) parts.push(md);
        if (el.type === "GridTextBox" || el.type === "GridEmbed") {
          expected.push(...htmlWords(el.content ?? ""));
          actual.push(...markdownWords(md));
        }
        if (el.type === "GridImage") images.push(md);
        if (el.type === "GridEmbed" && hasCode(el.content ?? "")) {
          const file = `embeds/${pagePath === "/" ? "home" : pagePath.slice(1)}--${elId}.html`;
          await fs.writeFile(path.join(OUT, file), el.content);
          embeds.push(file);
          parts.push(`<!-- original embed with code saved as ${file} -->`);
        }
      }
    }

    const mismatch = compareWords(expected, actual);
    Object.assign(entry, {
      name: page.name,
      title: head.title,
      noindex: head.noindex,
      htmlLang: head.htmlLang,
      words: expected.length,
      wordCheck: mismatch ?? "identical",
      images: images.length,
      embedsWithCode: embeds,
    });

    const frontmatter = [
      "---",
      `url: ${SITE}${pagePath}`,
      `name: ${yamlString(page.name)}`,
      `title: ${yamlString(head.title)}`,
      `description: ${yamlString(head.description)}`,
      `ogImage: ${yamlString(head.ogImage)}`,
      `htmlLang: ${yamlString(head.htmlLang)}`,
      `noindex: ${head.noindex}`,
      `inSitemap: ${entry.inSitemap}`,
      `extracted: ${today}`,
      "---",
    ].join("\n");
    const file = `${pagePath === "/" ? "home" : pagePath.slice(1)}.md`;
    await fs.writeFile(path.join(OUT, file), `${frontmatter}\n\n${parts.join("\n\n")}\n`);
    console.log(`${mismatch ? "DIFF " : "ok   "} ${String(expected.length).padStart(5)} words  ${pagePath}${mismatch ? `  (${mismatch})` : ""}`);
  }

  // Site-wide structured data (in the page head) for the SEO step.
  const jsonLd = [...home.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([, j]) => JSON.parse(j));
  await fs.writeFile(path.join(OUT, "_site-jsonld.json"), `${JSON.stringify(jsonLd, null, 2)}\n`);
  await fs.writeFile(
    path.join(OUT, "_site-settings.json"),
    `${JSON.stringify({ cookieBanner: { text: siteData.cookieBannerDisclaimer, accept: siteData.cookieBannerAcceptText, decline: siteData.cookieBannerDeclineText, categories: siteData.cookieConsentTranslations } }, null, 2)}\n`,
  );
  await fs.writeFile(path.join(OUT, "_index.json"), `${JSON.stringify(index, null, 2)}\n`);

  const extracted = index.filter((p) => p.status === 200);
  const diffs = extracted.filter((p) => p.wordCheck !== "identical");
  console.log(`\n${extracted.length} pages copied, ${index.length - extracted.length} skipped, ${diffs.length} with word differences.`);
  if (diffs.length) process.exitCode = 1;
}

await main();
