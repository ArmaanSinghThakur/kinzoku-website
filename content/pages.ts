import { languagePages } from "./languages";
import { routes } from "@/lib/routes";

// Every public page with its title: used by the 404 search now, and by the sitemap and link
// check later. Titles are the live site's link texts (checked 2026-10-01).
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
  { href: "/how-we-work-sourcing-steel-asia-europe", title: "How We Work", group: "Articles" },
  { href: "/low-carbon-steel-wire-for-nail-manufacturing", title: "Drawn Wire for Nail Manufacturing", group: "Articles" },
  {
    href: "/epal-certified-pallet-nails-bulk-common-nails-coil-nails",
    title: "Bulk Common Nails, Coil Nails, Collated Nails & Heavy-Duty Staples",
    group: "Articles",
  },
  {
    href: "/risk-leverage-in-steel-procurement-deferred-cbam-liabilities",
    title: "Risk Leverage in Steel Procurement: Deferred CBAM Liabilities",
    group: "Articles",
  },
  { href: "/cbam-2026-complete-guide-steel-importers", title: "CBAM Guide", group: "Articles" },
  { href: "/steel-import-quota-europe-2026-july-changes-buyers-guide", title: "EU Steel Quota Changes July 2026", group: "Articles" },
  {
    href: "/cbam-default-values-indian-steel-hidden-cost",
    title: "CBAM Default Values for Indian Steel: The Hidden Cost",
    group: "Articles",
  },
  {
    href: "/japanese-wire-rod-europe-sourcing-quality-standards-europe",
    title: "Wire Rod Sourcing from Japan: Quality Standards for European Buyers",
    group: "Articles",
  },
  {
    href: "/steel-sourcing-india-vs-china-cost-quality-compliance",
    title: "Steel Sourcing from India vs. China: Cost, Quality, Compliance",
    group: "Articles",
  },
  ...languagePages
    .filter((page) => page.href !== routes.home)
    .map((page) => ({ href: page.href, title: page.label, group: "Languages" as const })),
];
