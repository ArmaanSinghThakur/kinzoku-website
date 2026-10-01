import { rfqStatuses } from "@/content/rfq-status";
import { cn } from "@/lib/cn";

const tones = {
  received: "bg-butter/25 text-graphite",
  in_review: "bg-forge/10 text-forge",
  quote_sent: "bg-emerald-100 text-emerald-800",
  closed: "bg-mist text-muted",
} as const;

export function StatusBadge({ status }: { status: keyof typeof rfqStatuses }) {
  return (
    <span className={cn("inline-block rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap", tones[status])}>
      {rfqStatuses[status]}
    </span>
  );
}
