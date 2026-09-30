import { Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldStyles } from "@/components/ui/field-styles";
import { admin } from "@/content/admin";
import { emails, rfqStatuses } from "@/content/rfq-status";
import { requireStaff } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import type { RfqStatus } from "@/lib/generated/prisma/client";
import { rfqAnswers } from "@/lib/rfq-answers";
import { markAsClient, setRfqStatus } from "../../../actions";

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });
const day = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });
/** Today in Amsterdam as YYYY-MM-DD (en-CA writes dates that way). */
const amsterdamToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date());
const statuses = Object.keys(rfqStatuses) as RfqStatus[];
const size = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export async function generateMetadata({ params }: PageProps<"/admin/requests/[reference]">) {
  return { title: (await params).reference };
}

export default async function RequestPage({ params }: PageProps<"/admin/requests/[reference]">) {
  await requireStaff();
  const t = admin.request;
  const { reference } = await params;
  const rfq = await db.rfq.findUnique({
    where: { reference },
    include: {
      files: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { name: true } } } },
      emails: { orderBy: { kind: "asc" } },
      company: true,
    },
  });
  if (!rfq) notFound();
  const companies = rfq.company
    ? []
    : await db.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, country: true } });
  const answers = rfqAnswers(rfq).filter(([label]) => label !== emails.sales.files);
  const today = amsterdamToday();

  return (
    <>
      <Link href="/admin" className="text-sm">← {t.back}</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl">{rfq.reference}</h1>
        <StatusBadge status={rfq.status} />
      </div>
      <p className="mt-1 text-muted">
        {t.received(when.format(rfq.createdAt))} · {rfq.companyName}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-charcoal">{t.moveTo}</span>
        {statuses
          .filter((s) => s !== rfq.status)
          .map((s) => (
            <form key={s} action={setRfqStatus}>
              <input type="hidden" name="reference" value={rfq.reference} />
              <input type="hidden" name="from" value={rfq.status} />
              <input type="hidden" name="to" value={s} />
              <button type="submit" className={buttonStyles({ variant: "secondary", size: "sm" })}>{rfqStatuses[s]}</button>
            </form>
          ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl">{t.answers}</h2>
            <dl className="mt-3 divide-y divide-line rounded-lg border border-line">
              {answers.map(([label, value]) => (
                <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[2fr_3fr] sm:gap-4">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="whitespace-pre-line break-words">
                    {label === "Email" ? <a href={`mailto:${value}?subject=${encodeURIComponent(rfq.reference)}`}>{value}</a> : value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl">{t.files}</h2>
            {rfq.files.length === 0 ? (
              <p className="mt-2 text-muted">{t.noFiles}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {rfq.files.map((f) => (
                  <li key={f.id}>
                    <a href={`/admin/files/${f.id}`} className="inline-flex items-center gap-2">
                      <Download aria-hidden className="size-4" />
                      {f.fileName}
                    </a>{" "}
                    <span className="text-sm text-muted">({size(f.sizeBytes)})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl">{t.history}</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {rfq.statusHistory.map((h) => (
                <li key={h.id}>
                  <span className="font-semibold text-charcoal">
                    {h.fromStatus ? `${rfqStatuses[h.fromStatus]} → ${rfqStatuses[h.toStatus]}` : t.arrived}
                  </span>
                  <span className="block text-muted">
                    {when.format(h.createdAt)}
                    {h.fromStatus && ` · ${h.changedBy ? t.by(h.changedBy.name) : t.byDeleted}`}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl">{t.emails}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {rfq.emails.map((e) => (
                <li key={e.id}>
                  <span className="font-semibold text-charcoal">{t.emailKinds[e.kind]}</span>
                  <span className={e.sentAt ? "block text-muted" : "block text-danger"}>
                    {e.sentAt ? t.emailSent(when.format(e.sentAt)) : t.emailWaiting(e.attempts)}
                    {!e.sentAt && e.lastError && ` – ${e.lastError}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl">{t.client}</h2>
            {rfq.company ? (
              <p className="mt-2 text-sm">{t.clientLinked(rfq.company.name, day.format(rfq.company.clientSince))}</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">{t.notClient}</p>
                <details className="mt-3 rounded-lg border border-line p-4">
                  <summary className="cursor-pointer font-semibold text-charcoal">{t.markClient}</summary>
                  <form action={markAsClient} className="mt-4 space-y-4">
                    <input type="hidden" name="reference" value={rfq.reference} />
                    {companies.length > 0 && (
                      <div>
                        <label htmlFor="companyId" className="text-sm font-semibold text-charcoal">{t.client}</label>
                        <select id="companyId" name="companyId" defaultValue="" className={fieldStyles()}>
                          <option value="">+ {t.company.name}</option>
                          {companies.map((c) => (
                            <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label htmlFor="name" className="text-sm font-semibold text-charcoal">{t.company.name}</label>
                      <input id="name" name="name" defaultValue={rfq.companyName} maxLength={200} className={fieldStyles()} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="country" className="text-sm font-semibold text-charcoal">{t.company.country}</label>
                        <input id="country" name="country" maxLength={100} className={fieldStyles()} />
                      </div>
                      <div>
                        <label htmlFor="vat" className="text-sm font-semibold text-charcoal">{t.company.vat}</label>
                        <input id="vat" name="vat" maxLength={30} className={fieldStyles()} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="since" className="text-sm font-semibold text-charcoal">{t.company.since}</label>
                      <input id="since" name="since" type="date" defaultValue={today} className={fieldStyles()} />
                    </div>
                    <button type="submit" className={buttonStyles({ size: "sm" })}>{t.company.submit}</button>
                  </form>
                </details>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
