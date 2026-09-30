import nailWire from "@/public/images/products/nail-wire.jpg";
import wireRod from "@/public/images/products/wire-rod.jpg";
import { routes } from "@/lib/routes";

// Text from content/_source/low-carbon-steel-wire-rod-and-drawn-nail-wires.md. All content kept
// (decision after Step 7). Approved fixes: "is widely used", missing "(", "C1010, SWRM10",
// "go the extra mile to deliver", "comply with". Customer quotes stay exactly as given.
// The live page's in-page links pointed to broken addresses (/en/de/es/es/…); they now jump to
// the sections on this page.
export const wirePage = {
  meta: {
    title: "Nail Wire for Enkotec, Wafios & Vitari Machines",
    description:
      "Low carbon steel nail wire SAE 1008/1010 for high-speed nail machines. EN 10204 3.1 certified, CBAM cleared, mill-direct wholesale supply and import into Europe, LatAm, Africa.",
  },
  breadcrumb: "Wire Rod, Drawn Wires",
  title: "Wire Rods, Drawn Wires",
  subtitle: "Low Carbon Steel Wire Rod & Drawn Wire - SAE 1008 / SAE 1010",
  intro:
    "High quality Low Carbon Steel Grade Wire (As rolled Wire Rods) is widely used across industries for its excellent cold forming, welding and drawing capabilities. These wires are delivered in excellent logistic and packaging condition to our customers.",
  quote: { label: "Submit RFQ / Procurement Specification", href: "/contact-us?product=wire#quote" },
  images: [
    { src: wireRod, alt: "Coils of low carbon steel wire rod" },
    { src: nailWire, alt: "Coils of drawn nail wire" },
  ],
  sizes: ["Wire Rod Size in 5.5mm, 6mm, 6.5mm, 8mm, 10mm, 12mm", "Drawn Wire Sizes from 1mm to 5mm"],
  chemistryCaption: "Chemical composition and tensile strength",
  chemistryNote: "Tensile depending on diameter",
  grades: {
    id: "grades-standards",
    title: "Grades & Standards",
    gradesLabel: "Worldwide grades which resemble our product:",
    grades:
      "SAE1008, SAE1010, AISI 1010, C7D (WNr 1.0313), C10D (WNr 1.0310), Q195, Q235, 08F, 10#, 15#, C1008, C1010, SWRM10 or SWRM10K, KWRM10, SM10C, SANS 1431 Grade 230",
    standardsLabel: "Worldwide Standards similar to our grades:",
    standards: "ASTM A510M, ASTM A853, EN10016-2, EN10218-2, GB/T 343, GB/T 699, GB/T 4354, JIS G 3532, JIS G 3505, ISO 16120-2",
    packaging: "Depending on diameter, Coil Packaging available from 500 - 2500 kilogram coils",
  },
  machines: {
    id: "nail-manufacturing",
    title: "High-Speed Performance Engineered: Our Drawn Wires for Enkotec, Wafios & Vitari Lines",
    paragraphs: [
      "In nail manufacturing, machine uptime dictates your profitability. When your production lines run at 1,000 to 2,500 nails per minute, raw material inconsistency is your most expensive risk.",
      "Our Low Carbon Drawn Wires (SAE 1008 / SAE 1010) are metallurgically optimized to eliminate feeding jams, reduce tooling wear, and keep your high-speed machinery running at peak capacity.",
    ],
    compatibilityTitle: "Machine-Specific Compatibility",
    compatibility: [
      {
        label: "Enkotec Rotary Systems (Zero Flaking)",
        text: "Enkotec machines run a dry, oil-free process. Our wires feature a bright, mechanically clean finish with tightly controlled residual soaps. This prevents powder buildup inside precision rotary dies, eliminating feed roller slippage and short nails.",
      },
      {
        label: "Wafios (Zero Hard Spots)",
        text: "High-speed linear reciprocating punches demand predictable steel ductility. Our wires maintain a strictly uniform tensile profile and chemistry across all sizes (1mm–5mm). This prevents premature chipping of the premium carbide tooling pins.",
      },
      {
        label: "Eurolls / Vitari Lines (Zero Geometric Slippage)",
        text: "Built to heavy-duty standards, Vitari lines require perfect wire geometry. Our wires comply with strict dimensional tolerances and minimal ovality under ASTM A510M standards, ensuring stable, uninterrupted tracking through heavy straighteners.",
      },
    ],
    whyTitle: "Why European Manufacturers Choose Kinzoku",
    why: [
      { label: "Full Compliance", text: "Full EN 10204 3.1 Material Test Certificates and pre-vetted CBAM carbon reporting data" },
      { label: "High-Volume Packaging", text: "Available in 500 kg to 2,500 kg carrier coils to minimize coil-change downtime" },
      { label: "Mill-Direct Pricing", text: "Competitive mill-direct supply paired with flexible European logistics" },
    ],
    closing: [
      "Stop letting inconsistent wire quality cause unplanned machine stops.",
      "Get reliable, machine-compatible steel wire tailored to your exact manufacturing line.",
    ],
  },
  applications: {
    title: "Industrial Applications",
    lead: "Our wire rods are highly sought after for re-drawing into wire and manufacturing of steel products across various industries such as:",
    items: [
      { text: "General hardware & High Speed manufacturing", href: "#nail-manufacturing", detail: "(Common Nails, Coil Nails, Screws, Staples, Chains, Mesh)" },
      { text: "Construction for binding reinforcement" },
      { text: "Agricultural & Fencing (Barbed Wire, Field Fencing, Vineyard)" },
      { text: "Automotive seat frames" },
      { text: "Consumer Goods (Baskets, Shopping Carts, Retail Displays)" },
    ],
  },
  characteristics: {
    title: "Key Characteristics",
    items: [
      "Wire rod for drawing and excellent surface finish",
      "Suitable for chemical pickling and mechanical descaling",
      "Reach diameter reductions lower than one millimeter",
      "Silicon content controlled to ensure the best hot zinc plating",
    ],
  },
  keyTopics: {
    title: "Key Topics",
    items: [
      { label: "High-Speed Nail Machine Compatibility Enkotec, Wafios & Vitari", href: "#nail-manufacturing" },
      { label: "ASTM 510 (Advanced Standards Transforming Mechanism)", href: "#astm-a510m" },
      {
        label: "How Wire Drawing & Nail Manufacturing Companies Source Low Carbon Steel Wire Across EMEA",
        href: "/low-carbon-steel-wire-for-nail-manufacturing",
      },
    ],
  },
  astm: {
    id: "astm-a510m",
    title: "ASTM A510M",
    paragraphs: [
      "ASTM A510M is the metric specification for the general requirements of carbon steel wire rods and uncoated coarse round wire. It details standard chemical compositions, dimensional tolerances, testing methods, and quality standards for steel wire rods and coils.",
      "Low carbon steel wire (containing less than 0.25% carbon) is valued for its high malleability, flexibility, and weldability. It is predominantly used in construction for binding reinforcement, agricultural fencing, general hardware manufacturing (nails, screws, and mesh), and automotive seat frames.",
      "The adaptability of the wire stems from processing it into different forms and finishes depending on the intended use. Common applications rely on these specific variations:",
    ],
    uses: [
      {
        group: "Construction and Hardware",
        items: [
          { label: "Tie/Binding Wire", text: "Used to tie rebar in place before pouring concrete, frequently using annealed wire for easy bending and knotting." },
          { label: "Nail Manufacturing", text: "Cold-drawn wire ranging from 1mm to 6mm is the primary material used to produce common, roofing, and specialty nails." },
          {
            label: "Wire Mesh and Fencing",
            text: "Available in bare, galvanized, or PVC-coated forms, it is used to fabricate welded or woven wire meshes for security, partitions, and concrete reinforcement.",
          },
        ],
      },
      {
        group: "Agriculture and Landscaping",
        items: [
          {
            label: "Trellising and Fencing",
            text: "Galvanized low carbon wire is the standard for building chain-link fences, agricultural wire for vineyards, and trellising for crops like hops and grapes.",
          },
          { label: "Barbed Wire", text: "Twisted for security fencing and livestock management" },
        ],
      },
      {
        group: "Industrial and Manufacturing",
        items: [
          { label: "Everyday Consumer Goods", text: "Used to form everyday items like shopping carts, bucket handles, shelving units, and retail displays." },
          { label: "Welding Consumables", text: "Drawn into straight lengths or spools to act as a filler material in gas metal arc welding (GMAW/MIG)." },
        ],
      },
      {
        group: "Automotive and Engineering",
        items: [
          { label: "Mechanical Components", text: "Utilized for fasteners, cable armoring, and functional interior components like seat frames and springs." },
          { label: "Utility Flags", text: "Utilized in markers for underground utility location and landscaping." },
        ],
      },
      {
        group: "Protective Coatings",
        items: [
          {
            label: "",
            text: "For outdoor or heavy-duty use, the wire is often further processed. For maximum longevity, Hot Dipped Galvanized coating provides a thick, protective layer of zinc, while PVC coating creates an additional plastic barrier against moisture and oxygen.",
          },
        ],
      },
    ],
  },
  reviews: {
    title: "Customer reviews",
    intro: "Discover what our clients think about our service. We have many more references than these",
    quotes: [
      {
        text: "A few iterations in achieving the right product with continuous improvement and service quality dedication, Kinzoku has been supplying us Wire Rods for our Wire Drawing factory since we started working together in 2021.",
        author: "S. H., Germany - Monthly 80 Tons",
      },
      {
        text: "The supply structure has been build successfully by working together with Kinzoku. They have supported us during these difficult global crisis.",
        author: "V. S., Portugal - Monthly 50 Tons",
      },
    ],
    next: {
      title: "You are next.....",
      lines: ["Reach out to us with your requirements.", "We go the extra mile to deliver the right product and service quality to you."],
    },
  },
  bannerText: "Tell us the wire grade, diameter, quantity and delivery country.",
  canonical: routes.wire,
};
