// New About Us page, built only from existing Kinzoku text: the How We Work article
// (content/_source/how-we-work-sourcing-steel-asia-europe.md), the homepage, and the markets in
// the live site's structured data (content/_source/_site-jsonld.json).
export const about = {
  meta: {
    title: "About Us",
    description:
      "Kinzoku Consultancy & Trade connects European buyers with verified Asian steel mills, supplying pallet manufacturers, construction wholesalers and nail producers across Europe, Latin America and Africa.",
  },
  title: "About Us",
  intro: "Kinzoku Consultancy & Trade connects European buyers with verified Asian steel mills.",
  story: {
    title: "Our Model",
    paragraphs: [
      "Kinzoku Consultancy & Trade operates as a steel trading company with deep sourcing capabilities across Asia. We purchase directly from mills and deliver to European buyers at competitive prices — fully documented, compliant, and transparent.",
      "Kinzoku supplies pallet manufacturers, construction wholesalers and nail producers across Europe, Latin America and Africa with fasteners and wire.",
    ],
  },
  network: {
    title: "Our Network",
    offices: { label: "Offices", items: ["Netherlands", "India", "Japan"] },
    headquarters: "Netherlands: Corporate headquarters, Rotterdam/Antwerp clearance, European distribution",
    sourcing: {
      label: "Sourcing Capabilities",
      items: [
        { country: "India", text: "Mill sourcing, quality verification, supplier relationships" },
        { country: "Japan", text: "High-spec alloy steel, precision tubes, automotive grade sourcing" },
        { country: "China", text: "Wide range of grades, competitive pricing, large volume capacity" },
        { country: "Vietnam", text: "Cost-effective production, growing quality capabilities" },
      ],
    },
  },
  mvvTitle: "Mission, Vision & Values",
  howWeWork: {
    title: "How We Work",
    steps: [
      { title: "You request.", text: "Send us your specifications, grade, quantity, and delivery timeline." },
      { title: "We source.", text: "We identify and verify mills in India, Japan, China, and Vietnam capable of production." },
      { title: "We quote.", text: "We negotiate mill-direct pricing and provide you with a transparent, all-inclusive quote." },
      { title: "You confirm.", text: "You approve the order and pricing." },
      { title: "We manage.", text: "Production oversight, quality verification, documentation, logistics." },
      { title: "You receive.", text: "Goods delivered to your warehouse, fully documented, with one EUR invoice." },
    ],
    more: "Read the full How We Work guide",
    moreHref: "/how-we-work-sourcing-steel-asia-europe",
  },
  regions: {
    title: "Regions We Serve",
    // Country names word for word from the live structured data (Service → areaServed).
    items: [
      { name: "Europe", countries: ["Netherlands", "Germany", "Austria", "Switzerland", "Belgium", "France", "Italy", "Spain", "Poland", "Czechia"] },
      { name: "Latin America", countries: ["Mexico", "Brazil", "Colombia", "Peru", "Chile", "Argentina"] },
      {
        name: "Africa",
        countries: ["Morocco", "Algeria", "Tunisia", "Egypt", "Nigeria", "Ghana", "Kenya", "South Africa", "Angola", "Mozambique", "Ivory Coast", "Senegal", "Cameroon", "DR Congo"],
      },
      { name: "North America", countries: ["United States", "Canada"] },
    ],
  },
  details: {
    title: "Company Details",
  },
};
