import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldStyles } from "@/components/ui/field-styles";
import { admin } from "@/content/admin";
import { quoteForm } from "@/content/quote-form";
import { rfqStatuses } from "@/content/rfq-status";
import { requireStaff } from "@/lib/admin-guard";
import { cn } from "@/lib/cn";
import { db } from "@/lib/db";
import type { Prisma, RfqStatus } from "@/lib/generated/prisma/client";

export const metadata: Metadata = { title: admin.requests.title };

const perPage = 50;
const day = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });
const statuses = Object.keys(rfqStatuses) as RfqStatus[];

/** All requests, newest first, filtered by status and a search over reference, company, name and email. */
export default async function RequestsPage({ searchParams }: PageProps<"/admin">) {
  await requireStaff();
  const t = admin.requests;
  const params = await searchParams;
  const status = statuses.find((s) => s === params.status);
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const page = Math.max(1, Math.floor(Number(params.page)) || 1);

  const search: Prisma.RfqWhereInput = q
    ? {
        OR: (["reference", "companyName", "contactName", "email"] as const).map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        })),
      }
    : {};
  const where: Prisma.RfqWhereInput = { ...search, ...(status && { status }) };
  const [rows, total, counts] = await Promise.all([
    db.rfq.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        reference: true,
        createdAt: true,
        companyName: true,
        contactName: true,
        email: true,
        type: true,
        status: true,
        _count: { select: { files: true, chatMessages: { where: { sender: "buyer", readAt: null } } } },
      },
    }),
    db.rfq.count({ where }),
    db.rfq.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  const count = (s?: RfqStatus) => counts.filter((c) => !s || c.status === s).reduce((n, c) => n + c._count._all, 0);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const href = (changes: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries({ status, q: q || undefined, page: undefined, ...changes })) {
      if (value !== undefined && value !== "" && !(key === "page" && String(value) === "1")) query.set(key, String(value));
    }
    return `/admin${query.size ? `?${query}` : ""}`;
  };

  return (
    <>
      <h1 className="text-3xl">{t.title}</h1>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <nav aria-label="Status" className="flex flex-wrap gap-2">
          {[undefined, ...statuses].map((s) => (
            <Link
              key={s ?? "all"}
              href={href({ status: s })}
              aria-current={s === status ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1 text-sm no-underline",
                s === status ? "border-forge bg-forge text-white" : "border-line text-graphite hover:border-graphite",
              )}
            >
              {s ? rfqStatuses[s] : t.all} <span className="opacity-70">{count(s)}</span>
            </Link>
          ))}
        </nav>
        <form action="/admin" className="flex w-full gap-2 lg:max-w-md">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="search" className="sr-only">{t.search}</label>
          <input id="search" name="q" type="search" defaultValue={q} placeholder={t.search} className={cn(fieldStyles(), "mt-0 py-2")} />
          <button type="submit" className={buttonStyles({ variant: "secondary", size: "sm" })}>{t.searchButton}</button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-muted">{t.empty}</p>
      ) : (
        <div className="table-scroll mt-6 rounded-lg border border-line">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                {Object.values(t.columns).map((c) => (
                  <th key={c} scope="col" className="px-4 py-3 font-semibold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.reference} className="border-t border-line hover:bg-mist/60">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link href={`/admin/requests/${r.reference}`}>{r.reference}</Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{day.format(r.createdAt)}</td>
                  <td className="px-4 py-3">{r.companyName}</td>
                  <td className="px-4 py-3">
                    {r.contactName}
                    <span className="block text-muted">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{quoteForm.type.options[r.type]}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">{r._count.files || "–"}</td>
                  <td className="px-4 py-3">
                    {r._count.chatMessages > 0 ? (
                      <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">{r._count.chatMessages}</span>
                    ) : (
                      "–"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 && <Link href={href({ page: page - 1 })}>{t.previous}</Link>}
          <span className="text-muted">{t.page(page, pages)}</span>
          {page < pages && <Link href={href({ page: page + 1 })}>{t.next}</Link>}
        </nav>
      )}
    </>
  );
}
