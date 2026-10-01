import { Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

type VideoLinkProps = { href: string; title: string; label: string; still: StaticImageData };

/**
 * A still image that opens the video on YouTube. Nothing from YouTube loads on our page, so no
 * YouTube cookies and no Privacy Policy change (decision after Step 6).
 */
export function VideoLink({ href, title, label, still }: VideoLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block max-w-xl overflow-hidden rounded-xl border border-line bg-white no-underline shadow-card transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <Image
          src={still}
          alt=""
          placeholder="blur"
          sizes="(min-width: 640px) 576px, 100vw"
          className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 grid place-items-center bg-graphite/20 transition-colors group-hover:bg-graphite/30">
          <span className="grid size-14 place-items-center rounded-full bg-butter text-graphite shadow-lift transition-transform duration-300 group-hover:scale-110">
            <Play aria-hidden className="ml-1 size-6 fill-current" />
          </span>
        </span>
      </div>
      <p className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <span className="font-semibold text-graphite">{title}</span>
        <span className="spec-label text-forge">{label} ↗</span>
      </p>
    </a>
  );
}
