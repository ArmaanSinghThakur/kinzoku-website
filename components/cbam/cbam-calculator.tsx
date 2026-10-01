"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldErrorStyles, fieldStyles } from "@/components/ui/field-styles";
import type { cbamPage } from "@/content/pages/cbam";
import { estimateCbam, formatCbam } from "@/lib/cbam";

type Text = (typeof cbamPage)["calculator"];

const toNumber = (value: string) => (value.trim() === "" ? NaN : Number(value));

/**
 * CBAM liability calculator. Results update as soon as the inputs are valid; errors appear next
 * to the field (not in a pop-up) once a field has been left or the form submitted.
 */
export function CbamCalculator({ t }: { t: Text }) {
  const id = useId();
  const [route, setRoute] = useState(0);
  const [tonnes, setTonnes] = useState("");
  const [price, setPrice] = useState(String(t.defaultPrice));
  const [touched, setTouched] = useState({ tonnes: false, price: false });
  const tonnesRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const tonnesValue = toNumber(tonnes);
  const priceValue = toNumber(price);
  const tonnesOk = Number.isFinite(tonnesValue) && tonnesValue > 0;
  const priceOk = Number.isFinite(priceValue) && priceValue >= 0;
  const result =
    tonnesOk && priceOk
      ? estimateCbam({ factor: t.routes[route].factor, tonnes: tonnesValue, price: priceValue, phaseInRate: t.phaseInRate })
      : null;

  const tonnesError = touched.tonnes && !tonnesOk ? t.errors.tonnes : null;
  const priceError = touched.price && !priceOk ? t.errors.price : null;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ tonnes: true, price: true });
    if (!tonnesOk) tonnesRef.current?.focus();
    else if (!priceOk) priceRef.current?.focus();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div>
          <label htmlFor={`${id}-route`} className="font-semibold text-graphite">
            {t.routeLabel}
          </label>
          <select
            id={`${id}-route`}
            value={route}
            onChange={(e) => setRoute(Number(e.target.value))}
            className={fieldStyles()}
          >
            {t.routes.map((r, i) => (
              <option key={r.label} value={i}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-tonnes`} className="font-semibold text-graphite">
            {t.tonnesLabel}
          </label>
          <input
            ref={tonnesRef}
            id={`${id}-tonnes`}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder={t.tonnesPlaceholder}
            value={tonnes}
            onChange={(e) => setTonnes(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, tonnes: true }))}
            aria-invalid={tonnesError ? true : undefined}
            aria-describedby={tonnesError ? `${id}-tonnes-error` : undefined}
            className={fieldStyles(!!tonnesError)}
          />
          {/* Space kept for the message: leaving the field shows it on the button's mouse-down, and
              a button that moved would lose the click. */}
          <p id={`${id}-tonnes-error`} className={`${fieldErrorStyles} min-h-5`}>
            {tonnesError}
          </p>
        </div>

        <div>
          <label htmlFor={`${id}-price`} className="font-semibold text-graphite">
            {t.priceLabel}
          </label>
          <input
            ref={priceRef}
            id={`${id}-price`}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, price: true }))}
            aria-invalid={priceError ? true : undefined}
            aria-describedby={priceError ? `${id}-price-error` : undefined}
            className={fieldStyles(!!priceError)}
          />
          <p id={`${id}-price-error`} className={`${fieldErrorStyles} min-h-5`}>
            {priceError}
          </p>
        </div>

        <button type="submit" className={buttonStyles()}>
          {t.button}
        </button>
      </form>

      <div className="relative overflow-hidden rounded-xl bg-forge p-6 text-chalk sm:p-8 lg:sticky lg:top-24 lg:self-start">
        {/* Datasheet grid behind the readout. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(247_245_240/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(247_245_240/0.05)_1px,transparent_1px)] bg-[size:20px_20px]"
        />
        <h3 className="relative text-xl text-chalk">{t.resultsTitle}</h3>
        {/* Announced to screen readers when the estimate changes. */}
        <dl aria-live="polite" className="relative mt-4 divide-y divide-chalk/15">
          {[
            [t.results.emissions, result ? formatCbam.emissions(result.emissions) : "—"],
            [t.results.phaseIn, t.results.phaseInValue],
            [t.results.certificates, result ? formatCbam.certificates(result.certificates) : "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="text-chalk/80">{label}</dt>
              <dd className="font-mono font-medium tabular-nums">{value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-chalk/80">{t.results.cost}</dt>
            <dd className="font-heading text-3xl font-extrabold text-butter tabular-nums">{result ? formatCbam.cost(result.cost) : "—"}</dd>
          </div>
        </dl>
        <p className="relative mt-4 text-sm text-chalk/75">{t.disclaimer}</p>
      </div>
    </div>
  );
}
