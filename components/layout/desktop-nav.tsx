"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ChromeDictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { NavPopover } from "./nav-popover";

// Active and idle styles are exclusive, so plain clsx is enough here and tailwind-merge stays off the client.
const itemClass = (active: boolean) =>
  clsx(
    "flex items-center gap-1 rounded-md px-3 py-2 font-heading text-sm font-semibold no-underline transition-colors",
    active ? "text-white shadow-[inset_0_-2px_0_var(--color-gold)]" : "text-white/80 hover:text-white",
  );
const panelLinkClass =
  "block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist aria-[current=page]:font-semibold";

export function DesktopNav({ dict }: { dict: ChromeDictionary }) {
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? "page" : undefined);

  const link = (href: string, label: string) => (
    <li>
      <Link href={href} aria-current={current(href)} className={itemClass(pathname === href)}>
        {label}
      </Link>
    </li>
  );

  return (
    <nav aria-label={dict.nav.label} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {link(routes.about, dict.nav.about)}
        <li>
          <NavPopover
            label={dict.nav.products}
            triggerClassName={itemClass(dict.productLinks.some((p) => p.href === pathname))}
            className="w-80"
          >
            <ul>
              {dict.productLinks.map((product) => (
                <li key={product.href}>
                  <Link href={product.href} aria-current={current(product.href)} className={panelLinkClass}>
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </NavPopover>
        </li>
        {link(routes.cbam, dict.nav.cbam)}
        {link(routes.blog, dict.nav.blog)}
        {link(routes.contact, dict.nav.contact)}
      </ul>
    </nav>
  );
}
