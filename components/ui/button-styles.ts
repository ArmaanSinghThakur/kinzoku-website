import { clsx } from "clsx";

const variants = {
  primary: "bg-gold text-charcoal hover:bg-gold-hover",
  secondary: "border border-charcoal/25 text-charcoal hover:border-charcoal",
  /** Outline button for dark backgrounds (hero, quote banner). */
  "secondary-dark": "border border-white/40 text-white hover:border-white",
};

const sizes = {
  md: "px-5 py-3 text-base",
  sm: "px-4 py-2 text-sm",
};

export type ButtonStyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes };

// Own module with clsx only (base, variant and size never conflict), so client components can
// import it without pulling in tailwind-merge.
export function buttonStyles({ variant = "primary", size = "md" }: ButtonStyleProps = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold no-underline transition-colors disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
  );
}
