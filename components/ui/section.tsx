import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Section surfaces: Chalk by default; pastel tints for Products (mist), Process (sage) and About/Quote (blush). */
const tones = {
  chalk: "bg-chalk",
  mist: "bg-mist",
  sage: "bg-sage",
  blush: "bg-blush",
  /** Forge Navy, used sparingly. */
  forge: "bg-forge text-chalk",
};

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  tone?: keyof typeof tones;
  /** Short datasheet label above the title (IBM Plex Mono, uppercase). */
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
};

/**
 * Page section: background tone, 1200px container and optional heading block. The title rises in
 * on scroll, and the tone takes part in the background drift between pastels (components/motion).
 */
export function Section({ tone = "chalk", eyebrow, title, intro, className, children, ...props }: SectionProps) {
  const dark = tone === "forge";

  return (
    <section data-tone={dark ? undefined : tone} className={cn("py-16 sm:py-20", tones[tone], className)} {...props}>
      <div className="site-container">
        {(eyebrow || title || intro) && (
          <header className={cn("max-w-3xl", children && "mb-10 sm:mb-12")}>
            {eyebrow && <p className={cn("spec-label", dark ? "text-butter" : "text-forge")}>{eyebrow}</p>}
            {title && (
              <h2 data-reveal="rise" className={cn("text-section", eyebrow && "mt-3", dark && "text-chalk")}>
                {title}
              </h2>
            )}
            {intro && (
              <div data-reveal="fade" className={cn("mt-4 text-lg", dark ? "text-chalk/80" : "text-muted")}>
                {intro}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
