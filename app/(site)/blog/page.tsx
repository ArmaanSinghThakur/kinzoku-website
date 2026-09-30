import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { BlogCard } from "@/components/ui/blog-card";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { categories, listArticles } from "@/lib/blog";
import { routes } from "@/lib/routes";

// New page (plan): every article as a card, grouped by CBAM, Sourcing and Products.
export const metadata: Metadata = {
  title: "Blog",
  description: "Articles by Kinzoku Consultancy & Trade on CBAM, steel sourcing from Asia and nail products for European buyers.",
  alternates: { canonical: routes.blog },
};

export default async function BlogPage() {
  const articles = await listArticles();

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: routes.home },
          { name: "Blog", href: routes.blog },
        ]}
        title="Blog"
        intro="CBAM, steel sourcing and product guides for European buyers."
      />
      {categories.map((category, i) => (
        <Section key={category} tone={i % 2 === 0 ? "white" : "mist"} title={category}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((a) => a.category === category)
              .map((a) => (
                <BlogCard key={a.slug} href={`/${a.slug}`} title={a.title} summary={a.description} date={a.date} readingMinutes={a.readingMinutes} />
              ))}
          </div>
        </Section>
      ))}
      <QuoteBanner />
    </>
  );
}
