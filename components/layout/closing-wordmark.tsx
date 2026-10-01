import { useId } from "react";

/**
 * Full-width KINZOKU at the end of every page: an outline that fills with Butter, bottom to top,
 * as it scrolls into view (--progress, set by components/motion). Without motion it is simply
 * filled. Decorative: the company name is in the footer text.
 */
export function ClosingWordmark() {
  const clip = `${useId()}-wordmark`;
  const text = (
    <text
      x="0"
      y="146"
      textLength="1000"
      lengthAdjust="spacingAndGlyphs"
      fontSize="186"
      fontWeight="800"
      style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"wdth" 125' }}
    >
      KINZOKU
    </text>
  );

  return (
    <div aria-hidden data-scroll-progress className="closing-wordmark site-container">
      <svg viewBox="0 0 1000 152" className="block w-full overflow-visible">
        <defs>
          <clipPath id={clip}>{text}</clipPath>
        </defs>
        <g className="fill-none stroke-chalk/30" strokeWidth="1.5">
          {text}
        </g>
        <g clipPath={`url(#${clip})`}>
          <rect className="fill-rect fill-butter" width="1000" height="152" />
        </g>
      </svg>
    </div>
  );
}
