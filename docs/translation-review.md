# Translation review: menu, footer, cookie banner and WhatsApp (Step 12)

The site chrome on the 7 translated language pages (`content/i18n/{de,fr,es,pt,it,pl,nl}.ts`) was
translated during the rebuild, then checked by an independent review pass on 2026-10-01.

- **Must-fix:** none. In every language the cookie texts carry all four legal points: necessary
  cookies make the site work, analytics runs only with consent, analytics stays off until the
  visitor accepts, and the choice can be changed via the footer link. Nothing implies consent by
  continued use.
- **Should-fix:** all 15 applied:
  - French: non-breaking spaces in « » and before ":" (including the footer labels);
    "barres en acier allié".
  - Portuguese: VAT label "Nº IVA (UE)"; "barras de aço-liga".
  - Italian: "barre in acciaio legato".
  - Polish: "Zapytaj o ofertę" (matches the page); "Ustawienia plików cookie" in footer and
    panel; banner buttons "Akceptuj / Odrzuć"; bar label.
  - Dutch: "losse spijkers" (matches the page); grammatical long-products label.
- **Optional,** for Kinzoku's native speakers to accept or reject before launch:

| Lang | Key | Current | Suggested |
|---|---|---|---|
| de | nav.home (screen readers only) | Kinzoku Startseite | Kinzoku-Startseite |
| de | productLinks (bars) | Langprodukte: legierter Stahl, Kohlenstoffstahl & Blankstahl | Langprodukte: legierter und unlegierter Stabstahl, Blankstahl |
| de | whatsapp.label | Mit Kinzoku auf WhatsApp schreiben | Mit Kinzoku per WhatsApp chatten |
| de | cookies.text (last sentence) | Analytics bleibt ausgeschaltet, bis Sie zustimmen. | Die Analyse bleibt deaktiviert, bis Sie zustimmen. |
| fr | footer.company | Informations société | Informations sur la société |
| es | footer.jobs | Empleo | Ofertas de empleo |
| es | footer.vat | NIF-IVA | N.º IVA (UE) |
| es | whatsapp.message | Hola Kinzoku, quisiera… | Hola, Kinzoku. Quisiera… |
| pt | whatsapp.message | Olá Kinzoku, gostaria… | Olá, Kinzoku! Gostaria… |
| it | whatsapp.label | Scrivete a Kinzoku su WhatsApp | Scrivi a Kinzoku su WhatsApp |
| pl | cookies.text (last sentence) | …dopóki jej nie zaakceptujesz. | …dopóki nie wyrazisz zgody. |
| pl | whatsapp.label | Napisz do Kinzoku na WhatsApp | Napisz do Kinzoku przez WhatsApp |
| pl | whatsapp.message | Dzień dobry, Kinzoku, proszę o ofertę na … | Dzień dobry, proszę o ofertę na … |
| pl | cookies.analytics.text | …które strony są używane, abyśmy mogli ulepszać stronę. | …które podstrony są odwiedzane, abyśmy mogli ulepszać serwis. |
| nl | nav.home (screen readers only) | Kinzoku startpagina | Kinzoku-startpagina |
| nl | cookies.text (last sentence) | Analytics blijft uit totdat u akkoord geeft. | Google Analytics blijft uitgeschakeld totdat u akkoord geeft. |

## Added in the UI redesign: the 金属 seal caption (`footer.nameMeaning`)

The redesign plan's name mark adds one short footer line to every language. Translated during the
redesign and not yet reviewed; for Kinzoku's native speakers to confirm before launch. The seal
itself shows only "if approved" (plan §5): `nameSeal` in `lib/site.ts` turns it off everywhere.

| Lang | footer.nameMeaning |
|---|---|
| en | Kinzoku (金属) means “metal” in Japanese. |
| de | Kinzoku (金属) bedeutet auf Japanisch „Metall“. |
| fr | Kinzoku (金属) signifie « métal » en japonais. |
| es | Kinzoku (金属) significa «metal» en japonés. |
| pt | Kinzoku (金属) significa “metal” em japonês. |
| it | Kinzoku (金属) significa «metallo» in giapponese. |
| pl | Kinzoku (金属) oznacza po japońsku „metal”. |
| nl | Kinzoku (金属) betekent ‘metaal’ in het Japans. |
