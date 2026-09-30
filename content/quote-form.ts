// Text of the quote form on /contact-us#quote (Step 15). The questions are the live Google Form
// "Request a Quote" (content/_source/_google-forms.json) with the approved spelling fixes; product
// and finish choices come from the product pages; delivery terms from the plan's request table.
// This file is sent to the browser with the form, so it holds form text only.

export const requestTypes = ["nails", "wire", "bars", "cbam_advisory", "other"] as const;
export type RequestType = (typeof requestTypes)[number];
/** Request types that ask for a product specification and a delivery place. */
export const productTypes = ["nails", "wire", "bars"] as const satisfies readonly RequestType[];

export const maxFiles = 3;
export const maxFileMb = 10;
/** For the file picker only; the server checks each file's actual contents. */
export const acceptedFiles = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.tif,.tiff,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods";

export const quoteForm = {
  type: {
    label: "What is your request about?",
    choose: "Please choose",
    options: {
      nails: "Coil Nails, Staples, Bulk Nails, EPAL Nails",
      wire: "Nail Wire & Wire Rod",
      bars: "Long Products (Bars)",
      cbam_advisory: "CBAM advisory",
      other: "Something else",
    } satisfies Record<RequestType, string>,
    error: "Please choose what your request is about.",
  },
  /** ?product= values used by links on the product and CBAM pages. */
  fromLink: { nails: "nails", wire: "wire", bars: "bars", cbam: "cbam_advisory" } as Record<string, RequestType>,

  groups: { company: "Your details", requirement: "Your requirement", delivery: "Delivery", more: "Anything else" },

  companyName: { label: "Company Legal Name", error: "Please enter your company's legal name." },
  contactName: { label: "Name", error: "Please enter your name." },
  email: { label: "Email", error: "Please enter a valid email address, e.g. name@company.com." },
  phone: {
    label: "WhatsApp / Phone Number",
    hint: "With the country code, e.g. +31 6 1234 5678",
    error: "Please enter a phone or WhatsApp number with the country code.",
  },

  products: {
    label: "Products (choose any)",
    options: {
      nails: ["Coil Nails", "Staples", "Bulk Nails", "EPAL Nails"],
      wire: ["Wire Rod", "Drawn Nail Wire"],
      bars: ["Alloy Bars", "Carbon Bars", "Bright Bars"],
    },
  },
  finishes: {
    label: "Finish (choose any)",
    options: ["Bright", "Electro-Galvanized", "Hot-Dip Galvanized", "Stainless Steel (A2/A4)"],
  },
  specification: {
    nails: { label: "Size and type", hint: "e.g., 2.5 × 50 mm, ring shank, 16° wire collated" },
    wire: { label: "Required Grade and Diameter", hint: "e.g., SAE 1008, 5.5 mm" },
    bars: { label: "Required Grade", hint: "e.g., 42CrMo4, 1.8509, SAE 1006" },
    error: "Please describe the product you need.",
  },
  dimensions: { label: "Specific Dimensions, Tolerances and Length" },
  quantity: { label: "Total Quantity", hint: "e.g., 23 tons" },
  targetPrice: { label: "Target Price per Metric Ton (EUR / USD)" },

  deliveryCountry: { label: "Delivery Postcode / Country", error: "Please enter the delivery postcode and country." },
  deliveryTerms: {
    label: "Delivery terms (Incoterms)",
    choose: "Not sure yet",
    options: ["CIF", "CFR", "DAP", "DDP", "FCA", "FOB"],
  },
  leadTime: {
    label: "Required Delivery Window / Lead Time Expectation",
    options: [
      "Immediate Spot Allocation (Subject to current stock/port availability)",
      "Within 30–60 Days",
      "Within 90–120 Days (Future Mill Rolling Program Allocation)",
    ],
  },

  message: {
    label: { product: "Anything else we should know?", cbam_advisory: "How can we help with CBAM?", other: "Your message" },
    error: "Please tell us how we can help.",
  },
  files: {
    label: "Drawings or specifications",
    hint: `Up to ${maxFiles} files, ${maxFileMb} MB each: PDF, images or office files (Word, Excel, PowerPoint).`,
    tooMany: `Please attach up to ${maxFiles} files.`,
    tooBig: (name: string) => `“${name}” is larger than ${maxFileMb} MB.`,
    wrongType: (name: string) => `“${name}” is not a PDF, image or office file.`,
    empty: (name: string) => `“${name}” is empty.`,
  },

  optional: "optional",
  choice: "Please choose from the list.",
  tooLong: (max: number) => `Please shorten this to ${max} characters.`,
  honeypot: "Leave this field empty",
  privacy: { before: "We use your details only to answer your request, as described in our", link: "Privacy Policy" },
  noScript: "Please turn on JavaScript to send this form, or send your request by email or WhatsApp below.",

  submit: "Send request",
  retry: "Try again",
  sending: "Sending…",
  summary: (count: number) => `Please check the ${count === 1 ? "field" : `${count} fields`} marked below.`,
  failed: "Your request could not be sent. Everything you entered is still here, so you can simply try again.",
  rateLimited: "You have sent several requests in a short time. Please try again in an hour, or email us.",
  sent: {
    title: "Thank you, your request has been received",
    reference: "Your reference:",
    next: "We return a preliminary assessment and transparent quote within 48 hours.",
    another: "Send another request",
  },
};
