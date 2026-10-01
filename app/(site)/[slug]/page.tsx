import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { BlogCard } from "@/components/ui/blog-card";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { articles } from "@/content/blog/articles.generated";
import { getArticle, listArticles } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/lib/routes";
import { openGraph } from "@/lib/seo";
import { articleJsonLd } from "@/lib/structured-data";

// Blog articles at their current addresses (e.g. /cbam-2026-complete-guide-steel-importers).
// Only these slugs exist; any other top-level address falls through to the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: `/${article.slug}` },
    openGraph: openGraph({ type: "article", title: article.title, description: article.description }),
  };
}

export default async function ArticlePage({ params }: PageProps<"/[slug]">) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();

  const related = (await listArticles()).filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);
  const meta = [article.category, article.date && formatDate(article.date), `${article.readingMinutes} min read`].filter(Boolean).join(" · ");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: "Blog", href: routes.blog },
          { name: article.title, href: `/${article.slug}` },
        ]}
        title={article.title}
        subtitle={meta}
      />

      <div className="site-container py-12 sm:py-16">
        {/* Own content, converted from Markdown at build time. */}
        <article
          className="prose prose-lg max-w-3xl prose-headings:tracking-tight prose-a:decoration-forge/40 prose-a:underline-offset-4 hover:prose-a:decoration-forge prose-th:font-mono prose-th:text-[0.8125rem] prose-th:uppercase prose-th:tracking-wider prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </div>

      {related.length > 0 && (
        <Section tone="mist" title="Related articles">
          <div data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <BlogCard key={a.slug} href={`/${a.slug}`} title={a.title} summary={a.description} date={a.date} readingMinutes={a.readingMinutes} />
            ))}
          </div>
        </Section>
      )}

      <QuoteBanner />
      <JsonLd data={articleJsonLd(article)} />
    </>
  );
}
