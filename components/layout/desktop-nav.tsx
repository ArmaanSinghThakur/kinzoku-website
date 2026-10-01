"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarProfilesArt } from "@/components/ui/bar-profiles-art";
import type { ChromeDictionary } from "@/content/i18n/en";
import { productFacts } from "@/content/product-facts";
import { routes } from "@/lib/routes";
import { NavPopover } from "./nav-popover";

// Active and idle styles are exclusive, so plain clsx is enough here and tailwind-merge stays off the client.
const itemClass = (active: boolean) =>
  clsx(
    "flex items-center gap-1 rounded-lg px-3 py-2 font-heading text-sm font-semibold no-underline transition-colors",
    active
      ? "text-graphite shadow-[inset_0_-2px_0_var(--color-forge)]"
      : "text-graphite/75 hover:bg-graphite/[0.06] hover:text-graphite",
  );

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
      <ul className="flex items-center gap-0.5">
        {link(routes.about, dict.nav.about)}
        <li>
          <NavPopover
            label={dict.nav.products}
            triggerClassName={itemClass(dict.productLinks.some((p) => p.href === pathname))}
            className="w-[42rem] p-3"
          >
            {/* Photo menu: each product with its picture and key figures. Pictures load on first open. */}
            <ul className="grid grid-cols-3 gap-3">
              {dict.productLinks.map((product) => {
                const facts = productFacts[product.href];
                return (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      aria-current={current(product.href)}
                      className="group flex h-full flex-col rounded-lg p-2 text-graphite no-underline transition-colors hover:bg-mist/70 aria-[current=page]:bg-mist/70"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-mist">
                        {facts?.image ? (
                          <Image
                            src={facts.image}
                            alt=""
                            fill
                            sizes="200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <BarProfilesArt className="size-full" />
                        )}
                      </span>
                      <span className="mt-3 block font-heading text-sm leading-snug font-semibold">{product.label}</span>
                      {facts && (
                        <span className="spec-label mt-2 flex flex-wrap gap-x-2 text-muted">
                          {facts.specs.map((spec) => (
                            <span key={spec} className="whitespace-nowrap">
                              {spec}
                            </span>
                          ))}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
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
