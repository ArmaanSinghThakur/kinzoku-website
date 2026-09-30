import type { ArticleMeta } from "@/content/blog/articles.generated";
import { structuredData as sd } from "@/content/structured-data";
import { site } from "./site";

// Structured data (schema.org JSON-LD) for Google, ported from the live site. Contact details come
// from lib/site.ts, so the phone number is written once (the live data had a wrong one).
const orgId = `${site.url}/#organization`;
const logo = `${site.url}/brand/kinzoku-logo-512.png`;
const image = `${site.url}/brand/kinzoku-share.jpg`;
const address = {
  "@type": "PostalAddress",
  addressLocality: site.address.locality,
  addressRegion: sd.organization.addressRegion,
  addressCountry: site.address.countryCode,
};
const context = "https://schema.org";

export const organizationJsonLd = {
  "@context": context,
  "@type": "Organization",
  "@id": orgId,
  name: site.name,
  alternateName: sd.organization.alternateName,
  url: site.url,
  logo,
  description: sd.organization.description,
  email: site.email,
  telephone: site.phone.e164,
  address,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.phone.e164,
      email: site.email,
      contactType: sd.organization.contactType,
      availableLanguage: sd.organization.availableLanguage,
      areaServed: sd.organization.areaServed,
    },
  ],
  sameAs: [site.linkedin],
  vatID: site.vat,
  identifier: { "@type": "PropertyValue", name: "KvK", value: site.kvk },
};

export const websiteJsonLd = {
  "@context": context,
  "@type": "WebSite",
  name: sd.website.name,
  url: site.url,
  description: sd.website.description,
  inLanguage: sd.website.inLanguage,
  keywords: sd.website.keywords,
  image,
  publisher: { "@id": orgId },
};

export const storeJsonLd = {
  "@context": context,
  "@type": "WholesaleStore",
  name: site.name,
  image,
  url: site.url,
  telephone: site.phone.e164,
  email: site.email,
  address,
  ...sd.store,
};

export const serviceJsonLd = {
  "@context": context,
  "@type": "Service",
  serviceType: sd.service.serviceType,
  provider: { "@type": "Organization", "@id": orgId, name: site.name, url: site.url },
  areaServed: sd.service.areaServed,
  hasOfferCatalog: sd.service.hasOfferCatalog,
};

export function articleJsonLd(article: ArticleMeta) {
  const url = `${site.url}/${article.slug}`;
  return {
    "@context": context,
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    image,
    author: { "@type": "Organization", "@id": orgId, name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: logo } },
    // Publication dates are added once Kinzoku supplies them (decision before Step 11).
    ...(article.date ? { datePublished: article.date } : {}),
  };
}
