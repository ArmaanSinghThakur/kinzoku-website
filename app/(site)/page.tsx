// Temporary page to check the design tokens and fonts. Replaced by the real homepage in Step 7.
export default function Home() {
  return (
    <>
      <section className="bg-charcoal py-20 text-white">
        <div className="site-container">
          <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">
            Coil Nails, EPAL Pallet Nails, Staples &amp; Nail Wire
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">Delivered to Your Factory Gate</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/contact-us#quote"
              className="rounded-lg bg-gold px-5 py-3 font-heading font-semibold text-charcoal no-underline transition-colors hover:bg-gold-hover"
            >
              Request a quote
            </a>
            <a
              href="#products"
              className="rounded-lg border border-white/40 px-5 py-3 font-heading font-semibold text-white no-underline transition-colors hover:border-white"
            >
              View products
            </a>
          </div>
        </div>
      </section>

      <section id="products" className="bg-mist py-16">
        <div className="site-container">
          <h2 className="text-2xl">Design system check</h2>
          <p className="mt-2 text-muted">Secondary text in mid grey. Body text in dark grey.</p>
          <div className="mt-6 rounded-lg bg-white p-6 shadow-card">
            <p>
              Card with 8px corners and a light shadow. <a href="/privacy-policy">Steel blue link</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
