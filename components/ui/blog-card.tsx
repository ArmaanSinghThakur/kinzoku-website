import Link from "next/link";
import { Fragment } from "react";
import { formatDate } from "@/lib/format";

type BlogCardProps = {
  href: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-07-01". Optional until Kinzoku supplies publication dates. */
  date?: string;
  category?: string;
  readingMinutes?: number;
};

export function BlogCard({ href, title, summary, date, category, readingMinutes }: BlogCardProps) {
  const meta = [
    category && (
      <span key="c" className="font-semibold text-steel">
        {category}
      </span>
    ),
    date && (
      <time key="d" dateTime={date}>
        {formatDate(date)}
      </time>
    ),
    readingMinutes ? <span key="r">{readingMinutes} min read</span> : null,
  ].filter(Boolean);

  return (
    <article className="group relative flex flex-col rounded-lg border border-line bg-white p-6 shadow-card">
      <p className="flex flex-wrap gap-x-2 text-sm text-muted">
        {meta.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span aria-hidden>·</span>}
            {item}
          </Fragment>
        ))}
      </p>
      <h3 className="mt-2 text-lg">
        <Link href={href} className="text-charcoal no-underline transition-colors after:absolute after:inset-0 group-hover:text-steel">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-muted">{summary}</p>
    </article>
  );
}
