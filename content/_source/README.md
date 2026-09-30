# Live-site content copy

Word-for-word copy of every public page of kinzokutrade.com, made by
`node scripts/extract-live-content.mjs`. It is the **reference** the rebuilt pages are made from;
the site itself never reads these files. Re-run the script before launch to pick up late edits
(it rewrites this folder and checks every page word for word against the live text).

| File | What it holds |
|---|---|
| `<address>.md` | One page: frontmatter (URL, title, description, language, noindex, in sitemap) and the content in page order, one `<!-- block … -->` per section. `home.md` is `/`. |
| `embeds/*.html` | Original embedded code that can't be expressed as text: the CBAM calculator and the three Google Forms. |
| `_index.json` | Every address found (sitemap + builder), HTTP status, word count, word-check result. |
| `_google-forms.json` | Questions, answer options and required fields of the three Google Forms (for the new forms in Phase 4). |
| `_site-jsonld.json` | The structured data from the live page head (for the SEO step). Its phone number ends in 85; the correct one ends in 86. |
| `_site-settings.json` | The live cookie banner text and consent categories. |

Only clear spelling and grammar mistakes may be corrected when building pages from this copy, and
only after approval. The Privacy Policy stays word for word.
