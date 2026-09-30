import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// Polish menu, footer, WhatsApp and cookie texts (informal "ty", like the Polish page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const pl: ChromeDictionary = {
  lang: "pl",
  skipToContent: "Przejdź do treści",
  nav: {
    label: "Menu główne",
    home: "Strona główna Kinzoku",
    about: "O nas",
    products: "Produkty",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Kontakt",
    quote: "Zapytaj o ofertę",
    language: "Język",
    menu: "Menu",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
  },
  productLinks: [
    { href: routes.nails, label: "Gwoździe zwojowe, zszywki, gwoździe luzem, gwoździe EPAL" },
    { href: routes.wire, label: "Walcówka, drut ciągniony" },
    { href: routes.bars, label: "Wyroby długie: pręty ze stali stopowej i węglowej, pręty ciągnione" },
  ],
  footer: {
    contact: "Kontakt",
    company: "Dane firmy",
    links: "Linki",
    email: "E-mail",
    phone: "Telefon",
    kvk: "KvK",
    vat: "Nr VAT UE",
    linkedin: "LinkedIn",
    about: "O nas",
    jobs: "Oferty pracy",
    privacy: "Polityka prywatności",
    cookies: "Ustawienia plików cookie",
  },
  whatsapp: {
    label: "Napisz do Kinzoku na WhatsApp",
    message: "Dzień dobry, Kinzoku, proszę o ofertę na …",
  },
  cookies: {
    title: "Pliki cookie na tej stronie",
    text: "Używamy niezbędnych plików cookie, aby ta strona działała. Za Twoją zgodą używamy również plików cookie Google Analytics, aby sprawdzić, jak odwiedzający korzystają ze strony. Analityka pozostaje wyłączona, dopóki jej nie zaakceptujesz.",
    policyLink: "Polityka prywatności",
    accept: "Akceptuj",
    reject: "Odrzuć",
    settings: "Ustawienia",
    panelTitle: "Ustawienia plików cookie",
    panelIntro: "Wybierz, których plików cookie możemy używać. Swój wybór możesz w każdej chwili zmienić, klikając „Ustawienia plików cookie” w stopce strony.",
    close: "Zamknij",
    alwaysOn: "Zawsze aktywne",
    necessary: {
      title: "Niezbędne",
      text: "Potrzebne do działania strony, na przykład do zapamiętania Twojego wyboru dotyczącego plików cookie.",
    },
    analytics: {
      title: "Analityka",
      text: "Google Analytics liczy odwiedziny i pokazuje, które strony są używane, abyśmy mogli ulepszać stronę.",
    },
    columns: { name: "Plik cookie", provider: "Dostawca", purpose: "Cel", duration: "Czas przechowywania" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Zapamiętuje Twój wybór dotyczący plików cookie", duration: "12 miesięcy", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Rozróżnia odwiedzających", duration: "2 lata", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Przechowuje stan wizyty", duration: "2 lata", category: "analytics" },
    ],
    rejectAll: "Odrzuć wszystkie",
    save: "Zapisz wybór",
    acceptAll: "Akceptuj wszystkie",
  },
};
