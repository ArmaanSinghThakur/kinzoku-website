import { Clock, ExternalLink, Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { QuoteForm } from "@/components/contact/quote-form";
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
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl">{site.name}</h2>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="inline font-semibold text-charcoal">{details.email}:</dt>{" "}
                  <dd className="inline">
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-charcoal">{details.phone}:</dt>{" "}
                  <dd className="inline">
                    <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-charcoal">{details.kvk}:</dt> <dd className="inline">{site.kvk}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-charcoal">{details.vat}:</dt> <dd className="inline">{site.vat}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg bg-mist p-5">
              <h2 className="flex items-center gap-2 text-lg">
                <Clock aria-hidden className="size-5 text-steel" />
                {hours.title}
              </h2>
              <p className="mt-2 font-semibold text-charcoal">{hours.value}</p>
              <p className="mt-1 text-muted">{hours.reply}</p>
            </div>
          </div>

          <figure>
            <a href={map.href} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-lg border border-line">
              <Image src={mapImage} alt={map.alt} placeholder="blur" sizes="(min-width: 1024px) 700px, 100vw" className="w-full" />
              <span className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="font-semibold text-charcoal">
                  {site.address.locality}, {site.address.country}
                </span>
                <span className="inline-flex items-center gap-1 text-steel group-hover:underline">
                  {map.open}
                  <ExternalLink aria-hidden className="size-4" />
                </span>
              </span>
            </a>
            <figcaption className="mt-2 text-xs text-muted">
              Map data <a href={map.attributionHref}>{map.attribution}</a>
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id={quote.id} tone="mist" title={quote.title} intro={quote.intro}>
        <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
          <QuoteForm email={site.email} />
          <aside className="rounded-lg border border-line bg-white/60 p-6">
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
