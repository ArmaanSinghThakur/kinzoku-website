import { routes } from "@/lib/routes";

// Text from content/_source/long-products-alloy-bars-carbon-bars-bright-bars.md. The intro is new
// (the live page has none); it was drafted only from facts in the page's own table and approved
// after Step 7. The profile data is in long-products.tables.ts.
export const longProductsPage = {
  meta: {
    title: "Long products - bars",
    description:
      "We supply comprehensive steel long products across multiple geometric profiles and material disciplines. Long Products Bars Bright bars, Carbon Bars, Alloy Bars, Tool Steel, Nitriding grades fully certified.",
  },
  breadcrumb: "Long Products",
  title: "Long Products",
  subtitle: "Alloy Bars, Carbon Bars, Bright Bars",
  intro:
    "Carbon, alloy and bright steel bars in round, square, flat and hexagonal profiles, plus CNC bright bars: from 3 mm to 500 mm, in 3 m, 6 m and 12 m lengths, with EN 10204 3.1 material test certificates. Popular grades include S355J2, C45, 42CrMo4 and 16MnCr5.",
  quote: { label: "Submit RFQ / Procurement Specification", href: "/contact-us?product=bars#quote" },
  capabilitiesTitle: "Long Product - Steel Bar Supply Capabilities",
  index: {
    title: "View Cross-Reference Sourcing Index & Technical Compliance Keywords",
    paragraphs: [
      {
        label: "Standard Compliance Classifications",
        text: "EN 10060 hot rolled round bars, EN 10278 bright steel dimensions, EN 10085 nitriding steel stockist, EN 10058 flat bar standard sizes, ISO h11 cold drawn bar tolerances, ISO h9 peeled turned steel bars, ISO h6 centerless ground shafting, EN 10204 3.1 material test certificate, CPT delivery France, DAP logistics steel Europe, EN 10088-3 martensitic stainless bar supply.",
      },
      {
        label: "Metallurgical Grade & Material Numbers Matrix",
        text: "42CrMo4 1.7225 quenched and tempered, S355J2+N 1.0577 structural steel bars, 11SMnPb30 1.0718 leaded bright bar, 41CrAlMo7-10 1.8509 nitriding round bar, 16MnCr5 1.7131 case hardening steel, C45E 1.1191 medium carbon bar, 11SMn30 1.0715 free cutting steel, X153CrMoV12 1.2379 D2 tool steel, 90MnCrV8 1.2842 O1 precision flat, 34CrNiMo6 1.6582 crankshaft alloy, 30CrNiMo8 1.6580 heavy engineering bars, X37CrMoV5-1 1.2343 hot work tool steel, X40CrMoV5-1 1.2344 H13 extrusion tool bar, 100MnCrW4 1.2510 O1 tool steel, 55NiCrMoV7 1.2715 L6 hot work block, X17CrNi16-2 1.4057 martensitic steel, X12Cr13 1.4006 410 stainless, X20Cr13 1.4021 420 round bar, 18CrNiMo6-7 1.6587 gearbox alloy, 30CrNi15 1.5752 high tensile bar.",
      },
      {
        label: "International Cross-Reference Equivalents",
        text: "40CAD6-12 AFNOR equivalent, 38HMJ steel grade Poland, En8 carbon steel equivalent EN, 905M39 British Standard steel, 42CD4 steel grade supplier France, AISI 4140 equivalent European grade, AISI D2 Werkstoff number, 16MC5 AFNOR, 20MnCr5 1.7147 equivalent, SKD11 JIS tool steel matrix, AISI H11 Werkstoff 1.2343, AISI H13 1.2344 equivalent, AISI O1 1.2510 tool steel, AISI L6 1.2715 steel, AISI 431 stainless 1.4057, AISI 410 1.4006 Werkstoff, AISI 420 1.4021 corrosion resistant, DIN 18CrNiMo6-7 gear alloy, AISI 4340 European 34CrNiMo6 equivalent.",
      },
      {
        label: "Commercial Wholesale Trading Terms",
        text: "Wholesale steel bar supplier Europe, Steel round bar bulk distributor, Direct mill alloy steel round bar, Buy steel bars container load, Bright steel bar wholesale prices, Hexagonal bar metric sizes stock, Precision ground flat stock wholesale, Special bar quality SBQ importer, Northern France steel truck delivery, Mill-direct Asian tool steel importer, CBAM compliant stainless steel bars, Pre-vetted embedded emission long steel.",
      },
    ],
  },
  bannerText: "Tell us the profile, grade, dimensions, quantity and delivery country.",
  canonical: routes.bars,
};
