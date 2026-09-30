import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { es } from "@/content/i18n/es";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the Spanish page: its own <html lang> (from es.lang) and Spanish menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={es}>{children}</LanguageRoot>;
}
