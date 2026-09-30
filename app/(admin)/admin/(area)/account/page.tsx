import type { Metadata } from "next";
import { PasswordForm } from "@/components/admin/account-forms";
import { admin } from "@/content/admin";
import { requireStaff } from "@/lib/admin-guard";

export const metadata: Metadata = { title: admin.account.title };

export default async function AccountPage() {
  const me = await requireStaff({ passwordChange: true });
  const t = admin.account;
  return (
    <>
      <h1 className="text-3xl">{t.title}</h1>
      <p className="mt-2 text-muted">
        {me.name} · {me.email} · {admin.staff.roles[me.role]}
      </p>
      {me.mustChangePassword && (
        <p role="status" className="mt-6 max-w-md rounded-lg border border-gold bg-gold/15 p-4 font-semibold text-charcoal">
          {t.mustChange}
        </p>
      )}
      <div className="mt-6">
        <PasswordForm email={me.email} />
      </div>
    </>
  );
}
