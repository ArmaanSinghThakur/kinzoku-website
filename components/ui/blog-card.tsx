import { ArrowUpRight } from "lucide-react";
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
      <span key="c" className="text-forge">
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
    <article className="group relative flex flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <p className="spec-label flex flex-wrap gap-x-2 text-muted">
        {meta.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span aria-hidden>·</span>}
            {item}
          </Fragment>
        ))}
      </p>
      <h3 className="mt-3 text-lg leading-snug">
        <Link href={href} className="text-graphite no-underline transition-colors after:absolute after:inset-0 group-hover:text-forge">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-muted">{summary}</p>
      <ArrowUpRight
        aria-hidden
        className="mt-5 size-5 text-forge transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </article>
  );
}
