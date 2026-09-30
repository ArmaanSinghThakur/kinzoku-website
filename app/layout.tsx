import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kinzokutrade.com"),
  title: {
    default: "Kinzoku Consultancy & Trade",
    template: "%s | Kinzoku",
  },
  description:
    "Coil nails, EPAL pallet nails, staples and nail wire delivered to your factory gate. CBAM-cleared, EN 10204 3.1 certified, invoiced in EUR.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
