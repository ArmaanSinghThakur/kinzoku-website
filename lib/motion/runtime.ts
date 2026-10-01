import Lenis from "lenis";
import { animate, inView, scroll, stagger } from "motion";

// The site's motion, loaded after the page is interactive and only when the visitor has no
// reduced-motion preference (components/motion/motion-runtime.tsx). Pages opt in with data
// attributes, so they stay server components:
//   data-reveal="rise | fade | unmask | stagger"   scroll reveal (once)
//   data-tone="chalk | mist | sage | blush"        section tone for the background drift
//   data-tilt                                       steel sheen tilt (cards)
//   data-spotlight                                  pastel glow that follows the cursor
//   a.btn-primary                                   magnetic call to action
//   data-scroll-progress                            sets --progress (0–1) while it scrolls past
// All motion is 200–600 ms.

const settle = [0.22, 1, 0.36, 1] as const;
const draw = [0.65, 0, 0.35, 1] as const;

type Cleanup = () => void;

let lenis: Lenis | null = null;

/** The smooth-scroll instance, for code that needs to stay in sync with it (wire story). */
export const getLenis = () => lenis;

export function startSmoothScroll(): Cleanup {
  lenis = new Lenis({
    autoRaf: true,
    // Stops while a dialog is open (html:has(dialog[open]) sets overflow: hidden).
    autoToggle: true,
    // Menus, tables and the chat log keep their own native scrolling.
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    lerp: 0.12,
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Reveal each [data-reveal] element once, as it comes into view. */
export function startReveals(root: ParentNode): Cleanup {
  const stops: Cleanup[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")) {
    const stop = inView(
      el,
      () => {
        if (el.dataset.revealed !== undefined) return;
        el.dataset.revealed = "";
        reveal(el);
      },
      { margin: "0px 0px -8% 0px", amount: 0.12 },
    );
    stops.push(stop);
  }
  return () => stops.forEach((stop) => stop());
}

function reveal(el: HTMLElement) {
  const delay = Number(el.dataset.revealDelay ?? 0);
  switch (el.dataset.reveal) {
    case "unmask": {
      animate(el, { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] }, { duration: 0.6, ease: draw, delay });
      const img = el.querySelector("img");
      if (img) animate(img, { scale: [1.1, 1] }, { duration: 0.6, ease: settle, delay });
      break;
    }
    case "stagger":
      animate([...el.children], { opacity: [0, 1], y: [24, 0] }, { duration: 0.5, ease: settle, delay: stagger(0.07, { startDelay: delay }) });
      break;
    case "rise":
      animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, ease: settle, delay });
      break;
    default:
      animate(el, { opacity: [0, 1] }, { duration: 0.5, ease: "easeOut", delay });
  }
}

/**
 * Backgrounds drift between pastels: sections inside main[data-drift] go transparent and <main>
 * takes the tone of whichever section crosses the middle of the screen, fading between them.
 */
export function startDrift(main: HTMLElement): Cleanup {
  const sections = [...main.querySelectorAll<HTMLElement>("[data-tone]")];
  if (sections.length === 0) {
    main.style.backgroundColor = "";
    return () => {};
  }
  const tone = (el: HTMLElement) => `var(--color-${el.dataset.tone})`;
  main.style.backgroundColor = tone(sections[0]);
  document.documentElement.dataset.driftOn = "";

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) main.style.backgroundColor = tone(entry.target as HTMLElement);
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}

/** Elements that set --progress (0 → 1) as they scroll through the screen. */
export function startScrollProgress(root: ParentNode): Cleanup {
  const stops: Cleanup[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("[data-scroll-progress]")) {
    // "page": from the element's top at the top of the screen to its end at the bottom.
    // Otherwise: from entering the screen to its end reaching the bottom (closing wordmark).
    const offset = el.dataset.scrollProgress === "page" ? ["start start", "end end"] : ["start end", "end end"];
    stops.push(
      scroll((progress: number) => el.style.setProperty("--progress", progress.toFixed(4)), {
        target: el,
        offset: offset as never,
      }),
    );
  }
  return () => stops.forEach((stop) => stop());
}

