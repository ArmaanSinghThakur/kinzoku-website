import type { ReactNode } from "react";
import { CookieConsent } from "@/components/consent/cookie-consent";
import type { Dictionary } from "@/content/i18n/en";
import { Footer } from "./footer";
import { Header } from "./header";
import { WhatsAppButton } from "./whatsapp-button";

/** Everything around a public page's content, in the page's language. */
export function SiteChrome({ dict, children }: { dict: Dictionary; children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-gold px-4 py-2 font-heading font-semibold text-charcoal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {dict.skipToContent}
      </a>
      <Header dict={dict} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer dict={dict} />
      <WhatsAppButton dict={dict} />
      <CookieConsent dict={dict} />
    </>
  );
}
