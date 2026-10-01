import type { StaticImageData } from "next/image";
import coilNails from "@/public/images/products/coil-nails.jpg";
import nailWire from "@/public/images/products/nail-wire.jpg";
import { routes } from "@/lib/routes";

// Each product's photo and key figures, shown as datasheet chips in the header's photo menu and on
// the product cards. Numbers and units only, so they read the same in all 8 languages. Figures
// are from the product pages (content/pages/products/*.ts). Long Products has no photo yet
// (plan: Kinzoku to supply one); until then it shows a drawing of its bar profiles.
export type ProductFacts = { image: StaticImageData | null; specs: string[] };

export const productFacts: Record<string, ProductFacts> = {
  [routes.nails]: { image: coilNails, specs: ["15°–16°", "Ø 2.1–3.8 mm", "25–100 mm"] },
  [routes.wire]: { image: nailWire, specs: ["SAE 1008 / 1010", "Ø 1–12 mm", "500–2500 kg"] },
  [routes.bars]: { image: null, specs: ["3–500 mm", "3 · 6 · 12 m", "EN 10204 3.1"] },
};
