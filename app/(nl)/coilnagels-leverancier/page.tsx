import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { nl as page } from "@/content/language-pages/nl";

export const metadata = languageMetadata(page);

export default function DutchPage() {
  return <LanguageLanding page={page} />;
}
