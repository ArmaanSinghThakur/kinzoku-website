"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Runtime = typeof import("@/lib/motion/runtime");

/**
 * Starts the site's motion after the page is interactive (lib/motion/runtime.ts): smooth scroll,
 * scroll reveals, the background drift and the pointer effects. Nothing is downloaded for
 * visitors who prefer reduced motion: the inline script in HtmlShell never marks the page.
 */
export function MotionRuntime() {
  const pathname = usePathname();
  const [runtime, setRuntime] = useState<Runtime | null>(null);

  // Once per visit: load the code, then smooth scroll and the pointer effects.
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.motion === undefined) return;
    let cleanups: (() => void)[] = [];
    let cancelled = false;
    import("@/lib/motion/runtime")
      .then((loaded) => {
        if (cancelled) return;
        cleanups = [loaded.startSmoothScroll(), loaded.startPointerEffects()];
        html.dataset.motion = "ready";
        setRuntime(loaded);
      })
      .catch(() => {
        // The CSS failsafe reveals everything; leave the page as it is.
      });
    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  // Each page: its reveals, section tones and scroll-linked pieces.
  useEffect(() => {
    if (!runtime) return;
    const main = document.querySelector<HTMLElement>("main[data-drift]");
    const cleanups = [
      runtime.startReveals(document),
      runtime.startScrollProgress(document),
      main ? runtime.startDrift(main) : () => {},
    ];
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [runtime, pathname]);

  return null;
}
