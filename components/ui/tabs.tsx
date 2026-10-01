"use client";

import { Tabs as RadixTabs } from "radix-ui";
import { useSyncExternalStore, type ReactNode } from "react";

export type TabItem = { value: string; label: string; content: ReactNode };

type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tab list, e.g. "Product types". */
  label: string;
  /** Keep the selected tab in the URL hash so links like /page#staples open that tab. */
  syncHash?: boolean;
};

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const getHash = () => decodeURIComponent(window.location.hash.slice(1));
const getServerHash = () => "";

function selectViaHash(value: string) {
  history.replaceState(null, "", `#${value}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function Tabs({ items, label, syncHash = false }: TabsProps) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const first = items[0]?.value;
  const hashValue = items.some((item) => item.value === hash) ? hash : first;

  return (
    <RadixTabs.Root
      defaultValue={first}
      value={syncHash ? hashValue : undefined}
      onValueChange={syncHash ? selectViaHash : undefined}
    >
      <RadixTabs.List aria-label={label} className="flex gap-1 overflow-x-auto border-b border-line">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className="shrink-0 cursor-pointer rounded-t-lg px-4 py-3 font-heading font-semibold whitespace-nowrap text-muted transition-colors hover:bg-graphite/[0.04] hover:text-graphite data-[state=active]:text-graphite data-[state=active]:shadow-[inset_0_-3px_0_var(--color-forge)]"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        // forceMount keeps every tab's content in the HTML so search engines can read it;
        // inactive panels are hidden with CSS instead of being removed.
        <RadixTabs.Content key={item.value} value={item.value} forceMount className="pt-8 data-[state=inactive]:hidden">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
