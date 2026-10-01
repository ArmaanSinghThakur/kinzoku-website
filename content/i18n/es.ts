import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// Spanish menu, footer, WhatsApp and cookie texts ("usted" and "cotización", like the Spanish page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const es: ChromeDictionary = {
  lang: "es",
  skipToContent: "Ir al contenido",
  nav: {
    label: "Menú principal",
    home: "Inicio de Kinzoku",
    about: "Quiénes somos",
    products: "Productos",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contacto",
    quote: "Solicitar cotización",
    language: "Idioma",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  productLinks: [
    { href: routes.nails, label: "Clavos en rollo, grapas, clavos a granel, clavos EPAL" },
    { href: routes.wire, label: "Alambrón, alambre trefilado" },
    { href: routes.bars, label: "Productos largos: barras aleadas, al carbono y calibradas" },
  ],
  footer: {
    contact: "Contacto",
    company: "Datos de la empresa",
    links: "Enlaces",
    email: "Correo electrónico",
    phone: "Teléfono",
    kvk: "KvK",
    vat: "NIF-IVA",
    linkedin: "LinkedIn",
    about: "Quiénes somos",
    jobs: "Empleo",
    privacy: "Política de privacidad",
    cookies: "Configuración de cookies",
    nameMeaning: "Kinzoku (金属) significa «metal» en japonés.",
  },
  whatsapp: {
    label: "Escribir a Kinzoku por WhatsApp",
    message: "Hola Kinzoku, quisiera una cotización para …",
  },
  cookies: {
    title: "Cookies en este sitio web",
    text: "Utilizamos cookies estrictamente necesarias para que este sitio web funcione. Con su permiso, también utilizamos cookies de Google Analytics para ver cómo los visitantes usan el sitio. La analítica permanece desactivada hasta que usted acepte.",
    policyLink: "Política de privacidad",
    accept: "Aceptar",
    reject: "Rechazar",
    settings: "Configuración",
    panelTitle: "Configuración de cookies",
    panelIntro: "Elija qué cookies podemos utilizar. Puede cambiar su elección en cualquier momento en «Configuración de cookies», en el pie de página.",
    close: "Cerrar",
    alwaysOn: "Siempre activas",
    necessary: {
      title: "Estrictamente necesarias",
      text: "Necesarias para que el sitio web funcione, por ejemplo para recordar su elección de cookies.",
    },
    analytics: {
      title: "Analítica",
      text: "Google Analytics cuenta las visitas y muestra qué páginas se utilizan, para que podamos mejorar el sitio web.",
    },
    columns: { name: "Cookie", provider: "Proveedor", purpose: "Finalidad", duration: "Duración" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Recuerda su elección de cookies", duration: "12 meses", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Distingue a los visitantes", duration: "2 años", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Guarda el estado de una visita", duration: "2 años", category: "analytics" },
    ],
    rejectAll: "Rechazar todas",
    save: "Guardar selección",
    acceptAll: "Aceptar todas",
  },
};
