import type { Metadata } from "next";
import { site } from "./site";

/** Shared by every root layout (English site, language pages, 404). */
export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: "%s | Kinzoku",
  },
  description:
    "Coil nails, EPAL pallet nails, staples and nail wire delivered to your factory gate. CBAM-cleared, EN 10204 3.1 certified, invoiced in EUR.",
};
