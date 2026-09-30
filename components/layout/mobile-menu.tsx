"use client";

import { clsx } from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import type { Dictionary } from "@/content/i18n/en";
import { languagePages } from "@/content/languages";
import { routes } from "@/lib/routes";

/**
 * Phone/tablet menu on the native <dialog> element: showModal() gives focus trapping, Esc to close,
 * an inert page behind it and focus return to the button, with no library. Scroll lock is in CSS.
 */
export function MobileMenu({ dict }: { dict: Dictionary }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  const item = (href: string, label: string, className?: string) => (
    <Link
      href={href}
      onClick={close}
      aria-current={pathname === href ? "page" : undefined}
      className={clsx(
        "block rounded-md px-3 py-2.5 text-charcoal no-underline hover:bg-mist aria-[current=page]:font-semibold",
        className,
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      <button
        type="button"
        aria-label={dict.nav.openMenu}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="grid size-10 cursor-pointer place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-menu-title"
        // A click that lands on the dialog itself (not its content) is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="mobile-menu fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-sm bg-white p-0 shadow-card backdrop:bg-charcoal/60"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
            <h2 id="mobile-menu-title" className="text-base">
              {dict.nav.menu}
            </h2>
            <button
              type="button"
              aria-label={dict.nav.closeMenu}
              onClick={close}
              className="grid size-10 cursor-pointer place-items-center rounded-md text-charcoal hover:bg-mist"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>

          <nav aria-label={dict.nav.label} className="flex-1 overflow-y-auto px-3 py-4">
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
                  <Link
                    href={page.href}
                    hrefLang={page.lang}
                    lang={page.lang}
                    onClick={close}
                    className="block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-line p-6">
            <Link href={routes.quote} onClick={close} className={clsx(buttonStyles(), "w-full")}>
              {dict.nav.quote}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
