import Link from "next/link";
import type { ReactNode } from "react";
import type { ChromeDictionary } from "@/content/i18n/en";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { ClosingWordmark } from "./closing-wordmark";
import { Logo } from "./logo";

const linkClass = "text-chalk/85 no-underline transition-colors hover:text-butter";
const headingClass = "spec-label text-butter";

function Row({ label, colon, children }: { label: string; colon: string; children: ReactNode }) {
  // Label and value on one line (the live footer splits them apart).
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="text-chalk/70">
        {label}
        {colon}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Forge Navy footer, ending in the full-width KINZOKU wordmark. */
export function Footer({ dict }: { dict: ChromeDictionary }) {
  const t = dict.footer;
  // French typography puts a no-break space before a colon.
  const colon = dict.lang.startsWith("fr") ? " :" : ":";

  return (
    <footer className="bg-forge text-sm text-chalk/85">
      <div className="site-container grid gap-10 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo label={dict.nav.home} className="text-chalk" />
          <address className="mt-5 not-italic">
            {site.name}
            <br />
            {site.address.locality}, {site.address.country}
          </address>
          {site.nameSeal && (
            <p className="mt-6 flex max-w-64 items-center gap-3 text-chalk/75">
              {/* Hanko-style seal: Kinzoku (金属) means "metal". */}
              <span
                lang="ja"
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-md border-2 border-butter font-bold text-butter [font-family:'Yu_Gothic','Hiragino_Sans','Noto_Sans_JP',sans-serif] [writing-mode:vertical-rl]"
              >
                金属
              </span>
              {t.nameMeaning}
            </p>
          )}
        </div>

        <div>
          <h2 className={headingClass}>{t.contact}</h2>
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
          <h2 className={headingClass}>{t.company}</h2>
          <dl className="mt-4 space-y-2">
            <Row colon={colon} label={t.kvk}>{site.kvk}</Row>
            <Row colon={colon} label={t.vat}>{site.vat}</Row>
          </dl>
        </div>

        <div>
          <h2 className={headingClass}>{t.links}</h2>
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
              {/* Opens the cookie settings panel (components/consent/cookie-consent.tsx). */}
              <a href="#cookie-settings" className={linkClass}>
                {t.cookies}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <ClosingWordmark />

      <div className="mt-8 border-t border-chalk/15">
        <p className="site-container py-6 text-chalk/70">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
