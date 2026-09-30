import type { ReactNode } from "react";
import type { ChromeDictionary } from "@/content/i18n/en";
import { HtmlShell } from "./html-shell";
import { SiteChrome } from "./site-chrome";

/** Root layout body for a language page: its own <html lang> plus translated menu and footer. */
export function LanguageRoot({ dict, children }: { dict: ChromeDictionary; children: ReactNode }) {
  return (
    <HtmlShell lang={dict.lang}>
      <SiteChrome dict={dict}>{children}</SiteChrome>
    </HtmlShell>
  );
}
