import { ArrowDown, Mail } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { buttonStyles } from "@/components/ui/button-styles";
import { Section } from "@/components/ui/section";
import { jobsPage as page } from "@/content/pages/jobs";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.canonical },
};

const applyHref = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export default function JobOpeningsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: page.title, href: page.canonical },
        ]}
        title={page.title}
      />

      <Section>
        <div data-reveal="stagger" className="grid gap-6 md:grid-cols-2">
          {page.roles.map((role, i) => (
            <article
              key={role.id}
              className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-7"
            >
              <p aria-hidden className="spec-label text-forge">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-xl">{role.title}</h2>
              <ul className="mt-3 flex-1 space-y-1 text-sm text-muted">
                {role.summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`#${role.id}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                  <ArrowDown aria-hidden className="size-4" />
                  {page.viewLabel}
                </a>
                <a href={applyHref(role.apply.subject)} className={buttonStyles({ size: "sm" })}>
                  <Mail aria-hidden className="size-4" />
                  {page.applyLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {page.roles.map((role, i) => (
        <Section key={role.id} id={role.id} tone={i % 2 === 0 ? "mist" : "chalk"} title={role.title}>
          <ul className="-mt-6 mb-8 flex flex-wrap gap-2">
            {role.summary.map((line) => (
              <li key={line} className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-forge ring-1 ring-line">
                {line}
              </li>
            ))}
          </ul>
          <div className="grid max-w-4xl gap-8">
            {role.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg">{section.title}</h3>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-2">
                    {p}
                  </p>
                ))}
                {section.items && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-forge">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="rounded-xl bg-blush p-6 sm:p-8">
              <p>{role.apply.instruction}</p>
              <p className="mt-3">{role.apply.questionsIntro}</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-6 marker:text-forge">
                {role.apply.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
              <a href={applyHref(role.apply.subject)} className={`${buttonStyles()} mt-6`}>
                <Mail aria-hidden className="size-5" />
                {page.applyLabel}
              </a>
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