/** Steel sheen tilt, magnetic call to action and hero spotlight. Mouse and trackpad only. */
export function startPointerEffects(): Cleanup {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  let tiltEl: HTMLElement | null = null;
  let magnetEl: HTMLElement | null = null;
  let spotEl: HTMLElement | null = null;
  const spot = { x: 0, y: 0, tx: 0, ty: 0, frame: 0 };
  const spring = { type: "spring", stiffness: 260, damping: 24, mass: 0.6 } as const;

  function release(el: HTMLElement | null, kind: "tilt" | "magnet") {
    if (!el) return;
    delete el.dataset.active;
    animate(el, kind === "tilt" ? { rotateX: 0, rotateY: 0 } : { x: 0, y: 0 }, spring);
  }

  function followSpot() {
    if (!spotEl) return;
    spot.x += (spot.tx - spot.x) * 0.14;
    spot.y += (spot.ty - spot.y) * 0.14;
    spotEl.style.setProperty("--spot-x", `${spot.x.toFixed(1)}px`);
    spotEl.style.setProperty("--spot-y", `${spot.y.toFixed(1)}px`);
    spot.frame = Math.abs(spot.tx - spot.x) + Math.abs(spot.ty - spot.y) > 0.5 ? requestAnimationFrame(followSpot) : 0;
  }

  function onMove(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    const target = event.target instanceof Element ? event.target : null;

    // Product cards tilt up to 6° while the sheen follows the cursor.
    const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
    if (tilt !== tiltEl) {
      release(tiltEl, "tilt");
      tiltEl = tilt;
    }
    if (tilt) {
      const r = tilt.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width - 0.5;
      const py = (event.clientY - r.top) / r.height - 0.5;
      tilt.dataset.active = "";
      tilt.style.setProperty("--sheen-x", `${((px + 0.5) * 100).toFixed(1)}%`);
      animate(tilt, { rotateX: -py * 12, rotateY: px * 12 }, spring);
    }

    // "Request a quote" leans toward the cursor; the Butter fill grows from where it entered.
    const magnet = target?.closest<HTMLElement>("a.btn-primary") ?? null;
    if (magnet !== magnetEl) {
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        magnetEl.style.setProperty("--fill-x", `${event.clientX - r.left}px`);
        magnetEl.style.setProperty("--fill-y", `${event.clientY - r.top}px`);
      }
      release(magnetEl, "magnet");
      magnetEl = magnet;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        magnet.style.setProperty("--fill-x", `${event.clientX - r.left}px`);
        magnet.style.setProperty("--fill-y", `${event.clientY - r.top}px`);
      }
    }
    if (magnet) {
      const r = magnet.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      magnet.dataset.active = "";
      magnet.style.setProperty("--sheen-x", `${(((event.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      animate(magnet, { x: Math.max(-8, Math.min(8, dx * 0.22)), y: Math.max(-6, Math.min(6, dy * 0.3)) }, spring);
    }

    // Hero: a pastel glow trails the cursor over the wire mesh.
    const spotlight = target?.closest<HTMLElement>("[data-spotlight]") ?? null;
    if (spotlight !== spotEl) {
      if (spotEl) delete spotEl.dataset.active;
      spotEl = spotlight;
      if (spotlight) {
        const r = spotlight.getBoundingClientRect();
        spot.x = spot.tx = event.clientX - r.left;
        spot.y = spot.ty = event.clientY - r.top;
        spotlight.dataset.active = "";
      }
    }
    if (spotlight) {
      const r = spotlight.getBoundingClientRect();
      spot.tx = event.clientX - r.left;
      spot.ty = event.clientY - r.top;
      if (!spot.frame) spot.frame = requestAnimationFrame(followSpot);
    }
  }

  function onLeaveWindow() {
    release(tiltEl, "tilt");
    release(magnetEl, "magnet");
    if (spotEl) delete spotEl.dataset.active;
    tiltEl = magnetEl = spotEl = null;
  }

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeaveWindow);
  return () => {
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    cancelAnimationFrame(spot.frame);
  };
}
