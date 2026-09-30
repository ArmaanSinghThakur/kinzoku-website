"use client";

import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { useId, useRef, type ReactNode, type ToggleEvent } from "react";

type NavPopoverProps = {
  label: ReactNode;
  triggerClassName: string;
  /** Align the panel with the button's left edge ("start") or right edge ("end"). */
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
};

/**
 * Drop-down on the browser's Popover API: Esc, click-outside, focus return and the expanded
 * state for screen readers are built in, so no menu library is shipped. The panel stays in the
 * HTML while closed, so search engines still see its links.
 */
export function NavPopover({ label, triggerClassName, align = "start", className, children }: NavPopoverProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Open popovers sit in the viewport's top layer, so place the panel under its button before it shows.
  function place(event: ToggleEvent<HTMLDivElement>) {
    const trigger = triggerRef.current;
    if (event.newState !== "open" || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panel = event.currentTarget.style;
    panel.top = `${rect.bottom + 8}px`;
    if (align === "end") panel.right = `${document.documentElement.clientWidth - rect.right}px`;
    else panel.left = `${rect.left}px`;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={id}
        className={clsx("cursor-pointer [&:has(+:popover-open)_.chevron]:rotate-180", triggerClassName)}
      >
        {label}
        <ChevronDown aria-hidden className="chevron size-4 transition-transform" />
      </button>
      <div
        id={id}
        popover="auto"
        onBeforeToggle={place}
        // Client-side navigation keeps the page, so close the panel when a link inside is chosen.
        onClick={(event) => {
          if ((event.target as Element).closest("a")) event.currentTarget.hidePopover();
        }}
        className={clsx("nav-popover rounded-lg bg-white p-2 text-charcoal shadow-card ring-1 ring-line", className)}
      >
        {children}
      </div>
    </>
  );
}
