import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

/** Top of every inner page: breadcrumbs, the page's single H1 and an optional intro. */
export function PageHeader({ breadcrumbs, title, intro }: { breadcrumbs: Crumb[]; title: string; intro?: ReactNode }) {
  return (
    <section className="border-b border-line bg-mist">
      <div className="site-container py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg text-muted">{intro}</p>}
      </div>
    </section>
  );
}
