import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { nl } from "@/content/i18n/nl";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the Dutch page: its own <html lang> (from nl.lang) and Dutch menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={nl}>{children}</LanguageRoot>;
}
