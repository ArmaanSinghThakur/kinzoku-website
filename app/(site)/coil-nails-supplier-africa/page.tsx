import { LanguageLanding, languageMetadata } from "@/components/sections/language-landing";
import { africa as page } from "@/content/language-pages/africa";

// The Africa page is in English, so it uses the English site layout.
export const metadata = languageMetadata(page);

export default function AfricaPage() {
  return <LanguageLanding page={page} />;
}
