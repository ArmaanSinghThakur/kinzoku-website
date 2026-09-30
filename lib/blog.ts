import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { type ArticleCategory, type ArticleMeta, articles } from "@/content/blog/articles.generated";

// Blog articles: metadata in content/blog/articles.generated.ts, bodies as Markdown next to it.
// Everything here runs at build time (pages are pre-rendered), so no Markdown code reaches visitors.

export const categories: ArticleCategory[] = ["CBAM", "Sourcing", "Products"];
export type ArticleSummary = ArticleMeta & { readingMinutes: number };

const WORDS_PER_MINUTE = 220;
const readBody = (slug: string) => fs.readFile(path.join(process.cwd(), "content", "blog", `${slug}.md`), "utf8");
const readingMinutes = (markdown: string) =>
  Math.max(1, Math.ceil((markdown.match(/[\p{L}\p{N}]+/gu)?.length ?? 0) / WORDS_PER_MINUTE));

// Tables scroll sideways inside their own box on phones instead of widening the page.
const wrapTables = (html: string) =>
  html.replaceAll("<table>", '<div class="table-scroll"><table>').replaceAll("</table>", "</table></div>");

export async function listArticles(): Promise<ArticleSummary[]> {
  return Promise.all(articles.map(async (a) => ({ ...a, readingMinutes: readingMinutes(await readBody(a.slug)) })));
}

export async function getArticle(slug: string) {
  const meta = articles.find((a) => a.slug === slug);
  if (!meta) return null;
  const markdown = await readBody(slug);
  return { ...meta, readingMinutes: readingMinutes(markdown), html: wrapTables(await marked.parse(markdown)) };
}
