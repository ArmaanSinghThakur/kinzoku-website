import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { fr } from "@/content/i18n/fr";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the French page: its own <html lang> (from fr.lang) and French menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={fr}>{children}</LanguageRoot>;
}
