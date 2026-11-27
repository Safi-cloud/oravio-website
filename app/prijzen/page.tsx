import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Video, BadgeEuro, MapPin, Gauge, Check, Plus } from "lucide-react";
import CloudField from "@/components/CloudField";
import ScrollReveal from "@/components/ScrollReveal";
import WebsitePackages, { MaatwerkCard } from "@/components/pricing/WebsitePackages";
import ActieScope from "@/components/pricing/ActieScope";
import BeheerPlans from "@/components/pricing/BeheerPlans";
import PriceCalculator from "@/components/pricing/PriceCalculator";
import { ACTIE, BEHEER_PLANS, EXTRAS, TERMS, STANDARD, VERGELIJKING, euro } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Prijzen websites en beheer | Oravio",
  description:
    "Tijdelijke actie: Website Start voor €199 in plaats van €399, met Beheer Zorgeloos €35 per maand. Zakelijk €995, Plus €1.695. Altijd eerst een gratis ontwerpvoorstel.",
  openGraph: {
    title: "Prijzen websites en beheer | Oravio",
    description: "Tijdelijk: website op maat voor €199 met Beheer Zorgeloos €35 per maand. Eerst gratis zien, dan beslissen.",
    url: "https://oravio.nl/prijzen",
  },
};

const PROMISES = [
  { icon: Video, title: "Eerst zien", body: "Gratis ontwerpvoorstel met demovideo van jouw nieuwe site." },
  { icon: BadgeEuro, title: "Vaste prijs", body: "Geen uurtje-factuurtje, je weet vooraf wat het kost." },
  { icon: Gauge, title: "Snel en modern", body: "Geen verouderde plugins, wel topscores in snelheid." },
  { icon: MapPin, title: "Dichtbij", body: "Eén vast aanspreekpunt, langskomen kan altijd." },
];

const FAQS = [
  {
    q: "Hoe werkt de actie van €199?",
    a: "Je krijgt Website Start voor €199 in plaats van €399. Daarbij hoort Beheer Zorgeloos voor €35 per maand, het eerste jaar verplicht. Dat bedrag schrijven we maandelijks af via automatische incasso. Je betaalt het eerste jaar dus €199 eenmalig plus 12 keer €35. Daarna is het beheer maandelijks opzegbaar.",
  },
  {
    q: "Waarom hoort er altijd beheer bij?",
    a: "Je website draait op onze snelle hosting. Daarmee zijn veiligheid, updates en back-ups altijd geregeld en hoef je zelf nergens naar om te kijken.",
  },
  {
    q: "Zijn er nog verborgen kosten?",
    a: "Nee. Je betaalt het pakket en het beheer. Alleen als je zelf iets extra's wilt, zoals een extra pagina of taal, krijg je daar vooraf een vaste prijs voor.",
  },
  {
    q: "Wat als ik later wil uitbreiden?",
    a: "Dat kan altijd. Je stapt over naar een groter pakket en betaalt alleen het verschil, of je laat losse onderdelen toevoegen.",
  },
  {
    q: "Kan ik mijn bestaande teksten en foto's gebruiken?",
    a: "Ja. We nemen wat goed is over en verbeteren waar nodig. Heb je nog niets, dan schrijven we de teksten voor je.",
  },
];

