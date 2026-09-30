import { routes } from "@/lib/routes";
import { enError } from "./en-error";

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
  notFound: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has moved. Search below, or go to one of these pages.",
    searchLabel: "Search pages",
    searchPlaceholder: "Search, e.g. coil nails or CBAM",
    noResults: "No pages match your search.",
    results: "results",
    home: "Home",
    products: "Products",
    contact: "Contact",
  },
  error: enError,
  // Matches Privacy Policy section 8: banner on site, detailed breakdown via the footer cookie link.
  cookies: {
    title: "Cookies on this website",
    text: "We use strictly necessary cookies to make this website work. With your permission, we also use Google Analytics cookies to see how visitors use the site. Analytics stays off until you accept.",
    policyLink: "Privacy Policy",
    accept: "Accept",
    reject: "Reject",
    settings: "Settings",
    panelTitle: "Cookie settings",
    panelIntro: "Choose which cookies we may use. You can change your choice at any time via “Cookie settings” in the footer.",
    close: "Close",
    alwaysOn: "Always on",
    necessary: {
      title: "Strictly necessary",
      text: "Needed for the website to work, such as remembering your cookie choice.",
    },
    analytics: {
      title: "Analytics",
      text: "Google Analytics counts visits and shows which pages are used, so we can improve the website.",
    },
    columns: { name: "Cookie", provider: "Provider", purpose: "Purpose", duration: "Duration" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Remembers your cookie choice", duration: "12 months", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Distinguishes visitors", duration: "2 years", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Keeps the state of a visit", duration: "2 years", category: "analytics" },
    ],
    rejectAll: "Reject all",
    save: "Save choices",
    acceptAll: "Accept all",
  },
};

export type Dictionary = typeof en;
