import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// German menu, footer, WhatsApp and cookie texts (formal "Sie", like the German page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const de: ChromeDictionary = {
  lang: "de",
  skipToContent: "Zum Inhalt springen",
  nav: {
    label: "Hauptmenü",
    home: "Kinzoku Startseite",
    about: "Über uns",
    products: "Produkte",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Kontakt",
    quote: "Angebot anfordern",
    language: "Sprache",
    menu: "Menü",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
  },
  productLinks: [
    { href: routes.nails, label: "Rollnägel, Heftklammern, lose Nägel, EPAL-Nägel" },
    { href: routes.wire, label: "Walzdraht, gezogener Draht" },
    { href: routes.bars, label: "Langprodukte: legierter Stahl, Kohlenstoffstahl & Blankstahl" },
  ],
  footer: {
    contact: "Kontakt",
    company: "Firmendaten",
    links: "Links",
    email: "E-Mail",
    phone: "Telefon",
    kvk: "KvK",
    vat: "USt-IdNr.",
    linkedin: "LinkedIn",
    about: "Über uns",
    jobs: "Stellenangebote",
    privacy: "Datenschutzerklärung",
    cookies: "Cookie-Einstellungen",
  },
  whatsapp: {
    label: "Mit Kinzoku auf WhatsApp schreiben",
    message: "Hallo Kinzoku, ich möchte ein Angebot für …",
  },
  cookies: {
    title: "Cookies auf dieser Website",
    text: "Wir verwenden technisch notwendige Cookies, damit diese Website funktioniert. Mit Ihrer Einwilligung verwenden wir außerdem Cookies von Google Analytics, um zu sehen, wie Besucher die Website nutzen. Analytics bleibt ausgeschaltet, bis Sie zustimmen.",
    policyLink: "Datenschutzerklärung",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    settings: "Einstellungen",
    panelTitle: "Cookie-Einstellungen",
    panelIntro: "Wählen Sie, welche Cookies wir verwenden dürfen. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ in der Fußzeile ändern.",
    close: "Schließen",
    alwaysOn: "Immer aktiv",
    necessary: {
      title: "Technisch notwendig",
      text: "Erforderlich, damit die Website funktioniert, zum Beispiel um Ihre Cookie-Auswahl zu speichern.",
    },
    analytics: {
      title: "Analyse",
      text: "Google Analytics zählt Besuche und zeigt, welche Seiten genutzt werden, damit wir die Website verbessern können.",
    },
    columns: { name: "Cookie", provider: "Anbieter", purpose: "Zweck", duration: "Speicherdauer" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Speichert Ihre Cookie-Auswahl", duration: "12 Monate", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Unterscheidet Besucher", duration: "2 Jahre", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Speichert den Stand eines Besuchs", duration: "2 Jahre", category: "analytics" },
    ],
    rejectAll: "Alle ablehnen",
    save: "Auswahl speichern",
    acceptAll: "Alle akzeptieren",
  },
};
