import { CookieConsent } from "@/components/consent/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { en } from "@/content/i18n/en";

// Shell for the public English pages. The admin area (Phase 4) gets its own group without it.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-gold px-4 py-2 font-heading font-semibold text-charcoal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {en.skipToContent}
      </a>
      <Header dict={en} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer dict={en} />
      <WhatsAppButton dict={en} />
      <CookieConsent dict={en} />
    </>
  );
}
