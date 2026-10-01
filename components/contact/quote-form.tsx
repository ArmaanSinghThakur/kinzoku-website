"use client";

import { clsx } from "clsx";
import { Check } from "lucide-react";
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
type StepKey = "product" | "quantity" | "destination" | "contact";

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
 *
 * Laid out in 4 steps (redesign plan): product → quantity → destination → contact. All steps stay
 * on the page, so nothing is hidden and the checks work exactly as before; the step tracker shows
 * where you are and what is complete.
 */
export function QuoteForm({ email }: { email: string }) {
  const linkedType = useLinkedType();
  const [chosenType, setChosenType] = useState<RequestType | "">("");
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<StepKey>("product");
  const [filled, setFilled] = useState<Partial<Record<StepKey, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);

  const type = chosenType || linkedType;
  const isProduct = isProductType(type);
  const errorCount = Object.values(errors).filter(Boolean).length;
  // Requests that aren't for a product (CBAM advisory, something else) only have the first and last step.
  const steps: StepKey[] = isProduct ? ["product", "quantity", "destination", "contact"] : ["product", "contact"];

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

  /** Which steps have their required answers (for the step tracker only; the checks are unchanged). */
  function trackProgress(form: HTMLFormElement) {
    const data = new FormData(form);
    const has = (name: string) => String(data.get(name) ?? "").trim() !== "";
    const product = isProductType(String(data.get("type") ?? ""));
    setFilled({
      product: has("type") && (!product || has("specification")),
      quantity: has("quantity") || has("targetPrice"),
      destination: has("deliveryCountry"),
      contact: has("companyName") && has("contactName") && has("email") && (product ? has("phone") : has("message")),
    });
  }

  /** Step tracker: scroll to a step and put the cursor in its first field. */
  function goToStep(key: StepKey) {
    const step = formRef.current?.querySelector<HTMLElement>(`[data-step="${key}"]`);
    if (!step) return;
    const smooth = matchMedia("(prefers-reduced-motion: no-preference)").matches;
    step.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    step.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-butter ring-8 ring-butter/30">
          <Check className="size-6" />
        </span>
        <h3 ref={sentRef} tabIndex={-1} className="mt-6 text-2xl focus:outline-none">
          {t.sent.title}
        </h3>
        {reference && (
          <p className="mt-4">
            {t.sent.reference} <strong className="rounded-md bg-mist px-2 py-1 font-mono font-medium text-graphite">{reference}</strong>
          </p>
        )}
        <p className="mt-3 text-muted">{t.sent.next}</p>
        <button
          type="button"
          onClick={() => {
            setFilled({});
            setCurrentStep("product");
            setStatus("idle");
          }}
          className={`mt-8 ${buttonStyles({ variant: "secondary" })}`}
        >
          {t.sent.another}
        </button>
      </div>
    );
  }

  const text = (name: string) => ({ name, error: errors[name] });
  const stepProps = (key: StepKey) => ({
    stepKey: key,
    number: steps.indexOf(key) + 1,
    title: t.steps[key],
    done: !!filled[key],
    current: currentStep === key,
    last: key === steps[steps.length - 1],
  });

  return (
    <form
      ref={formRef}
      action="/api/quote"
      method="post"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      onChange={onChange}
      onInput={(event) => trackProgress(event.currentTarget)}
      onFocus={(event) => {
        void loadChecks();
        const step = (event.target as Element).closest<HTMLElement>("[data-step]")?.dataset.step as StepKey | undefined;
        if (step) setCurrentStep(step);
      }}
      aria-busy={status === "sending"}
      className="min-w-0 rounded-2xl border border-line bg-white shadow-card"
    >
      <StepTracker steps={steps} current={currentStep} filled={filled} onSelect={goToStep} />

      <div className="space-y-10 p-6 sm:p-8">
        {status === "invalid" && errorCount > 0 && (
          <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-4 font-semibold text-danger">
            {t.summary(errorCount)}
          </p>
        )}

        <Step {...stepProps("product")} description={isProduct ? t.groups.requirement : undefined}>
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

          {isProduct && (
            <>
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
            </>
          )}
        </Step>

        {isProduct && (
          <Step {...stepProps("quantity")}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field {...text("quantity")} label={t.quantity.label} hint={t.quantity.hint} optional>
                {(props) => <input {...props} maxLength={100} />}
              </Field>
              <Field {...text("targetPrice")} label={t.targetPrice.label} optional>
                {(props) => <input {...props} maxLength={100} />}
              </Field>
            </div>
          </Step>
        )}

        {isProduct && (
          <Step {...stepProps("destination")} description={t.groups.delivery}>
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
          </Step>
        )}

        <Step {...stepProps("contact")} description={t.groups.company}>
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
                  className={`${props.className} cursor-pointer border-dashed file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-mist file:px-3 file:py-1.5 file:font-semibold file:text-graphite hover:file:bg-butter`}
                />
              )}
            </Field>
            {fileNames.length > 0 && (
              <ul className="-mt-3 space-y-1 text-sm text-muted">
                {fileNames.map((name, i) => (
                  <li key={`${i}-${name}`} className="flex items-center gap-2">
                    <Check aria-hidden className="size-4 shrink-0 text-forge" />
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </Group>
        </Step>

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

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <button type="submit" disabled={status === "sending"} className={`shrink-0 ${buttonStyles()}`}>
            {status === "sending" ? t.sending : status === "failed" ? t.retry : t.submit}
          </button>
          <p className="text-sm text-muted">
            {t.privacy.before} <a href={routes.privacy}>{t.privacy.link}</a>.
          </p>
        </div>
      </div>
    </form>
  );
}

/**
 * The step list at the top of the form: where you are, what is complete, and a jump to each step.
 * Every step stays on the page, so this is navigation, not a gate.
 */
function StepTracker(props: {
  steps: StepKey[];
  current: StepKey;
  filled: Partial<Record<StepKey, boolean>>;
  onSelect: (key: StepKey) => void;
}) {
  const { steps, current, filled, onSelect } = props;
  const done = steps.filter((key) => filled[key]).length;
  return (
    <div className="sticky top-4 z-10 rounded-t-2xl border-b border-line bg-white/90 px-3 pt-3 backdrop-blur-md sm:px-6 lg:top-20">
      <ol aria-label={t.steps.label} className="flex gap-1 overflow-x-auto pb-3 sm:gap-2">
        {steps.map((key, i) => (
          // On phones only the current step shows its name; the others show their number.
          <li key={key} className={clsx("flex min-w-0", current === key ? "flex-1" : "flex-none sm:flex-1")}>
            <button
              type="button"
              onClick={() => onSelect(key)}
              aria-current={current === key ? "step" : undefined}
              className={clsx(
                "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-chalk",
                current === key && "bg-chalk",
              )}
            >
              <span
                className={clsx(
                  "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[0.8125rem] font-medium transition-colors duration-300",
                  filled[key] ? "bg-forge text-chalk" : current === key ? "bg-butter text-graphite" : "bg-mist text-graphite",
                )}
              >
                {filled[key] ? <Check aria-hidden className="size-4" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className={clsx("truncate text-sm font-semibold text-graphite", current !== key && "sr-only sm:not-sr-only")}>
                {t.steps[key]}
                {filled[key] && <span className="sr-only"> ({t.steps.done})</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {/* Progress along the wire: Butter fills as steps are completed. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-mist">
        <span
          className="block h-full origin-left bg-butter transition-[scale] duration-500 ease-out"
          style={{ scale: `${done / steps.length} 1` }}
        />
      </span>
    </div>
  );
}

/** One step: a numbered station on the wire that runs down the form's left edge. */
function Step(props: {
  stepKey: StepKey;
  number: number;
  title: string;
  description?: string;
  done: boolean;
  current: boolean;
  last: boolean;
  children: ReactNode;
}) {
  const { stepKey, number, title, description, done, current, last, children } = props;
  return (
    <fieldset data-step={stepKey} className="relative min-w-0 scroll-mt-44 pl-12 sm:pl-16">
      {!last && (
        <span
          aria-hidden
          className={clsx(
            "absolute top-12 -bottom-10 left-[1.1875rem] w-0.5 rounded-full transition-colors duration-500",
            done ? "bg-butter" : "bg-mist",
          )}
        />
      )}
      <legend className="font-heading text-xl font-semibold text-graphite">
        <span
          aria-hidden
          className={clsx(
            "absolute top-0 left-0 grid size-10 place-items-center rounded-full font-mono text-sm font-medium transition-colors duration-300",
            done ? "bg-forge text-chalk" : current ? "bg-butter text-graphite ring-4 ring-butter/35" : "bg-mist text-graphite",
          )}
        >
          {done ? <Check className="size-5" /> : String(number).padStart(2, "0")}
        </span>
        <span className="block pt-1.5">{title}</span>
      </legend>
      {description && <p className="spec-label mt-1 text-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </fieldset>
  );
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 space-y-5 pt-2">
      {title && <legend className="spec-label mb-4 text-forge">{title}</legend>}
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
      <label htmlFor={id} className="font-semibold text-graphite">
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

/** Checkboxes, or radio buttons with `single`, as selectable tiles. */
function Choices(props: { name: string; label: string; options: readonly string[]; error?: string; single?: boolean; optional?: boolean }) {
  const { name, label, options, error, single, optional } = props;
  const id = `quote-${name}`;
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="min-w-0">
      <legend className="font-semibold text-graphite">
        {label}
        {optional && <span className="font-normal text-muted"> ({t.optional})</span>}
      </legend>
      <div className={`mt-2 grid gap-2 ${single ? "" : "sm:grid-cols-2"}`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-3.5 py-3 transition-colors hover:border-graphite/35 has-checked:border-forge has-checked:bg-mist/50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forge"
          >
            <input type={single ? "radio" : "checkbox"} name={name} value={option} className="mt-1 size-4 shrink-0 accent-forge" />
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
