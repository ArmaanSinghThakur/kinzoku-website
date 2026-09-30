import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// French menu, footer, WhatsApp and cookie texts ("vous", like the French page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const fr: ChromeDictionary = {
  lang: "fr",
  skipToContent: "Aller au contenu",
  nav: {
    label: "Menu principal",
    home: "Accueil Kinzoku",
    about: "À propos",
    products: "Produits",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contact",
    quote: "Demander un devis",
    language: "Langue",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  productLinks: [
    { href: routes.nails, label: "Clous en rouleau, agrafes, clous en vrac, clous EPAL" },
    { href: routes.wire, label: "Fil machine, fil tréfilé" },
    { href: routes.bars, label: "Produits longs : barres en acier allié, au carbone et étirées" },
  ],
  footer: {
    contact: "Contact",
    company: "Informations société",
    links: "Liens",
    email: "E-mail",
    phone: "Téléphone",
    kvk: "KvK",
    vat: "N° TVA",
    linkedin: "LinkedIn",
    about: "À propos",
    jobs: "Offres d'emploi",
    privacy: "Politique de confidentialité",
    cookies: "Paramètres des cookies",
  },
  whatsapp: {
    label: "Écrire à Kinzoku sur WhatsApp",
    message: "Bonjour Kinzoku, je souhaite un devis pour …",
  },
  cookies: {
    title: "Cookies sur ce site",
    text: "Nous utilisons des cookies strictement nécessaires au fonctionnement de ce site. Avec votre accord, nous utilisons également des cookies Google Analytics pour comprendre comment les visiteurs utilisent le site. Les statistiques restent désactivées tant que vous n'avez pas accepté.",
    policyLink: "Politique de confidentialité",
    accept: "Accepter",
    reject: "Refuser",
    settings: "Paramètres",
    panelTitle: "Paramètres des cookies",
    panelIntro: "Choisissez les cookies que nous pouvons utiliser. Vous pouvez modifier votre choix à tout moment via « Paramètres des cookies » en bas de page.",
    close: "Fermer",
    alwaysOn: "Toujours actifs",
    necessary: {
      title: "Strictement nécessaires",
      text: "Indispensables au fonctionnement du site, par exemple pour mémoriser votre choix en matière de cookies.",
    },
    analytics: {
      title: "Statistiques",
      text: "Google Analytics compte les visites et indique quelles pages sont consultées, afin que nous puissions améliorer le site.",
    },
    columns: { name: "Cookie", provider: "Fournisseur", purpose: "Finalité", duration: "Durée" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Mémorise votre choix en matière de cookies", duration: "12 mois", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Distingue les visiteurs", duration: "2 ans", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Conserve l'état d'une visite", duration: "2 ans", category: "analytics" },
    ],
    rejectAll: "Tout refuser",
    save: "Enregistrer mes choix",
    acceptAll: "Tout accepter",
  },
};
