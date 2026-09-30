import Image from "next/image";
import Link from "next/link";
import wordmark from "@/public/brand/kinzoku-wordmark.png";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

// Interim logo: the gold wordmark cut from the current site's image. Swap for the SVG when supplied.
export function Logo({ label, className }: { label: string; className?: string }) {
  return (
    <Link href={routes.home} aria-label={label} className={cn("inline-flex shrink-0", className)}>
      <Image src={wordmark} alt="Kinzoku" priority className="h-6 w-auto sm:h-7" />
    </Link>
  );
}
