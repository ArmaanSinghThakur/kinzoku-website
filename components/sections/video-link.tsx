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
      className="group block max-w-xl overflow-hidden rounded-lg border border-line no-underline shadow-card"
    >
      <div className="relative">
        <Image src={still} alt="" placeholder="blur" sizes="(min-width: 640px) 576px, 100vw" className="w-full" />
        <span className="absolute inset-0 grid place-items-center bg-charcoal/20 transition-colors group-hover:bg-charcoal/35">
          <span className="grid size-14 place-items-center rounded-full bg-white/90 text-charcoal shadow-card">
            <Play aria-hidden className="ml-1 size-6 fill-current" />
          </span>
        </span>
      </div>
      <p className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <span className="font-semibold text-charcoal">{title}</span>
        <span className="text-steel">{label} ↗</span>
      </p>
    </a>
  );
}
