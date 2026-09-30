import { cn } from "@/lib/cn";

export type ProcessStep = { title: string; text?: string; note?: string };

/**
 * Numbered steps. Up to 4 steps: one row with connectors on desktop. More steps (e.g. the 6-step
 * "how we work"): a 3-column grid. Always stacked on phones, 2 columns on tablets.
 */
export function ProcessStepper({ steps }: { steps: ProcessStep[] }) {
  const row = steps.length <= 4;

  return (
    <ol className={cn("grid gap-8 sm:grid-cols-2", row ? "lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none" : "lg:grid-cols-3")}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "relative flex gap-4",
            row &&
              "lg:flex-col lg:after:absolute lg:after:top-5 lg:after:left-14 lg:after:-right-6 lg:after:h-px lg:after:bg-line lg:last:after:hidden",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-charcoal font-heading font-bold text-gold">
            {i + 1}
          </span>
          <div>
            <h3 className="text-lg">{step.title}</h3>
            {step.text && <p className="mt-1 text-muted">{step.text}</p>}
            {step.note && (
              <p className="mt-3 inline-block rounded-md bg-mist px-2 py-1 text-xs font-semibold text-steel">{step.note}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
