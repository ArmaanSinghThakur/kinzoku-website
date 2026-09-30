import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { it } from "@/content/i18n/it";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the Italian page: its own <html lang> (from it.lang) and Italian menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={it}>{children}</LanguageRoot>;
}
