import { HtmlShell } from "@/components/layout/html-shell";
import { SiteChrome } from "@/components/layout/site-chrome";
import { en } from "@/content/i18n/en";
import { baseMetadata } from "@/lib/metadata";

export const metadata = baseMetadata;

// Root layout for the English site. Language pages (Step 12) and the admin area (Phase 4)
// have their own root layouts, so each can set its own <html lang> and chrome.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <HtmlShell lang={en.lang}>
      <SiteChrome dict={en}>{children}</SiteChrome>
    </HtmlShell>
  );
}
