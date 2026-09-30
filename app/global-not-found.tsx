import type { Metadata } from "next";
import { NotFound } from "@/components/errors/not-found";
import { HtmlShell } from "@/components/layout/html-shell";
import { SiteChrome } from "@/components/layout/site-chrome";
import { en } from "@/content/i18n/en";
import { baseMetadata } from "@/lib/metadata";

// Any address that matches no page. Needed because the app has several root layouts
// (experimental.globalNotFound in next.config.ts). Next.js returns it with status 404.
export const metadata: Metadata = {
  ...baseMetadata,
  title: `${en.notFound.title} | Kinzoku`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <HtmlShell lang={en.lang}>
      <SiteChrome dict={en}>
        <NotFound dict={en} />
      </SiteChrome>
    </HtmlShell>
  );
}
