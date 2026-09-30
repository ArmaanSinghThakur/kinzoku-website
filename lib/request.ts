// Checks shared by the site's own API addresses.

/**
 * True when the request comes from a page of this site. Browsers always send Origin with a POST,
 * and other sites can't fake it, so this stops them sending forms in a visitor's name (the same
 * check Next.js makes for Server Actions).
 */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * The visitor's IP address, for rate limits only (kept in memory, never stored). On the server,
 * Caddy (Phase 5) replaces any X-Forwarded-For a visitor sends with the real address.
 */
export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
