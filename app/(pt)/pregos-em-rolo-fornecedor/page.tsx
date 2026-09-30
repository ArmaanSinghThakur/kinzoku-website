import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { pt as page } from "@/content/language-pages/pt";

export const metadata = languageMetadata(page);

export default function BrazilianPortuguesePage() {
  return <LanguageLanding page={page} />;
}
