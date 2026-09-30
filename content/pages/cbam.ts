import { routes } from "@/lib/routes";

// Text from content/_source/cbam-europe.md and the calculator embed
// (content/_source/embeds/cbam-europe--ziy1bb.html). Approved fixes: "Manages" → "Manage",
// "tCO_2e/t" → "tCO₂e/t". The live Google Form ("CBAM Advisory Form") is replaced by a link to
// the contact form until Phase 4 builds a Kinzoku-hosted version (decision before Step 9).
export const cbamPage = {
  meta: {
    title: "Authorized CBAM Declarant for Steel & Fasteners",
    description:
      "We handle CBAM declarations for coil nails, wire and steel product imports into Europe, LatAm, Africa, Asia — zero reporting liability for buyers. EN 10204 3.1 certificates on every lot.",
  },
  title: "CBAM",
  subtitle: "CBAM Compliance & Supply Chain Insulation",
  intro: "Zero CBAM Liability for Your Steel Supply Chain.",
  advisory: { label: "Request CBAM advisory", href: "/contact-us?product=cbam#quote" },
  calculatorLink: { label: "CBAM Liability Calculator", href: "#calculator" },
  problem: {
    title: "Core Problem",
    items: [
      {
        title: "Data Deficiency Crisis",
        text: "Overseas manufacturing facilities (specifically induction furnace and smaller blast furnace operations in Asia and the Middle East) lack the granular tracking mechanisms required to isolate embedded direct and indirect emissions (tCO₂e/t of steel produced) according to EU-validated system boundaries.",
      },
      {
        title: "The Penalty Threat",
        text: "Importers face significant financial exposure under Article 26 of the regulation for non-compliance, misreporting, or failing to submit verified data through the CBAM Transitional Registry.",
      },
      {
        title: "The Scale Deficit",
        text: "Mid-size stockists and industrial end-users (consuming 2,000 to 15,000 tons annually) do not possess the internal legal or compliance overhead to manage data communication loops with non-EU installations.",
      },
    ],
  },
  solution: {
    title: "Our Solution",
    allocation: {
      title: "Zero-Liability Procurement Through Allocation",
      lead: "Seeking total insulation from regulatory overhead?",
      points: [
        "We integrate compliance directly into our material supply.",
        "When purchasing from our certified engineering bar, flat product, or stainless allocations, we execute all deliveries on a seamless DDP basis.",
        "We assume 100% of the CBAM reporting liabilities and financial certificate obligations delivering fully cleared material directly to your production facility.",
      ],
    },
    advisory: {
      title: "Corporate Advisory for Independent Importers",
      paragraphs: [
        "As the European Union transitions toward definitive CBAM implementations, unverified emissions data and reporting failures carry severe financial penalties.",
        "We provide specialized consulting services to safeguard your existing supply lines.",
      ],
      points: [
        { label: "Mill-Level Emissions Auditing", text: "Audit mill data-collection methodologies against EU Regulation 2023/956 standards." },
        { label: "Registry Management", text: "Prepare, Verify and Manage quarterly declarations to eliminate data-deficiency red flags." },
        {
          label: "Tariff Optimization Analysis",
          text: "Calculate financial exposure based on specific primary data vs. EU default values, allowing for proactive supply chain re-routing.",
        },
      ],
    },
  },
  calculator: {
    id: "calculator",
    title: "CBAM Liability Calculator",
    subtitle: "Estimate EU import carbon exposure for Steel products (2026 Phase)",
    routeLabel: "Steel Production Route / Product Type",
    routes: [
      { label: "Crude Iron & Steel (Blast Furnace / BOF Default) ~ 1.90 tCO2/t", factor: 1.9 },
      { label: "Hot-Rolled Steel Coil / Flat Steel ~ 1.53 tCO2/t", factor: 1.53 },
      { label: "Direct Reduced Iron (DRI / EAF Route) ~ 1.033 tCO2/t", factor: 1.033 },
      { label: "Scrap-based Electric Arc Furnace (EAF) ~ 0.288 tCO2/t", factor: 0.288 },
    ],
    tonnesLabel: "Import Volume (Metric Tons)",
    tonnesPlaceholder: "e.g. 500",
    priceLabel: "EU ETS Carbon Price (€ per tCO₂e)",
    defaultPrice: 75,
    phaseInRate: 0.025,
    button: "Calculate Financial Exposure",
    resultsTitle: "Estimated 2026 Liability",
    results: {
      emissions: "Total Embedded Emissions:",
      phaseIn: "2026 Phase-In Rate:",
      phaseInValue: "2.5%",
      certificates: "Certificates To Surrender:",
      cost: "Estimated CBAM Cost:",
    },
    errors: {
      // First message is the live calculator's alert text; the price check is new (live had none).
      tonnes: "Please enter a valid import volume.",
      price: "Please enter a valid carbon price.",
    },
    disclaimer:
      "Calculations are based on 2026 EU default adjustment variables (2.5% exposure rule). Real procurement exposure may vary depending on actual factory data and third-party country tax deductions.",
  },
  related: {
    title: "Related CBAM articles",
    readMore: "Read article",
    items: [
      { href: "/cbam-2026-complete-guide-steel-importers", title: "CBAM 2026: Complete Guide for Steel Importers" },
      { href: "/cbam-default-values-indian-steel-hidden-cost", title: "CBAM Default Values for Indian Steel: The Hidden Cost" },
      {
        href: "/risk-leverage-in-steel-procurement-deferred-cbam-liabilities",
        title: "Risk Leverage in Steel Procurement: The Reality of Deferred CBAM Liabilities",
      },
    ],
  },
  index: {
    title: "View Cross-Reference Sourcing Index & Technical Compliance Keywords",
    paragraphs: [
      {
        label: "EU Regulatory Carbon Frameworks",
        text: "CBAM steel import compliance Europe, EU regulation 2023/956 boundary lines, carbon border adjustment mechanism transitional registry, quarterly emissions declarations steel, embedded carbon emissions accounting tCO2e, direct and indirect emissions tracking blast furnace, primary data auditing vs EU default values penalty mitigation, Article 26 non-compliance legal protection, unverified data deficiency crisis resolution.",
      },
      {
        label: "Procurement Security & Supply Chain Insulation",
        text: "Zero liability steel procurement allocation, fully cleared DDP deliveries steel trade, reporting liabilities insulation stockholders, financial certificate obligations management, mill level emissions auditing standards, data communication loops non-EU installations, corporate regulatory advisory independent steel importers, mid-size stockists overhead mitigation, safeguard supply lines trading company.",
      },
      {
        label: "Core Product Technical Verification",
        text: "Melt and pour continuous casting origin validation, EN 10204 3.1 material test certificates verification, alloy bars carbon bars bright bars tracking, hot cold rolled coils sheets heavy plates accounting, seamless welded mechanical tubing carbon reporting, structural steel sections beams channels angles origin, cold heading wire rods drawn wires certification, finished fasteners hardware bolts nails subsea compliance data.",
      },
      {
        label: "Regional European Trade Logistics",
        text: "Asian steel import supply channels Europe, India steel mill emission auditing, Vietnam hot rolled coil tariff optimization analysis, Rotterdam port customs clearance carbon accounting, Antwerp terminal freight handling steel, KVK registered Netherlands steel importer, local European invoicing trade desk, Northern France factory gate truck delivery CPT DAP.",
      },
    ],
  },
  bannerText: "Tell us the product, origin, annual volume and delivery country.",
  canonical: routes.cbam,
};
