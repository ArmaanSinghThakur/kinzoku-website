# Kinzoku content report (Step 6)

Prepared 2026-10-01 from the word-for-word copy in `content/_source/` (made by
`scripts/extract-live-content.mjs`). Nothing here has been applied to any page yet: every item
waits for approval. Line numbers refer to the files in `content/_source/`.

## 1. What was copied

- **37 public pages** copied: the 26 in the sitemap plus 11 hidden ones (below). Each copy was
  checked word for word against the live text: **0 differences on every page**, including the
  **Privacy Policy (846 words)**.
- All embedded content now sits in the page copy as text: size tables (160 table rows), FAQs,
  blog articles and language pages. Google cannot read these on the current site.
- **CBAM calculator** (`embeds/cbam-europe--ziy1bb.html`):
  - Inputs: steel route (1.90 / 1.53 / 1.033 / 0.288 tCO₂ per tonne), tonnes, and EU carbon price
    (default €75).
  - Result: emissions = tonnes × factor; certificates = emissions × 2.5% (2026 phase-in rate);
    cost = certificates × price.
  - Errors show as a browser pop-up (to be fixed per the plan).
- **Three Google Forms**, with every question, option and required flag in
  `_google-forms.json`:
  - "Request a Quote" (Contact, 10 questions). Its embed link on the live site is malformed
    (`embedded=truehl=en`).
  - "CBAM Advisory Form" (CBAM page, 14 questions).
  - "Global Supplier Registration Form" (hidden Suppliers page, 12 questions).
- **Site data:** structured data for Google (`_site-jsonld.json`, whose phone number is wrong:
  it ends in 85 instead of 86) and the live cookie banner settings (`_site-settings.json`).

## Decisions taken (2026-10-01)

- **§2.1 clear spelling and grammar fixes: approved.** Applied while building each page. §2.2
  content errors, testimonials and "check" items stay as on the live site until Kinzoku confirms.
  The Privacy Policy is untouched.
- **§2.3 hidden pages and the old duplicate article: redirect as proposed** (added in Step 13).
- **YouTube video:** a still image stored on our server that links to YouTube. No embed.
- **Photos:** use the live site's product photos until Kinzoku's own arrive. No stock photos.
- **Still open, for Kinzoku:** the §2.2 content errors, which images are Kinzoku's own, and the
  cookie banner wording (recommendation: keep the Step 4 text).

## 2. Decisions needed

### 2.1 Clear spelling and grammar fixes (recommended: approve all)

Mistakes any editor would fix. They would be corrected while building each page. The Privacy
Policy is excluded: it stays word for word, including its one grammar slip ("information that is
collected", line 19).

| Page | Line | Now | Fix |
|---|---|---|---|
| home | 37 | tariff penalities | tariff penalties |
| cbam-europe | 86 | Prepare, Verify and Manages | Prepare, Verify and Manage |
| coil-nails… | 18 | …with high tensile strength operate under strict standards | …with high tensile strength and are made to strict standards |
| coil-nails… | 71 | Diy Retail | DIY Retail |
| coil-nails… | 73–75 | 2.50x64, 2.50x65, 2.50x70 | 2.50×64, 2.50×65, 2.50×70 |
| coil-nails… | 82–84 | 3.4x65, 3.4x70, 3.4x90 | 3.40×65, 3.40×70, 3.40×90 |
| coil-nails… | 94 | 71, ,80, 90, 92 | 71, 80, 90, 92 |
| coil-nails… | 113 | Wire Guage | Wire Gauge |
| coil-nails… | 115, 120, 127 | Galvanised | Galvanized (as in the rest of the page) |
| coil-nails… | 120 | Bea 380/16-420 | BeA 380/16-420 |
| coil-nails… | 154 | ( standard ), ( high withdrawal resistance ) | (standard), (high withdrawal resistance) |
| coil-nails… | 245 | Ankernegle | Ankernägel |
| coil-nails… | 247 | Kinzoku Consulting & Trade | Kinzoku Consultancy & Trade |
| low-carbon-steel-wire-rod… | 18 | Wire (As rolled Wire Rods) are widely used … for its | …is widely used … for its |
| low-carbon-steel-wire-rod… | 49 | Agricultural & Fencing, Barbed Wire, Field Fencing, Vineyard) | Agricultural & Fencing (Barbed Wire, Field Fencing, Vineyard) |
| low-carbon-steel-wire-rod… | 58 | C1010 ,SWRM10 | C1010, SWRM10 |
| low-carbon-steel-wire-rod… | 106 | We go to the extra mile to delivery | We go the extra mile to deliver |
| low-carbon-steel-wire-rod… | 126 | comply to strict dimensional tolerances | comply with strict dimensional tolerances |
| job-openings | 35, 90 | KPI's | KPIs |
| job-openings | 37 | experience in Steel Industry | experience in the steel industry |
| job-openings | 97, 109, 121 | in European Union | in the European Union |
| job-openings | 121 | if No Visa sponsorship | if no visa sponsorship |
| job-openings | 125 | Typically a 3 month research leads to | Typically, 3 months of research leads to |
| job-openings | 135 | Suppliers (Stockiest) | Suppliers (Stockists) |
| job-openings | 140 | 5 Why's | 5 Whys |
| job-openings | 144 | submitted from you | submitted by you |
| job-openings | 161 | or going to graduated from a University | or are you going to graduate from a university |
| epal-certified-pallet-nails… (article) | 92 | Ankernegle | Ankernägel |
| steel-sourcing-india-vs-china… | 55 | A Chinese mill … — or an Indian mill … — both face | A Chinese mill … and an Indian mill … both face |
| rollnaegel… (DE) | 101 | Palettnägel | Palettennägel |
| rollnaegel… (DE) | 103 | EU-Schkontingente | EU-Schutzkontingente |
| coilnagels… (NL) | 33 | Afwikkelingen | Afwerkingen |
| coilnagels… (NL) | 43 | kopdoorvaartwaarden | kopdoortrekwaarden |
| coilnagels… (NL) | 68 | Laag koolstofstaaldraad | Laagkoolstofstaaldraad |
| coilnagels… (NL) | 103 | EU-salvagecontingenten | EU-vrijwaringscontingenten |

