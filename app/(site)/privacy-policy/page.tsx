import type { Metadata } from "next";
import { Fragment } from "react";
import { PageHeader } from "@/components/sections/page-header";
import { type Block, privacyPolicy as policy, type Segment } from "@/content/pages/privacy.generated";
import { routes } from "@/lib/routes";

// The policy text is word for word (see privacy.generated.ts); this page only lays it out in a
// readable column with section links.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Kinzoku Consultancy & Trade. Learn how we collect, process, and protect your personal data in compliance with GDPR. For any questions, contact us immediately",
  alternates: { canonical: routes.privacy },
};

const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Inline({ segments }: { segments: Segment[] }) {
  return segments.map((s, i) =>
    s.href ? (
      <a key={i} href={s.href}>
        {s.text}
      </a>
    ) : s.em ? (
      <em key={i}>{s.text}</em>
    ) : (
      <Fragment key={i}>{s.text}</Fragment>
    ),
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) =>
    block.type === "p" ? (
      <p key={i} className="mt-4">
        <Inline segments={block.content} />
      </p>
    ) : (
      <ul key={i} className="mt-4 list-disc space-y-2 pl-6 marker:text-steel">
        {block.items.map((item, j) => (
          <li key={j}>
            <Inline segments={item} />
          </li>
        ))}
      </ul>
    ),
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: policy.title, href: routes.privacy },
        ]}
        title={policy.title}
        intro={policy.updated}
      />

      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="Sections" className="lg:sticky lg:top-24 lg:self-start">
            <ol className="space-y-1.5 border-l-2 border-line text-sm">
              {policy.sections.map((section) => (
                <li key={section.number}>
                  <a
                    href={`#${sectionId(section.title)}`}
                    className="-ml-0.5 block border-l-2 border-transparent py-0.5 pl-4 text-muted no-underline hover:border-gold hover:text-charcoal"
                  >
                    {section.number}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-[68ch] text-ink">
            <Blocks blocks={policy.intro} />
            {policy.sections.map((section) => (
              <section key={section.number} id={sectionId(section.title)} className="mt-10">
                <h2 className="text-2xl">
                  {section.number}. {section.title}
                </h2>
                <Blocks blocks={section.blocks} />
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
