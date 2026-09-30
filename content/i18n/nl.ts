import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// Dutch menu, footer, WhatsApp and cookie texts (formal "u", like the Dutch page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const nl: ChromeDictionary = {
  lang: "nl",
  skipToContent: "Naar de inhoud",
  nav: {
    label: "Hoofdmenu",
    home: "Kinzoku startpagina",
    about: "Over ons",
    products: "Producten",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contact",
    quote: "Offerte aanvragen",
    language: "Taal",
    menu: "Menu",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
  },
  productLinks: [
    { href: routes.nails, label: "Coilnagels, nieten, losse spijkers, EPAL-nagels" },
    { href: routes.wire, label: "Walsdraad, getrokken draad" },
    { href: routes.bars, label: "Langproducten: gelegeerd staal, koolstofstaal en blankstaal" },
  ],
  footer: {
    contact: "Contact",
    company: "Bedrijfsgegevens",
    links: "Links",
    email: "E-mail",
    phone: "Telefoon",
    kvk: "KvK",
    vat: "Btw-nr.",
    linkedin: "LinkedIn",
    about: "Over ons",
    jobs: "Vacatures",
    privacy: "Privacybeleid",
    cookies: "Cookie-instellingen",
  },
  whatsapp: {
    label: "Stuur Kinzoku een WhatsApp-bericht",
    message: "Hallo Kinzoku, ik wil graag een offerte voor …",
  },
  cookies: {
    title: "Cookies op deze website",
    text: "Wij gebruiken strikt noodzakelijke cookies om deze website te laten werken. Met uw toestemming gebruiken wij ook cookies van Google Analytics om te zien hoe bezoekers de site gebruiken. Analytics blijft uit totdat u akkoord geeft.",
    policyLink: "Privacybeleid",
    accept: "Accepteren",
    reject: "Weigeren",
    settings: "Instellingen",
    panelTitle: "Cookie-instellingen",
    panelIntro: "Kies welke cookies wij mogen gebruiken. U kunt uw keuze altijd wijzigen via ‘Cookie-instellingen’ onderaan de pagina.",
    close: "Sluiten",
    alwaysOn: "Altijd actief",
    necessary: {
      title: "Strikt noodzakelijk",
      text: "Nodig om de website te laten werken, bijvoorbeeld om uw cookiekeuze te onthouden.",
    },
    analytics: {
      title: "Analyse",
      text: "Google Analytics telt bezoeken en laat zien welke pagina's worden gebruikt, zodat wij de website kunnen verbeteren.",
    },
    columns: { name: "Cookie", provider: "Aanbieder", purpose: "Doel", duration: "Bewaartermijn" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Onthoudt uw cookiekeuze", duration: "12 maanden", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Onderscheidt bezoekers", duration: "2 jaar", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Bewaart de status van een bezoek", duration: "2 jaar", category: "analytics" },
    ],
    rejectAll: "Alles weigeren",
    save: "Keuze opslaan",
    acceptAll: "Alles accepteren",
  },
};
