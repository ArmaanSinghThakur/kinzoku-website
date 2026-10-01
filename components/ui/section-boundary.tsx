"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { enError } from "@/content/i18n/en-error";
import { buttonStyles } from "./button-styles";

/**
 * Wrap interactive sections (calculator, quote form, chat) so a failure there shows a short
 * message in place while the rest of the page keeps working.
 */
export function SectionBoundary({ children, message = enError.section }: { children: ReactNode; message?: string }) {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-mist p-6">
          <p>{message}</p>
          <button type="button" onClick={resetErrorBoundary} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            {enError.retry}
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
