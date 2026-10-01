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
        className="w-60"
        triggerClassName="flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-mono text-sm font-medium text-graphite/75 uppercase transition-colors hover:bg-graphite/[0.06] hover:text-graphite"
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
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-graphite no-underline transition-colors hover:bg-mist/70 aria-[current=page]:font-semibold"
              >
                {page.label}
                <span aria-hidden className="spec-label text-muted">
                  {page.lang}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </NavPopover>
    </nav>
  );
}
