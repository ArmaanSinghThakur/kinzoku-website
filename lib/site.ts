// Single source for company facts, so the phone number and IDs are written once and used everywhere
// (header, footer, contact page, structured data). Checked against kinzokutrade.com on 2026-10-01.
export const site = {
  name: "Kinzoku Consultancy & Trade",
  shortName: "Kinzoku",
  url: "https://www.kinzokutrade.com",
  email: "info@kinzokutrade.com",
  phone: {
    display: "+31 6 82 55 91 86",
    /** E.164 format for tel: links and structured data. */
    e164: "+31682559186",
  },
  /** WhatsApp number in wa.me format (country code, no plus). */
  whatsapp: "31682559186",
  address: {
    locality: "Amsterdam",
    region: "North Holland",
    country: "Netherlands",
    countryCode: "NL",
  },
  kvk: "42042968",
  vat: "NL005451507B80",
  linkedin: "https://www.linkedin.com/company/kinzokutrade/",
  /**
   * Google Analytics 4 ID, the only place it is set. Comes from the environment so staging and
   * local builds send nothing; production sets NEXT_PUBLIC_GA_ID=G-J0XSVBKVJ9 (see .env.example).
   */
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
} as const;

/** WhatsApp chat link with a pre-filled message. A plain link: no WhatsApp code runs on the site. */
export function whatsappHref(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
