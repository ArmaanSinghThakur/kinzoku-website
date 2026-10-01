/**
 * The live pages' long keyword lists, kept word for word (search engines read them) but folded
 * away in a native <details> so they don't crowd the page. No JavaScript.
 */
export function KeywordIndex({ title, paragraphs }: { title: string; paragraphs: { label: string; text: string }[] }) {
  return (
    <details className="group rounded-xl border border-dashed border-graphite/25 bg-chalk">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-semibold text-forge transition-colors hover:text-graphite [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="font-mono text-base transition-transform duration-300 group-open:rotate-90">
          ›
        </span>
        {title}
      </summary>
      <div className="space-y-3 px-5 pb-5 text-sm text-muted">
        {paragraphs.map((p) => (
          <p key={p.label}>
            <strong className="text-graphite">{p.label}:</strong> {p.text}
          </p>
        ))}
      </div>
    </details>
  );
}
