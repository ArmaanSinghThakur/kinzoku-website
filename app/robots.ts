import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /styleguide is a temporary review page (removed before launch).
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
