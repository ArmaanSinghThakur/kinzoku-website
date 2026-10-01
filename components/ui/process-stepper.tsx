import { cn } from "@/lib/cn";

export type ProcessStep = { title: string; text?: string; note?: string };

/**
 * Numbered steps, like stations along a wire. Up to 4 steps: one row joined by a line on desktop.
 * More steps (e.g. the 6-step "how we work"): a 3-column grid. Always stacked on phones, 2 columns
 * on tablets.
 */
export function ProcessStepper({ steps }: { steps: ProcessStep[] }) {
  const row = steps.length <= 4;

  return (
    <ol
      data-reveal="stagger"
      className={cn("grid gap-x-8 gap-y-10 sm:grid-cols-2", row ? "lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none" : "lg:grid-cols-3")}
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "relative flex gap-4",
            row &&
              "lg:flex-col lg:after:absolute lg:after:top-5 lg:after:left-14 lg:after:-right-6 lg:after:h-0.5 lg:after:rounded-full lg:after:bg-forge/20 lg:last:after:hidden",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-butter font-mono text-sm font-medium text-graphite ring-4 ring-butter/30">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-lg leading-snug">{step.title}</h3>
            {step.text && <p className="mt-1.5 text-muted">{step.text}</p>}
            {step.note && <p className="spec-label mt-3 inline-block rounded-md bg-white/70 px-2 py-1 text-forge ring-1 ring-line">{step.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
