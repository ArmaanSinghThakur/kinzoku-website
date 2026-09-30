import Link from "next/link";
import { formatDate } from "@/lib/format";

type BlogCardProps = {
  href: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-07-01". */
  date: string;
  category?: string;
  readingMinutes?: number;
};

export function BlogCard({ href, title, summary, date, category, readingMinutes }: BlogCardProps) {
  return (
    <article className="group relative flex flex-col rounded-lg border border-line bg-white p-6 shadow-card">
      <p className="flex flex-wrap gap-x-2 text-sm text-muted">
        {category && (
          <>
            <span className="font-semibold text-steel">{category}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <time dateTime={date}>{formatDate(date)}</time>
        {readingMinutes ? (
          <>
            <span aria-hidden>·</span>
            <span>{readingMinutes} min read</span>
          </>
        ) : null}
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
