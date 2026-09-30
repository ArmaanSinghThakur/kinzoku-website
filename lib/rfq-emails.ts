import { quoteForm as t } from "@/content/quote-form";
import { emails } from "@/content/rfq-status";
import type { Prisma } from "@/lib/generated/prisma/client";
import { mailSettings } from "@/lib/mailer";
import { site } from "@/lib/site";
import { uploadPath } from "@/lib/uploads";

// The two emails sent for each quote request: the buyer's confirmation with their private status
// link, and the alert to the sales team with every answer and the attached files. Each has a plain
// text and an HTML version; everything the buyer typed is escaped in the HTML.

type RfqWithFiles = Prisma.RfqGetPayload<{ include: { files: true } }>;

/** Attach the files to the sales alert up to this total (mail servers refuse very large emails). */
const maxAttachmentBytes = 20 * 1024 * 1024;

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Amsterdam" });
const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
/** Email subjects are one line, whatever was typed into the form. */
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();
const shortLabel = (label: string) => label.replace(/ \(choose any\)$/, "");

/** Every answer, labelled as in the form; unanswered questions are left out. */
function answers(rfq: RfqWithFiles): [string, string][] {
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

const signature = [
  site.name,
  `${site.email} · ${site.phone.display}`,
  `${site.address.locality}, ${site.address.country} · KvK ${site.kvk}`,
];

function textTable(rows: [string, string][]) {
  return rows.map(([label, value]) => `${label}: ${value.includes("\n") ? `\n  ${value.replace(/\n/g, "\n  ")}` : value}`).join("\n");
}

function htmlTable(rows: [string, string][]) {
  const cell = "padding:8px 12px 8px 0;border-top:1px solid #e2e5e9;vertical-align:top;font-size:14px;";
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:8px 0 24px">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="${cell}color:#5a6270;width:38%">${escapeHtml(label)}</td><td style="${cell}color:#1f2328">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
}

function htmlLayout(content: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2328;line-height:1.5">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
<div style="background:#14171a;padding:16px 24px;border-radius:8px 8px 0 0;color:#f2b705;font-weight:bold;font-size:20px;letter-spacing:1px">KINZOKU</div>
<div style="background:#ffffff;padding:24px;border-radius:0 0 8px 8px">${content}
<p style="margin:24px 0 0;font-size:13px;color:#5a6270">${signature.map(escapeHtml).join("<br>")}</p></div>
</div></body></html>`;
}

const p = (text: string, style = "") => `<p style="margin:0 0 12px;${style}">${escapeHtml(text)}</p>`;

/** The buyer's confirmation with the private link to their status page. */
export function buyerConfirmation(rfq: RfqWithFiles, statusUrl: string) {
  const b = emails.buyer;
  const rows = answers(rfq);
  const text = [
    b.greeting(rfq.contactName),
    "",
    b.thanks(rfq.reference),
    b.next,
    "",
    b.follow,
    statusUrl,
    b.private,
    "",
    `${b.summary}:`,
    textTable(rows),
    "",
    b.signOff,
    ...signature,
    "",
    b.why,
  ].join("\n");
  const html = htmlLayout(
    [
      p(b.greeting(rfq.contactName)),
      // The reference in bold and never split at its hyphens.
      p(b.thanks(rfq.reference)).replace(rfq.reference, `<strong style="white-space:nowrap">${rfq.reference}</strong>`),
      p(b.next),
      `<p style="margin:20px 0"><a href="${escapeHtml(statusUrl)}" style="display:inline-block;background:#f2b705;color:#14171a;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none">${escapeHtml(b.button)}</a></p>`,
      p(b.private, "font-size:13px;color:#5a6270"),
      `<h2 style="margin:24px 0 0;font-size:16px">${escapeHtml(b.summary)}</h2>`,
      htmlTable(rows),
      p(b.signOff),
      p(b.why, "font-size:12px;color:#5a6270"),
    ].join("\n"),
  );
  return {
    to: { name: oneLine(rfq.contactName), address: rfq.email },
    subject: oneLine(b.subject(rfq.reference)),
    text,
    html,
  };
}

/** The alert to the sales team: every answer, the files attached, and replies go to the buyer. */
export function salesAlert(rfq: RfqWithFiles) {
  const s = emails.sales;
  const rows = answers(rfq);
  const attach = rfq.files.length > 0 && rfq.files.reduce((sum, f) => sum + f.sizeBytes, 0) <= maxAttachmentBytes;
  const filesNote = rfq.files.length === 0 ? [] : [attach ? s.filesAttached : s.filesTooLarge];
  const intro = s.intro(rfq.reference, dateTime.format(rfq.createdAt));
  return {
    to: mailSettings.salesEmail,
    replyTo: { name: oneLine(rfq.contactName), address: rfq.email },
    subject: oneLine(s.subject(rfq.reference, t.type.options[rfq.type], rfq.companyName)),
    text: [intro, s.reply, ...filesNote, "", textTable(rows)].join("\n"),
    html: htmlLayout([p(intro, "font-weight:bold"), p(s.reply), ...filesNote.map((n) => p(n)), htmlTable(rows)].join("\n")),
    attachments: attach
      ? rfq.files.map((f) => ({ filename: f.fileName, path: uploadPath(f.storagePath), contentType: f.mimeType }))
      : [],
  };
}
