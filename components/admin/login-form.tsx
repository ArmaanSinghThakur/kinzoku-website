"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { fieldStyles } from "@/components/ui/field-styles";
import { admin } from "@/content/admin";

const t = admin.login;

/**
 * Staff login. Posts to Better Auth's own endpoint (not a Server Action) so its limit on login
 * attempts applies. The same message covers a wrong password and a switched-off account.
 */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (response.ok) {
        router.replace("/admin");
        return;
      }
      const { code } = (await response.json().catch(() => ({}))) as { code?: string };
      setError(
        response.status === 429 ? t.tooMany : response.status < 500 || code === "FAILED_TO_CREATE_SESSION" ? t.wrong : t.failed,
      );
    } catch {
      setError(t.failed);
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <div>
        <label htmlFor="login-email" className="font-semibold text-charcoal">
          {t.email}
        </label>
        <input id="login-email" name="email" type="email" autoComplete="username" required className={fieldStyles()} />
      </div>
      <div>
        <label htmlFor="login-password" className="font-semibold text-charcoal">
          {t.password}
        </label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required className={fieldStyles()} />
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`w-full ${buttonStyles()}`}>
        {busy ? t.sending : t.submit}
      </button>
    </form>
  );
}
