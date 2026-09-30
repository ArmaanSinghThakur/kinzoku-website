import type { Metadata } from "next";
import { AddStaffForm, StaffRowActions } from "@/components/admin/account-forms";
import { admin } from "@/content/admin";
import { requireStaff } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: admin.staff.title };

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });

/** Admins only: add staff, give new temporary passwords, log people out, switch accounts off. */
export default async function StaffPage() {
  const me = await requireStaff({ role: "admin" });
  const t = admin.staff;
  const staff = await db.staffUser.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true },
  });

  return (
    <>
      <h1 className="text-3xl">{t.title}</h1>

      <section className="mt-6 rounded-lg border border-line p-5">
        <h2 className="text-lg">{t.add}</h2>
        <div className="mt-4">
          <AddStaffForm />
        </div>
      </section>

      <div className="table-scroll mt-8 rounded-lg border border-line">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-mist text-muted">
            <tr>
              {[...Object.values(t.columns), ""].map((c, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-semibold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-line align-top">
                <td className="px-4 py-3 font-semibold">
                  {s.name}
                  {s.id === me.id && <span className="font-normal text-muted"> ({t.you})</span>}
                </td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{t.roles[s.role]}</td>
                <td className="px-4 py-3 whitespace-nowrap">{s.lastLoginAt ? when.format(s.lastLoginAt) : t.never}</td>
                <td className="px-4 py-3">{s.active ? t.active : <span className="text-danger">{t.off}</span>}</td>
                <td className="px-4 py-3">{s.id !== me.id && <StaffRowActions id={s.id} active={s.active} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
