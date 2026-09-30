"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import type { Dictionary } from "@/content/i18n/en";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const itemClass =
  "flex items-center gap-1 rounded-md px-3 py-2 font-heading text-sm font-semibold text-white/80 no-underline transition-colors hover:text-white data-[active]:text-white data-[active]:shadow-[inset_0_-2px_0_var(--color-gold)]";

export function DesktopNav({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const productActive = dict.productLinks.some((p) => p.href === pathname);

  const link = (href: string, label: string) => (
    <NavigationMenu.Item>
      <NavigationMenu.Link asChild active={pathname === href}>
        <Link href={href} className={itemClass}>
          {label}
        </Link>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );

  return (
    <NavigationMenu.Root aria-label={dict.nav.label} className="hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-1">
        {link(routes.about, dict.nav.about)}
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger className={cn(itemClass, "group cursor-pointer")} data-active={productActive || undefined}>
            {dict.nav.products}
            <ChevronDown aria-hidden className="size-4 transition-transform group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg bg-white p-2 shadow-card ring-1 ring-line">
            <ul>
              {dict.productLinks.map((product) => (
                <li key={product.href}>
                  <NavigationMenu.Link asChild active={pathname === product.href}>
                    <Link
                      href={product.href}
                      className="block rounded-md px-3 py-2 text-sm text-charcoal no-underline hover:bg-mist data-[active]:font-semibold"
                    >
                      {product.label}
                    </Link>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        {link(routes.cbam, dict.nav.cbam)}
        {link(routes.blog, dict.nav.blog)}
        {link(routes.contact, dict.nav.contact)}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
