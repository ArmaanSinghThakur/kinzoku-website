import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { DesktopNav } from "./desktop-nav";
import { LanguageMenu } from "./language-menu";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

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
          <MobileMenu dict={dict} />
        </div>
      </div>
    </header>
  );
}
