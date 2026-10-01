"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/components/ui/process-stepper";

type WireStoryProps = { title: string; eyebrow?: string; steps: ProcessStep[] };

// Nail heads of a collated coil seen from above: rings of heads around the centre.
const coilHeads = [
  { r: 20, n: 6 },
  { r: 35, n: 11 },
  { r: 50, n: 15 },
  { r: 65, n: 19 },
].flatMap(({ r, n }, ring) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + ring * 0.35;
    return { x: +(650 + r * Math.cos(a)).toFixed(1), y: +(210 + r * Math.sin(a)).toFixed(1) };
  }),
);
const nailXs = [442, 466, 490, 514, 538, 562];
const stations = [110, 294, 502, 650];

/**
 * "From Wire Rod to Nails" as one drawing: rod coil → wire drawing → loose nails → collated coil.
 * On desktop (with motion) the section pins while scrolling draws the wire through each station and
 * highlights its step (GSAP ScrollTrigger, loaded only then). Everywhere else the drawing is shown
 * complete beside the steps.
 */
export function WireStory({ title, eyebrow, steps }: WireStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // null: no scroll story running, every step shown equally.
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || document.documentElement.dataset.motion === undefined) return;
    if (!matchMedia("(min-width: 1024px)").matches) return;
    let revert = () => {};
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
          const q = gsap.utils.selector(section);
          const last = steps.length - 1;
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=170%",
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => {
                section.style.setProperty("--story", self.progress.toFixed(4));
                setActive(Math.min(last, Math.floor(self.progress * steps.length)));
              },
            },
          });

          // 1 · Rod coil: rings wind on from the inside out.
          timeline.fromTo(q("[data-ring]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.04, duration: 0.2 }, 0);
          // 2 · Drawing: thick rod into the die, thin wire out of it.
          timeline.fromTo(q("[data-wire='rod']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.1 }, 0.22);
          timeline.fromTo(q("[data-die]"), { scale: 0.85, opacity: 0.3, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.06 }, 0.26);
          timeline.fromTo(q("[data-wire='drawn']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.12 }, 0.32);
          // 3 · Loose nails: cut from the wire, one after another.
          timeline.fromTo(q("[data-nail]"), { opacity: 0, y: -18 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.06 }, 0.5);
          // 4 · Collated coil: heads wind into rings, held by the collation wire.
          timeline.fromTo(q("[data-head]"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, stagger: 0.004, duration: 0.04 }, 0.75);
          timeline.fromTo(q("[data-collation]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.15 }, 0.82);

          setActive(0);
          return () => {
            section.style.removeProperty("--story");
            setActive(null);
          };
        });
        revert = () => mm.revert();
        // Fonts and images change heights after load: measure again.
        if (document.readyState !== "complete") window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      revert();
    };
  }, [steps.length]);

  const running = active !== null;

  return (
    <section ref={sectionRef} data-tone="sage" className="overflow-hidden bg-sage lg:flex lg:min-h-dvh lg:items-center">
      <div className="site-container grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[5fr_7fr] lg:gap-14">
        <div>
          {eyebrow && <p className="spec-label text-forge">{eyebrow}</p>}
          <h2 data-reveal="rise" className={clsx("text-section", eyebrow && "mt-3")}>
            {title}
          </h2>

          <ol className="relative mt-8 space-y-5 pl-14">
            {/* The wire the steps hang on; fills with Butter as the story plays. */}
            <span aria-hidden className="absolute top-2 bottom-2 left-[1.1875rem] w-0.5 rounded-full bg-forge/15" />
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-[1.1875rem] w-0.5 origin-top rounded-full bg-butter"
              style={{ scale: running ? "1 var(--story, 0)" : "1 1" }}
            />
            {steps.map((step, i) => {
              const state = !running ? "idle" : i === active ? "active" : i < active ? "done" : "next";
              return (
                <li
                  key={step.title}
                  aria-current={state === "active" ? "step" : undefined}
                  className={clsx("relative transition-opacity duration-300", state === "next" && "opacity-45")}
                >
                  <span
                    className={clsx(
                      "absolute top-0 -left-14 grid size-10 place-items-center rounded-full font-mono text-sm font-medium ring-4 transition-colors duration-300",
                      state === "active" || state === "idle" || state === "done"
                        ? "bg-butter text-graphite ring-sage"
                        : "bg-white text-muted ring-sage",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="pt-1.5 text-lg leading-snug">{step.title}</h3>
                  {step.text && <p className="mt-1 text-[0.9375rem] text-muted">{step.text}</p>}
                  {step.note && (
                    <p className="spec-label mt-2 inline-block rounded-md bg-white/70 px-2 py-1 text-forge ring-1 ring-line">{step.note}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <figure aria-hidden className="relative rounded-2xl border border-line bg-chalk/70 p-4 shadow-card sm:p-6">
          <svg viewBox="0 0 760 420" className="w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Datasheet grid and floor line. */}
            <defs>
              <pattern id="wire-story-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" className="stroke-forge/[0.07]" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="760" height="420" fill="url(#wire-story-grid)" />
            <path d="M30 330H730" className="stroke-graphite/15" strokeWidth="1.5" strokeDasharray="4 6" />

            {/* Station markers 01–04. */}
            {stations.map((x, i) => (
              <g key={x}>
                <path d={`M${x} 92V112`} className="stroke-graphite/25" strokeWidth="1.5" />
                <rect
                  x={x - 22}
                  y="58"
                  width="44"
                  height="26"
                  rx="5"
                  className={clsx("transition-colors duration-300", running && active === i ? "fill-butter" : "fill-white stroke-graphite/15")}
                />
                <text x={x} y="76" textAnchor="middle" className="fill-graphite font-mono text-[13px] font-medium">
                  {String(i + 1).padStart(2, "0")}
                </text>
              </g>
            ))}

            {/* 1 · Wire rod coil. */}
            {[24, 36, 48, 60, 72].map((r) => (
              <circle key={r} data-ring cx="110" cy="210" r={r} pathLength={1} strokeDasharray="1" className="stroke-forge" strokeWidth="7" />
            ))}

            {/* 2 · Rod into the drawing die, thin wire out. */}
            <path data-wire="rod" d="M182 210H276" pathLength={1} strokeDasharray="1" className="stroke-forge" strokeWidth="7" />
            <path data-wire="drawn" d="M312 210H420" pathLength={1} strokeDasharray="1" className="stroke-forge" strokeWidth="3.5" />
            <g data-die>
              <path d="M272 162H316V200L294 206L272 200Z" className="fill-graphite/80" />
              <path d="M272 258H316V220L294 214L272 220Z" className="fill-graphite/80" />
            </g>

            {/* 3 · Loose nails. */}
            {nailXs.map((x) => (
              <g key={x} data-nail>
                <rect x={x - 8} y="164" width="16" height="6" rx="2" className="fill-forge" />
                <path d={`M${x} 170V254`} className="stroke-forge" strokeWidth="3.5" />
                <path d={`M${x - 2} 254L${x} 262L${x + 2} 254`} className="fill-forge stroke-forge" strokeWidth="1.5" />
              </g>
            ))}

            {/* 4 · Collated coil from above: rings of nail heads on the collation wire. */}
            <circle data-collation cx="650" cy="210" r="73" pathLength={1} strokeDasharray="1" className="stroke-butter" strokeWidth="4" />
            {coilHeads.map((head) => (
              <circle key={`${head.x}-${head.y}`} data-head cx={head.x} cy={head.y} r="5.5" className="fill-forge" />
            ))}
          </svg>
        </figure>
      </div>
    </section>
  );
}
