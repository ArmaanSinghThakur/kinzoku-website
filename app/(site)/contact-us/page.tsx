import { Clock, ExternalLink, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { QuoteForm } from "@/components/contact/quote-form";
import { SalesOnline } from "@/components/contact/sales-online";
import { WhatsAppIcon } from "@/components/layout/whatsapp-button";
import { PageHeader } from "@/components/sections/page-header";
import { buttonStyles } from "@/components/ui/button-styles";
import { Section } from "@/components/ui/section";
import { contactPage as page } from "@/content/pages/contact";
import mapImage from "@/public/images/map-amsterdam.jpg";
import { routes } from "@/lib/routes";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

export default function ContactPage() {
  const { details, hours, map, quote } = page;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: page.title, href: page.canonical },
        ]}
        title={page.title}
        intro={page.intro}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h2 className="text-2xl">{site.name}</h2>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                <div className="flex flex-wrap items-center gap-x-2 py-2.5">
                  <dt className="flex items-center gap-2 font-semibold text-graphite">
                    <Mail aria-hidden className="size-4 text-forge" />
                    {details.email}:
                  </dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 py-2.5">
                  <dt className="flex items-center gap-2 font-semibold text-graphite">
                    <Phone aria-hidden className="size-4 text-forge" />
                    {details.phone}:
                  </dt>
                  <dd>
                    <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2 py-2.5">
                  <dt className="spec-label pt-0.5 text-muted">{details.kvk}:</dt> <dd className="font-mono">{site.kvk}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2 py-2.5">
                  <dt className="spec-label pt-0.5 text-muted">{details.vat}:</dt> <dd className="font-mono">{site.vat}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl bg-sage p-6">
              <h2 className="flex items-center gap-2 text-lg">
                <Clock aria-hidden className="size-5 text-forge" />
                {hours.title}
              </h2>
              <p className="mt-2 font-semibold text-graphite">{hours.value}</p>
              <p className="mt-1 text-muted">{hours.reply}</p>
              <SalesOnline label={hours.online} />
            </div>
          </div>

          <figure>
            <a
              href={map.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-lift"
            >
              <span data-reveal="unmask" className="block overflow-hidden">
                <Image src={mapImage} alt={map.alt} placeholder="blur" sizes="(min-width: 1024px) 700px, 100vw" className="w-full" />
              </span>
              <span className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="font-semibold text-graphite">
                  {site.address.locality}, {site.address.country}
                </span>
                <span className="inline-flex items-center gap-1 text-forge group-hover:underline">
                  {map.open}
                  <ExternalLink aria-hidden className="size-4" />
                </span>
              </span>
            </a>
            <figcaption className="mt-2 text-sm text-muted">
              Map data <a href={map.attributionHref}>{map.attribution}</a>
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id={quote.id} tone="mist" title={quote.title} intro={quote.intro}>
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
          <QuoteForm email={site.email} />
          <aside className="rounded-xl bg-blush p-6 lg:sticky lg:top-24">
            <h3 className="text-lg">{quote.other.title}</h3>
            <p className="mt-2 text-muted">{quote.other.text}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(quote.other.email.subject)}`}
                className={buttonStyles({ variant: "secondary" })}
              >
                <Mail aria-hidden className="size-5" />
                {quote.other.email.label}
              </a>
              <a
                href={whatsappHref(quote.other.whatsapp.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "secondary" })}
              >
                <WhatsAppIcon className="size-5" />
                {quote.other.whatsapp.label}
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
