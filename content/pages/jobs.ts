import { routes } from "@/lib/routes";

// Text from content/_source/job-openings.md. Approved fixes: "KPI's" → "KPIs" (2×), "the steel
// industry", "the European Union" (4×), "no visa sponsorship", "3 months of research", "Stockists",
// "5 Whys", "submitted by you", "are you going to graduate from a university". The live page's
// role links pointed to broken /en/de/es/es/… addresses; they now jump to the roles below.
export type Role = {
  id: string;
  title: string;
  summary: string[];
  sections: { title: string; paragraphs?: string[]; items?: string[] }[];
  apply: { instruction: string; questionsIntro: string; questions: string[]; subject: string };
};

export const jobsPage = {
  meta: {
    title: "Job Openings",
    description:
      "Job openings at Kinzoku Consultancy & Trade: International Trader - Steel Sales & Marketing, and an Internship in B2B Sales & Marketing Planning.",
  },
  title: "Job Openings",
  applyLabel: "Apply by email",
  viewLabel: "View role",
  roles: [
    {
      id: "international-trader",
      title: "International Trader - Steel Sales & Marketing",
      summary: ["Language Capability: German, Italian, English", "EU citizens with no Visa sponsorship requirement."],
      sections: [
        {
          title: "Role Description",
          paragraphs: [
            "You will manage day-to-day sales and trading activities involving steel products between Asian mills and European clients in a full-time, remote capacity.",
            "A typical week looks like Plan, Execute, Customer Visits, Phone Calls, Review of KPIs.",
            "This is a sales opportunity where you will take complete ownership right from Lead Generation to Closure utilizing your experience in the steel industry along with your connections.",
          ],
        },
        {
          title: "Responsibilities include",
          items: [
            "Developing new customer relationships in Europe - Call, Email, LinkedIn, Trade Fairs, Innovative Channels",
            "Negotiating contracts and pricing, and coordinating orders from quotation through delivery.",
            "Monitoring market trends and steel pricing, assessing risks, and ensuring transactions align with CBAM and EU regulatory requirements in collaboration with compliance and logistics partners.",
            "Prepare and review commercial documentation, support DDP delivery processes, and liaise with internal and external stakeholders to resolve operational issues.",
            "This role will primarily focus on proactive lead generation, participation in sales and business development initiatives, and clear reporting on pipeline, margins, and market opportunities.",
          ],
        },
        {
          title: "Where we support you",
          items: [
            "Infrastructure for Sales and Marketing.",
            "Infrastructure to navigate through European Regulations.",
            "Tier-1 audited supplier connections to help you close your sales deals.",
            "Logistics partner who will support execution of your sales deals.",
          ],
        },
        {
          title: "Qualifications",
          items: [
            "Fluent/Native in German, Italian and English",
            "Passionate about steel industry with an Entrepreneurial Spirit",
            "3+ years of Experience in Sales in European Union Region",
            "Skills in International trade, contract negotiation, and supplier/customer relationship management",
            "Experience with logistics and supply chain coordination, including Incoterms, customs procedures",
            "Some knowledge on EU trade regulations, CBAM requirements, and basic understanding of emissions and compliance documentation.",
            "Proficiency in market research and commercial analysis, with the ability to interpret steel market trends and pricing.",
            "High level of accuracy and attention to detail in handling contracts, reports, and trade documentation.",
            "Comfort working independently in a remote setting, using digital tools for collaboration and data management.",
            "Prior experience in metals/steel trading or industrial B2B sales is highly beneficial.",
          ],
        },
        {
          title: "Compensation",
          items: [
            "Fixed + Uncapped Sales Commissions. This is practically your business.",
            "Your KPIs: New Leads, Opportunity, Deal Closure, Deal Size in Value",
          ],
        },
      ],
      apply: {
        instruction:
          "Send in your CV with a cover letter to info@kinzokutrade.com with the subject as International Trader - Steel Your First Name & Last Name.",
        questionsIntro: "In your cover letter, state your motivation and answers to the below questions in Yes/No.",
        questions: [
          "Are you legally authorized to work in the European Union without Visa Support? Yes/No",
          "How many years of Wholesale Import and Export experience do you currently have? A: Years of experience",
          "What is your level of proficiency in English? A: Native / Professional / Conversational / None",
          "What is your level of proficiency in German? A: Native / Professional / Conversational / None",
          "What is your level of proficiency in Italian? A: Native / Professional / Conversational / None",
          "How many years of work experience do you have with Steel? A: Years of experience",
          "Do you have a valid driver's license issued in the European Union? Yes / No",
          "Do you own a car and are you willing to use it for travelling to customers with Fuel Reimbursement? Yes / No",
        ],
        subject: "International Trader - Steel",
      },
    },
    {
      id: "internshipb2b",
      title: "Internship (8 to 12 weeks recommended) - B2B Sales & Marketing Planning",
      summary: ["Language: English", "Apply if no visa sponsorship is required in the European Union."],
      sections: [
        {
          title: "What you will do",
          paragraphs: [
            "Market research and commercial analysis for a product in Steel Category",
            "Prepare a Business Plan Case. Typically, 3 months of research leads to",
          ],
          items: [
            "Identifying the Product",
            "Understanding the Value Chain of the Product",
            "Understanding the Product Opportunity in a Specific Region/Country",
            "Identifying Usage of the Product, Industry where they are used",
            "Identifying Manufacturers, Suppliers (Stockists) - Product, Quality, Selling Pricing, Supply Chain, Compliances, Lead Times",
            "Identifying Customers, Procurement Managers, Procurement Cycles, Buying Pricing",
          ],
        },
        {
          title: "Our key success factor has been Toyota's principles - 5 Whys",
          paragraphs: [
            "At the end of your internship, we hope to learn from you.",
            "The internship will close with a detailed presentation submitted by you.",
            "An internship can also lead to a job.",
          ],
        },
        {
          title: "Who can apply:",
          items: [
            "Currently pursuing or recently completed a degree in Business, Commerce, Engineering, Economics, or a related field.",
            "Interested in Steel Industry, International trade.",
            "Speak Fluent English along with a European Language, especially German/Italian/Polish",
          ],
        },
      ],
      apply: {
        instruction:
          "Submit your CV with a cover letter to info@kinzokutrade.com with the subject as Internship - B2B First Name Last Name.",
        questionsIntro: "In your cover letter, state your motivation and answers to the below questions in Yes/No.",
        questions: [
          "Have you recently graduated or are you going to graduate from a university?",
          "Does your current visa or your Nationality support the duration of this Internship without any sponsorship?",
          "Are you based in the European Union?",
        ],
        subject: "Internship - B2B",
      },
    },
  ] satisfies Role[],
  canonical: routes.jobs,
};
