import { cn } from "@/lib/cn";

export type Spec = { label: string; value: string; items?: string[] };

/** "Label: value" specification list, with optional sub-points (e.g. shank options). */
export function SpecList({ specs, className }: { specs: Spec[]; className?: string }) {
  return (
    <dl className={cn("space-y-3", className)}>
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt className="inline font-semibold text-charcoal">{spec.label}:</dt> <dd className="inline">{spec.value}</dd>
          {spec.items && (
            <ul className="mt-2 list-disc space-y-1 pl-6 marker:text-steel">
              {spec.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </dl>
  );
}

/** Values shared by every row of a size table, shown once above it instead of in each row. */
export function CommonValues({ label, values }: { label: string; values: { label: string; value: string }[] }) {
  return (
    <div className="rounded-lg bg-mist p-5">
      <p className="font-heading text-sm font-semibold tracking-wider text-steel uppercase">{label}</p>
      <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.label}>
            <dt className="inline font-semibold text-charcoal">{v.label}:</dt> <dd className="inline">{v.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
