import { clsx } from "clsx";

const variants = {
  /**
   * Butter call to action. A deeper Butter fill grows from the cursor and the steel sheen sweeps
   * across (app/globals.css); as a link it also leans toward the cursor (components/motion).
   */
  primary: "btn-primary btn-fill sheen overflow-hidden bg-butter text-graphite shadow-[inset_0_-1px_0_rgb(30_35_41/0.12)]",
  /** Forge Navy outline that fills on hover. */
  secondary: "border border-forge/45 text-forge hover:border-forge hover:bg-forge hover:text-chalk",
  /** Outline button for Forge Navy surfaces. */
  "secondary-dark": "border border-chalk/40 text-chalk hover:border-chalk hover:bg-chalk/10",
};

const sizes = {
  md: "px-6 py-3.5 text-base",
  sm: "px-4 py-2 text-sm",
};

export type ButtonStyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes };

// Own module with clsx only (base, variant and size never conflict), so client components can
// import it without pulling in tailwind-merge.
export function buttonStyles({ variant = "primary", size = "md" }: ButtonStyleProps = {}) {
  return clsx(
    "relative isolate inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-heading leading-tight font-semibold no-underline transition-[color,background-color,border-color,translate] duration-300 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
  );
}
