import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HtmlShell } from "@/components/layout/html-shell";
import { admin } from "@/content/admin";

// Root layout for the staff admin area: no public header, footer, cookie banner or analytics.
export const metadata: Metadata = {
  title: { default: admin.name, template: `%s | ${admin.name}` },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <HtmlShell lang="en">{children}</HtmlShell>;
}
