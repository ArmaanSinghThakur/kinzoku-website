import { Montserrat, Open_Sans } from "next/font/google";

// Self-hosted at build time: no browser request ever goes to Google Fonts.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** Class names that define the font CSS variables; set on <html>. */
export const fontVariables = `${montserrat.variable} ${openSans.variable}`;
