import { routes } from "@/lib/routes";
import type { ChromeDictionary } from "./en";

// Brazilian Portuguese menu, footer, WhatsApp and cookie texts ("você", like the Portuguese page).
// Translated during the rebuild; to be confirmed by a native speaker at Kinzoku before launch.
export const pt: ChromeDictionary = {
  lang: "pt-BR",
  skipToContent: "Pular para o conteúdo",
  nav: {
    label: "Menu principal",
    home: "Página inicial da Kinzoku",
    about: "Sobre nós",
    products: "Produtos",
    cbam: "CBAM",
    blog: "Blog",
    contact: "Contato",
    quote: "Solicitar cotação",
    language: "Idioma",
    menu: "Menu",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
  productLinks: [
    { href: routes.nails, label: "Pregos em rolo, grampos, pregos a granel, pregos EPAL" },
    { href: routes.wire, label: "Fio-máquina, arame trefilado" },
    { href: routes.bars, label: "Produtos longos: barras de aço-liga, aço carbono e trefiladas" },
  ],
  footer: {
    contact: "Contato",
    company: "Dados da empresa",
    links: "Links",
    email: "E-mail",
    phone: "Telefone",
    kvk: "KvK",
    vat: "Nº IVA (UE)",
    linkedin: "LinkedIn",
    about: "Sobre nós",
    jobs: "Vagas",
    privacy: "Política de Privacidade",
    cookies: "Configurações de cookies",
    nameMeaning: "Kinzoku (金属) significa “metal” em japonês.",
  },
  whatsapp: {
    label: "Falar com a Kinzoku no WhatsApp",
    message: "Olá Kinzoku, gostaria de uma cotação para …",
  },
  cookies: {
    title: "Cookies neste site",
    text: "Usamos cookies estritamente necessários para o funcionamento deste site. Com a sua permissão, também usamos cookies do Google Analytics para ver como os visitantes usam o site. A análise fica desativada até que você aceite.",
    policyLink: "Política de Privacidade",
    accept: "Aceitar",
    reject: "Recusar",
    settings: "Configurações",
    panelTitle: "Configurações de cookies",
    panelIntro: "Escolha quais cookies podemos usar. Você pode alterar sua escolha a qualquer momento em “Configurações de cookies”, no rodapé.",
    close: "Fechar",
    alwaysOn: "Sempre ativos",
    necessary: {
      title: "Estritamente necessários",
      text: "Necessários para o funcionamento do site, por exemplo para lembrar a sua escolha de cookies.",
    },
    analytics: {
      title: "Análise",
      text: "O Google Analytics conta as visitas e mostra quais páginas são usadas, para que possamos melhorar o site.",
    },
    columns: { name: "Cookie", provider: "Fornecedor", purpose: "Finalidade", duration: "Duração" },
    list: [
      { name: "kz_consent", provider: "Kinzoku", purpose: "Lembra a sua escolha de cookies", duration: "12 meses", category: "necessary" },
      { name: "_ga", provider: "Google", purpose: "Distingue os visitantes", duration: "2 anos", category: "analytics" },
      { name: "_ga_<ID>", provider: "Google", purpose: "Mantém o estado de uma visita", duration: "2 anos", category: "analytics" },
    ],
    rejectAll: "Recusar todos",
    save: "Salvar escolhas",
    acceptAll: "Aceitar todos",
  },
};
