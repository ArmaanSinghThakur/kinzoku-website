import type { Metadata } from "next";
import { KeywordIndex } from "@/components/sections/keyword-index";
import { PageHeader } from "@/components/sections/page-header";
import { ButtonLink } from "@/components/ui/button";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { longProductsPage as page } from "@/content/pages/products/long-products";
import { barColumns, barProfiles } from "@/content/pages/products/long-products.tables";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

function GradeList({ title, grades }: { title: string; grades: { grade: string; note: string }[] }) {
  return (
    <div>
      <h4 className="font-heading text-sm font-semibold tracking-wide text-steel uppercase">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm">
        {grades.map((g) => (
          <li key={g.grade}>
            <span className="font-semibold text-charcoal">{g.grade}</span> <span className="text-muted">{g.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The live 5-column table becomes one card per profile, so it fits any screen without sideways
// scrolling (plan: "grades table that fits the screen").
export default function LongProductsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: page.breadcrumb, href: page.canonical },
        ]}
        title={page.title}
        subtitle={page.subtitle}
        intro={page.intro}
      >
        <ButtonLink href={page.quote.href}>{page.quote.label}</ButtonLink>
      </PageHeader>

      <Section title={page.capabilitiesTitle}>
        <div className="space-y-6">
          {barProfiles.map((p) => (
            <article key={p.profile} className="rounded-lg border border-line bg-white p-6 shadow-card">
              <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
                <div>
                  <h3 className="text-2xl">{p.profile}</h3>
                  <h4 className="sr-only">{barColumns.dimensions}</h4>
                  <dl className="mt-3 space-y-1 text-sm">
                    {p.dimensions.map((d) => (
                      <div key={d.label}>
                        <dt className="inline font-semibold text-charcoal">{d.label}:</dt> <dd className="inline text-muted">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <GradeList title={barColumns.carbon} grades={p.carbon} />
                  <GradeList title={barColumns.alloy} grades={p.alloy} />
                  <GradeList title={barColumns.niche} grades={p.niche} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <div className="site-container">
        <KeywordIndex title={page.index.title} paragraphs={page.index.paragraphs} />
      </div>

      <QuoteBanner text={page.bannerText} href={page.quote.href} />
    </>
  );
}
