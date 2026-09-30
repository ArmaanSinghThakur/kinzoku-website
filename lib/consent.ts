import { site } from "./site";

// The visitor's cookie choice, kept in one first-party cookie (itself strictly necessary).
// Value format: "<version>.<analytics 0|1>", e.g. "1.0".
const NAME = "kz_consent";
/** Bump when cookie categories change, so everyone is asked again. */
const VERSION = "1";
/** Ask again after 12 months. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type Consent = { analytics: boolean };

const listeners = new Set<() => void>();

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Raw cookie value, or null if the visitor hasn't chosen yet (or chose under an older version). */
export function getConsentSnapshot(): string | null {
  const value = document.cookie.match(new RegExp(`(?:^|;\\s*)${NAME}=([^;]*)`))?.[1] ?? null;
  return value?.startsWith(`${VERSION}.`) ? value : null;
}

export function parseConsent(raw: string | null | undefined): Consent | null {
  return raw ? { analytics: raw.endsWith(".1") } : null;
}

export function saveConsent({ analytics }: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NAME}=${VERSION}.${analytics ? 1 : 0}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;

  if (site.analyticsId) {
    // Google's documented opt-out flag: stops a gtag already loaded in this tab from sending anything.
    (window as unknown as Record<string, boolean>)[`ga-disable-${site.analyticsId}`] = !analytics;
  }
  if (!analytics) removeAnalyticsCookies();
  listeners.forEach((listener) => listener());
}

/** Delete Google Analytics cookies (_ga, _ga_<id>) on this host and its parent domains. */
function removeAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const labels = location.hostname.split(".");
  const domains = labels.map((_, i) => labels.slice(i).join(".")).filter((domain) => domain.includes("."));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domain}`;
  }
}
