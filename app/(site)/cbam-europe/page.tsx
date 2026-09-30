import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CbamCalculator } from "@/components/cbam/cbam-calculator";
import { KeywordIndex } from "@/components/sections/keyword-index";
import { PageHeader } from "@/components/sections/page-header";
import { ButtonLink } from "@/components/ui/button";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { SectionBoundary } from "@/components/ui/section-boundary";
import { cbamPage as page } from "@/content/pages/cbam";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

export default function CbamPage() {
  const { problem, solution, calculator, related } = page;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: page.title, href: page.canonical },
        ]}
        title={page.title}
        subtitle={page.subtitle}
        intro={page.intro}
      >
        <ButtonLink href={page.advisory.href}>{page.advisory.label}</ButtonLink>
        <ButtonLink href={page.calculatorLink.href} variant="secondary">
          {page.calculatorLink.label}
        </ButtonLink>
      </PageHeader>

      <Section title={problem.title}>
        <div className="grid gap-6 lg:grid-cols-3">
          {problem.items.map((item) => (
            <div key={item.title} className="rounded-lg border-t-4 border-gold bg-white p-6 shadow-card">
              <h3 className="text-lg">{item.title}</h3>
              <p className="mt-2 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="mist" title={solution.title}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h3 className="text-xl">{solution.allocation.title}</h3>
            <p className="mt-2 font-semibold text-steel">{solution.allocation.lead}</p>
            <ul className="mt-4 space-y-3">
              {solution.allocation.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-steel" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h3 className="text-xl">{solution.advisory.title}</h3>
            {solution.advisory.paragraphs.map((p) => (
              <p key={p} className="mt-2">
                {p}
              </p>
            ))}
            <ul className="mt-4 space-y-3">
              {solution.advisory.points.map((point) => (
                <li key={point.label} className="flex gap-3">
                  <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-steel" />
                  <span>
                    <strong className="text-charcoal">{point.label}:</strong> {point.text}
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href={page.advisory.href} className="mt-6">
              {page.advisory.label}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section id={calculator.id} title={calculator.title} intro={calculator.subtitle}>
        <SectionBoundary>
          <CbamCalculator t={calculator} />
        </SectionBoundary>
      </Section>

      <Section tone="mist" title={related.title}>
        <ul className="grid gap-6 md:grid-cols-3">
          {related.items.map((article) => (
            <li key={article.href} className="group relative flex flex-col rounded-lg bg-white p-6 shadow-card">
              <h3 className="flex-1 text-lg">
                <Link href={article.href} className="text-charcoal no-underline after:absolute after:inset-0 group-hover:text-steel">
                  {article.title}
                </Link>
              </h3>
              <span aria-hidden className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-semibold text-steel">
                {related.readMore}
                <ArrowRight className="size-4" />
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <div className="site-container pt-16">
        <KeywordIndex title={page.index.title} paragraphs={page.index.paragraphs} />
      </div>

      <QuoteBanner text={page.bannerText} href={page.advisory.href} />
    </>
  );
}
