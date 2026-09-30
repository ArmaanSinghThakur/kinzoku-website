import { NotFound } from "@/components/errors/not-found";
import { en } from "@/content/i18n/en";

// Shown when an English page calls notFound(), e.g. an unknown blog article.
export default function SiteNotFound() {
  return <NotFound dict={en} />;
}
