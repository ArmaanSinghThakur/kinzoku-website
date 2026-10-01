import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// Italian menu, footer, WhatsApp and cookie texts (business "voi", like the Italian page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const it: ChromeDictionary = {
  lang: "it",
  skipToContent: "Vai al contenuto",
  nav: {
    label: "Menu principale",
    home: "Home page Kinzoku",
    about: "Chi siamo",
    products: "Prodotti",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contatti",
    quote: "Richiedi un preventivo",
    language: "Lingua",
    menu: "Menu",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
  },
  productLinks: [
    { href: routes.nails, label: "Chiodi in rotolo, graffe, chiodi sfusi, chiodi EPAL" },
    { href: routes.wire, label: "Vergella, filo trafilato" },
    { href: routes.bars, label: "Prodotti lunghi: barre in acciaio legato, al carbonio e trafilate" },
  ],
  footer: {
    contact: "Contatti",
    company: "Dati aziendali",
    links: "Link",
    email: "E-mail",
    phone: "Telefono",
    kvk: "KvK",
    vat: "P. IVA",
    linkedin: "LinkedIn",
    about: "Chi siamo",
    jobs: "Posizioni aperte",
    privacy: "Informativa sulla privacy",
    cookies: "Impostazioni cookie",
    nameMeaning: "Kinzoku (金属) significa «metallo» in giapponese.",
  },
  whatsapp: {
    label: "Scrivete a Kinzoku su WhatsApp",
    message: "Buongiorno Kinzoku, vorrei un preventivo per …",
  },
  cookies: {
    title: "Cookie su questo sito",
    text: "Utilizziamo cookie strettamente necessari per il funzionamento di questo sito. Con il vostro consenso utilizziamo anche i cookie di Google Analytics per capire come i visitatori usano il sito. Le statistiche restano disattivate finché non accettate.",
    policyLink: "Informativa sulla privacy",
    accept: "Accetta",
    reject: "Rifiuta",
    settings: "Impostazioni",
    panelTitle: "Impostazioni cookie",
    panelIntro: "Scegliete quali cookie possiamo utilizzare. Potete modificare la vostra scelta in qualsiasi momento tramite «Impostazioni cookie» nel piè di pagina.",
    close: "Chiudi",
    alwaysOn: "Sempre attivi",
    necessary: {
      title: "Strettamente necessari",
      text: "Indispensabili per il funzionamento del sito, ad esempio per ricordare la vostra scelta sui cookie.",
    },
    analytics: {
      title: "Statistiche",
      text: "Google Analytics conta le visite e mostra quali pagine vengono utilizzate, così possiamo migliorare il sito.",
    },
    columns: { name: "Cookie", provider: "Fornitore", purpose: "Finalità", duration: "Durata" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Ricorda la vostra scelta sui cookie", duration: "12 mesi", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Distingue i visitatori", duration: "2 anni", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Conserva lo stato di una visita", duration: "2 anni", category: "analytics" },
    ],
    rejectAll: "Rifiuta tutti",
    save: "Salva le scelte",
    acceptAll: "Accetta tutti",
  },
};
