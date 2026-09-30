import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { pl as page } from "@/content/language-pages/pl";

export const metadata = languageMetadata(page);

export default function PolishPage() {
  return <LanguageLanding page={page} />;
}
