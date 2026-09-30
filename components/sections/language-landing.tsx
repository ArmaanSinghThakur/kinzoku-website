import { ArrowRight, BadgeCheck, FileCheck2, Factory, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import type { LanguagePage } from "@/content/language-pages/types";
import { languageAlternates, openGraph } from "@/lib/seo";

// The four "why" points are the same on every language page, in the same order.
const whyIcons = [BadgeCheck, FileCheck2, Factory, Truck];

export function languageMetadata(page: LanguagePage): Metadata {
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `/${page.slug}`,
      // The Africa page is English for another market, not a translation: no hreflang cluster.
      ...(page.lang === "en" ? {} : { languages: languageAlternates }),
    },
    openGraph: openGraph({ locale: page.lang.replace("-", "_") }),
  };
}

/** One of the 8 language landing pages, laid out like the homepage (plan). */
export function LanguageLanding({ page }: { page: LanguagePage }) {
  return (
    <>
      <section className="bg-charcoal">
        <div className="site-container py-20 sm:py-24">
          <p className="font-heading text-sm font-semibold tracking-wider text-gold uppercase">{page.brand}</p>
          <h1 className="mt-4 max-w-4xl text-4xl text-white sm:text-5xl">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-white/80">{page.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={page.cta.quoteHref}>{page.cta.quote}</ButtonLink>
            <ButtonLink href="#products" variant="secondary-dark">
              {page.cta.products}
            </ButtonLink>
          </div>
        </div>
      </section>

      <Section id="products" tone="mist" title={page.products.title} intro={page.products.intro}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {page.products.items.map((item) => (
            <article key={item.title} className="flex flex-col rounded-lg bg-white p-6 shadow-card">
              <h3 className="text-lg">{item.title}</h3>
              <ul className="mt-3 flex-1 list-disc space-y-1.5 pl-5 text-sm marker:text-steel">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {item.link && (
                <Link href={item.link.href} className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-semibold">
                  {item.link.label.replace(/\s*→$/, "")}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section title={page.why.title} intro={page.why.intro}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {page.why.items.map((item, i) => {
            const Icon = whyIcons[i] ?? BadgeCheck;
            return (
              <div key={item.title} className="rounded-lg border-t-4 border-gold bg-white p-6 shadow-card">
                <Icon aria-hidden className="size-6 text-steel" />
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="mist" title={page.delivery.title}>
        <p className="-mt-4 max-w-3xl text-lg">{page.delivery.text}</p>
      </Section>

      <Section title={page.faq.title}>
        <Faq className="max-w-3xl" items={page.faq.items.map((f) => ({ question: f.question, answer: <p>{f.answer}</p> }))} />
      </Section>

      <QuoteBanner title={page.closing.title} text={page.closing.text} cta={page.closing.cta} href={page.closing.href} />
    </>
  );
}
