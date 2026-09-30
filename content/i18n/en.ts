import { routes } from "@/lib/routes";

// Shared interface text for header, menus and footer. Language pages (Step 12) get a copy of this
// shape with translated strings, so the Dictionary type keeps every translation complete.
export const en = {
  lang: "en",
  skipToContent: "Skip to content",
  nav: {
    label: "Main",
    home: "Kinzoku home",
    about: "About Us",
    products: "Products",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contact",
    quote: "Request a quote",
    language: "Language",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  productLinks: [
    { href: routes.nails, label: "Coil Nails, Staples, Bulk Nails, EPAL Nails" },
    { href: routes.wire, label: "Wire Rod, Drawn Wires" },
    { href: routes.bars, label: "Long Products: Alloy, Carbon & Bright Bars" },
  ],
  footer: {
    contact: "Contact",
    company: "Company details",
    links: "Links",
    email: "Email",
    phone: "Phone",
    kvk: "KvK",
    vat: "VAT",
    linkedin: "LinkedIn",
    about: "About Us",
    jobs: "Job Openings",
    privacy: "Privacy Policy",
    cookies: "Cookie settings",
  },
  whatsapp: {
    label: "Chat with Kinzoku on WhatsApp",
    message: "Hello Kinzoku, I would like a quote for …",
  },
};

export type Dictionary = typeof en;
