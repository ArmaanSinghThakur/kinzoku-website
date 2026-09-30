import { articles } from "./blog/articles.generated";
import { languagePages } from "./languages";
import { routes } from "@/lib/routes";

// Every public page with its title: used by the 404 search now, and by the sitemap and link
// check later. Article titles come from the blog index, so they are written in one place.
export type PageEntry = { href: string; title: string; group: "Pages" | "Products" | "Articles" | "Languages" };

export const pages: PageEntry[] = [
  { href: routes.home, title: "Home", group: "Pages" },
  { href: routes.about, title: "About Us", group: "Pages" },
  { href: routes.nails, title: "Coil Nails, Staples, Bulk Nails, EPAL Nails", group: "Products" },
  { href: routes.wire, title: "Wire Rod, Drawn Wires", group: "Products" },
  { href: routes.bars, title: "Long Products - Alloy Bars, Carbon Bars, Bright Bars", group: "Products" },
  { href: routes.cbam, title: "CBAM", group: "Pages" },
  { href: routes.contact, title: "Contact", group: "Pages" },
  { href: routes.jobs, title: "Job Openings", group: "Pages" },
  { href: routes.privacy, title: "Privacy Policy", group: "Pages" },
  { href: routes.blog, title: "Blog", group: "Pages" },
  ...articles.map((a) => ({ href: `/${a.slug}`, title: a.title, group: "Articles" as const })),
  ...languagePages
    .filter((page) => page.href !== routes.home)
    .map((page) => ({ href: page.href, title: page.label, group: "Languages" as const })),
];
