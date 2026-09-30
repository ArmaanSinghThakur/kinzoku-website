import type { ReactNode } from "react";
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

/** Top of every inner page: breadcrumbs, the page's single H1, intro and actions. */
export function PageHeader({ breadcrumbs, title, subtitle, intro, children }: PageHeaderProps) {
  return (
    <section className="border-b border-line bg-mist">
      <div className="site-container py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 font-heading text-lg font-semibold text-steel">{subtitle}</p>}
        {intro && <p className="mt-4 max-w-3xl text-lg text-muted">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
