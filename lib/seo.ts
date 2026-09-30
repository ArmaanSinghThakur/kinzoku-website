import type { Metadata } from "next";
import { languagePages } from "@/content/languages";
import { routes } from "./routes";
import { site } from "./site";

/** Share image for every page (Kinzoku's own banner from the live site). Stable URL for crawlers. */
export const shareImage = {
  url: "/brand/kinzoku-share.jpg",
  width: 1200,
  height: 630,
  alt: "KINZOKU – Nail Wire | Coil Nails | Staples | EPAL Nails",
};

/**
 * Open Graph block for a page. Next.js replaces (not merges) a layout's openGraph when a page sets
 * its own, so every page-level openGraph goes through this to keep the image and site name.
 */
export function openGraph(extra: NonNullable<Metadata["openGraph"]> = {}): Metadata["openGraph"] {
  return { type: "website", siteName: site.name, images: [shareImage], ...extra };
}

/**
 * hreflang cluster: the English homepage and the 7 translated landing pages point to each other.
 * The Africa page is English for another market, not a translation, so it stays out.
 */
export const languageAlternates: Record<string, string> = Object.fromEntries([
  ["x-default", routes.home],
  ...languagePages.filter((p) => p.href === routes.home || p.lang !== "en").map((p) => [p.lang, p.href]),
]);
