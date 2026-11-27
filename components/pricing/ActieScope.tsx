import Link from "next/link";
import { ArrowRight, Check, CircleSlash, Clock, Wrench } from "lucide-react";
import { ACTIE, ACTIE_SCOPE, euro } from "@/lib/pricing";

// Wat wel en niet in de actie zit. "je" is de standaard; met u={true} spreekt het blok met "u".
export default function ActieScope({ u = false, intakeHref }: { u?: boolean; intakeHref?: string }) {
  const w = (je: string, uVorm: string) => (u ? uVorm : je);
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[0_40px_90px_-60px_rgba(15,40,65,0.45)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ff9a7a] opacity-[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#2f9e6e] opacity-[0.10] blur-3xl" />

      <div className="relative grid gap-0 lg:grid-cols-[1.35fr_1fr]">
        {/* Wel */}
        <div className="p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {ACTIE.label}
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]">
              {euro(ACTIE.voor)} + {euro(ACTIE.perMaand)} p/m
            </span>
          </div>
          <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
            Dit zit er allemaal in.
          </h3>
          <ul className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {ACTIE_SCOPE.wel.map((x) => (
              <li key={x.titel} className="flex gap-3">
                <span className="bg-gradient-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-[var(--ink)]">{x.titel}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--slate)]">{x.tekst}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Niet */}
        <div className="border-t border-[var(--line)] bg-[#f7fafc] p-7 md:p-10 lg:border-l lg:border-t-0">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]">Niet in de actie</p>
          <h3 className="font-display mt-3 text-xl font-semibold text-[var(--ink)]">Wel mogelijk, tegen een vaste prijs</h3>
          <ul className="mt-6 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white">
            {ACTIE_SCOPE.niet.map((x) => (
              <li key={x.titel} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="flex items-start gap-2.5 text-sm text-[var(--navy)]">
                  <CircleSlash className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slate)]/60" strokeWidth={2} />
                  {x.titel}
                </span>
                <span className="font-display shrink-0 text-sm font-semibold text-[var(--ink)]">{x.prijs}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Afspraken in drie tegels */}
      <div className="relative grid gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
        {[
          {
            icon: Clock,
            kop: `Materialen binnen ${ACTIE_SCOPE.aanleveren} dagen`,
            tekst: w(
              "Via één handig formulier. Lukt het niet, dan gaan we live met passende stockfoto's.",
              "Via één handig formulier. Lukt het niet, dan gaan we live met passende stockfoto's.",
            ),
          },
          {
            icon: Wrench,
            kop: `${ACTIE_SCOPE.wijzigingenUur} uur wijzigingen per jaar`,
            tekst: w(
              "Openingstijden, prijzen of een nieuwe foto: geef het door, wij regelen het.",
              "Openingstijden, prijzen of een nieuwe foto: geeft u het door, wij regelen het.",
            ),
          },
          {
            icon: ArrowRight,
            kop: `Daarna ${euro(ACTIE_SCOPE.uurtarief)} per uur`,
            tekst: w("Altijd vooraf een prijs, dus nooit een verrassing op de factuur.", "Altijd vooraf een prijs, dus nooit een verrassing op de factuur."),
          },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.kop} className="flex gap-3 bg-white px-7 py-6">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--sky-deep)] text-[var(--teal)]">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-[var(--ink)]">{t.kop}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--slate)]">{t.tekst}</p>
              </div>
            </div>
          );
        })}
      </div>

      {intakeHref && (
        <div className="relative flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] bg-gradient-to-r from-[#f0f7fb] to-[#f3fbf6] px-7 py-6 md:flex-row md:items-center md:px-10">
          <p className="text-sm text-[var(--navy)]">
            {w("Al akkoord? Lever je logo, foto's en gegevens in één keer aan.", "Al akkoord? Levert u uw logo, foto's en gegevens in één keer aan.")}
          </p>
          <Link
            href={intakeHref}
            className="bg-gradient-brand inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Materialen aanleveren
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
