"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { languagePages } from "@/content/languages";
import { NavPopover } from "./nav-popover";

type LanguageMenuProps = { lang: string; label: string };

export function LanguageMenu({ lang, label }: LanguageMenuProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="hidden lg:block">
      <NavPopover
        align="end"
        className="w-56"
        triggerClassName="flex items-center gap-1.5 rounded-md px-2 py-2 font-heading text-sm font-semibold text-white/80 uppercase transition-colors hover:text-white"
        label={
          <>
            <Globe aria-hidden className="size-4" />
            {lang}
            <span className="sr-only">: {label}</span>
          </>
        }
      >
        <ul>
          {languagePages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                hrefLang={page.lang}
                lang={page.lang}
                aria-current={pathname === page.href ? "page" : undefined}
                className="block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist aria-[current=page]:font-semibold"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </NavPopover>
    </nav>
  );
}
