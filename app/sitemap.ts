import type { MetadataRoute } from "next";
import { pages } from "@/content/pages";
import { languageAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

// sitemap.xml for Google: every public page (from content/pages.ts, the same list the 404 search and
// the address check use). Pages in the language cluster also list their language versions.
const absolute = (href: string) => new URL(href, site.url).toString();
const clusterHrefs = new Set(Object.values(languageAlternates));
const languages = Object.fromEntries(Object.entries(languageAlternates).map(([lang, href]) => [lang, absolute(href)]));

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: absolute(page.href),
    ...(clusterHrefs.has(page.href) ? { alternates: { languages } } : {}),
  }));
}
