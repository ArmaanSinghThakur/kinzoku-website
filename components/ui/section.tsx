import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  white: "bg-white",
  mist: "bg-mist",
  dark: "bg-charcoal text-white",
};

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  tone?: keyof typeof tones;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
};

/** Page section: background tone, 1200px container, optional heading block, fade-in on scroll. */
export function Section({ tone = "white", eyebrow, title, intro, className, children, ...props }: SectionProps) {
  const dark = tone === "dark";

  return (
    <section className={cn("py-16 sm:py-20", tones[tone], className)} {...props}>
      <div className="site-container fade-in">
        {(eyebrow || title || intro) && (
          <header className={cn("max-w-3xl", children && "mb-10")}>
            {eyebrow && (
              <p className={cn("font-heading text-sm font-semibold uppercase tracking-wider", dark ? "text-gold" : "text-steel")}>
                {eyebrow}
              </p>
            )}
            {title && <h2 className={cn("mt-2 text-3xl", dark && "text-white")}>{title}</h2>}
            {intro && <div className={cn("mt-4 text-lg", dark ? "text-white/80" : "text-muted")}>{intro}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
