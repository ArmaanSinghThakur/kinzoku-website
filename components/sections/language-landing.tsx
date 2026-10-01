import { ArrowRight, BadgeCheck, Check, FileCheck2, Factory, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import type { LanguagePage } from "@/content/language-pages/types";
import { productFacts } from "@/content/product-facts";
import { routes } from "@/lib/routes";
import { languageAlternates, openGraph } from "@/lib/seo";

// The four "why" points are the same on every language page, in the same order.
const whyIcons = [BadgeCheck, FileCheck2, Factory, Truck];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

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
  const heroImage = productFacts[routes.nails].image;

  return (
    <>
      <section data-tone="chalk" data-spotlight className="hero-spotlight relative isolate overflow-hidden bg-chalk">
        <div aria-hidden className="hero-glow absolute inset-0 -z-10" />
        <div aria-hidden className="wire-mesh absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div aria-hidden className="wire-mesh hero-mesh-lit absolute inset-0 -z-10" />
        <div className="site-container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <p className="spec-label load-fade text-forge">{page.brand}</p>
            <h1 className="load-rise mt-5 max-w-4xl text-[clamp(2.5rem,1.9rem+1.9vw,3.375rem)] leading-[1.08] tracking-[-0.02em]" style={delay(60)}>
              {page.title}
            </h1>
            <p className="load-fade mt-6 max-w-3xl text-lg text-graphite/80" style={delay(180)}>
              {page.intro}
            </p>
            <div className="load-fade mt-9 flex flex-wrap gap-3" style={delay(260)}>
              <ButtonLink href={page.cta.quoteHref}>{page.cta.quote}</ButtonLink>
              <ButtonLink href="#products" variant="secondary">
                {page.cta.products}
              </ButtonLink>
            </div>
          </div>
          {heroImage && (
            <div
              className="load-unmask relative mx-auto hidden aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-mist shadow-lift lg:block"
              style={delay(120)}
            >
              {/* Illustration only: the products are named in the text beside it. */}
              <Image src={heroImage} alt="" fill priority placeholder="blur" sizes="384px" className="object-cover" />
              <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
                {productFacts[routes.nails].specs.map((spec) => (
                  <li key={spec} className="spec-label rounded-[4px] bg-chalk/90 px-2 py-1 text-graphite shadow-card backdrop-blur-sm">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Section id="products" tone="mist" title={page.products.title} intro={page.products.intro}>
        <div data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {page.products.items.map((item, i) => (
            <article
              key={item.title}
              className="group flex flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
            >
              <p aria-hidden className="spec-label text-forge">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg leading-snug">{item.title}</h3>
              <ul className="mt-4 flex-1 space-y-2 border-t border-line pt-4 text-sm">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-forge" />
                    {bullet}
                  </li>
                ))}
              </ul>
              {item.link && (
                <Link href={item.link.href} className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold">
                  {item.link.label.replace(/\s*→$/, "")}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section title={page.why.title} intro={page.why.intro}>
        <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.why.items.map((item, i) => {
            const Icon = whyIcons[i] ?? BadgeCheck;
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-xl border border-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-lg bg-mist text-forge transition-colors duration-300 group-hover:bg-butter group-hover:text-graphite">
                  <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-lg leading-snug">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-butter transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="sage" title={page.delivery.title}>
        <p data-reveal="fade" className="-mt-4 max-w-3xl font-heading text-xl leading-normal font-medium">
          {page.delivery.text}
        </p>
      </Section>

      <Section title={page.faq.title}>
        <Faq className="max-w-3xl" items={page.faq.items.map((f) => ({ question: f.question, answer: <p>{f.answer}</p> }))} />
      </Section>

      <QuoteBanner title={page.closing.title} text={page.closing.text} cta={page.closing.cta} href={page.closing.href} />
    </>
  );
}
