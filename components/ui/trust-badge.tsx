import type { LucideIcon } from "lucide-react";

type TrustBadgeProps = { icon: LucideIcon; title: string; text?: string };

export function TrustBadge({ icon: Icon, title, text }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-charcoal">
        <Icon aria-hidden className="size-5" />
      </span>
      <div>
        <p className="font-heading font-semibold text-charcoal">{title}</p>
        {text && <p className="text-sm text-muted">{text}</p>}
      </div>
    </div>
  );
}
