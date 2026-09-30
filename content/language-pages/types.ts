// Shape of the 8 language landing pages (all built from the same live template).
export type LanguagePage = {
  code: string;
  /** Value for <html lang>, e.g. "de", "pt-BR". */
  lang: string;
  slug: string;
  meta: { title: string; description: string };
  brand: string;
  title: string;
  intro: string;
  cta: { quote: string; products: string; quoteHref: string };
  products: { title: string; intro: string; items: { title: string; bullets: string[]; link: { label: string; href: string } | null }[] };
  why: { title: string; intro: string; items: { title: string; text: string }[] };
  delivery: { title: string; text: string };
  faq: { title: string; items: { question: string; answer: string }[] };
  closing: { title: string; text: string; cta: string; href: string };
};
