import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MissionVisionValues } from "@/components/sections/mission-vision-values";
import { PageHeader } from "@/components/sections/page-header";
import { ProcessStepper } from "@/components/ui/process-stepper";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { about } from "@/content/pages/about";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: routes.about },
};

export default function AboutPage() {
  const { story, network, howWeWork, regions, details } = about;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: about.title, href: routes.about },
        ]}
        title={about.title}
        intro={about.intro}
      />

      <Section title={story.title}>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-4 text-lg">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="rounded-lg border border-line p-6">
            <h3 className="text-lg">{network.title}</h3>
            <p className="mt-3 text-sm">
              <span className="font-semibold text-charcoal">{network.offices.label}:</span> {network.offices.items.join(" | ")}
            </p>
            <p className="mt-2 text-sm text-muted">{network.headquarters}</p>
            <h4 className="mt-5 font-heading text-sm font-semibold text-charcoal">{network.sourcing.label}</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {network.sourcing.items.map((item) => (
                <li key={item.country}>
                  <span className="font-semibold text-charcoal">{item.country}:</span> <span className="text-muted">{item.text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section tone="mist" title={about.mvvTitle}>
        <MissionVisionValues />
      </Section>

      <Section title={howWeWork.title}>
        <ProcessStepper steps={howWeWork.steps} />
        <Link href={howWeWork.moreHref} className="mt-10 inline-flex items-center gap-1 font-heading font-semibold">
          {howWeWork.more}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </Section>

      <Section tone="mist" title={regions.title}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regions.items.map((region) => (
            <div key={region.name} className="rounded-lg bg-white p-6 shadow-card">
              <h3 className="text-lg">{region.name}</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {region.countries.map((country) => (
                  <li key={country}>{country}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={details.title}>
        <dl className="grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr]">
          <dt className="font-semibold text-charcoal">Company</dt>
          <dd>{site.name}</dd>
          <dt className="font-semibold text-charcoal">Address</dt>
          <dd>
            {site.address.locality}, {site.address.country}
          </dd>
          <dt className="font-semibold text-charcoal">KvK</dt>
          <dd>{site.kvk}</dd>
          <dt className="font-semibold text-charcoal">VAT</dt>
          <dd>{site.vat}</dd>
          <dt className="font-semibold text-charcoal">Email</dt>
          <dd>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </dd>
          <dt className="font-semibold text-charcoal">Phone</dt>
          <dd>
            <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
          </dd>
        </dl>
      </Section>

      <QuoteBanner />
    </>
  );
}
