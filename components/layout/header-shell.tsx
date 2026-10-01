"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Smart header: slides away while scrolling down, returns frosted on the way up, and draws a Butter
 * progress line along its bottom edge. It stays put while one of its menus is open or it holds
 * keyboard focus. Reduced-motion visitors get a fade instead of the slide (app/globals.css).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!header || !progress) return;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const room = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.scale = `${room > 0 ? Math.min(1, y / room) : 0} 1`;
      header.toggleAttribute("data-scrolled", y > 8);

      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      const menuOpen = header.querySelector(".nav-popover:popover-open") !== null;
      const focused = header.contains(document.activeElement) && document.activeElement !== document.body;
      header.toggleAttribute("data-hidden", delta > 0 && y > 120 && !menuOpen && !focused);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const reveal = () => header.removeAttribute("data-hidden");

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    header.addEventListener("focusin", reveal);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      header.removeEventListener("focusin", reveal);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-40 bg-mist">
      {children}
      <span
        ref={progressRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-butter"
        style={{ scale: "0 1" }}
      />
    </header>
  );
}
