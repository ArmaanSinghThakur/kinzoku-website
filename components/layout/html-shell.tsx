import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import "@/app/globals.css";

// Runs before the page is painted: marks <html> when motion is welcome, so scroll reveals can start
// hidden without a flash. Reduced-motion visitors (and no JavaScript) never get the mark, so they
// see everything at once. app/globals.css reveals everything anyway if the motion code never loads.
const motionFlag = `try{if(matchMedia("(prefers-reduced-motion: no-preference)").matches&&"IntersectionObserver"in window)document.documentElement.dataset.motion="pending"}catch(e){}`;

/**
 * The <html>/<body> document shared by every root layout. There are several root layouts
 * (English site, each language page, 404, later the admin area) so each page can declare its
 * own language in <html lang>.
 */
export function HtmlShell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    // The motion flag above changes <html> before React loads.
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        {children}
      </body>
    </html>
  );
}
