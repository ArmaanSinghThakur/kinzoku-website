import { routes } from "@/lib/routes";

// Text from content/_source/contact-us.md. Company details come from lib/site.ts (one phone number;
// "BANK: ING" removed from public pages per the plan). Office hours are from the live structured
// data; the reply time is from the How We Work article. The quote checklist is the live Google
// Form "Request a Quote" (content/_source/_google-forms.json), used until Step 15 builds the form.
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
    intro: "Send us your request by email or WhatsApp and include:",
    fields: [
      "Company Legal Name",
      "Name",
      "Email",
      "Delivery Postcode / Country",
      "WhatsApp / Phone Number (+ ISD Phone Number)",
      "Required Grade (e.g., 42CrMo4, 1.8509, SAE 1006)",
      "Total Quantity (eg: 23 Tons)",
      "Specific Dimensions, Tolerances and Length",
      "Target Price per Metric Ton (EUR / USD)",
      "Required Delivery Window / Lead Time Expectation",
    ],
    deliveryOptions: [
      "Immediate Spot Allocation (Subject to current stock/port availability)",
      "Within 30–60 Days",
      "Within 90–120 Days (Future Mill Rolling Program Allocation)",
    ],
    email: { label: "Email your request", subject: "Request a Quote" },
    whatsapp: { label: "Send on WhatsApp", message: "Hello Kinzoku, I would like a quote for …" },
    // Product names for links like /contact-us?product=wire#quote from the product pages.
    products: {
      nails: "Coil Nails, Staples, Bulk Nails, EPAL Nails",
      wire: "Nail Wire & Wire Rod",
      bars: "Long Products (Bars)",
      cbam: "CBAM advisory",
    } as Record<string, string>,
  },
  canonical: routes.contact,
};
