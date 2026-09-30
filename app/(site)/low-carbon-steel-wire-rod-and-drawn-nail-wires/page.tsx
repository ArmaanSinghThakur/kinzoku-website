import { CheckCircle2, Quote } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { ButtonLink } from "@/components/ui/button";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { SpecTable } from "@/components/ui/spec-table";
import { wirePage as page } from "@/content/pages/products/wire";
import { wireChemistry } from "@/content/pages/products/wire.tables";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

export default function WirePage() {
  const { grades, machines, applications, characteristics, keyTopics, astm, reviews } = page;
  const last = wireChemistry.columns.length - 1;
  const chemistry = { columns: wireChemistry.columns.slice(0, last), rows: wireChemistry.rows.map((r) => r.slice(0, last)) };
  const tensile = { label: wireChemistry.columns[last], value: wireChemistry.rows[0][last] };

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

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {page.images.map((image) => (
              <div key={image.alt} className="relative aspect-square overflow-hidden rounded-lg bg-mist">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 290px, 50vw" placeholder="blur" className="object-cover" />
              </div>
            ))}
          </div>
          {/* min-w-0: let this grid column shrink so the table scrolls inside its box on phones. */}
          <div className="min-w-0 space-y-6">
            <ul className="space-y-2">
              {page.sizes.map((size) => (
                <li key={size} className="font-heading text-lg font-semibold text-charcoal">
                  {size}
                </li>
              ))}
            </ul>
            {/* On the live page the tensile value is one cell spanning Min and Max, so it is shown
                once below the table rather than repeated in both rows. */}
            <SpecTable caption={page.chemistryCaption} columns={chemistry.columns} rows={chemistry.rows} />
            <p className="text-sm">
              <span className="font-semibold text-charcoal">{tensile.label}:</span> {tensile.value}
              <span className="block text-muted">{page.chemistryNote}</span>
            </p>
          </div>
        </div>
      </Section>

      <Section id={grades.id} tone="mist" title={grades.title}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg">{grades.gradesLabel}</h3>
            <p className="mt-2">{grades.grades}</p>
          </div>
          <div>
            <h3 className="text-lg">{grades.standardsLabel}</h3>
            <p className="mt-2">{grades.standards}</p>
          </div>
        </div>
        <p className="mt-8 font-heading font-semibold text-charcoal">{grades.packaging}</p>
      </Section>

      <Section id={machines.id} title={machines.title}>
        <div className="max-w-3xl space-y-4 text-lg">
          {machines.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <h3 className="mt-10 text-xl">{machines.compatibilityTitle}</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          {machines.compatibility.map((m) => (
            <div key={m.label} className="rounded-lg border-t-4 border-gold bg-white p-6 shadow-card">
              <h4 className="font-heading font-semibold text-charcoal">{m.label}</h4>
              <p className="mt-2 text-muted">{m.text}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-10 text-xl">{machines.whyTitle}</h3>
        <ul className="mt-4 space-y-3">
          {machines.why.map((w) => (
            <li key={w.label} className="flex gap-3">
              <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-steel" />
              <span>
                <strong className="text-charcoal">{w.label}:</strong> {w.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-heading text-lg font-semibold text-charcoal">
          {machines.closing.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Section>

      <Section tone="mist" title={applications.title} intro={applications.lead}>
        <div className="grid gap-10 lg:grid-cols-3">
          <ul className="space-y-3">
            {applications.items.map((item) => (
              <li key={item.text} className="flex gap-3">
                <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-steel" />
                <span>
                  {item.href ? <Link href={item.href}>{item.text}</Link> : item.text}
                  {item.detail && <span className="block text-sm text-muted">{item.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="text-lg">{characteristics.title}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-steel">
              {characteristics.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg">{keyTopics.title}</h3>
            <ul className="mt-3 space-y-2">
              {keyTopics.items.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="font-semibold">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id={astm.id} title={astm.title}>
        <div className="max-w-3xl space-y-4">
          {astm.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {astm.uses.map((use) => (
            <div key={use.group} className="rounded-lg border border-line p-5">
              <h3 className="text-lg">{use.group}</h3>
              <dl className="mt-3 space-y-3 text-sm">
                {use.items.map((item) => (
                  <div key={item.text}>
                    {item.label && <dt className="font-semibold text-charcoal">{item.label}</dt>}
                    <dd className="text-muted">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="mist" title={reviews.title} intro={reviews.intro}>
        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.quotes.map((q) => (
            <figure key={q.author} className="flex flex-col rounded-lg bg-white p-6 shadow-card">
              <Quote aria-hidden className="size-6 text-gold" />
              <blockquote className="mt-3 flex-1">{q.text}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-steel italic">{q.author}</figcaption>
            </figure>
          ))}
          <div className="rounded-lg bg-charcoal p-6 text-white">
            <p className="font-heading text-xl font-bold">{reviews.next.title}</p>
            {reviews.next.lines.map((line) => (
              <p key={line} className="mt-3 text-white/80 italic">
                {line}
              </p>
            ))}
            <ButtonLink href={page.quote.href} className="mt-6">
              {page.quote.label}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <QuoteBanner text={page.bannerText} href={page.quote.href} />
    </>
  );
}