export default function PrijzenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-sky relative overflow-hidden px-6 pb-16 pt-16 md:px-10 md:pb-20 md:pt-24">
        <CloudField variant="light" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Prijzen</p>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
            Heldere prijzen, <span className="text-gradient">geen verrassingen</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            Een professionele website op maat, met één vast bedrag per maand voor beheer. Je ziet altijd eerst gratis hoe
            jouw nieuwe site eruitziet.
          </p>
        </div>

        {ACTIE.actief && (
          <a
            href="#websites"
            className="group relative mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 overflow-hidden rounded-3xl border-2 border-[#ffcfc4] bg-white/90 p-6 text-left shadow-[0_30px_70px_-40px_rgba(232,92,68,0.6)] backdrop-blur-sm transition-transform hover:-translate-y-0.5 md:flex-row md:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#ff9a7a] opacity-20 blur-3xl" />
            <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white md:self-center">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {ACTIE.label}
            </span>
            <div className="relative flex-1">
              <p className="font-display text-lg font-semibold text-[var(--ink)] md:text-xl">
                Website Start voor{" "}
                <span className="relative mx-1 text-[var(--slate)]/70">
                  {euro(ACTIE.van)}
                  <span className="absolute left-[-6%] top-1/2 h-[2px] w-[112%] -rotate-6 rounded bg-[#ff7a66]" />
                </span>{" "}
                <span className="text-[#e85c44]">{euro(ACTIE.voor)}</span>
              </p>
              <p className="mt-1 text-sm text-[var(--slate)]">
                Plus Beheer Zorgeloos voor {euro(ACTIE.perMaand)} per maand via automatische incasso, het eerste jaar verplicht.
              </p>
            </div>
            <span className="relative flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#e85c44]">
              Bekijk de actie
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </a>
        )}
        <div className="relative mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {PROMISES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border border-[var(--line)] bg-white/80 p-5 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-[var(--teal)]" strokeWidth={1.75} />
                <p className="font-display mt-3 text-sm font-semibold text-[var(--ink)]">{p.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--slate)]">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Websites en beheer, als één geheel */}
      <section id="websites" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Je website, compleet</p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
                Eenmalig bouwen, daarna een vast bedrag per maand.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--slate)]">
                Bij elk pakket zie je direct beide: wat het bouwen kost en wat het beheer per maand kost. Geen verrassingen achteraf.
              </p>
            </div>
          </ScrollReveal>
          <div className="mt-16">
            <WebsitePackages showMaatwerk={false} />
          </div>

          {ACTIE.actief && (
            <div id="actie" className="mx-auto mt-14 max-w-6xl scroll-mt-28">
              <ActieScope intakeHref="/intake" />
            </div>
          )}

          <div id="beheer" className="relative mt-16 scroll-mt-28">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-[var(--line)] md:w-32" />
              <span className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="h-px w-16 bg-[var(--line)] md:w-32" />
            </div>
            <div className="mx-auto mt-8 max-w-2xl text-center">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                Kies je beheer, vanaf {euro(Math.min(...BEHEER_PLANS.map((b) => b.perMonth)))} per maand.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--slate)]">
                Hosting, veiligheid en updates zijn altijd geregeld. Kies hoeveel hulp je daarnaast wilt.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-6xl rounded-[2rem] bg-[#eef5fa] p-5 md:p-8">
              <BeheerPlans />
            </div>
            <p className="mt-5 text-center text-xs text-[var(--slate)]">
              Bij de actie wordt Zorgeloos maandelijks via incasso afgeschreven. Overig beheer wordt per jaar vooraf gefactureerd.
              Alle prijzen exclusief 21% btw.
            </p>
            <div className="mx-auto mt-12 max-w-6xl">
              <MaatwerkCard />
            </div>
          </div>
        </div>
      </section>

      {/* Standaard in elke website */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">In elke website</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Ook het kleinste pakket is gebouwd als een topsite.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--slate)]">
              Geen sjabloon met een stapel plugins, maar moderne techniek die snel, veilig en onderhoudsarm is.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARD.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[var(--line)] bg-white p-6">
                <span className="bg-gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-white">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <p className="font-display mt-4 font-semibold text-[var(--ink)]">{f.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--slate)]">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <h3 className="font-display text-center text-2xl font-semibold text-[var(--ink)]">
              Oravio naast een gangbare WordPress-site
            </h3>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--line)] bg-white">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="font-mono-label px-6 py-4 text-[11px] font-normal uppercase tracking-[0.15em] text-[var(--slate)]"> </th>
                    <th className="font-display px-6 py-4 font-semibold text-[var(--teal)]">Oravio (Next.js)</th>
                    <th className="font-display px-6 py-4 font-semibold text-[var(--slate)]">WordPress</th>
                  </tr>
                </thead>
                <tbody>
                  {VERGELIJKING.map((r) => (
                    <tr key={r.label} className="border-b border-[var(--line)] last:border-0">
                      <td className="px-6 py-4 font-medium text-[var(--ink)]">{r.label}</td>
                      <td className="px-6 py-4 text-[var(--navy)]">{r.oravio}</td>
                      <td className="px-6 py-4 text-[var(--slate)]">{r.wordpress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="samenstellen" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Samenstellen</p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
                Reken het zelf uit.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--slate)]">
                Kies je website, je beheer en eventuele extra&apos;s. Je ziet direct wat het eerste jaar kost.
              </p>
            </div>
          </ScrollReveal>
          <div className="mt-12">
            <PriceCalculator />
          </div>
        </div>
      </section>

      {/* Extra's en voorwaarden */}
      <section id="afspraken" className="scroll-mt-24 border-t border-[var(--line)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Extra&apos;s</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Losse onderdelen
            </h2>
            <dl className="mt-8 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--paper)]">
              {EXTRAS.map((e) => (
                <div key={e.label} className="flex items-center justify-between gap-6 px-6 py-4">
                  <dt className="text-sm text-[var(--navy)]">{e.label}</dt>
                  <dd className="font-display shrink-0 text-sm font-semibold text-[var(--ink)]">{e.price}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Afspraken</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Zo werken we samen
            </h2>
            <ol className="mt-8 space-y-4">
              {TERMS.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="bg-gradient-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-[var(--slate)]">{t}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Vragen over prijzen</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Goed om te weten
            </h2>
          </div>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-[var(--ink)]">
                  {faq.q}
                  <span className="font-mono-label text-[var(--teal)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--slate)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="bg-gradient-brand mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl px-8 py-14 text-white md:flex-row md:items-center md:px-14">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Twijfel je welk pakket past?
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/85 md:text-base">
              Vraag een gratis ontwerpvoorstel aan. We adviseren welk pakket bij je past, en je beslist pas als je
              het resultaat hebt gezien.
            </p>
          </div>
          <Link
            href="/contact?onderwerp=website"
            className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-lg transition-transform hover:scale-[1.02]"
          >
            Vraag een ontwerpvoorstel aan
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </>
  );
}
