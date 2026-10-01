import { ArrowRight, Euro, FileCheck2, Scale, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { MissionVisionValues } from "@/components/sections/mission-vision-values";
import { CommonValues, SpecList } from "@/components/sections/spec-list";
import { WireStory } from "@/components/sections/wire-story";
import { WireThread } from "@/components/sections/wire-thread";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { SpecDrawer } from "@/components/ui/spec-drawer";
import { SpecTable } from "@/components/ui/spec-table";
import { TrustBadge } from "@/components/ui/trust-badge";
import { about as aboutPage } from "@/content/pages/about";
import { home } from "@/content/pages/home";
import { coilNailsPage } from "@/content/pages/products/coil-nails";
import { coilNailSizes } from "@/content/pages/products/coil-nails.tables";
import { barColumns, barProfiles } from "@/content/pages/products/long-products.tables";
import { wirePage } from "@/content/pages/products/wire";
import { wireChemistry } from "@/content/pages/products/wire.tables";
import { productFacts } from "@/content/product-facts";
import { routes } from "@/lib/routes";
import { languageAlternates } from "@/lib/seo";
import { organizationJsonLd, serviceJsonLd, storeJsonLd, websiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: { canonical: routes.home, languages: languageAlternates },
};

const badgeIcons = { certificate: FileCheck2, cbam: ShieldCheck, delivery: Truck, quota: Scale };
// Why Kinzoku figures, in content order: CBAM, EN 10204 3.1, EUR.
const factIcons = [ShieldCheck, FileCheck2, Euro];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Tensile strength is one value for both rows, so (as on the wire page) it is shown under the table.
const tensileColumn = wireChemistry.columns.length - 1;
const chemistry = {
  columns: wireChemistry.columns.slice(0, tensileColumn),
  rows: wireChemistry.rows.map((row) => row.slice(0, tensileColumn)),
};

/** Each product's key specification for its "View specs" drawer, from the product pages. */
const specSheets: Record<string, ReactNode> = {
  [routes.nails]: (
    <div className="space-y-6">
      <p className="text-muted">{coilNailsPage.tabs.coil.title}</p>
      <SpecList specs={coilNailsPage.tabs.coil.specs} className="text-[0.9375rem]" />
      <CommonValues label={coilNailsPage.commonLabel} values={coilNailSizes.common} />
    </div>
  ),
  [routes.wire]: (
    <div className="space-y-6">
      <ul className="divide-y divide-line border-y border-line">
        {[...wirePage.sizes, wirePage.grades.packaging].map((line) => (
          <li key={line} className="py-3 font-semibold text-graphite">
            {line}
          </li>
        ))}
      </ul>
      <div>
        <SpecTable caption={wirePage.chemistryCaption} columns={chemistry.columns} rows={chemistry.rows} />
        <p className="mt-2 text-sm">
          <span className="font-semibold text-graphite">{wireChemistry.columns[tensileColumn]}:</span> {wireChemistry.rows[0][tensileColumn]} (
          {wirePage.chemistryNote})
        </p>
      </div>
      <p className="text-sm">
        <span className="font-semibold text-graphite">{wirePage.grades.standardsLabel}</span> {wirePage.grades.standards}
      </p>
    </div>
  ),
  [routes.bars]: (
    <div>
      <p className="spec-label text-forge">{barColumns.dimensions}</p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {barProfiles.map((profile) => (
          <li key={profile.profile} className="py-3">
            <p className="font-heading font-semibold text-graphite">{profile.profile}</p>
            <dl className="mt-1 text-sm">
              {profile.dimensions.map((d) => (
                <div key={d.label}>
                  <dt className="inline text-muted">{d.label}:</dt> <dd className="inline">{d.value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export default function HomePage() {
  const { hero, badges, products, process, why, about, thread } = home;
  // The last two words carry the Butter marker ("Factory Gate").
  const headline = hero.subtitle.split(" ");
  const marked = headline.splice(-2).join(" ");

  return (
    <WireThread start={thread.start} end={thread.end}>
      {/* Hero: short headline, coil photo and the trust strip, over a faint wire mesh that a
          pastel glow lights up around the cursor. */}
      <section data-tone="chalk" data-spotlight className="hero-spotlight relative isolate overflow-hidden bg-chalk">
        <div aria-hidden className="hero-glow absolute inset-0 -z-10" />
        <div aria-hidden className="wire-mesh absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div aria-hidden className="wire-mesh hero-mesh-lit absolute inset-0 -z-10" />

        <div className="site-container grid items-center gap-12 pt-12 pb-14 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:py-14">
          <div>
            <h1>
              <span className="load-rise block font-heading text-lg leading-snug font-semibold text-forge sm:text-xl">{hero.title}</span>
              <span className="load-rise mt-4 block text-display" style={delay(80)}>
                {headline.join(" ")} <span className="headline-mark">{marked}</span>
              </span>
            </h1>
            <p className="load-fade mt-5 max-w-xl text-lg text-graphite/80" style={delay(200)}>
              {hero.text}
            </p>
            <div className="load-fade mt-8 flex flex-wrap gap-3" style={delay(280)}>
              <ButtonLink href={routes.quote}>{hero.quote}</ButtonLink>
              <ButtonLink href="#products" variant="secondary">
                {hero.products}
              </ButtonLink>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="load-unmask relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist shadow-lift sm:aspect-[5/4] lg:aspect-square"
              style={delay(120)}
            >
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 448px, 100vw"
                className="object-cover"
              />
              <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
                {productFacts[routes.nails].specs.map((spec) => (
                  <li key={spec} className="spec-label rounded-[4px] bg-chalk/90 px-2 py-1 text-graphite shadow-card backdrop-blur-sm">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="spec-label mt-3 text-muted">{hero.figure}</figcaption>
          </figure>
        </div>

        {/* Trust strip: the proof points once, in a single line (replaces the feature grid). */}
        <div className="border-t border-line bg-chalk/60 backdrop-blur-sm">
          <ul aria-label={home.badgesLabel} data-reveal="stagger" className="site-container grid gap-x-8 gap-y-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <li key={badge.title}>
                <TrustBadge icon={badgeIcons[badge.icon as keyof typeof badgeIcons]} title={badge.title} text={badge.text} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="products" tone="mist" title={products.title}>
        <div data-reveal="stagger" className="grid gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {products.items.map((product) => (
            <ProductCard
              key={product.href}
              href={product.href}
              title={product.title}
              text={product.text}
              image={product.image}
              specs={productFacts[product.href]?.specs}
              action={
                <SpecDrawer
                  label={products.specs}
                  title={product.title}
                  closeLabel={products.close}
                  actions={
                    <>
                      <ButtonLink href={product.quoteHref} size="sm">
                        {products.quote}
                      </ButtonLink>
                      <ButtonLink href={product.href} variant="secondary" size="sm">
                        {products.productPage}
                        <ArrowRight aria-hidden className="size-4" />
                      </ButtonLink>
                    </>
                  }
                >
                  {specSheets[product.href]}
                </SpecDrawer>
              }
            />
          ))}
        </div>
      </Section>

      <WireStory title={process.title} eyebrow={process.eyebrow} steps={process.steps} />

      <Section title={why.title} intro={why.lead}>
        <dl data-reveal="stagger" className="grid gap-4 md:grid-cols-3">
          {why.facts.map((fact, i) => {
            const Icon = factIcons[i] ?? ShieldCheck;
            return (
              <div
                key={fact.value}
                className="group relative overflow-hidden rounded-xl border border-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-7"
              >
                <dt className="font-heading text-[clamp(2rem,1.55rem+1.4vw,2.75rem)] leading-none font-extrabold tracking-tight text-graphite">
                  <span className="mb-8 grid size-12 place-items-center rounded-lg bg-mist text-forge transition-colors duration-300 group-hover:bg-butter group-hover:text-graphite">
                    <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                  </span>
                  {fact.value}
                </dt>
                <dd className="mt-3 text-muted">{fact.label}</dd>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-butter transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </div>
            );
          })}
        </dl>
      </Section>

      {/* About: the brand story first, then mission, vision and values as tinted panels. */}
      <Section tone="blush" title={about.title}>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-start">
          <div>
            <p data-reveal="fade" className="font-heading text-xl leading-normal font-medium text-graphite sm:text-[1.375rem]">
              {aboutPage.story.paragraphs[0]}
            </p>
            <Link href={routes.about} className="group mt-8 inline-flex items-center gap-1.5 font-heading font-semibold">
              {about.more}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <MissionVisionValues stacked tints={["bg-chalk", "bg-mist", "bg-sage"]} />
        </div>
      </Section>

      <QuoteBanner />
      <JsonLd data={[organizationJsonLd, websiteJsonLd, storeJsonLd, serviceJsonLd]} />
    </WireThread>
  );
}
