import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/content/i18n/en";
import { pages } from "@/content/pages";
import { routes } from "@/lib/routes";
import { PageSearch } from "./page-search";

/** Branded "Page not found": search over all pages, plus links to Home, Products and Contact. */
export function NotFound({ dict }: { dict: Dictionary }) {
  const t = dict.notFound;

  return (
    <section className="py-20 sm:py-28">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-semibold tracking-wider text-steel uppercase">404</p>
          <h1 className="mt-2 text-4xl">{t.title}</h1>
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
