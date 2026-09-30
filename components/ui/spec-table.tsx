import { cn } from "@/lib/cn";

type Cell = string | number;

type SpecTableProps = {
  caption: string;
  columns: string[];
  rows: Cell[][];
  className?: string;
};

/** Data table that scrolls sideways inside its box on phones, with the first column pinned. */
export function SpecTable({ caption, columns, rows, className }: SpecTableProps) {
  return (
    <figure className={cn("overflow-hidden rounded-lg border border-line bg-white", className)}>
      <figcaption className="border-b border-line px-4 py-3 font-heading font-semibold text-charcoal">{caption}</figcaption>
      {/* Focusable so keyboard users can scroll it; labelled for screen readers. */}
      <div className="overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-steel text-white">
              {columns.map((column, i) => (
                <th
                  key={column}
                  scope="col"
                  className={cn("bg-steel px-4 py-3 font-heading font-semibold whitespace-nowrap", i === 0 && "sticky left-0")}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-line bg-white even:bg-mist">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th
                      key={i}
                      scope="row"
                      className="sticky left-0 bg-inherit px-4 py-3 font-semibold text-charcoal shadow-[1px_0_0_var(--color-line)]"
                    >
                      {cell}
                    </th>
                  ) : (
                    // Short values stay on one line; long text (e.g. applications) wraps in a
                    // readable column instead of stretching the table.
                    <td key={i} className={cn("px-4 py-3", String(cell).length > 40 ? "min-w-72" : "whitespace-nowrap")}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
