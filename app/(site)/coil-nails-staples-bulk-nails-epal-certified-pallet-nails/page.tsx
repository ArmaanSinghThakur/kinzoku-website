import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { KeywordIndex } from "@/components/sections/keyword-index";
import { PageHeader } from "@/components/sections/page-header";
import { CommonValues, SpecList } from "@/components/sections/spec-list";
import { VideoLink } from "@/components/sections/video-link";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { SpecTable } from "@/components/ui/spec-table";
import { Tabs } from "@/components/ui/tabs";
import { coilNailsPage as page } from "@/content/pages/products/coil-nails";
import { bulkNailSizes, coilNailSizes, nailFaq, staplesSeries } from "@/content/pages/products/coil-nails.tables";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

const imageSizes = "(min-width: 1024px) 460px, 100vw";

type TabIntroProps = { image: { src: StaticImageData; alt: string }; title: string; lead?: string; children?: ReactNode };

function TabIntro({ image, title, lead, children }: TabIntroProps) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mist">
        <Image src={image.src} alt={image.alt} fill sizes={imageSizes} placeholder="blur" className="object-cover" />
      </div>
      <div>
        <h2 className="text-3xl">{title}</h2>
        {lead && <p className="mt-3 text-lg text-muted italic">{lead}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

export default function CoilNailsPage() {
  const { coil, staples, bulk, epal } = page.tabs;

  const tabs = [
    {
      value: coil.value,
      label: coil.label,
      content: (
        <div className="space-y-8">
          <TabIntro image={coil.image} title={coil.title} lead={coil.lead}>
            <SpecList specs={coil.specs} />
          </TabIntro>
          <CommonValues label={page.commonLabel} values={coilNailSizes.common} />
          <SpecTable caption={coil.tableCaption} columns={coilNailSizes.columns} rows={coilNailSizes.rows} />
          <VideoLink {...coil.video} />
        </div>
      ),
    },
    {
      value: staples.value,
      label: staples.label,
      content: (
        <div className="space-y-8">
          <TabIntro image={staples.image} title={staples.title}>
            <SpecList specs={staples.specs} />
          </TabIntro>
          <div className="grid gap-6 md:grid-cols-2">
            <p className="rounded-lg bg-mist p-5">
              {staples.packaging.map((line, i) => (
                <span key={line} className={i === 0 ? "block font-semibold text-charcoal" : "block"}>
                  {line}
                </span>
              ))}
            </p>
            <ul className="space-y-2">
              {staples.features.map((feature) => (
                <li key={feature} className="flex gap-2 italic">
                  <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-steel" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {staplesSeries.items.map((series) => (
              <div key={series.series} className="min-w-0 space-y-4 rounded-lg border border-line p-5">
                <h3 className="text-xl">{series.series}</h3>
                <SpecList
                  className="text-sm"
                  specs={[
                    { label: staplesSeries.columns.finishes, value: series.finishes },
                    { label: staplesSeries.columns.crownWidth, value: series.crownWidth },
                    { label: staplesSeries.columns.wireGauge, value: series.wireGauge },
                    { label: staplesSeries.columns.application, value: series.application },
                    { label: staplesSeries.columns.compatibleGuns, value: series.compatibleGuns },
                  ]}
                />
                <SpecTable
                  caption={`${series.series}: ${staplesSeries.columns.code} / ${staplesSeries.columns.legLength}`}
                  columns={[staplesSeries.columns.code, staplesSeries.columns.legLength]}
                  rows={series.sizes}
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      value: bulk.value,
      label: bulk.label,
      content: (
        <div className="space-y-8">
          <TabIntro image={bulk.image} title={bulk.title} lead={bulk.lead}>
            <SpecList specs={bulk.specs} />
          </TabIntro>
          <CommonValues label={page.commonLabel} values={bulkNailSizes.common} />
          <SpecTable caption={bulk.tableCaption} columns={bulkNailSizes.columns} rows={bulkNailSizes.rows} />
        </div>
      ),
    },
    {
      value: epal.value,
      label: epal.label,
      content: (
        <div className="space-y-8">
          <TabIntro image={epal.image} title={epal.title} lead={epal.lead}>
            <h3 className="text-lg">{epal.sizesLabel}</h3>
            <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
              {epal.sizes.map((size) => (
                <li key={size} className="px-4 py-2.5 font-semibold text-charcoal">
                  {size}
                </li>
              ))}
            </ul>
            <SpecList specs={epal.specs} className="mt-6" />
          </TabIntro>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: page.breadcrumb, href: page.canonical },
        ]}
        title={page.title}
        intro={page.intro}
      >
        <ButtonLink href={page.quote.href}>{page.quote.label}</ButtonLink>
      </PageHeader>

      <Section>
        <Tabs label={page.tabsLabel} items={tabs} syncHash />
      </Section>

      <Section tone="mist" title={page.tools.title} intro={page.tools.text}>
        <p className="-mt-6 font-heading text-lg font-semibold text-charcoal">{page.tools.brands}</p>
        <h3 className="mt-10 text-xl">{page.tools.advantagesTitle}</h3>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {page.tools.advantages.map((a) => (
            <li key={a.label} className="rounded-lg bg-white p-5 shadow-card">
              <span className="font-semibold text-charcoal">{a.label}:</span> {a.text}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={page.faqTitle}>
        <div className="grid gap-10 lg:grid-cols-2">
          {nailFaq.map((group) => (
            <div key={group.category}>
              <h3 className="text-lg">{group.category}</h3>
              <Faq
                className="mt-3"
                items={group.items.map((item) => ({ question: item.term, answer: <p>{item.definition}</p> }))}
              />
            </div>
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
