import { Check, Mail } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/layout/whatsapp-button";
import { BuyerChat } from "@/components/live/buyer-chat";
import { buttonStyles } from "@/components/ui/button-styles";
import { quoteForm } from "@/content/quote-form";
import { rfqStatuses, statusPage as t } from "@/content/rfq-status";
import { cn } from "@/lib/cn";
import { db } from "@/lib/db";
import { hashStatusToken } from "@/lib/rfq";
import { site, whatsappHref } from "@/lib/site";

// The buyer's private status page, opened from the link in their confirmation email (plan: "no
// password, no sign-up"). The status updates live and the buyer can chat with the sales team.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: t.meta.title,
  robots: { index: false, follow: false },
  // The address contains the secret, so it is never passed on to other sites.
  referrer: "no-referrer",
};

const steps = Object.keys(rfqStatuses) as (keyof typeof rfqStatuses)[];
const day = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Europe/Amsterdam" });

export default async function RfqStatusPage({ params }: PageProps<"/rfq/status/[token]">) {
  const { token } = await params;
  // Links we send carry 32 random bytes (43 characters); anything else is not looked up.
  if (!/^[\w-]{43}$/.test(token)) notFound();
  const rfq = await db.rfq.findUnique({
    where: { statusTokenHash: hashStatusToken(token) },
    select: {
      reference: true,
      type: true,
      status: true,
      specification: true,
      quantity: true,
      createdAt: true,
      statusHistory: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!rfq) notFound();

  const reachedOn = new Map(rfq.statusHistory.map((h) => [h.toStatus, h.createdAt]));
  const current = steps.indexOf(rfq.status);
  const summary = [quoteForm.type.options[rfq.type], rfq.specification, rfq.quantity].filter(Boolean);

  return (
    <>
      <section data-tone="mist" className="relative overflow-hidden border-b border-line bg-mist">
        <div aria-hidden className="wire-mesh absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
        <div className="site-container relative py-12 sm:py-16">
          <h1 className="load-rise text-title">
            {t.title} <span className="whitespace-nowrap">{rfq.reference}</span>
          </h1>
          <p className="mt-4 text-lg text-muted">{t.received(day.format(rfq.createdAt))}</p>
        </div>
      </section>

      <section data-tone="chalk" className="py-12 sm:py-16">
        <div className="site-container grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl">{t.stepsTitle}</h2>
              <ol className="mt-6 space-y-5">
                {steps.map((step, i) => {
                  const done = i < current;
                  const isCurrent = i === current;
                  const date = reachedOn.get(step);
                  return (
                    <li key={step} className="flex items-start gap-4" aria-current={isCurrent ? "step" : undefined}>
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full font-mono text-sm font-medium",
                          done && "bg-forge text-chalk",
                          isCurrent && "bg-butter text-graphite ring-4 ring-butter/35",
                          !done && !isCurrent && "border border-line bg-white text-muted",
                        )}
                      >
                        {done ? <Check aria-hidden className="size-5" /> : i + 1}
                      </span>
                      <div className="pt-1">
                        <p className={cn("font-semibold", isCurrent ? "text-graphite" : done ? "text-graphite" : "text-muted")}>
                          {rfqStatuses[step]}
                          {isCurrent && <span className="sr-only"> ({t.current})</span>}
                        </p>
                        {(done || isCurrent) && date && <p className="text-sm text-muted">{day.format(date)}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div>
              <h2 className="text-2xl">{t.summaryTitle}</h2>
              <p className="mt-3 whitespace-pre-line">{summary.join("\n")}</p>
            </div>

            <BuyerChat token={token} reference={rfq.reference} />
          </div>

          <aside className="h-fit rounded-xl bg-blush p-6 sm:p-7 lg:sticky lg:top-24">
            <h2 className="text-lg">{t.questions.title}</h2>
            <p className="mt-2 text-muted">{t.questions.text(rfq.reference)}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(rfq.reference)}`}
                className={buttonStyles({ variant: "secondary" })}
              >
                <Mail aria-hidden className="size-5" />
                {t.questions.email}
              </a>
              <a
                href={whatsappHref(t.questions.whatsappMessage(rfq.reference))}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "secondary" })}
              >
                <WhatsAppIcon className="size-5" />
                {t.questions.whatsapp}
              </a>
            </div>
            <p className="mt-6 text-sm text-muted">{t.private}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
