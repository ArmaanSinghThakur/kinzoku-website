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
      <h4 className="spec-label border-b border-line pb-2 text-forge">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {grades.map((g) => (
          <li key={g.grade}>
            <span className="font-semibold text-graphite">{g.grade}</span> <span className="text-muted">{g.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A small hatched cross-section of the bar profile, like the drawing on the product card. */
function ProfileGlyph({ profile }: { profile: string }) {
  const shape = /hex/i.test(profile) ? (
    <polygon points="24,4 41,14 41,34 24,44 7,34 7,14" />
  ) : /square/i.test(profile) ? (
    <rect x="7" y="7" width="34" height="34" />
  ) : /flat/i.test(profile) ? (
    <rect x="3" y="15" width="42" height="18" />
  ) : (
    <circle cx="24" cy="24" r="19" />
  );
  const hatch = `hatch-${profile.replace(/\W+/g, "-")}`;
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="size-12 shrink-0">
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" className="stroke-forge/50" strokeWidth="1.2" />
        </pattern>
      </defs>
      <g fill={`url(#${hatch})`} className="stroke-forge" strokeWidth="2">
        {shape}
      </g>
      {/bright/i.test(profile) && <circle cx="24" cy="24" r="12" fill="none" className="stroke-forge/40" strokeWidth="1.5" strokeDasharray="3 2" />}
    </svg>
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
        <div data-reveal="stagger" className="space-y-5">
          {barProfiles.map((p) => (
            <article
              key={p.profile}
              className="rounded-xl border border-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-7"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
                <div>
                  <div className="flex items-center gap-4">
                    <ProfileGlyph profile={p.profile} />
                    <h3 className="text-2xl">{p.profile}</h3>
                  </div>
                  <h4 className="sr-only">{barColumns.dimensions}</h4>
                  <dl className="mt-4 space-y-1 text-sm">
                    {p.dimensions.map((d) => (
                      <div key={d.label}>
                        <dt className="inline font-semibold text-graphite">{d.label}:</dt> <dd className="inline text-muted">{d.value}</dd>
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

      <div className="site-container pt-4">
        <KeywordIndex title={page.index.title} paragraphs={page.index.paragraphs} />
      </div>

      <QuoteBanner text={page.bannerText} href={page.quote.href} />
    </>
  );
}
