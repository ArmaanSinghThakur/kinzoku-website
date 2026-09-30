"use client";

import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { buttonStyles } from "@/components/ui/button-styles";
import { quoteMailto } from "@/lib/quote-mailto";

type QuoteEmailButtonProps = {
  email: string;
  label: string;
  subject: string;
  fields: string[];
  deliveryOptions: string[];
  /** Product names by ?product= value; omit for the plain (no product) link. */
  products?: Record<string, string>;
};

/**
 * Interim quote request (until Step 15 builds Kinzoku's own form): opens an email with the quote
 * checklist pre-filled. Links like /contact-us?product=wire#quote name the product.
 */
export function QuoteEmailButton({ label, products, ...mail }: QuoteEmailButtonProps) {
  const key = useSearchParams().get("product") ?? "";
  return <QuoteEmailLink label={label} href={quoteMailto({ ...mail, product: products?.[key] })} />;
}

/** The link itself, without reading the address (used as the pre-built fallback). */
export function QuoteEmailLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className={buttonStyles()}>
      <Mail aria-hidden className="size-5" />
      {label}
    </a>
  );
}
