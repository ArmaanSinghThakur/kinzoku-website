import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { es as page } from "@/content/language-pages/es";

export const metadata = languageMetadata(page);

export default function SpanishPage() {
  return <LanguageLanding page={page} />;
}
