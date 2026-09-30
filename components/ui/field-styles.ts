import { clsx } from "clsx";

// Form inputs, selects and text areas (CBAM calculator, quote form). clsx only, so client
// components can use it without tailwind-merge.
export function fieldStyles(invalid?: boolean) {
  return clsx(
    "mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-base text-ink focus:outline-2 focus:outline-offset-0 focus:outline-steel",
    invalid ? "border-danger" : "border-line",
  );
}

/** The message shown under a field that needs correcting. */
export const fieldErrorStyles = "mt-1.5 text-sm font-semibold text-danger";
