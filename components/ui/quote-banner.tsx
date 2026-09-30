import { routes } from "@/lib/routes";
import { ButtonLink } from "./button";

type QuoteBannerProps = {
  title?: string;
  text?: string;
  /** e.g. "/contact-us?product=wire#quote" to preselect the product in the form. */
  href?: string;
  cta?: string;
};

/** Closing call to action used at the end of every page. */
export function QuoteBanner({
  title = "Request a quote",
  text = "Tell us the product, specification, quantity and delivery country.",
  href = routes.quote,
  cta = "Request a quote",
}: QuoteBannerProps) {
  return (
    <section className="py-16">
      <div className="site-container">
        <div className="flex flex-col items-start gap-6 rounded-lg bg-charcoal px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl text-white">{title}</h2>
            <p className="mt-2 text-white/75">{text}</p>
          </div>
          <ButtonLink href={href} className="shrink-0">
            {cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
