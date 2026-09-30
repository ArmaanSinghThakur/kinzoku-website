import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { fr as page } from "@/content/language-pages/fr";

export const metadata = languageMetadata(page);

export default function FrenchPage() {
  return <LanguageLanding page={page} />;
}
