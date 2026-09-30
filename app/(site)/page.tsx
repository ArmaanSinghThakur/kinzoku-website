import { ArrowRight, FileCheck2, Scale, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MissionVisionValues } from "@/components/sections/mission-vision-values";
import { ButtonLink } from "@/components/ui/button";
import { ProcessStepper } from "@/components/ui/process-stepper";
import { ProductCard } from "@/components/ui/product-card";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { TrustBadge } from "@/components/ui/trust-badge";
import { home } from "@/content/pages/home";
import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/lib/routes";
import { languageAlternates } from "@/lib/seo";
import { organizationJsonLd, serviceJsonLd, storeJsonLd, websiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: { canonical: routes.home, languages: languageAlternates },
};

const badgeIcons = { certificate: FileCheck2, cbam: ShieldCheck, delivery: Truck, quota: Scale };

export default function HomePage() {
  const { hero, badges, products, process, why, about } = home;

  return (
    <>
      <section className="bg-charcoal">
        <div className="site-container py-20 sm:py-28">
          <h1 className="max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">{hero.title}</h1>
          <p className="mt-4 font-heading text-xl font-semibold text-gold sm:text-2xl">{hero.subtitle}</p>
          <p className="mt-6 max-w-2xl text-lg text-white/80">{hero.text}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={routes.quote}>{hero.quote}</ButtonLink>
            <ButtonLink href="#products" variant="secondary-dark">
              {hero.products}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-label={home.badgesLabel} className="border-b border-line">
        <div className="site-container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <TrustBadge key={badge.title} icon={badgeIcons[badge.icon as keyof typeof badgeIcons]} title={badge.title} text={badge.text} />
          ))}
        </div>
      </section>

      <Section id="products" tone="mist" title={products.title}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.items.map((product) => (
            <ProductCard key={product.href} {...product} />
          ))}
        </div>
      </Section>

      <Section title={process.title}>
        <ProcessStepper steps={process.steps} />
      </Section>

      <Section tone="mist" title={why.title} intro={why.lead}>
        <dl className="grid gap-6 md:grid-cols-3">
          {why.facts.map((fact) => (
            <div key={fact.value} className="rounded-lg bg-white p-6 shadow-card">
              <dt className="font-heading text-3xl font-bold text-charcoal">{fact.value}</dt>
              <dd className="mt-2 text-muted">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={about.title}>
        <MissionVisionValues />
        <Link href={routes.about} className="mt-8 inline-flex items-center gap-1 font-heading font-semibold">
          {about.more}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </Section>

      <QuoteBanner />
      <JsonLd data={[organizationJsonLd, websiteJsonLd, storeJsonLd, serviceJsonLd]} />
    </>
  );
}
