import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus BreadcrumbList structured data for Google. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.href, site.url).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {items.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="size-4" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {crumb.name}
              </span>
            ) : (
              <Link href={crumb.href} className="text-muted hover:text-steel">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
