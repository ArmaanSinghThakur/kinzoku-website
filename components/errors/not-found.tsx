import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/content/i18n/en";
import { pages } from "@/content/pages";
import { routes } from "@/lib/routes";
import { PageSearch } from "./page-search";

/** Branded "Page not found": search over all pages, plus links to Home, Products and Contact. */
export function NotFound({ dict }: { dict: Dictionary }) {
  const t = dict.notFound;

  return (
    <section data-tone="chalk" className="relative isolate overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="wire-mesh absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_80%_30%,black,transparent_60%)]" />
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="spec-label text-forge">404</p>
          <h1 className="load-rise mt-3 text-title">{t.title}</h1>
          <p className="mt-4 text-lg text-muted">{t.text}</p>
          <div className="mt-8">
            <PageSearch pages={pages} label={t.searchLabel} placeholder={t.searchPlaceholder} noResults={t.noResults} resultsLabel={t.results} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={routes.home} variant="secondary">
              {t.home}
            </ButtonLink>
            <ButtonLink href={routes.products} variant="secondary">
              {t.products}
            </ButtonLink>
            <ButtonLink href={routes.contact}>{t.contact}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
