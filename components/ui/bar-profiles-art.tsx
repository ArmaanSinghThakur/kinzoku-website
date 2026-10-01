import { clsx } from "clsx";
import { useId } from "react";

/**
 * Long Products artwork until Kinzoku supplies a photo: the four bar profiles as a hatched
 * engineering section drawing, labelled with their size ranges from the Long Products table.
 * Decorative (the card or link beside it names the product), so hidden from screen readers.
 */
export function BarProfilesArt({ className }: { className?: string }) {
  const id = useId();
  const hatch = `${id}-hatch`;
  const grid = `${id}-grid`;
  const centre = "stroke-graphite/35 [stroke-dasharray:10_3_2_3]";
  const label = "fill-graphite font-mono text-[13px] font-medium tracking-[0.06em]";

  return (
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={clsx("bg-mist", className)}>
      <defs>
        <pattern id={hatch} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" className="stroke-forge/45" strokeWidth="1.2" />
        </pattern>
        <pattern id={grid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="stroke-forge/10" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${grid})`} />

      {/* Two rows of profiles with their size labels above; the bottom stays clear for spec chips. */}
      <g fill={`url(#${hatch})`} className="stroke-forge" strokeWidth="2" strokeLinejoin="round">
        {/* Round */}
        <circle cx="110" cy="78" r="38" />
        {/* Square */}
        <rect x="258" y="44" width="68" height="68" />
        {/* Hexagonal, across flats */}
        <polygon points="110,160 143,179 143,217 110,236 77,217 77,179" />
        {/* Flat */}
        <rect x="228" y="181" width="126" height="34" />
      </g>

      <g fill="none" strokeWidth="1">
        <path d="M60 78H160M110 30V126" className={centre} />
        <path d="M244 78H340M292 32V124" className={centre} />
        <path d="M66 198H154M110 152V244" className={centre} />
        <path d="M214 198H368M291 170V226" className={centre} />
      </g>

      <g className={label}>
        <text x="110" y="22" textAnchor="middle">Ø 5–500</text>
        <text x="292" y="22" textAnchor="middle">□ 10–150</text>
        <text x="110" y="150" textAnchor="middle">AF 8–80</text>
        <text x="291" y="168" textAnchor="middle">10–400 × 3–60</text>
      </g>
    </svg>
  );
}
