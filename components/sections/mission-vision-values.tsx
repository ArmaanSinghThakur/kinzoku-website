import { missionVisionValues } from "@/content/company";

/** Mission, vision and values as three cards (Home and About Us). */
export function MissionVisionValues() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {missionVisionValues.map((item) => (
        <div key={item.label} className="rounded-lg border-t-4 border-gold bg-white p-6 shadow-card">
          <h3 className="text-sm tracking-wider text-steel uppercase">{item.label}</h3>
          <p className="mt-3 text-lg text-ink">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