**Customer testimonials** (wire page, lines 99–101) also contain errors: "has been build",
"these difficult global crisis" and a broken first sentence. They are quotes, so they should be
corrected only if Kinzoku agrees.

### 2.2 Content errors that are not spelling (Kinzoku must decide)

The plan only allows spelling fixes. These look like wrong facts or figures, so they stay exactly
as they are unless Kinzoku confirms the correct value.

| Page | Line | Issue |
|---|---|---|
| coil-nails… | 84 | Row "3.4x90" gives the length as **100 mm**, but the inch column says 3.54 in (= 90 mm). |
| coil-nails… | 169–170 | The **"2.80×50" row appears twice** on the live site; the second copy has an empty Application cell. |
| coil-nails… | 164–175 | Packaging says "1000KG **Carton**", but line 158 says 1,000 kg per **pallet** (the cartons are 20–25 kg). |
| steel-import-quota-europe-2026… | 127 | "**September 1**, 2026 — New quarterly quota begins" sits between a July 1 start and a September 30 end. October 1 was probably meant. |
| steel-import-quota-europe-2026… | 129 | This page gives the CBAM surrender deadline for 2026 imports as Sept 30, **2026**; two other articles say Sept 30, **2027**. |
| cbam-default-values-indian-steel… | 175 | "€28,000–32,000", but 500 t × €48–64 = €24,000–32,000. |
| japanese-wire-rod… | 63 | "SWRH 45K": the K suffix belongs to SWRCH grades. |
| japanese-wire-rod… | 105 | Specialised grades are "20–50 tonnes (higher …)", but that is *lower* than the 50–100 t for standard grades. |
| long-products… | 27, 29, 37 | Grade pairings to confirm: 30CrNi15 ↔ 1.5752 (normally 14NiCr14); C15 ↔ 1.1141 (C15E); 90MnCrV8/1.2842 labelled O1 (it is O2). |
| low-carbon-steel-wire-rod… | 83 | "ASTM 510 (Advanced Standards Transforming Mechanism)": the standard is ASTM A510M, and ASTM stands for American Society for Testing and Materials. |
| low-carbon-steel-wire-rod… | 157 | Drawn wire "1mm to 6mm", but the rest of the page says 1–5 mm. |
| cbam-europe | 39 | "third-party country tax deductions": CBAM's term is "third country". |
| rollnaegel… (DE) | 68, 83 | "Niedriglegierter Stahldraht" means *low-alloy*, but SAE 1008/1010 is *low-carbon* ("kohlenstoffarmer"). "Werkszeugnisse" is the name of the 2.2 certificate; 3.1 is "Abnahmeprüfzeugnis". |
| coilnagels… (NL) | 79, 103 | "CBAM-aanvrager" (= applicant) should be "CBAM-aangever" (= declarant). "franco geleverd, verzonden" should say duty paid ("ingeklaard"), not "shipped". |

