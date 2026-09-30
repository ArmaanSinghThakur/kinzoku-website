import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { it as page } from "@/content/language-pages/it";

export const metadata = languageMetadata(page);

export default function ItalianPage() {
  return <LanguageLanding page={page} />;
}
