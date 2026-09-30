import { quoteForm as t } from "@/content/quote-form";
import { emails } from "@/content/rfq-status";
import type { Prisma } from "@/lib/generated/prisma/client";

// A request's answers with the form's own labels: used by the emails and the admin area.

export type RfqWithFiles = Prisma.RfqGetPayload<{ include: { files: true } }>;

const shortLabel = (label: string) => label.replace(/ \(choose any\)$/, "");

/** Every answer, labelled as in the form; unanswered questions are left out. */
export function rfqAnswers(rfq: RfqWithFiles): [string, string][] {
  const details = (rfq.details ?? {}) as Record<string, string | string[] | undefined>;
  const list = (value: string | string[] | undefined) => (Array.isArray(value) ? value.join(", ") : value);
  const specification =
    rfq.type === "nails" || rfq.type === "wire" || rfq.type === "bars" ? t.specification[rfq.type].label : "Specification";
  const rows: [string, string | null | undefined][] = [
    [t.type.label, t.type.options[rfq.type]],
    [t.companyName.label, rfq.companyName],
    [t.contactName.label, rfq.contactName],
    [t.email.label, rfq.email],
    [t.phone.label, rfq.phone],
    [shortLabel(t.products.label), list(details.products)],
    [shortLabel(t.finishes.label), list(details.finishes)],
    [specification, rfq.specification],
    [t.dimensions.label, list(details.dimensions)],
    [t.quantity.label, rfq.quantity],
    [t.targetPrice.label, list(details.targetPrice)],
    [t.deliveryCountry.label, rfq.deliveryCountry],
    [t.deliveryTerms.label, rfq.deliveryTerms],
    [t.leadTime.label, list(details.leadTime)],
    ["Message", rfq.message],
    [emails.sales.files, rfq.files.map((f) => f.fileName).join(", ")],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}
