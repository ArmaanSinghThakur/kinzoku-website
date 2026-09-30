export type ProcessStep = { title: string; text?: string };

/** Numbered steps: stacked on phones, two columns on tablets, one row with connectors on desktop. */
export function ProcessStepper({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-4 lg:flex-col lg:after:absolute lg:after:top-5 lg:after:left-14 lg:after:-right-6 lg:after:h-px lg:after:bg-line lg:last:after:hidden"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-charcoal font-heading font-bold text-gold">
            {i + 1}
          </span>
          <div>
            <h3 className="text-lg">{step.title}</h3>
            {step.text && <p className="mt-1 text-muted">{step.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
