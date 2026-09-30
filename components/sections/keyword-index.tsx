/**
 * The live pages' long keyword lists, kept word for word (search engines read them) but folded
 * away in a native <details> so they don't crowd the page. No JavaScript.
 */
export function KeywordIndex({ title, paragraphs }: { title: string; paragraphs: { label: string; text: string }[] }) {
  return (
    <details className="group rounded-lg border border-line">
      <summary className="cursor-pointer list-none px-5 py-4 font-heading text-sm font-semibold text-steel [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
        {title}
      </summary>
      <div className="space-y-3 px-5 pb-5 text-sm text-muted">
        {paragraphs.map((p) => (
          <p key={p.label}>
            <strong className="text-ink">{p.label}:</strong> {p.text}
          </p>
        ))}
      </div>
    </details>
  );
}
