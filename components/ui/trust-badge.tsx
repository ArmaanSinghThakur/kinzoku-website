import type { LucideIcon } from "lucide-react";

type TrustBadgeProps = { icon: LucideIcon; title: string; text?: string };

/** One proof point in a trust strip: icon, short title and one line of detail. */
export function TrustBadge({ icon: Icon, title, text }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-butter text-graphite">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-heading text-[0.9375rem] leading-snug font-semibold text-graphite">{title}</p>
        {text && <p className="mt-0.5 text-sm leading-snug text-muted">{text}</p>}
      </div>
    </div>
  );
}
