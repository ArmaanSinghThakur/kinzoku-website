import { Clock, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { QuoteEmailButton, QuoteEmailLink } from "@/components/contact/quote-email-button";
import { WhatsAppIcon } from "@/components/layout/whatsapp-button";
import { PageHeader } from "@/components/sections/page-header";
import { buttonStyles } from "@/components/ui/button-styles";
import { Section } from "@/components/ui/section";
import { contactPage as page } from "@/content/pages/contact";
import mapImage from "@/public/images/map-amsterdam.jpg";
import { quoteMailto } from "@/lib/quote-mailto";
import { routes } from "@/lib/routes";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

export default function ContactPage() {
  const { details, hours, map, quote } = page;
  const mail = { email: site.email, subject: quote.email.subject, fields: quote.fields, deliveryOptions: quote.deliveryOptions };

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
        <ol className="grid list-decimal gap-x-10 gap-y-2 pl-6 marker:text-steel md:grid-cols-2">
          {quote.fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">{quote.deliveryOptions.join(" · ")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {/* Pre-built fallback: the same link without a product name, until the page reads ?product=. */}
          <Suspense fallback={<QuoteEmailLink label={quote.email.label} href={quoteMailto(mail)} />}>
            <QuoteEmailButton {...mail} label={quote.email.label} products={quote.products} />
          </Suspense>
          <a
            href={whatsappHref(quote.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: "secondary" })}
          >
            <WhatsAppIcon className="size-5" />
            {quote.whatsapp.label}
          </a>
        </div>
      </Section>
    </>
  );
}
