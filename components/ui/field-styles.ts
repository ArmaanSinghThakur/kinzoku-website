import { clsx } from "clsx";

// Form inputs, selects and text areas (CBAM calculator, quote form). clsx only, so client
// components can use it without tailwind-merge.
export function fieldStyles(invalid?: boolean) {
  return clsx(
    "mt-2 w-full rounded-lg border bg-white px-4 py-3 text-base text-graphite shadow-[inset_0_1px_2px_rgb(30_35_41/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted/80 hover:border-graphite/35 focus:border-forge focus:shadow-[0_0_0_3px_rgb(47_74_99/0.16)] focus:outline-hidden",
    invalid ? "border-danger" : "border-line",
  );
}

/** The message shown under a field that needs correcting. */
export const fieldErrorStyles = "mt-1.5 text-sm font-semibold text-danger";
