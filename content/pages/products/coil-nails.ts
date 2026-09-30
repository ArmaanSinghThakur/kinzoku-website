import bulkNails from "@/public/images/products/bulk-nails.jpg";
import coilNails from "@/public/images/products/coil-nails.jpg";
import epalNails from "@/public/images/products/epal-nails.jpg";
import staples from "@/public/images/products/staples.jpg";
import videoStill from "@/public/images/products/coil-nails-video.jpg";
import { routes } from "@/lib/routes";

// Text from content/_source/coil-nails-staples-bulk-nails-epal-certified-pallet-nails.md.
// Approved fixes: intro sentence, "71, ,80", "( standard )", "Ankernegle", "Kinzoku Consulting".
// Tables are in coil-nails.tables.ts. Photos are the live site's own product photos (interim,
// until Kinzoku supplies new ones).
export const coilNailsPage = {
  // Live title and description (the site template adds "| Kinzoku" once).
  meta: {
    title: "Coil Nails, EPAL Certified Pallet Nails, Loose Nails & Staples Supplier",
    description:
      "15°–16° wire collated coil nails, EPAL certified pallet nails, bulk common nails & industrial staples imports into Europe, LatAm, Africa, North America. Bostitch/MAX/Senco compatible.",
  },
  breadcrumb: "Coil Nails, Staples, Bulk Nails, EPAL Nails",
  title: "Coil Nails, Staples, Common Nails, EPAL Nails",
  intro:
    "Our Nail Products are produced from Low Carbon Steel Wire with high tensile strength and are made to strict standards such as EPAL (European Pallet Association) and EN 14592 (Timber structures)",
  quote: { label: "Submit RFQ / Procurement Specification", href: "/contact-us?product=nails#quote" },
  tabsLabel: "Nail products",
  commonLabel: "Common to all sizes",
  tabs: {
    coil: {
      value: "coil-nails",
      label: "Coil Nails",
      title: "Collated Wire Coil Nails (15° - 16° Angle)",
      image: { src: coilNails, alt: "Wire collated coil nails packed in a carton" },
      lead: "Engineered for high-speed pneumatic nailers used in wooden pallet assembly, roofing, siding, fencing, and timber framing construction.",
      specs: [
        { label: "Wire Angle", value: "15° - 16° Wire Collated" },
        { label: "Diameter Range", value: "2.1 mm to 3.8 mm" },
        { label: "Length Range", value: "25 mm to 100 mm" },
        {
          label: "Shank Options",
          value: "",
          items: [
            "Screw Shank (Helical): Maximum holding power in softwood.",
            "Ring Shank (Annular Thread): High pull-out force, required for cladding and decking.",
            "Smooth Shank: High-speed assembly applications.",
          ],
        },
        {
          label: "Finishes",
          value: "Bright (Indoor/furniture), Electro-Galvanized (Pallets/packaging), Stainless Steel A2/A4 (Outdoor cladding, maritime environments).",
        },
        {
          label: "Coil Capacity",
          value: "300 nails per coil (Jumbo coils up to 1,000 nails available for automated manufacturing systems).",
        },
      ],
      tableCaption: "Coil nail sizes",
      video: {
        href: "https://youtu.be/eOiv5X1SNgk",
        title: "KinzokuTrade - KCT Coil Nails",
        label: "Watch on YouTube",
        still: videoStill,
      },
    },
    staples: {
      value: "staples",
      label: "Staples",
      title: "Staples",
      image: { src: staples, alt: "Flat wire staples in strips" },
      specs: [
        { label: "Series", value: "71, 80, 90, 92" },
        { label: "Length", value: "4mm, 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 18mm, 20mm, 22mm, 25mm, 30mm, 35mm, 40mm" },
        { label: "Crown Width", value: "9mm, 12.8mm, 5.8mm, 8.5mm" },
      ],
      packaging: ["Flat wire staples packaging available in", "5000 staples per Box, 20 Boxes per Carton", "OR", "10,000 staples per Box, 10 Boxes per Carton"],
      features: [
        "Designed with a rust-resistant galvanized coating",
        "Suitable for indoor upholstery and re-upholstery applications",
        "Offer strong holding capabilities across multiple materials",
        "Commonly used for furniture, fabrics, blinds, pelmets, insulation, lining, and roofing felt",
      ],
    },
    bulk: {
      value: "bulk-nails",
      label: "Bulk Nails",
      title: "Loose Bulk Common Nails",
      image: { src: bulkNails, alt: "Loose bulk common nails in a row of sizes" },
      lead: "Commonly used in general framing, formwork, carpentry, and heavy wooden packaging across Europe.",
      specs: [
        { label: "Diameter Range", value: "2.2 mm to 6.0 mm" },
        { label: "Length Range", value: "40 mm to 200 mm (Most demanded sizes: 2.8 × 65 mm, 3.1 × 80 mm, 3.8 × 100 mm, 4.2 × 120 mm)" },
        { label: "Head Type", value: "Flat countersunk head with diamond point" },
        { label: "Shank Types", value: "Smooth shank (standard), Ring shank / Threaded (high withdrawal resistance)" },
        { label: "Finishes", value: "Polished / Bright, Electro-Galvanized (EZ > 12 µm), Hot-Dip Galvanized (HDG > 50 µm for outdoor construction)" },
        { label: "Packaging", value: "20 kg or 25 kg bulk cartons on wooden pallets (1,000 kg per pallet), plus custom 2.5 kg – 5 kg retailer packs." },
      ],
      tableCaption: "Bulk common nail sizes",
    },
    epal: {
      value: "epal-nails",
      label: "EPAL Nails",
      title: "EPAL-Certified Pallet Coil Nails",
      image: { src: epalNails, alt: "EPAL-certified ring shank pallet nails" },
      lead: "Strictly regulated for the production and repair of official Euro Pallets. Failure to meet EPAL standards results in immediate rejection by European logistics networks.",
      sizesLabel: "EPAL Size Standards",
      sizes: [
        "Plain Nails 2.8 x 45 VY",
        "Ring Nails 2.5 / 2.7 x 35 VZ",
        "Ring Nails 2.80 / 2.95 x 40 VX",
        "Ring Nails 2.80 / 2.95 x 55 VW",
        "Ring Nails 3.50 / 3.70 x 70 VV",
        "Ring Nails 3.50 / 3.70 x 90 VU",
      ],
      specs: [
        { label: "Mandatory Marking", value: "EPAL emblem / Manufacturer identification code stamped on the nail head." },
        {
          label: "Compliance & Testing",
          value: "Full EN 14592 compliance, strict head-pull-through parameters, certified wire tensile strength to prevent head shearing in automated lines (Storti, CAPE, Gulliver).",
        },
      ],
    },
  },
  tools: {
    title: "100% Tool & Machine Compatibility",
    text: "Guaranteed seamless feeding in all major pneumatic tools",
    brands: "Bostitch, MAX, Paslode, BeA, Haubold, Senco, Prebena, Omer, Tjep, Holz-Her, Alsafix, Kihlberg, Tacwise",
    advantagesTitle: "Key Performance Advantages",
    advantages: [
      { label: "Zero Jamming", text: "Precision weld-wire collation eliminates misfires on manual and robotic lines." },
      { label: "No Bending or Shearing", text: "High-tensile steel wire drives easily through dense hardwoods and frozen timber." },
      { label: "Maximized Uptime", text: "Standard (225–300) and Jumbo coils (up to 1,000 nails) reduce reload stops." },
      { label: "3 Shank Options", text: "Screw (max hold in softwoods), Ring (extreme pull-out resistance / EN 14592), Smooth (fast assembly)." },
      { label: "4 Coating Grades", text: "Bright, Electro-Galvanized, Hot-Dip Galvanized (>50µm), and Stainless Steel (A2/A4)." },
    ],
  },
  faqTitle: "FAQs",
  index: {
    title: "View Cross-Reference Sourcing Index & Technical Compliance Keywords",
    paragraphs: [
      {
        label: "European Standard Compliance & Fastener Classifications",
        text: "UIC 435-2 EPAL pallet nail certification, EN 14592 timber structure fasteners, CE marked coil nails, EN 10204 3.1 Material Test Certificate, CBAM carbon border compliance fasteners, 15 degree wire collated coil nails, 15° plastic sheet collated nails, smooth shank coil nails, ring shank coil nails, screw shank coil nails, diamond point pallet nails, chisel point staples, electro-galvanized HDG coil nails, stainless steel AISI 304 316 coil nails, CPT DAP DDP delivery Europe.",
      },
      {
        label: "Automated Line & Machine Compatibility Matrix",
        text: "CAPE automated pallet line nails, Storti pallet assembly fasteners, Gulliver automated nailer, Corali pallet machine coil nails, Delta pallet machinery, Stanley Bostitch coil nailers, MAX High Pressure Coil Nailers, Paslode Impulse frame nails, BeA pneumatic coil nailers, Senco heavy duty coil nailers, Prebena pneumatic nailers, Haubold staple systems, Tjep coil nailers, Holz-Her collated fasteners, Omer industrial nailers.",
      },
      {
        label: "Multi-Lingual European Fastener Terminology",
        text: "DE/DACH: Coilnägel 15 Grad drahtmagaziniert, Palettennägel EPAL zertifiziert, Rillennägel, Schraubnägel, Ankernägel, Heftklammern Schwerlast, Drahtstifte lose bulk. ES: Clavos en bobina 15° para palés, clavos peinados en tira electrosoldados, clavos EPAL homologados, grapas industriales pesadas, clavos a granel para construcción. FR: Pointes en rouleau 15°, clous en bobines pour palettes EPAL, pointes crantées cloueur automatique, agrafes industrielles, clous en vrac charpente. IT: Chiodi in rotolo per bancali, chiodi elettrosaldati 15 gradi, chiodi EPAL certificati, punti metallici industriali, chiodi sfusi per edilizia. PL: Gwoździe w kręgu 15 st, gwoździe łączone drutem do palet EPAL, gwoździe skręcane w zwoju, zszywki stolarskie, gwoździe budowlane luzem. NL: Coilnagels op draad 15 graden, EPAL palletnagels, draadgebonden spoelnagels, ringnagels, zware krammen, losse draadnagels. PT: Pregos em rolo para paletes 15°, pregos electrossoldados em tira, pregos anelados, grampos industriais.",
      },
      {
        label: "Commercial Wholesale & FCL Trading Terms",
        text: "Wholesale coil nails supplier Europe, FCL container load coil nails, EPAL pallet nail direct importer, pallet manufacturer bulk supply, coil nails wholesale price per pallet, jumbo coil nails 1000 count, pneumatic nailer fasteners supplier Netherlands, European pallet fasteners wholesale distributor, Kinzoku Consultancy & Trade fasteners.",
      },
    ],
  },
  bannerText: "Tell us the nail type, size, finish, quantity and delivery country.",
  canonical: routes.nails,
};
