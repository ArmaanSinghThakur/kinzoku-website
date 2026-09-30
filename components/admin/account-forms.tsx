"use client";

import { useActionState } from "react";
import { addStaff, changePassword, staffAction, type PasswordState, type StaffActionState } from "@/app/(admin)/admin/actions";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldStyles } from "@/components/ui/field-styles";
import { admin } from "@/content/admin";

// Admin forms that show a result: new temporary passwords (shown once) and password changes.

function Result({ state }: { state: StaffActionState }) {
  if (!state) return null;
  if (state.error) {
    return (
      <p role="alert" className="text-sm font-semibold text-danger">
        {state.error}
      </p>
    );
  }
  return (
    <div role="status" className="rounded-lg bg-mist p-3 text-sm">
      <p>{state.message}</p>
      {state.password && <p className="mt-1 font-mono text-base font-semibold tracking-wide text-charcoal select-all">{state.password}</p>}
    </div>
  );
}

export function AddStaffForm() {
  const t = admin.staff;
  const [state, action, pending] = useActionState(addStaff, null);
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="staff-name" className="font-semibold text-charcoal">{t.name}</label>
          <input id="staff-name" name="name" required maxLength={200} className={fieldStyles()} />
        </div>
        <div>
          <label htmlFor="staff-email" className="font-semibold text-charcoal">{t.email}</label>
          <input id="staff-email" name="email" type="email" required maxLength={254} className={fieldStyles()} />
        </div>
        <div>
          <label htmlFor="staff-role" className="font-semibold text-charcoal">{t.role}</label>
          <select id="staff-role" name="role" defaultValue="sales" className={fieldStyles()}>
            <option value="sales">{t.roles.sales}</option>
            <option value="admin">{t.roles.admin}</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonStyles({ size: "sm" })}>{t.submit}</button>
      <Result state={state} />
    </form>
  );
}

/** The buttons in one row of the staff list. */
export function StaffRowActions({ id, active }: { id: string; active: boolean }) {
  const t = admin.staff;
  const [state, action, pending] = useActionState(staffAction, null);
  const button = (value: string, label: string) => (
    <button type="submit" name="action" value={value} disabled={pending} className={buttonStyles({ variant: "secondary", size: "sm" })}>
      {label}
    </button>
  );
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-wrap gap-2">
        {button("reset", t.resetPassword)}
        {active && button("end", t.endSessions)}
        {button(active ? "off" : "on", active ? t.switchOff : t.switchOn)}
      </div>
      <Result state={state} />
    </form>
  );
}

export function PasswordForm({ email }: { email: string }) {
  const t = admin.account;
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, null);
  const field = (name: string, label: string, autoComplete: string, hint?: string) => (
    <div>
      <label htmlFor={`password-${name}`} className="font-semibold text-charcoal">{label}</label>
      {hint && <p id={`password-${name}-hint`} className="text-sm text-muted">{hint}</p>}
      <input
        id={`password-${name}`}
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        minLength={name === "current" ? undefined : 12}
        maxLength={128}
        aria-describedby={hint ? `password-${name}-hint` : undefined}
        className={fieldStyles()}
      />
    </div>
  );
  return (
    <form action={action} className="max-w-md space-y-5">
      {/* Tells password managers whose password this is. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      {field("current", t.current, "current-password")}
      {field("new", t.new, "new-password", t.newHint)}
      {field("confirm", t.confirm, "new-password")}
      {state?.error && <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p>}
      {state?.done && <p role="status" className="rounded-lg bg-mist p-3 text-sm">{t.changed}</p>}
      <button type="submit" disabled={pending} className={buttonStyles()}>{t.submit}</button>
    </form>
  );
}
