"use client";

import { ErrorMessage } from "@/components/errors/error-message";

// A page failed to render: header and footer stay, the page area shows this with "Try again".
export default function SiteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorMessage onRetry={retry} />;
}
