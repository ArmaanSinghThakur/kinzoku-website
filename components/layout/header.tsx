import { ButtonLink } from "@/components/ui/button";
import type { ChromeDictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { whatsappHref } from "@/lib/site";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { LanguageMenu } from "./language-menu";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { WhatsAppIcon } from "./whatsapp-button";

export function Header({ dict }: { dict: ChromeDictionary }) {
  return (
    <HeaderShell>
      <div className="site-container flex h-16 items-center gap-6">
        <Logo label={dict.nav.home} />
        <DesktopNav dict={dict} />
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageMenu lang={dict.lang} label={dict.nav.language} />
          {/* Below 1340px WhatsApp lives here, not floating over the content. */}
          <a
            href={whatsappHref(dict.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.whatsapp.label}
            title={dict.whatsapp.label}
            className="grid size-10 place-items-center rounded-lg text-graphite/75 transition-colors hover:bg-graphite/[0.06] hover:text-graphite min-[1340px]:hidden"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <ButtonLink href={routes.quote} size="sm" className="ml-1.5 hidden sm:inline-flex">
            {dict.nav.quote}
          </ButtonLink>
          <MobileMenu dict={dict} />
        </div>
      </div>
    </HeaderShell>
  );
}
