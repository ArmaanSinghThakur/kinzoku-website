import { routes } from "@/lib/routes";
import { ButtonLink } from "./button";

type QuoteBannerProps = {
  title?: string;
  text?: string;
  /** e.g. "/contact-us?product=wire#quote" to preselect the product in the form. */
  href?: string;
  cta?: string;
};

/** Closing call to action used at the end of every page: a Clay Blush panel, the "factory gate". */
export function QuoteBanner({
  title = "Request a quote",
  text = "Tell us the product, specification, quantity and delivery country.",
  href = routes.quote,
  cta = "Request a quote",
}: QuoteBannerProps) {
  return (
    <section data-tone="chalk" className="py-16 sm:py-20">
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-2xl bg-blush px-6 py-12 sm:px-12 sm:py-14">
          {/* The end of a wire coil, seen face on: concentric rings behind the button. */}
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            className="absolute -right-24 -bottom-40 -z-10 w-[26rem] stroke-graphite/[0.07] sm:-right-10 sm:-bottom-32"
            fill="none"
          >
            {Array.from({ length: 11 }, (_, i) => (
              <circle key={i} cx="200" cy="200" r={60 + i * 13} strokeWidth="5" />
            ))}
          </svg>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 data-reveal="rise" className="text-section">
                {title}
              </h2>
              <p className="mt-3 max-w-xl text-lg text-graphite/80">{text}</p>
            </div>
            <ButtonLink href={href} className="shrink-0 justify-self-start">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
