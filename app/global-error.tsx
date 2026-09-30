"use client";

import { ErrorMessage } from "@/components/errors/error-message";
import { HtmlShell } from "@/components/layout/html-shell";
import { enError } from "@/content/i18n/en-error";

// Last resort when a root layout itself fails. It replaces the whole document, so it brings its
// own shell and deliberately leaves out the header and footer (they may be what failed).
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <HtmlShell lang="en">
      <title>{`${enError.title} | Kinzoku`}</title>
      <main className="flex-1">
        <ErrorMessage onRetry={retry} />
      </main>
    </HtmlShell>
  );
}
