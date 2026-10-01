import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FaqItem = { question: string; answer: ReactNode };

/** Open/close question list built on native <details>: no JavaScript, and the answers stay in the HTML. */
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-xl border border-line bg-white", className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading font-semibold text-graphite transition-colors hover:bg-chalk group-open:bg-chalk [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mist transition-[rotate,background-color] duration-300 group-open:rotate-45 group-open:bg-butter">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <div className="bg-chalk px-5 pb-5 text-graphite/90">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
