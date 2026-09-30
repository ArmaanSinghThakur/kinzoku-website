import type { ReactNode } from "react";
import { LanguageRoot } from "@/components/layout/language-root";
import { pl } from "@/content/i18n/pl";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the Polish page: its own <html lang> (from pl.lang) and Polish menu, footer and cookie banner.
export default function Layout({ children }: { children: ReactNode }) {
  return <LanguageRoot dict={pl}>{children}</LanguageRoot>;
}