### 2.3 Hidden pages and the extra article (recommended: redirects)

"Every web address keeps working" requires these to go somewhere. Eleven builder pages are public
but marked *noindex*, so they are not in Google; the extra article is indexed.

| Address | Words | Proposal |
|---|---|---|
| /risk-leverage-in-steel-procurement-the-reality-of-deferred-cbam-liabilities | 343 | **Permanent redirect** to /risk-leverage-in-steel-procurement-deferred-cbam-liabilities. It is the older, shorter original of that article, and it still says "Kinzoku Consulting & Trade". |
| /wire-and-downstream-products-wire-rods-drawn-wires | 1188 | Redirect to the Nail Wire and Wire Rod page |
| /finished-fasteners-and-hardware-nails-high-tensile-bolts-pins-locking-nuts | 892 | Redirect to the Coil Nails page |
| /flat-products-hr-coil-cr-coil-plates, /pipes-tubes-and-hollow-sections-…, /semi-finished-steel-billets-blooms-slabs, /stainless-and-special-steels-…, /structural-sections-and-profiles-… | 632–741 each | Redirect to Long Products (the closest current steel line) |
| /resources-cbam (old "Blog" page, empty) | 1 | Redirect to /blog |
| /cbam-verification-risk-asian-steel-europe-2026 | 1768 | Redirect to /cbam-europe, **or publish it as a 10th article** (it is a full draft) |
| /scandinavian-steel-import-sourcing | 563 | Redirect to /how-we-work-sourcing-steel-asia-europe, or publish it |
| /steel-suppliers (supplier registration, Google Form) | 150 | Redirect to /contact-us, or rebuild it later with its own form |

### 2.4 Other findings

- **Cookie banner wording.** The live site has its own banner text: "This website uses cookies to
  provide necessary site functionality and to improve your experience. By using this website, you
  agree to our use of cookies." [Accept] [Decline].
  - Its last sentence claims agreement *by using the site*. That contradicts a banner that blocks
    tracking until Accept.
  - Recommendation: keep the Step 4 wording.
- **YouTube video** on the Coil Nails page (youtu.be/eOiv5X1SNgk). An embedded YouTube player sets
  YouTube cookies and is a new outside service the Privacy Policy does not mention.
  - Recommendation: show a still image that opens the video on YouTube. No embed, no policy change.
- **Language labels:**
  - The Polish page labelled "PL, CS" contains no Czech (Czechia is only a delivery destination).
    Label it "Polski".
  - The Portuguese page is Brazilian Portuguese: language code pt-BR, label "Português (Brasil)".
    Its meta description names Portugal, though the page targets Brazil, Angola and Mozambique.
  - "Afrika" becomes "Africa".
- **Live page titles:** all 8 language pages end in "| Kinzoku | Kinzoku" (doubled), and every
  page declares `lang="en"`. Both are fixed by the rebuild (Steps 12–13).
- **Trade terms left in English** on translated pages: MOQ, Tier-1, Melt & Pour, jumbo.
  Recommendation: keep them as industry terms, except the clear mistranslations above.
- **Images:** 9 content images plus 1 background. Which are Kinzoku's own needs confirming:

  | Image | Assessment |
  |---|---|
  | Coil nails in a carton; EPAL loose nails | Look like real photos |
  | KINZOKU banner; wire rod → nails process diagram | Kinzoku's own |
  | Staples; nail line-up on black | Look like catalogue or marketplace shots |
  | Wire rod coils; nail wire coils | Could be stock |
  | "Global CBAM Summit 2026" banner | Only on the old duplicate article |
  | Homepage background | **Unsplash stock**: will not be reused |

  The plan asks for Kinzoku's own product, warehouse and container photos.

## 3. Optional consistency items ("check")

These are probably wrong but a human should confirm, and none is required. Examples:
- "KVK" vs "KvK"; "Hot Dipped" vs "Hot-Dip"; "high tensile" vs "high-tensile"
- missing articles in the Job Openings text
- "EPAL Certified" vs "EPAL-Certified"; "France & BENELUX"
- Dutch and German compound spellings used as search keywords ("Staaldraad importeur",
  "Nageldraht Lieferant")
- "MOQ" left untranslated
- the Portuguese decimal point vs comma
- the French "logistique incluses" → "inclus"

The full lists, with line numbers, from three proofreading passes (main pages, articles, language
pages) are in [`proofreading-findings.md`](proofreading-findings.md). They can be walked through
page by page while building Steps 7–12.
