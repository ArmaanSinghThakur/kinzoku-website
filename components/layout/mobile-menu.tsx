"use client";

import { clsx } from "clsx";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import type { ChromeDictionary } from "@/content/i18n/en";
import { languagePages } from "@/content/languages";
import { productFacts } from "@/content/product-facts";
import { routes } from "@/lib/routes";

/**
 * Phone/tablet menu on the native <dialog> element: showModal() gives focus trapping, Esc to close,
 * an inert page behind it and focus return to the button, with no library. Scroll lock is in CSS.
 */
export function MobileMenu({ dict }: { dict: ChromeDictionary }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  const item = (href: string, label: string) => (
    <Link
      href={href}
      onClick={close}
      aria-current={pathname === href ? "page" : undefined}
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 font-heading text-lg font-semibold text-graphite no-underline transition-colors hover:bg-mist/70 aria-[current=page]:bg-mist/70"
    >
      {label}
      <ArrowUpRight aria-hidden className="size-4 text-muted" />
    </Link>
  );

  const heading = "spec-label px-3 pt-6 pb-2 text-muted";

  return (
    <>
      <button
        type="button"
        aria-label={dict.nav.openMenu}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="grid size-10 cursor-pointer place-items-center rounded-lg text-graphite transition-colors hover:bg-graphite/[0.06] lg:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-menu-title"
        // A click that lands on the dialog itself (not its content) is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="mobile-menu fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-sm bg-chalk p-0 text-graphite shadow-lift backdrop:bg-graphite/45 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-mist px-6">
            <h2 id="mobile-menu-title" className="text-base">
              {dict.nav.menu}
            </h2>
            <button
              type="button"
              aria-label={dict.nav.closeMenu}
              onClick={close}
              className="grid size-10 cursor-pointer place-items-center rounded-lg text-graphite transition-colors hover:bg-graphite/[0.06]"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>

          <nav aria-label={dict.nav.label} className="flex-1 overflow-y-auto px-3 py-4">
            {item(routes.about, dict.nav.about)}
            <p className={heading}>{dict.nav.products}</p>
            <ul className="space-y-1">
              {dict.productLinks.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={close}
                    aria-current={pathname === p.href ? "page" : undefined}
                    className="block rounded-lg border-l-2 border-butter py-2.5 pr-3 pl-4 text-graphite no-underline transition-colors hover:bg-mist/70 aria-[current=page]:bg-mist/70 aria-[current=page]:font-semibold"
                  >
                    {p.label}
                    {productFacts[p.href] && (
                      <span className="spec-label mt-1 flex flex-wrap gap-x-2 text-muted">
                        {productFacts[p.href].specs.map((spec) => (
                          <span key={spec} className="whitespace-nowrap">
                            {spec}
                          </span>
                        ))}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              {item(routes.cbam, dict.nav.cbam)}
              {item(routes.blog, dict.nav.blog)}
              {item(routes.contact, dict.nav.contact)}
            </div>

            <p className={heading}>{dict.nav.language}</p>
            <ul className="grid grid-cols-2 gap-x-2">
              {languagePages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    hrefLang={page.lang}
                    lang={page.lang}
                    onClick={close}
                    className={clsx(
                      "block rounded-lg px-3 py-2 text-sm text-graphite no-underline transition-colors hover:bg-mist/70",
                      pathname === page.href && "font-semibold",
                    )}
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
