import Link from "next/link";
import { ArrowRight, Check, Plus, RefreshCw } from "lucide-react";
import { ACTIE, BEHEER_PLANS, MAATWERK, WEBSITE_PACKAGES, euro } from "@/lib/pricing";

const vanaf = Math.min(...BEHEER_PLANS.map((b) => b.perMonth));

export default function WebsitePackages({ showMaatwerk = true }: { showMaatwerk?: boolean }) {
  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {WEBSITE_PACKAGES.map((pkg) => {
          const actie = ACTIE.actief && ACTIE.pakket === pkg.id;
          const dark = pkg.featured;
          return (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-3xl p-8 md:p-9 ${
                dark
                  ? "bg-gradient-dusk featured-glow text-white shadow-[0_40px_80px_-30px_rgba(15,40,65,0.55)] lg:-translate-y-3"
                  : actie
                    ? "border-2 border-[#ff8a7a]/60 bg-white shadow-[0_30px_70px_-35px_rgba(255,110,90,0.55)]"
                    : "border border-[var(--line)] bg-[var(--paper)]"
              }`}
            >
              {actie && (
                <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#ff7a66]/30">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {ACTIE.label}
                </span>
              )}
              <span
                className={`font-mono-label self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                  dark ? "bg-white/10 text-[#8fd6c2]" : "bg-[var(--sky)] text-[var(--teal)]"
                } ${actie ? "mt-2" : ""}`}
              >
                {pkg.tag}
              </span>
              <h3 className={`font-display mt-5 text-2xl font-semibold ${dark ? "text-white" : "text-[var(--ink)]"}`}>
                Website {pkg.name}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-[#c3d6e5]" : "text-[var(--slate)]"}`}>{pkg.forWho}</p>

              {/* Prijs: bouwen en beheer als één geheel */}
              <div className={`mt-6 rounded-2xl ${dark ? "bg-white/[0.06] ring-1 ring-white/10" : actie ? "bg-[#fff6f3] ring-1 ring-[#ffd9cf]" : "bg-white ring-1 ring-[var(--line)]"} p-5`}>
                <p className={`font-mono-label text-[10px] uppercase tracking-[0.18em] ${dark ? "text-[#a9bcc7]" : "text-[var(--slate)]"}`}>
                  Bouwen
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {actie && (
                    <span className="font-display relative text-2xl font-semibold text-[var(--slate)]/70">
                      {euro(ACTIE.van)}
                      <span className="absolute left-[-6%] top-1/2 h-[2.5px] w-[112%] -rotate-6 rounded bg-[#ff7a66]" />
                    </span>
                  )}
                  <span className={`font-display text-5xl font-semibold tracking-tight ${dark ? "text-white" : actie ? "text-[#e85c44]" : "text-[var(--ink)]"}`}>
                    {euro(actie ? ACTIE.voor : pkg.price)}
                  </span>
                  <span className={`text-sm ${dark ? "text-[#a9bcc7]" : "text-[var(--slate)]"}`}>eenmalig</span>
                </div>

                <div className={`my-4 flex items-center gap-3 ${dark ? "text-white/40" : "text-[var(--slate)]/50"}`}>
                  <span className="h-px flex-1 bg-current opacity-40" />
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  <span className="h-px flex-1 bg-current opacity-40" />
                </div>

                <p className={`font-mono-label text-[10px] uppercase tracking-[0.18em] ${dark ? "text-[#a9bcc7]" : "text-[var(--slate)]"}`}>
                  Beheer
                </p>
                {actie ? (
                  <>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-semibold text-[var(--ink)]">{euro(ACTIE.perMaand)}</span>
                      <span className="text-sm text-[var(--slate)]">per maand, Beheer Zorgeloos</span>
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[var(--navy)]">
                      <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e85c44]" strokeWidth={2.25} />
                      Maandelijks via automatische incasso. Het eerste jaar hoort Zorgeloos verplicht bij de actie.
                    </p>
                  </>
                ) : (
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className={`text-sm ${dark ? "text-[#c3d6e5]" : "text-[var(--slate)]"}`}>vanaf</span>
                    <span className={`font-display text-2xl font-semibold ${dark ? "text-white" : "text-[var(--ink)]"}`}>{euro(vanaf)}</span>
                    <span className={`text-sm ${dark ? "text-[#c3d6e5]" : "text-[var(--slate)]"}`}>per maand</span>
                  </p>
                )}
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {pkg.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-[#8fd6c2]" : "text-[var(--teal)]"}`} strokeWidth={2.5} />
                    <span className={dark ? "text-white/90" : "text-[var(--navy)]"}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?onderwerp=website"
                className={`mt-9 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  dark ? "bg-white text-[var(--ink)]" : actie ? "bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] text-white shadow-lg shadow-[#ff7a66]/25" : "bg-gradient-brand text-white"
                }`}
              >
                {actie ? "Pak de actie" : "Gratis ontwerpvoorstel"}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          );
        })}
      </div>

      {showMaatwerk && <MaatwerkCard />}

      <p className="mt-6 text-center text-xs text-[var(--slate)]">
        Alle prijzen zijn exclusief 21% btw. Bij elke website hoort beheer, zodat je site snel, veilig en actueel blijft.
      </p>
    </div>
  );
}

export function MaatwerkCard() {
  return (
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
  );
}
