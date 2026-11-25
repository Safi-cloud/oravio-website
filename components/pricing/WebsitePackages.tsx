import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MAATWERK, WEBSITE_PACKAGES, euro } from "@/lib/pricing";

export default function WebsitePackages({ showMaatwerk = true }: { showMaatwerk?: boolean }) {
  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {WEBSITE_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-3xl p-8 md:p-9 ${
              pkg.featured
                ? "bg-gradient-dusk featured-glow text-white shadow-[0_40px_80px_-30px_rgba(15,40,65,0.55)] lg:-translate-y-3"
                : "border border-[var(--line)] bg-[var(--paper)]"
            }`}
          >
            <span
              className={`font-mono-label self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                pkg.featured ? "bg-white/10 text-[#8fd6c2]" : "bg-[var(--sky)] text-[var(--teal)]"
              }`}
            >
              {pkg.tag}
            </span>
            <h3 className={`font-display mt-5 text-2xl font-semibold ${pkg.featured ? "text-white" : "text-[var(--ink)]"}`}>
              Website {pkg.name}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${pkg.featured ? "text-[#c3d6e5]" : "text-[var(--slate)]"}`}>
              {pkg.forWho}
            </p>

            <p className="mt-6 flex items-baseline gap-2">
              <span className={`font-display text-5xl font-semibold tracking-tight ${pkg.featured ? "text-white" : "text-[var(--ink)]"}`}>
                {euro(pkg.price)}
              </span>
              <span className={`text-sm ${pkg.featured ? "text-[#a9bcc7]" : "text-[var(--slate)]"}`}>eenmalig</span>
            </p>
            <ul className="mt-7 flex-1 space-y-3">
              {pkg.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.featured ? "text-[#8fd6c2]" : "text-[var(--teal)]"}`} strokeWidth={2.5} />
                  <span className={pkg.featured ? "text-white/90" : "text-[var(--navy)]"}>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact?onderwerp=website"
              className={`mt-9 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                pkg.featured ? "bg-white text-[var(--ink)]" : "bg-gradient-brand text-white"
              }`}
            >
              Gratis ontwerpvoorstel
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        ))}
      </div>

      {showMaatwerk && (
        <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 md:flex-row md:items-center md:p-9">
          <div className="max-w-2xl">
            <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--teal)]">{MAATWERK.name}</p>
            <p className="font-display mt-2 text-xl font-semibold text-[var(--ink)]">
              Meer nodig dan een website? Vanaf {euro(MAATWERK.from)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{MAATWERK.body}</p>
          </div>
          <Link
            href="/contact?onderwerp=website"
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--teal)]"
          >
            Vraag een offerte aan
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[var(--slate)]">
        Alle prijzen zijn exclusief 21% btw. Bij elke website hoort jaarlijks beheer, vanaf €240 per jaar.
      </p>
    </div>
  );
}
