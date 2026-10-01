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
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
          <div className="space-y-5">
            {story.paragraphs.map((paragraph, i) => (
              <p key={paragraph} data-reveal="fade" className={i === 0 ? "font-heading text-xl leading-normal font-medium sm:text-[1.375rem]" : "text-lg text-muted"}>
                {paragraph}
              </p>
            ))}
          </div>
          <aside className="rounded-xl bg-blush p-6 sm:p-7">
            <h3 className="text-lg">{network.title}</h3>
            <p className="mt-4 text-sm">
              <span className="font-semibold text-graphite">{network.offices.label}:</span>{" "}
              <span className="spec-label">{network.offices.items.join(" | ")}</span>
            </p>
            <p className="mt-2 text-sm text-graphite/80">{network.headquarters}</p>
            <h4 className="spec-label mt-6 border-b border-line pb-2 text-forge">{network.sourcing.label}</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {network.sourcing.items.map((item) => (
                <li key={item.country}>
                  <span className="font-semibold text-graphite">{item.country}:</span> <span className="text-graphite/80">{item.text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section tone="blush" title={about.mvvTitle}>
        <MissionVisionValues tints={["bg-chalk", "bg-mist", "bg-sage"]} />
      </Section>

      <Section tone="sage" title={howWeWork.title}>
        <ProcessStepper steps={howWeWork.steps} />
        <Link href={howWeWork.moreHref} className="group mt-10 inline-flex items-center gap-1.5 font-heading font-semibold">
          {howWeWork.more}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Section>

      <Section title={regions.title}>
        <div data-reveal="stagger" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regions.items.map((region) => (
            <div key={region.name} className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h3 className="flex items-baseline justify-between gap-2 text-lg">
                {region.name}
                <span aria-hidden className="spec-label text-forge">
                  {String(region.countries.length).padStart(2, "0")}
                </span>
              </h3>
              <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-muted">
                {region.countries.map((country) => (
                  <li key={country}>{country}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="mist" title={details.title}>
        <dl className="grid max-w-3xl gap-x-8 gap-y-3 rounded-xl border border-line bg-white p-6 shadow-card sm:grid-cols-[auto_1fr] sm:p-8">
          <dt className="font-semibold text-graphite">Company</dt>
          <dd>{site.name}</dd>
          <dt className="font-semibold text-graphite">Address</dt>
          <dd>
            {site.address.locality}, {site.address.country}
          </dd>
          <dt className="font-semibold text-graphite">KvK</dt>
          <dd>{site.kvk}</dd>
          <dt className="font-semibold text-graphite">VAT</dt>
          <dd>{site.vat}</dd>
          <dt className="font-semibold text-graphite">Email</dt>
          <dd>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </dd>
          <dt className="font-semibold text-graphite">Phone</dt>
          <dd>
            <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
          </dd>
        </dl>
      </Section>

      <QuoteBanner />
    </>
  );
}
