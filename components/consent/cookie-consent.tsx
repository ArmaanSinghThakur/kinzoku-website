"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import type { ChromeDictionary } from "@/content/i18n/en";
import { getConsentSnapshot, parseConsent, saveConsent, subscribeToConsent } from "@/lib/consent";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/** Footer link target that opens the settings panel (Privacy Policy section 8 points here). */
const SETTINGS_HASH = "#cookie-settings";

/**
 * Cookie banner + settings panel. Google Analytics is only mounted after the visitor accepts,
 * so nothing is requested from Google before that.
 */
export function CookieConsent({ dict }: { dict: ChromeDictionary }) {
  const t = dict.cookies;
  // undefined while server-rendering / hydrating, null when no choice has been made yet.
  const raw = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => undefined);
  const consent = parseConsent(raw);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function openSettings() {
    formRef.current?.reset(); // show the saved choice, not unsaved toggling from last time
    dialogRef.current?.showModal();
  }

  function choose(analytics: boolean) {
    saveConsent({ analytics });
    dialogRef.current?.close();
  }

  // Open from the footer's "Cookie settings" link, or when a page is opened with #cookie-settings.
  useEffect(() => {
    function openFromHash() {
      if (location.hash !== SETTINGS_HASH) return;
      history.replaceState(history.state, "", location.pathname + location.search);
      formRef.current?.reset();
      dialogRef.current?.showModal();
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <>
      {raw === null && (
        <section
          aria-labelledby="cookie-banner-title"
          className="cookie-banner fixed inset-x-0 bottom-0 z-40 p-4 sm:p-6"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-lg bg-white p-6 shadow-card ring-1 ring-line md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="cookie-banner-title" className="text-lg">
                {t.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm">
                {t.text} <Link href={routes.privacy}>{t.policyLink}</Link>
              </p>
            </div>
            {/* Accept and Reject look the same: refusing is as easy as agreeing. */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button type="button" onClick={() => choose(true)} className={buttonStyles({ size: "sm" })}>
                {t.accept}
              </button>
              <button type="button" onClick={() => choose(false)} className={buttonStyles({ size: "sm" })}>
                {t.reject}
              </button>
              <button
                type="button"
                onClick={openSettings}
                className="cursor-pointer px-2 py-2 font-heading text-sm font-semibold text-steel underline underline-offset-4"
              >
                {t.settings}
              </button>
            </div>
          </div>
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="cookie-settings-title"
        onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-lg bg-white p-0 text-ink shadow-card backdrop:bg-charcoal/60"
      >
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();
            choose(new FormData(event.currentTarget).get("analytics") === "on");
          }}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 id="cookie-settings-title" className="text-lg">
              {t.panelTitle}
            </h2>
            <button
              type="button"
              aria-label={t.close}
              onClick={() => dialogRef.current?.close()}
              className="grid size-9 cursor-pointer place-items-center rounded-md hover:bg-mist"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="space-y-5 px-6 py-5 text-sm">
            <p className="text-muted">{t.panelIntro}</p>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base">{t.necessary.title}</h3>
                <p className="mt-1 text-muted">{t.necessary.text}</p>
              </div>
              <span className="shrink-0 rounded-md bg-mist px-2 py-1 text-xs font-semibold text-muted">{t.alwaysOn}</span>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span>
                <span className="block font-heading text-base font-bold text-charcoal">{t.analytics.title}</span>
                <span className="mt-1 block text-muted">{t.analytics.text}</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                name="analytics"
                defaultChecked={consent?.analytics ?? false}
                className="peer sr-only"
              />
              {/* Visual switch; the real (visually hidden) checkbox above carries state and focus. */}
              <span
                aria-hidden
                className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-steel peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-steel after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-card after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-max text-left text-xs">
                <thead className="bg-mist text-charcoal">
                  <tr>
                    {Object.values(t.columns).map((column) => (
                      <th key={column} scope="col" className="px-3 py-2 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.list.map((cookie) => (
                    <tr key={cookie.name} className="border-t border-line">
                      <td className="px-3 py-2 font-mono">{cookie.name}</td>
                      <td className="px-3 py-2">{cookie.provider}</td>
                      <td className="px-3 py-2">{cookie.purpose}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-6 py-4">
            <button type="button" onClick={() => choose(false)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              {t.rejectAll}
            </button>
            <button type="button" onClick={() => choose(true)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              {t.acceptAll}
            </button>
            <button type="submit" className={buttonStyles({ size: "sm" })}>
              {t.save}
            </button>
          </div>
        </form>
      </dialog>

      {site.analyticsId && consent?.analytics && <GoogleAnalytics gaId={site.analyticsId} />}
    </>
  );
}
