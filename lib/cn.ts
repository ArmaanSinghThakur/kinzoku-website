import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register custom tokens from app/globals.css that tailwind-merge can't infer on its own.
const twMerge = extendTailwindMerge({
  extend: { theme: { shadow: ["card"] } },
});

/**
 * Join class names; later Tailwind classes override earlier conflicting ones.
 * For server components. In "use client" files use `clsx` directly: importing this there
 * ships tailwind-merge (~7 KB gzipped) to every visitor.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
