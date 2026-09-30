import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { de as page } from "@/content/language-pages/de";

export const metadata = languageMetadata(page);

export default function GermanPage() {
  return <LanguageLanding page={page} />;
}
