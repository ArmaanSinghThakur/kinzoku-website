import * as z from "zod/mini";
import { acceptedFiles, maxFileMb, maxFiles, productTypes, quoteForm as t } from "@/content/quote-form";

// The quote form's checks, run in the browser before sending and again by /api/quote (plan: "same
// checks in the browser and on the server"). zod/mini keeps the browser code small. The server
// additionally checks each file's real contents (lib/uploads.ts).

const required = (max: number, error: string) => z.string(error).check(z.maxLength(max, t.tooLong(max)));
const optional = (max: number) => z.optional(z.string().check(z.maxLength(max, t.tooLong(max))));
// Country code optional, at least 6 digits; spaces, brackets, dots, slashes and dashes allowed.
const phone = z.string(t.phone.error).check(
  z.maxLength(50, t.tooLong(50)),
  z.regex(/^\+?(?:[\s()./-]*\d){6,}[\s()./-]*$/, t.phone.error),
);

const contact = {
  companyName: required(200, t.companyName.error),
  contactName: required(200, t.contactName.error),
  email: z.email(t.email.error).check(z.maxLength(254, t.email.error)),
};

const productRequest = z.object({
  type: z.enum(productTypes, t.type.error),
  ...contact,
  phone,
  products: z.array(z.enum(Object.values(t.products.options).flat(), t.choice)).check(z.maxLength(20, t.choice)),
  finishes: z.array(z.enum(t.finishes.options, t.choice)).check(z.maxLength(20, t.choice)),
  specification: required(2000, t.specification.error),
  dimensions: optional(2000),
  quantity: optional(100),
  targetPrice: optional(100),
  deliveryCountry: required(200, t.deliveryCountry.error),
  deliveryTerms: z.optional(z.enum(t.deliveryTerms.options, t.choice)),
  leadTime: z.optional(z.enum(t.leadTime.options, t.choice)),
  message: optional(5000),
});

const otherRequest = z.object({
  type: z.enum(["cbam_advisory", "other"], t.type.error),
  ...contact,
  phone: z.optional(phone),
  message: required(5000, t.message.error),
});

const quoteSchema = z.discriminatedUnion("type", [productRequest, otherRequest], t.type.error);
export type QuoteRequest = z.output<typeof quoteSchema>;
export type QuoteErrors = Partial<Record<string, string>>;

const lists = new Set(["products", "finishes"]);
const acceptedExtensions = new Set(acceptedFiles.split(","));

/** Form fields as plain values: text trimmed, empty answers left out, checkbox groups as lists. */
function readFields(form: FormData) {
  const fields: Record<string, string | string[]> = { products: [], finishes: [] };
  for (const [name, value] of form) {
    if (typeof value !== "string" || name === "files") continue;
    const text = value.trim();
    if (!text) continue;
    if (lists.has(name)) (fields[name] as string[]).push(text);
    else fields[name] = text;
  }
  return fields;
}

/** Attached files, without the empty entry browsers send when no file was chosen. */
export function readFiles(form: FormData) {
  return form.getAll("files").filter((f): f is File => typeof f !== "string" && (f.size > 0 || f.name !== ""));
}

function checkFiles(files: File[]) {
  if (files.length > maxFiles) return t.files.tooMany;
  for (const file of files) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (file.size === 0) return t.files.empty(file.name);
    if (file.size > maxFileMb * 1024 * 1024) return t.files.tooBig(file.name);
    if (!acceptedExtensions.has(extension)) return t.files.wrongType(file.name);
  }
  return null;
}

/** Checks a submitted quote form. Errors are keyed by field name, one message per field. */
export function validateQuote(form: FormData) {
  const files = readFiles(form);
  const result = quoteSchema.safeParse(readFields(form));
  const errors: QuoteErrors = {};
  if (!result.success) {
    for (const issue of result.error.issues) errors[String(issue.path[0] ?? "type")] ??= issue.message;
  }
  const fileError = checkFiles(files);
  if (fileError) errors.files = fileError;
  return result.success && !fileError
    ? { ok: true as const, data: result.data, files }
    : { ok: false as const, errors };
}
