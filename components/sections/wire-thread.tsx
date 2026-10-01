import type { ReactNode } from "react";

type WireThreadProps = { start?: string; end?: string; children: ReactNode };

/**
 * The wire thread (plan §5): one line down the left margin from the hero to the quote form, "from
 * wire rod to factory gate". It fills with Butter as the page scrolls (--progress, set by
 * components/motion on the data-scroll-progress wrapper); without motion it is drawn in full.
 * Only on screens wide enough to have an empty margin beside the 1200px column.
 */
export function WireThread({ start, end, children }: WireThreadProps) {
  return (
    <div data-scroll-progress="page" className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[max(1rem,calc(50%-39.5rem))] z-20 hidden w-6 min-[1340px]:block"
      >
        {start && <span className="spec-label absolute top-28 left-1/2 -translate-x-1/2 text-forge [writing-mode:vertical-rl]">{start}</span>}
        <span className="absolute top-60 bottom-40 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-forge/15" />
        <span className="absolute top-60 bottom-40 left-1/2 w-0.5 -translate-x-1/2 origin-top rounded-full bg-butter [scale:1_var(--progress,1)]" />
        {/* The bead at the end of the drawn wire. */}
        <span className="absolute top-60 bottom-40 left-1/2 w-0 -translate-x-1/2">
          <span className="absolute top-[calc(var(--progress,1)*100%)] left-0 size-2.5 -translate-1/2 rounded-full bg-butter ring-4 ring-butter/30" />
        </span>
        {end && <span className="spec-label absolute bottom-6 left-1/2 -translate-x-1/2 text-forge [writing-mode:vertical-rl]">{end}</span>}
      </div>
      {children}
    </div>
  );
}
