import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FaqItem = { question: string; answer: ReactNode };

/** Open/close question list built on native <details>: no JavaScript, and the answers stay in the HTML. */
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line rounded-lg border border-line bg-white", className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading font-semibold text-charcoal [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown aria-hidden className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
