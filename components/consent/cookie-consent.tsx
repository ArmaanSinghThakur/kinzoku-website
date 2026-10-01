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
        // A small card in the corner, not a full-width banner: the first screen stays readable.
        <section
          aria-labelledby="cookie-banner-title"
          className="cookie-banner fixed bottom-3 left-3 z-40 w-[calc(100%-1.5rem)] max-w-[360px] rounded-xl bg-chalk p-4 text-graphite shadow-lift ring-1 ring-line sm:bottom-4 sm:left-4 sm:p-5"
        >
          <h2 id="cookie-banner-title" className="flex items-center gap-2 text-base">
            <span aria-hidden className="size-2 rounded-full bg-butter ring-4 ring-butter/35" />
            {t.title}
          </h2>
          <p className="mt-1.5 text-sm leading-snug text-muted">
            {t.text} <Link href={routes.privacy}>{t.policyLink}</Link>
          </p>
          {/* Accept and Reject look the same: refusing is as easy as agreeing. */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => choose(true)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              {t.accept}
            </button>
            <button type="button" onClick={() => choose(false)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              {t.reject}
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="ml-auto cursor-pointer rounded-lg px-1 py-2 text-sm font-semibold text-forge underline underline-offset-4 hover:text-graphite"
            >
              {t.settings}
            </button>
          </div>
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="cookie-settings-title"
        onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-xl bg-chalk p-0 text-graphite shadow-lift backdrop:bg-graphite/45 backdrop:backdrop-blur-sm"
      >
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();
            choose(new FormData(event.currentTarget).get("analytics") === "on");
          }}
        >
          <div className="flex items-center justify-between rounded-t-xl border-b border-line bg-mist px-6 py-4">
            <h2 id="cookie-settings-title" className="text-lg">
              {t.panelTitle}
            </h2>
            <button
              type="button"
              aria-label={t.close}
              onClick={() => dialogRef.current?.close()}
              className="grid size-9 cursor-pointer place-items-center rounded-lg transition-colors hover:bg-graphite/[0.06]"
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
              <span className="spec-label shrink-0 rounded-md bg-sage px-2 py-1 text-graphite">{t.alwaysOn}</span>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span>
                <span className="block font-heading text-base font-bold text-graphite">{t.analytics.title}</span>
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
                className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-graphite/20 transition-colors peer-checked:bg-forge peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forge after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-card after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>

            <div className="overflow-x-auto rounded-lg border border-line bg-white">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="bg-mist text-graphite">
                  <tr>
                    {Object.values(t.columns).map((column) => (
                      <th key={column} scope="col" className="spec-label px-3 py-2">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.list.map((cookie) => (
                    <tr key={cookie.name} className="border-t border-line">
                      <td className="px-3 py-2 font-mono text-sm">{cookie.name}</td>
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
