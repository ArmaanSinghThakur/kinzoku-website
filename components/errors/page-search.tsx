"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { PageEntry } from "@/content/pages";

type PageSearchProps = { pages: PageEntry[]; label: string; placeholder: string; noResults: string; resultsLabel: string };

/** Filters the site's page list as you type. Runs in the browser: no search service, no data sent. */
export function PageSearch({ pages, label, placeholder, noResults, resultsLabel }: PageSearchProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length
    ? pages
        .filter((page) => {
          const haystack = `${page.title} ${page.href.replace(/[/-]/g, " ")}`.toLowerCase();
          return words.every((word) => haystack.includes(word));
        })
        .slice(0, 8)
    : [];

  return (
    <div>
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full rounded-xl border border-line bg-white py-3.5 pr-4 pl-12 text-base text-graphite shadow-card placeholder:text-muted focus:border-forge focus:shadow-[0_0_0_3px_rgb(47_74_99/0.16)] focus:outline-hidden"
          />
        </div>
      </form>

      <p aria-live="polite" className="sr-only">
        {words.length ? `${results.length} ${resultsLabel}` : ""}
      </p>
      {words.length > 0 &&
        (results.length ? (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
            {results.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-graphite no-underline transition-colors hover:bg-mist/60"
                >
                  <span>
                    {page.title}
                    <span className="spec-label ml-2 text-muted">{page.group}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-forge" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted">{noResults}</p>
        ))}
    </div>
  );
}
