"use client";

import { useEffect, useState } from "react";

/**
 * "Sales team online" (plan): shown while someone from the sales team has the admin area open.
 * Asks once when the page opens and every minute while it is visible; no live connection.
 */
export function SalesOnline({ label }: { label: string }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let stopped = false;
    const check = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/presence", { cache: "no-store" });
        const { online } = (await response.json()) as { online?: boolean };
        if (!stopped) setOnline(online === true);
      } catch {}
    };
    void check();
    const timer = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  if (!online) return null;
  return (
    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-graphite">
      <span aria-hidden className="relative flex size-2.5">
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-emerald-600" />
      </span>
      {label}
    </p>
  );
}
