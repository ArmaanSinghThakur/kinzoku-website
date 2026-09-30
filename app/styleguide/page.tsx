// TEMPORARY review page for the building blocks (Step 2). Delete before launch (Phase 5).
import { BadgeCheck, Euro, ShieldCheck, Ship } from "lucide-react";
import type { Metadata } from "next";
import { BlogCard } from "@/components/ui/blog-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { ProcessStepper } from "@/components/ui/process-stepper";
import { ProductCard } from "@/components/ui/product-card";
import { QuoteBanner } from "@/components/ui/quote-banner";
import { Section } from "@/components/ui/section";
import { SpecTable } from "@/components/ui/spec-table";
import { Tabs } from "@/components/ui/tabs";
import { TrustBadge } from "@/components/ui/trust-badge";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const sample = <span className="text-xs font-normal text-muted"> (sample data)</span>;

export default function StyleguidePage() {
  return (
    <main className="flex-1">
      <div className="site-container pt-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Products", href: "/coil-nails-staples-bulk-nails-epal-certified-pallet-nails" },
            { name: "Styleguide", href: "/styleguide" },
          ]}
        />
      </div>

      <Section eyebrow="Step 2" title="Building blocks" intro="Every reusable block, shown once. Temporary page, not indexed.">
        <h3 className="text-lg">Buttons</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us#quote">Request a quote</ButtonLink>
          <ButtonLink href="#products" variant="secondary">
            View products
          </ButtonLink>
          <Button size="sm">Small primary</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 rounded-lg bg-charcoal p-6">
          <ButtonLink href="/contact-us#quote">On dark</ButtonLink>
          <ButtonLink href="#products" variant="secondary-dark">
            Outline on dark
          </ButtonLink>
        </div>
      </Section>

      <Section tone="mist" title="Trust badges">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <TrustBadge icon={ShieldCheck} title="EN 10204 3.1" text="Certified shipments" />
          <TrustBadge icon={BadgeCheck} title="Authorized CBAM Declarant" text="CBAM-cleared by us" />
          <TrustBadge icon={Ship} title="CIF, DAP or DDP" text="Delivered to your factory gate" />
          <TrustBadge icon={Euro} title="Invoiced in EUR" text="Every shipment" />
        </div>
      </Section>

      <Section id="products" title="Product cards">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            href="/coil-nails-staples-bulk-nails-epal-certified-pallet-nails"
            title="Coil Nails, Staples, Bulk & EPAL Nails"
            text="15°–16° wire collated coil nails (2.1–3.8 mm, 25–100 mm), EPAL-certified pallet nails, bulk common nails and industrial staples."
          />
          <ProductCard
            href="/low-carbon-steel-wire-rod-and-drawn-nail-wires"
            title="Nail Wire & Wire Rod"
            text="Machine-grade low carbon steel wire (SAE 1008/1010) engineered for Enkotec, Wafios and Vitari high-speed nail machines."
          />
          <ProductCard
            href="/long-products-alloy-bars-carbon-bars-bright-bars"
            title="Long Products"
            text="Alloy bars, carbon bars and bright bars."
          />
        </div>
      </Section>

      <Section tone="mist" title="Process stepper">
        <ProcessStepper
          steps={[
            { title: "Wire rod", text: "Sourced and CBAM-vetted at the mill." },
            { title: "Nail wire", text: "Drawn to size for high-speed nail machines." },
            { title: "Nails", text: "Coil, bulk and EPAL nails produced to spec." },
            { title: "Packed & shipped", text: "Delivered CIF, DAP or DDP." },
          ]}
        />
      </Section>

      <Section title="Specification table">
        <SpecTable
          caption="Wire rod chemistry (sample data)"
          columns={["Grade", "C %", "Mn %", "P % max", "S % max", "Standard"]}
          rows={[
            ["SAE 1006", "≤ 0.08", "0.25–0.40", "0.030", "0.035", "SAE J403"],
            ["SAE 1008", "≤ 0.10", "0.30–0.50", "0.030", "0.035", "SAE J403"],
            ["SAE 1010", "0.08–0.13", "0.30–0.60", "0.030", "0.035", "SAE J403"],
          ]}
        />
      </Section>

      <Section tone="mist" title="Tabs">
        <p className="-mt-6 mb-6 text-sm text-muted">
          Try <a href="#staples">#staples</a>: the tab follows the address, so product cards can link straight to one.
        </p>
        <Tabs
          label="Product types"
          syncHash
          items={[
            { value: "coil-nails", label: "Coil Nails", content: <p>Coil nails panel{sample}</p> },
            { value: "staples", label: "Staples", content: <p>Staples panel{sample}</p> },
            { value: "bulk-nails", label: "Bulk Nails", content: <p>Bulk nails panel{sample}</p> },
            { value: "epal-nails", label: "EPAL Nails", content: <p>EPAL nails panel{sample}</p> },
          ]}
        />
      </Section>

      <Section title="FAQ">
        <Faq
          className="max-w-3xl"
          items={[
            { question: "Which nail guns are the coil nails compatible with?", answer: <p>Answer text{sample}</p> },
            { question: "Do you supply EPAL-certified pallet nails?", answer: <p>Answer text{sample}</p> },
            { question: "Which delivery terms do you offer?", answer: <p>Answer text{sample}</p> },
          ]}
        />
      </Section>

      <Section tone="mist" title="Blog cards">
        <div className="grid gap-6 md:grid-cols-3">
          <BlogCard
            href="/cbam-2026-complete-guide-steel-importers"
            title="CBAM 2026: the complete guide for steel importers"
            summary="Sample summary text for the card layout."
            date="2026-01-15"
            category="CBAM"
            readingMinutes={8}
          />
          <BlogCard
            href="/steel-sourcing-india-vs-china-cost-quality-compliance"
            title="Steel sourcing: India vs China"
            summary="Sample summary text for the card layout."
            date="2026-03-02"
            category="Sourcing"
            readingMinutes={6}
          />
          <BlogCard
            href="/low-carbon-steel-wire-for-nail-manufacturing"
            title="Drawn wire for nail manufacturing"
            summary="Sample summary text for the card layout."
            date="2026-05-20"
            category="Products"
            readingMinutes={5}
          />
        </div>
      </Section>

      <Section tone="dark" eyebrow="Dark tone" title="Section on charcoal" intro="Used sparingly, for example under the hero." />

      <QuoteBanner />
    </main>
  );
}
