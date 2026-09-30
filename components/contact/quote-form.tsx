"use client";

import { CircleCheck } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldErrorStyles, fieldStyles } from "@/components/ui/field-styles";
import { acceptedFiles, productTypes, quoteForm as t, requestTypes, type RequestType } from "@/content/quote-form";
import type { QuoteErrors } from "@/lib/quote-validation";
import { routes } from "@/lib/routes";

type Status = "idle" | "invalid" | "sending" | "failed" | "rate_limited" | "sent";

const noSubscription = () => () => {};
// The checks (with Zod) load when the visitor first clicks into the form, not with the page.
const loadChecks = () => import("@/lib/quote-validation");
const isProductType = (type: string) => (productTypes as readonly string[]).includes(type);

/** The request type named by ?product= in links from the product and CBAM pages. */
function useLinkedType(): RequestType | "" {
  return useSyncExternalStore(
    noSubscription,
    () => t.fromLink[new URLSearchParams(window.location.search).get("product") ?? ""] ?? "",
    () => "", // while the page is pre-built
  );
}

/**
 * Kinzoku's quote form (replaces the Google Form). Questions change with the request type; every
 * field is checked before sending and again on the server, with the message beside the field.
 * Nothing typed is lost when sending fails: the form stays as it is and offers "Try again".
 */
