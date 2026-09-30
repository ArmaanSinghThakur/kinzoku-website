import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /styleguide is a temporary review page (removed before launch); /api/ is for machines only;
    // /rfq/ holds buyers' private status pages.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide", "/api/", "/rfq/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
