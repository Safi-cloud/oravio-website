import Link from "next/link";
import OravioMark from "./OravioMark";
import { COMPANY } from "@/lib/company";

const FOOTER_LINKS = {
  Platform: [
    { href: "/platform", label: "Functies" },
    { href: "/branches", label: "Branches" },
    { href: "/faq", label: "Veelgestelde vragen" },
    { href: "/contact", label: "Demo aanvragen" },
  ],
  Diensten: [
    { href: "/websites", label: "Websites op maat" },
    { href: "/websites#werkwijze", label: "Werkwijze" },
    { href: "/prijzen", label: "Prijzen" },
    { href: "/contact?onderwerp=website", label: "Gratis ontwerpvoorstel" },
  ],
  Bedrijf: [
    { href: "/over-ons", label: "Over ons" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-dusk border-t border-[var(--line)] text-[#c4d2db]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <OravioMark className="h-7 w-7" />
              <span className="font-display text-lg font-semibold tracking-tight text-white">ORAVIO</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#a9bcc7]">
              Alles-in-één cloudplatform voor verkoop, verhuur en reserveringen, onder jouw eigen merk,
              zonder zelf software te bouwen.
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed text-[#a9bcc7]">
              {COMPANY.street}
              <br />
              {COMPANY.zip} {COMPANY.city}
              <br />
              <a href={`mailto:${COMPANY.email}`} className="text-[#c4d2db] transition-colors hover:text-white">
                {COMPANY.email}
              </a>
            </address>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-mono-label text-xs uppercase tracking-[0.15em] text-[#a9bcc7]">{heading}</p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#c4d2db] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-[#a9bcc7] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
            <span>© {new Date().getFullYear()} {COMPANY.name}. Alle rechten voorbehouden.</span>
            {COMPANY.kvk && (
              <span className="flex items-center gap-2">
                <span className="hidden h-3 w-px bg-white/20 md:block" />
                <span className="font-mono-label tracking-[0.12em] text-[#8fa6b3]">KVK</span>
                <span className="text-[#c4d2db]">{COMPANY.kvk}</span>
              </span>
            )}
            {COMPANY.btw && (
              <span className="flex items-center gap-2">
                <span className="hidden h-3 w-px bg-white/20 md:block" />
                <span className="font-mono-label tracking-[0.12em] text-[#8fa6b3]">BTW</span>
                <span className="text-[#c4d2db]">{COMPANY.btw}</span>
              </span>
            )}
          </div>
          <span className="font-mono-label">CLOUD PLATFORM VOOR MODERNE ONDERNEMINGEN</span>
        </div>
      </div>
    </footer>
  );
}
