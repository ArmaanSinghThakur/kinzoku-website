import { routes } from "@/lib/routes";

// Text from content/_source/contact-us.md. Company details come from lib/site.ts (one phone number;
// "BANK: ING" removed from public pages per the plan). Office hours are from the live structured
// data; the reply time is from the How We Work article. The quote form (Step 15) has its own
// text in content/quote-form.ts.
export const contactPage = {
  meta: {
    title: "Contact Us for a Sales Quote — Coil Nails & Nail Wire",
    description:
      "Request a quote. Contact us with your requirement specification for Coil Nails, Nail Wire, Staples, Steel Round Bars. CIF/DAP/DDP to Europe, Latin America & Africa.",
  },
  title: "Contact us",
  intro: "We appreciate your interest and look forward to hearing from you.",
  details: { email: "Email", phone: "Phone", whatsapp: "WhatsApp", kvk: "KvK", vat: "VAT" },
  hours: {
    title: "Office hours",
    value: "Monday–Friday, 09:00–18:00",
    reply: "We return a preliminary assessment and transparent quote within 48 hours.",
  },
  map: {
    alt: "Map of Amsterdam, Netherlands, where Kinzoku Consultancy & Trade is based",
    href: "https://www.google.com/maps/search/?api=1&query=Amsterdam%2C%20Netherlands",
    open: "Open in Google Maps",
    attribution: "© OpenStreetMap contributors",
    attributionHref: "https://www.openstreetmap.org/copyright",
  },
  quote: {
    id: "quote",
    title: "Request a Quote",
    intro: "Tell us what you need, and attach drawings or specifications if you have them.",
    other: {
      title: "Prefer email or WhatsApp?",
      text: "Send us the same details, and any drawings, directly.",
      email: { label: "Email us", subject: "Request a Quote" },
      whatsapp: { label: "Send on WhatsApp", message: "Hello Kinzoku, I would like a quote for …" },
    },
  },
  canonical: routes.contact,
};
