"use client";

import { buttonStyles } from "@/components/ui/button-styles";
import { enError } from "@/content/i18n/en-error";
import { routes } from "@/lib/routes";

/**
 * "Something went wrong" block shared by the page error screen and the last-resort global one.
 * Plain <a> links on purpose: after an error a full page load is the cleanest reset, and it keeps
 * next/link out of this chunk, which every page downloads (the bundler would duplicate it here).
 */
export function ErrorMessage({ onRetry }: { onRetry: () => void }) {
  const t = enError;

  return (
    <section role="alert" className="relative isolate overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="wire-mesh absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_80%_30%,black,transparent_60%)]" />
      <div className="site-container">
        <div className="max-w-2xl">
          <h1 className="text-title">{t.title}</h1>
          <p className="mt-4 text-lg text-muted">{t.text}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={onRetry} className={buttonStyles()}>
              {t.retry}
            </button>
            <a href={routes.home} className={buttonStyles({ variant: "secondary" })}>
              {t.home}
            </a>
            <a href={routes.contact} className={buttonStyles({ variant: "secondary" })}>
              {t.contact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
