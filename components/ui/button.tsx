import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

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

type StyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function buttonStyles({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold no-underline transition-colors disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
  );
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
