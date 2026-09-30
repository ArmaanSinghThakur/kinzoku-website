const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-07-01" → "1 July 2026". UTC so server and browser always agree. */
export function formatDate(isoDate: string) {
  return dateFormat.format(new Date(isoDate));
}
