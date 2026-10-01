import type { CSSProperties, ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

type PageHeaderProps = {
  breadcrumbs: Crumb[];
  title: string;
  /** Short line under the title, e.g. the product subtitle. */
  subtitle?: string;
  intro?: ReactNode;
  /** Buttons under the intro (e.g. the page's quote button). */
  children?: ReactNode;
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Top of every inner page: breadcrumbs, the page's single H1, intro and actions, on Steel Mist. */
export function PageHeader({ breadcrumbs, title, subtitle, intro, children }: PageHeaderProps) {
  return (
    <section data-tone="mist" className="relative overflow-hidden border-b border-line bg-mist">
      {/* Faint wire mesh, fading out toward the text. */}
      <div aria-hidden className="wire-mesh absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
      <div className="site-container relative py-12 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="load-rise mt-5 max-w-4xl text-title">{title}</h1>
        {subtitle && (
          <p className="spec-label load-fade mt-4 text-forge" style={delay(120)}>
            {subtitle}
          </p>
        )}
        {intro && (
          <p className="load-fade mt-5 max-w-3xl text-lg text-muted" style={delay(180)}>
            {intro}
          </p>
        )}
        {children && (
          <div className="load-fade mt-8 flex flex-wrap gap-3" style={delay(260)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
