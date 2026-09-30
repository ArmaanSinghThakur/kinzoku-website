import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { whatsappHref } from "@/lib/site";
import { DesktopNav } from "./desktop-nav";
import { LanguageMenu } from "./language-menu";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { WhatsAppIcon } from "./whatsapp-button";

export function Header({ dict }: { dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 bg-charcoal">
      <div className="site-container flex h-16 items-center gap-6">
        <Logo label={dict.nav.home} />
        <DesktopNav dict={dict} />
        <div className="ml-auto flex items-center gap-2">
          <LanguageMenu lang={dict.lang} label={dict.nav.language} />
          <ButtonLink href={routes.quote} size="sm" className="hidden sm:inline-flex">
            {dict.nav.quote}
          </ButtonLink>
          {/* Below 1340px WhatsApp lives here, not floating over the content. */}
          <a
            href={whatsappHref(dict.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.whatsapp.label}
            title={dict.whatsapp.label}
            className="grid size-10 place-items-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white min-[1340px]:hidden"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <MobileMenu dict={dict} />
        </div>
      </div>
    </header>
  );
}
