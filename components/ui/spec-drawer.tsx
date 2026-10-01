"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";

type SpecDrawerProps = {
  /** Button text, e.g. "View specs". */
  label: string;
  /** Drawer heading: the product name. */
  title: string;
  closeLabel: string;
  /** The specification, rendered on the server. */
  children: ReactNode;
  /** Links at the bottom (product page, quote). */
  actions: ReactNode;
};

/**
 * "View specs": a side drawer with a product's key specification, on the native <dialog> element
 * (focus trap, Esc, inert page and focus return built in, like the mobile menu). The button sits
 * above the product card's stretched link.
 */
export function SpecDrawer({ label, title, closeLabel, children, actions }: SpecDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="spec-label relative z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line bg-chalk px-2.5 py-1.5 text-graphite transition-colors hover:border-forge hover:text-forge"
      >
        <SlidersHorizontal aria-hidden className="size-3.5" />
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // A click that lands on the dialog itself (not its content) is a click on the backdrop.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="drawer fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-lg bg-chalk p-0 text-graphite shadow-lift backdrop:bg-graphite/45 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-mist px-6 py-5">
            <div>
              <p className="spec-label text-forge">{label}</p>
              <h2 id={titleId} className="mt-1.5 text-xl leading-snug">
                {title}
              </h2>
            </div>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={close}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg transition-colors hover:bg-graphite/[0.06]"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          <div className="flex shrink-0 flex-wrap gap-3 border-t border-line px-6 py-5">{actions}</div>
        </div>
      </dialog>
    </>
  );
}
