"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { buttonStyles } from "@/components/ui/button";
import type { Dictionary } from "@/content/i18n/en";
import { languagePages } from "@/content/languages";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

/** Phone/tablet menu. Radix Dialog handles focus trapping, Esc to close and page scroll lock. */
export function MobileMenu({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();

  // Dialog.Close around each link closes the panel as the visitor navigates.
  const item = (href: string, label: string, className?: string) => (
    <Dialog.Close asChild>
      <Link
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        className={cn(
          "block rounded-md px-3 py-2.5 text-charcoal no-underline hover:bg-mist aria-[current=page]:font-semibold",
          className,
        )}
      >
        {label}
      </Link>
    </Dialog.Close>
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={dict.nav.openMenu}
        className="grid size-10 cursor-pointer place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/60 motion-safe:animate-[fade-in_150ms_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-card motion-safe:animate-[fade-in_150ms_ease-out]"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
            <Dialog.Title className="font-heading font-bold text-charcoal">{dict.nav.menu}</Dialog.Title>
            <Dialog.Close
              aria-label={dict.nav.closeMenu}
              className="grid size-10 cursor-pointer place-items-center rounded-md text-charcoal hover:bg-mist"
            >
              <X aria-hidden className="size-6" />
            </Dialog.Close>
          </div>

          <nav aria-label={dict.nav.label} className="flex-1 px-3 py-4">
            {item(routes.about, dict.nav.about)}
            <p className="px-3 pt-4 pb-1 font-heading text-xs font-semibold tracking-wider text-muted uppercase">
              {dict.nav.products}
            </p>
            {dict.productLinks.map((p) => (
              <div key={p.href}>{item(p.href, p.label, "pl-6 text-sm")}</div>
            ))}
            <div className="mt-2">
              {item(routes.cbam, dict.nav.cbam)}
              {item(routes.blog, dict.nav.blog)}
              {item(routes.contact, dict.nav.contact)}
            </div>

            <p className="px-3 pt-6 pb-1 font-heading text-xs font-semibold tracking-wider text-muted uppercase">
              {dict.nav.language}
            </p>
            <ul className="grid grid-cols-2 gap-x-2">
              {languagePages.map((page) => (
                <li key={page.href}>
                  <Dialog.Close asChild>
                    <Link
                      href={page.href}
                      hrefLang={page.lang}
                      lang={page.lang}
                      className="block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist"
                    >
                      {page.label}
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-line p-6">
            <Dialog.Close asChild>
              <Link href={routes.quote} className={cn(buttonStyles(), "w-full")}>
                {dict.nav.quote}
              </Link>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
