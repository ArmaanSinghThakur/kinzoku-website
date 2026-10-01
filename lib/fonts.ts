import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";

// Self-hosted at build time: no browser request ever goes to Google Fonts. Every subset the font
// has, including Latin Extended (Polish ą ę ł ń ś ź ż and the like), is in the CSS with its
// unicode-range, so a page downloads it only when it uses those letters. `subsets` only chooses
// what is preloaded: Latin, which covers English, German, French, Spanish, Portuguese, Italian
// and Dutch, keeps the first paint light.

/** Headings: variable weight plus the width axis, set to semi-expanded in app/globals.css. */
const archivo = Archivo({
  variable: "--font-archivo",
  axes: ["wdth"],
  subsets: ["latin"],
  display: "swap",
});

/** Body text. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Spec labels (Ø 2.1–3.8 MM), always uppercase. Not needed for first paint, so not preloaded. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** Class names that define the font CSS variables; set on <html>. */
export const fontVariables = `${archivo.variable} ${inter.variable} ${plexMono.variable}`;
