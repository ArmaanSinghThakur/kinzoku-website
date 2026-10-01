import { missionVisionValues } from "@/content/company";
import { cn } from "@/lib/cn";

type MissionVisionValuesProps = {
  /** One surface per panel, in content order (mission, vision, values). */
  tints?: string[];
  /** One panel per row, label beside the text (narrow columns). */
  stacked?: boolean;
};

/** Mission, vision and values as three tinted panels (Home and About Us). */
export function MissionVisionValues({ tints = ["bg-mist", "bg-sage", "bg-blush"], stacked = false }: MissionVisionValuesProps) {
  return (
    <div data-reveal="stagger" className={cn("grid gap-4", !stacked && "md:grid-cols-3")}>
      {missionVisionValues.map((item, i) => (
        <div
          key={item.label}
          className={cn("flex flex-col rounded-xl p-6 sm:p-7", stacked && "sm:grid sm:grid-cols-[8rem_1fr] sm:gap-6", tints[i % tints.length])}
        >
          <h3 className="spec-label flex items-center gap-2 text-graphite sm:pt-1">
            <span aria-hidden className="text-forge">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item.label}
          </h3>
          <p className={cn("font-heading text-lg leading-snug font-semibold text-graphite", stacked ? "mt-3 sm:mt-0" : "mt-4")}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
