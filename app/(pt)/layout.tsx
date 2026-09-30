import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { pt } from "@/content/i18n/pt";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the Brazilian Portuguese page: its own <html lang> (from pt.lang) and Brazilian Portuguese menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={pt}>{children}</LanguageRoot>;
}
