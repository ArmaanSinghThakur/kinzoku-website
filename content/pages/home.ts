import coilNails from "@/public/images/products/coil-nails.jpg";
import epalNails from "@/public/images/products/epal-nails.jpg";
import nailWire from "@/public/images/products/nail-wire.jpg";
import { routes } from "@/lib/routes";

// Homepage text from the live site (content/_source/home.md) in the plan's new order.
// Approved fix: "penalities" → "penalties". The 4 process steps come from the live process
// diagram (text inside the image), with "wire root" → "wire rod".
export const home = {
  meta: {
    // Live title had "| Kinzoku" twice; kept once.
    title: "Coil Nails, EPAL Nails, Staples & Nail Wire Supplier | CBAM compliant steel import | Kinzoku",
    description:
      "Bulk coil nails, EPAL pallet nails, loose nails, staples & nail wire. CBAM-cleared, EN 10204 3.1 certified, CIF, DAP or DDP delivery across Europe, LatAm & Africa.",
  },
  hero: {
    title: "Coil Nails, EPAL Pallet Nails, Staples & Nail Wire",
    subtitle: "Delivered to Your Factory Gate",
    text: "Kinzoku supplies pallet manufacturers, construction wholesalers and nail producers across Europe, Latin America and Africa with fasteners and wire.",
    quote: "Request a quote",
    products: "View products",
    // Redesign (plan §4): the coil photo beside the headline, captioned like a datasheet figure.
    image: { src: coilNails, alt: "Wire collated coil nails packed in a carton" },
    figure: "Fig. 01 — Wire collated coil nails",
  },
  badgesLabel: "Why buyers work with Kinzoku",
  badges: [
    { icon: "certificate", title: "EN 10204 3.1 Certified", text: "Full chemical & mechanical mill heat traceability guaranteed." },
    { icon: "cbam", title: "CBAM Compliance", text: "We manage all emissions reporting." },
    { icon: "delivery", title: "Turnkey CIF / DDP Delivery", text: "Inland truck logistics managed straight to your warehouse gate." },
    { icon: "quota", title: "Safeguard Quota Clearance", text: "Continuous trade monitoring protects your pricing from tariff penalties." },
  ],
  products: {
    title: "Our Products",
    // "View specs" drawer on each card (plan §4).
    specs: "View specs",
    close: "Close",
    productPage: "Product page",
    quote: "Request a quote",
    items: [
      {
        href: routes.nails,
        title: "Coil Nails, Loose Nails, EPAL Nails & Staples",
        text: "15°–16° wire collated coil nails (2.1–3.8 mm, 25–100 mm), EPAL-certified pallet nails, bulk common nails and industrial staples. Compatible with Bostitch, MAX, Paslode, BeA, Senco and automated EPAL lines (Storti, CAPE, Gulliver)",
        // The hero shows the coil nail photo, so this card shows the pallet nails.
        image: { src: epalNails, alt: "EPAL-certified ring shank pallet nails" },
        quoteHref: "/contact-us?product=nails#quote",
      },
      {
        href: routes.wire,
        title: "Nail Wire & Drawn Wire",
        text: "Machine-grade low carbon steel wire (SAE 1008/1010) engineered for Enkotec, Wafios and Vitari high-speed nail machines. CBAM-vetted wire rod with full mill test certificates.",
        image: { src: nailWire, alt: "Coils of drawn nail wire" },
        quoteHref: "/contact-us?product=wire#quote",
      },
      {
        href: routes.bars,
        title: "Long Products",
        text: "Alloy Bars, Carbon Bars, Bright Bars",
        // No photo yet (Kinzoku to supply one): the card shows the bar profile drawing.
        image: null,
        quoteHref: "/contact-us?product=bars#quote",
      },
    ],
  },
  process: {
    title: "From Wire Rod to Nails",
    eyebrow: "Rod → drawing → nails → coils",
    steps: [
      {
        title: "Input: Wire Rod Coils",
        text: "Detailed composition analysis of industrial steel rod coils.",
        note: "CBAM Insulated & Quota Managed Asia Mills",
      },
      {
        title: "Wire Drawing: Reducing Diameter",
        text: "Reducing wire rod and diameter with proprietary diameter control.",
        note: "Precise Engineering for Fastener Specification",
      },
      {
        title: "Intermediate: Loose Nails",
        text: "Ensuring consistency, quality control, local production of loose nails, and factory floor operations.",
        note: "Consistency, Quality, Mill Certified",
      },
      { title: "Output: Collated Coil Nails" },
    ],
  },
  why: {
    title: "Why Kinzoku",
    // The second sentence of the live hero text, laid out as three facts.
    lead: "Every shipment is CBAM-cleared by us as Authorized CBAM Declarant, certified to EN 10204 3.1, and invoiced in EUR - CIF, DAP or DDP.",
    facts: [
      { value: "CBAM", label: "Cleared by us as Authorized CBAM Declarant" },
      { value: "EN 10204 3.1", label: "Certified on every shipment" },
      { value: "EUR", label: "Invoiced in EUR - CIF, DAP or DDP" },
    ],
  },
  about: {
    title: "About Us",
    more: "More about Kinzoku",
  },
  // The wire thread that runs down the page, from the hero to the quote (plan §5).
  thread: { start: "Wire rod", end: "Factory gate" },
};
