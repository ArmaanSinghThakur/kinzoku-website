import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href: string;
  title: string;
  text: string;
  image?: { src: string | StaticImageData; alt: string };
  cta?: string;
  /** Image `sizes` hint; default fits a 3-column grid in the 1200px container. */
  sizes?: string;
};

/** Whole card is clickable through one stretched link, so there is a single tab stop per card. */
export function ProductCard({
  href,
  title,
  text,
  image,
  cta = "View product",
  sizes = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
}: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card">
      {image && (
        <div className="relative aspect-[4/3] bg-mist">
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl">
          <Link href={href} className="text-charcoal no-underline after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-muted">{text}</p>
        <span aria-hidden className="mt-4 inline-flex items-center gap-1 font-heading font-semibold text-steel">
          {cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
