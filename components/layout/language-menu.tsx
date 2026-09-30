"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { languagePages } from "@/content/languages";

type LanguageMenuProps = { lang: string; label: string };

/** Links to the language pages. Search engines get them via hreflang alternates (Step 13). */
export function LanguageMenu({ lang, label }: LanguageMenuProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root aria-label={label} className="hidden lg:block">
      <NavigationMenu.List>
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 font-heading text-sm font-semibold text-white/80 uppercase transition-colors hover:text-white">
            <Globe aria-hidden className="size-4" />
            {lang}
            <span className="sr-only">: {label}</span>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg bg-white p-2 shadow-card ring-1 ring-line">
            <ul>
              {languagePages.map((page) => (
                <li key={page.href}>
                  <NavigationMenu.Link asChild active={pathname === page.href}>
                    <Link
                      href={page.href}
                      hrefLang={page.lang}
                      lang={page.lang}
                      className="block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist data-[active]:font-semibold"
                    >
                      {page.label}
                    </Link>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
