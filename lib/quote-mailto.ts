// Interim quote request by email (until Step 15): a mailto link with the quote checklist pre-filled.
// Plain function so both the pre-built page and the client button can use it.
type QuoteMailto = { email: string; subject: string; fields: string[]; deliveryOptions: string[]; product?: string };

export function quoteMailto({ email, subject, fields, deliveryOptions, product }: QuoteMailto) {
  const fullSubject = product ? `${subject} – ${product}` : subject;
  const body = [
    ...(product ? [`Product: ${product}`, ""] : []),
    ...fields.map((field, i) => (i === fields.length - 1 ? `${field} (${deliveryOptions.join(" / ")}):` : `${field}:`)),
  ].join("\r\n");
  return `mailto:${email}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
}