export function QuoteForm({ email }: { email: string }) {
  const linkedType = useLinkedType();
  const [chosenType, setChosenType] = useState<RequestType | "">("");
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);

  const type = chosenType || linkedType;
  const isProduct = isProductType(type);
  const errorCount = Object.values(errors).filter(Boolean).length;

  // Move to the first field to correct, or to the confirmation once sent.
  useEffect(() => {
    if (status === "invalid") formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    if (status === "sent") sentRef.current?.focus();
  }, [status, errors]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return; // a second click while the first one is still going
    busy.current = true;
    const data = new FormData(event.currentTarget);
    try {
      const { validateQuote } = await loadChecks();
      const checked = validateQuote(data);
      if (!checked.ok) {
        setErrors(checked.errors);
        setStatus("invalid");
        return;
      }
      setErrors({});
      setStatus("sending");
      const response = await fetch("/api/quote", { method: "POST", body: data });
      const result = (await response.json().catch(() => ({}))) as { reference?: string | null; errors?: QuoteErrors };
      if (response.ok) {
        setReference(result.reference ?? null);
        setFileNames([]);
        setStatus("sent");
      } else if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        setStatus("invalid");
      } else {
        setStatus(response.status === 429 ? "rate_limited" : "failed");
      }
    } catch {
      // No connection (or the checks couldn't load): the form keeps everything for "Try again".
      setStatus("failed");
    } finally {
      busy.current = false;
    }
  }

  /** Once a field has a message, check it again as it is corrected. */
  async function onChange(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name;
    if (!errors[name]) return;
    const data = new FormData(event.currentTarget);
    const checks = await loadChecks().catch(() => null);
    if (!checks) return;
    const checked = checks.validateQuote(data);
    setErrors((current) => ({ ...current, [name]: checked.ok ? undefined : checked.errors[name] }));
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-lg bg-white p-6 shadow-card sm:p-8">
        <h3 ref={sentRef} tabIndex={-1} className="flex items-center gap-2 text-xl focus:outline-none">
          <CircleCheck aria-hidden className="size-6 shrink-0 text-steel" />
          {t.sent.title}
        </h3>
        {reference && (
          <p className="mt-3">
            {t.sent.reference} <strong className="font-heading text-charcoal">{reference}</strong>
          </p>
        )}
        <p className="mt-2 text-muted">{t.sent.next}</p>
        <button type="button" onClick={() => setStatus("idle")} className={`mt-6 ${buttonStyles({ variant: "secondary" })}`}>
          {t.sent.another}
        </button>
      </div>
    );
  }

  const text = (name: string) => ({ name, error: errors[name] });

  return (
    <form
      ref={formRef}
      action="/api/quote"
      method="post"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      onChange={onChange}
      onFocus={() => void loadChecks()}
      aria-busy={status === "sending"}
      className="space-y-8 rounded-lg bg-white p-6 shadow-card sm:p-8"
    >
      {status === "invalid" && errorCount > 0 && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-4 font-semibold text-danger">
          {t.summary(errorCount)}
        </p>
      )}

      <Field {...text("type")} label={t.type.label}>
        {(props) => (
          <select
            {...props}
            value={type}
            onChange={(e) => {
              setChosenType(e.target.value as RequestType);
              setErrors({});
            }}
            required
          >
            <option value="" disabled>
              {t.type.choose}
            </option>
            {requestTypes.map((value) => (
              <option key={value} value={value}>
                {t.type.options[value]}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Group title={t.groups.company}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field {...text("companyName")} label={t.companyName.label}>
            {(props) => <input {...props} autoComplete="organization" maxLength={200} required />}
          </Field>
          <Field {...text("contactName")} label={t.contactName.label}>
            {(props) => <input {...props} autoComplete="name" maxLength={200} required />}
          </Field>
          <Field {...text("email")} label={t.email.label}>
            {(props) => <input {...props} type="email" autoComplete="email" maxLength={254} required />}
          </Field>
          <Field {...text("phone")} label={t.phone.label} hint={t.phone.hint} optional={!isProduct}>
            {(props) => <input {...props} type="tel" autoComplete="tel" maxLength={50} required={isProduct} />}
          </Field>
        </div>
      </Group>

      {isProduct && (
        <Group title={t.groups.requirement}>
          <Choices
            key={type}
            name="products"
            label={t.products.label}
            options={t.products.options[type as keyof typeof t.products.options]}
            error={errors.products}
          />
          {type === "nails" && <Choices name="finishes" label={t.finishes.label} options={t.finishes.options} error={errors.finishes} />}
          <Field
            {...text("specification")}
            label={t.specification[type as keyof typeof t.products.options].label}
            hint={t.specification[type as keyof typeof t.products.options].hint}
          >
            {(props) => <textarea {...props} rows={3} maxLength={2000} required />}
          </Field>
          <Field {...text("dimensions")} label={t.dimensions.label} optional>
            {(props) => <textarea {...props} rows={2} maxLength={2000} />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field {...text("quantity")} label={t.quantity.label} hint={t.quantity.hint} optional>
              {(props) => <input {...props} maxLength={100} />}
            </Field>
            <Field {...text("targetPrice")} label={t.targetPrice.label} optional>
              {(props) => <input {...props} maxLength={100} />}
            </Field>
          </div>
        </Group>
      )}

      {isProduct && (
        <Group title={t.groups.delivery}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field {...text("deliveryCountry")} label={t.deliveryCountry.label}>
              {(props) => <input {...props} maxLength={200} required />}
            </Field>
            <Field {...text("deliveryTerms")} label={t.deliveryTerms.label} optional>
              {(props) => (
                <select {...props} defaultValue="">
                  <option value="">{t.deliveryTerms.choose}</option>
                  {t.deliveryTerms.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <Choices name="leadTime" label={t.leadTime.label} options={t.leadTime.options} error={errors.leadTime} single optional />
        </Group>
      )}

      <Group title={isProduct ? t.groups.more : undefined}>
        <Field
          {...text("message")}
          label={isProduct ? t.message.label.product : t.message.label[type === "cbam_advisory" ? "cbam_advisory" : "other"]}
          optional={isProduct}
        >
          {(props) => <textarea {...props} rows={4} maxLength={5000} required={!isProduct} />}
        </Field>
        <Field {...text("files")} label={t.files.label} hint={t.files.hint} optional>
          {(props) => (
            <input
              {...props}
              type="file"
              multiple
              accept={acceptedFiles}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFileNames([...(e.target.files ?? [])].map((f) => f.name))}
              className={`${props.className} file:mr-4 file:rounded-md file:border-0 file:bg-mist file:px-3 file:py-1.5 file:font-semibold file:text-charcoal`}
            />
          )}
        </Field>
        {fileNames.length > 0 && (
          <ul className="-mt-3 list-disc pl-6 text-sm text-muted">
            {fileNames.map((name, i) => (
              <li key={`${i}-${name}`}>{name}</li>
            ))}
          </ul>
        )}
      </Group>

      {/* Spam trap: hidden from people and screen readers, filled in by robots. */}
      <div aria-hidden className="sr-only">
        <label>
          {t.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <noscript>
        <p className="font-semibold text-danger">{t.noScript}</p>
      </noscript>

      {(status === "failed" || status === "rate_limited") && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-4 font-semibold text-danger">
          {status === "failed" ? t.failed : t.rateLimited}{" "}
          {status === "rate_limited" && <a href={`mailto:${email}`}>{email}</a>}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "sending"} className={`shrink-0 ${buttonStyles()}`}>
          {status === "sending" ? t.sending : status === "failed" ? t.retry : t.submit}
        </button>
        <p className="text-sm text-muted">
          {t.privacy.before} <a href={routes.privacy}>{t.privacy.link}</a>.
        </p>
      </div>
    </form>
  );
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      {title && <legend className="mb-4 font-heading text-lg font-semibold text-charcoal">{title}</legend>}
      {children}
    </fieldset>
  );
}

type ControlProps = {
  id: string;
  name: string;
  className: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

/** Label, optional hint, the control and its message, wired together for screen readers. */
function Field(props: {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: (control: ControlProps) => ReactNode;
}) {
  const { name, label, hint, optional, error, children } = props;
  const id = `quote-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="font-semibold text-charcoal">
        {label}
        {optional && <span className="font-normal text-muted"> ({t.optional})</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        name,
        className: fieldStyles(!!error),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {error && (
        <p id={`${id}-error`} className={fieldErrorStyles}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Checkboxes, or radio buttons with `single`. */
function Choices(props: { name: string; label: string; options: readonly string[]; error?: string; single?: boolean; optional?: boolean }) {
  const { name, label, options, error, single, optional } = props;
  const id = `quote-${name}`;
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="font-semibold text-charcoal">
        {label}
        {optional && <span className="font-normal text-muted"> ({t.optional})</span>}
      </legend>
      <div className={`mt-2 grid gap-2 ${single ? "" : "sm:grid-cols-2"}`}>
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2.5">
            <input type={single ? "radio" : "checkbox"} name={name} value={option} className="mt-1 size-4 shrink-0 accent-steel" />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className={fieldErrorStyles}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
