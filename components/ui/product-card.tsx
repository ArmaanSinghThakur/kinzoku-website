import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarProfilesArt } from "./bar-profiles-art";

type ProductCardProps = {
  href: string;
  title: string;
  text: string;
  image?: { src: string | StaticImageData; alt: string } | null;
  /** Key figures shown as datasheet chips over the picture, e.g. "Ø 2.1–3.8 mm". */
  specs?: string[];
  cta?: string;
  /** Extra action beside the link, e.g. the "View specs" drawer. Sits above the card's link. */
  action?: ReactNode;
  /** Image `sizes` hint; default fits a 3-column grid in the 1200px container. */
  sizes?: string;
};

/**
 * Whole card is clickable through one stretched link, so there is a single tab stop per card (plus
 * the optional action). Steel sheen: it tilts up to 6° toward the cursor while a light band follows
 * it (components/motion). Without a photo it shows the bar profile drawing.
 */
export function ProductCard({
  href,
  title,
  text,
  image,
  specs,
  cta = "View product",
  action,
  sizes = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
}: ProductCardProps) {
  return (
    <article
      data-tilt
      className="sheen group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            placeholder={typeof image.src === "string" ? "empty" : "blur"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <BarProfilesArt className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        )}
        {specs && specs.length > 0 && (
          <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
            {specs.map((spec) => (
              <li key={spec} className="spec-label rounded-[4px] bg-chalk/90 px-2 py-1 text-graphite shadow-card backdrop-blur-sm">
                {spec}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug">
          <Link href={href} className="text-graphite no-underline after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-muted">{text}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span aria-hidden className="inline-flex items-center gap-1.5 font-heading font-semibold text-forge">
            {cta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {action}
        </div>
      </div>
    </article>
  );
}
