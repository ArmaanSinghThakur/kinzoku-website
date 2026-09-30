import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { de } from "@/content/i18n/de";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the German page: its own <html lang> (from de.lang) and German menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={de}>{children}</LanguageRoot>;
}
