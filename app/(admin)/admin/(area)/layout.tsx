import Link from "next/link";
import type { ReactNode } from "react";
import { LiveAlerts } from "@/components/admin/live-alerts";
import { admin } from "@/content/admin";
import { requireStaff } from "@/lib/admin-guard";
import { logOut } from "../actions";

// The logged-in admin area: a top bar with the sections and the logout button. Each page checks
// the login again itself (this bar is not re-run when moving between pages).
export default async function AdminAreaLayout({ children }: { children: ReactNode }) {
  const me = await requireStaff({ passwordChange: true });
  const t = admin.nav;
  const link = "text-white/80 no-underline hover:text-white";
  return (
    <>
      <header className="bg-forge text-white">
        <div className="site-container flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <Link href="/admin" className="font-heading font-bold tracking-wide text-butter no-underline">
            KINZOKU <span className="font-normal text-white/60">admin</span>
          </Link>
          {!me.mustChangePassword && (
            <nav aria-label="Admin" className="flex gap-5 text-sm">
              <Link href="/admin" className={link}>{t.requests}</Link>
              {me.role === "admin" && <Link href="/admin/staff" className={link}>{t.staff}</Link>}
              <Link href="/admin/account" className={link}>{t.account}</Link>
            </nav>
          )}
          <form action={logOut} className="ml-auto flex items-center gap-3 text-sm">
            {!me.mustChangePassword && <LiveAlerts />}
            <span className="text-white/70">{me.name}</span>
            <button type="submit" className="rounded-md border border-white/30 px-3 py-1 text-white hover:border-white">
              {t.logout}
            </button>
          </form>
        </div>
      </header>
      <main className="site-container flex-1 py-8">{children}</main>
    </>
  );
}
