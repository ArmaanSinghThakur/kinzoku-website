import type { CSSProperties } from "react";
import Link from "next/link";
import wordmark from "@/public/brand/kinzoku-wordmark.png";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

// Interim logo: the wordmark cut from the current site's image, used as a mask so it takes the
// text colour (Graphite on the Steel Mist header, Chalk on the Forge Navy footer). The steel sheen
// sweeps across it on hover (app/globals.css). Swap for the SVG when supplied.
export function Logo({ label, className }: { label: string; className?: string }) {
  const style = {
    "--logo-src": `url(${wordmark.src})`,
    aspectRatio: `${wordmark.width} / ${wordmark.height}`,
  } as CSSProperties;

  return (
    <Link href={routes.home} aria-label={label} className={cn("logo-link inline-flex shrink-0 text-graphite", className)}>
      <span aria-hidden className="logo-mark h-5 sm:h-6" style={style} />
    </Link>
  );
}
