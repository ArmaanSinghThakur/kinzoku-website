import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import "@/app/globals.css";

/**
 * The <html>/<body> document shared by every root layout. There are several root layouts
 * (English site, each language page, 404, later the admin area) so each page can declare its
 * own language in <html lang>.
 */
export function HtmlShell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
