import Link from "next/link";
import type { ReactNode } from "react";
import type { ChromeDictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const linkClass = "text-white/80 no-underline transition-colors hover:text-gold";

function Row({ label, colon, children }: { label: string; colon: string; children: ReactNode }) {
  // Label and value on one line (the live footer splits them apart).
  return (
    <div className="flex gap-2">
      <dt className="text-white/55">
        {label}
        {colon}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export function Footer({ dict }: { dict: ChromeDictionary }) {
  const t = dict.footer;
  // French typography puts a no-break space before a colon.
  const colon = dict.lang.startsWith("fr") ? " :" : ":";

  return (
    <footer className="bg-charcoal text-sm text-white/80">
      <div className="site-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo label={dict.nav.home} />
          <address className="mt-4 not-italic">
            {site.name}
            <br />
            {site.address.locality}, {site.address.country}
          </address>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">{t.contact}</h2>
          <dl className="mt-4 space-y-2">
            <Row colon={colon} label={t.email}>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </Row>
            <Row colon={colon} label={t.phone}>
              <a href={`tel:${site.phone.e164}`} className={linkClass}>
                {site.phone.display}
              </a>
            </Row>
            <Row colon={colon} label={t.linkedin}>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                kinzokutrade
              </a>
            </Row>
          </dl>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">{t.company}</h2>
          <dl className="mt-4 space-y-2">
            <Row colon={colon} label={t.kvk}>{site.kvk}</Row>
            <Row colon={colon} label={t.vat}>{site.vat}</Row>
          </dl>
        </div>

        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">{t.links}</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href={routes.about} className={linkClass}>
                {t.about}
              </Link>
            </li>
            <li>
              <Link href={routes.jobs} className={linkClass}>
                {t.jobs}
              </Link>
            </li>
            <li>
              <Link href={routes.privacy} className={linkClass}>
                {t.privacy}
              </Link>
            </li>
            <li>
              {/* Opens the cookie settings panel (wired up in Step 4). */}
              <a href="#cookie-settings" className={linkClass}>
                {t.cookies}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="site-container py-6 text-white/55">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
