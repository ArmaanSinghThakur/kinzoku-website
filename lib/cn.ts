import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register custom tokens from app/globals.css that tailwind-merge can't infer on its own. Without
// the text sizes, "text-display text-graphite" would be read as two colours and one dropped.
const twMerge = extendTailwindMerge({
  extend: { theme: { shadow: ["card", "lift"], text: ["display", "title", "section"] } },
});

/**
 * Join class names; later Tailwind classes override earlier conflicting ones.
 * For server components. In "use client" files use `clsx` directly: importing this there
 * ships tailwind-merge (~7 KB gzipped) to every visitor.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
