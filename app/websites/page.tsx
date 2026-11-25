import type { Metadata } from "next";
import Link from "next/link";
import {
  PenTool,
  Gauge,
  Search,
  MousePointerClick,
  ShieldCheck,
  HardDrive,
  Activity,
  RefreshCw,
  Lock,
  Smartphone,
  Video,
  Network,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import CloudField from "@/components/CloudField";
import ScrollReveal from "@/components/ScrollReveal";
import BuildConsole from "@/components/websites/BuildConsole";
import WebsitePackages from "@/components/pricing/WebsitePackages";

export const metadata: Metadata = {
  title: "Websites op maat — Oravio",
  description:
    "Een professionele website op maat, gebouwd op hetzelfde fundament als het Oravio-platform. Eerst een gratis ontwerpvoorstel, daarna een vaste prijs en jaarlijks zorgeloos beheer.",
  openGraph: {
    title: "Websites op maat — Oravio",
    description:
      "Professionele websites op maat met jaarlijks beheer. Eerst een gratis ontwerpvoorstel, dan pas beslissen.",
    url: "https://oravio.nl/websites",
  },
};

const STACK = [
  "Next.js",
  "Edge-netwerk",
  "Automatische SSL",
  "Core Web Vitals",
  "Gestructureerde data",
  "AVG-proof formulieren",
  "Dagelijkse back-ups",
];

const DELIVERABLES = [
  {
    icon: PenTool,
    title: "Ontwerp op maat",
    body: "Geen sjabloon met jouw logo erop, maar een ontwerp dat past bij je vak, je klanten en je regio. Rustig, herkenbaar en gemaakt om vertrouwen te wekken.",
  },
  {
    icon: Gauge,
    title: "Razendsnel, ook op mobiel",
    body: "Gebouwd op dezelfde technologie als het Oravio-platform. Pagina's laden direct, ook op een trage verbinding, en Google beloont dat met een betere positie.",
  },
  {
    icon: Search,
    title: "Gevonden worden in je regio",
    body: "Technische SEO, gestructureerde bedrijfsgegevens en paginatitels die aansluiten op hoe klanten zoeken. Je bestaande posities in Google nemen we zorgvuldig mee.",
  },
  {
    icon: MousePointerClick,
    title: "Bezoekers worden aanvragen",
    body: "Een offerte aanvragen, een afspraak inplannen of direct bellen: elke pagina leidt naar één duidelijke volgende stap, in plaats van naar een lege contactpagina.",
  },
];

const SCAN = [
  { icon: Gauge, label: "Laadsnelheid en Core Web Vitals" },
  { icon: Smartphone, label: "Weergave op telefoon en tablet" },
  { icon: Lock, label: "Beveiliging, SSL en verouderde software" },
  { icon: Search, label: "Vindbaarheid en technische SEO" },
  { icon: FileCheck, label: "Privacyverklaring en AVG-punten" },
  { icon: MousePointerClick, label: "Hoe makkelijk een bezoeker contact opneemt" },
];

const STEPS = [
  {
    number: "01",
    title: "Analyse van je huidige site",
    body: "We lichten je huidige website door op snelheid, mobiel gebruik, beveiliging en vindbaarheid. Je krijgt een helder overzicht van wat er beter kan.",
  },
  {
    number: "02",
    title: "Gratis ontwerpvoorstel",
    body: "Je ontvangt een uitgewerkt ontwerp en een korte demovideo van je nieuwe site, met je eigen teksten en diensten. Je ziet het resultaat voordat je iets beslist.",
  },
  {
    number: "03",
    title: "Bouw en livegang",
    body: "Na akkoord bouwen we de site af tegen een vaste prijs. We verhuizen je domein zonder onderbreking en sturen oude pagina's netjes door, zodat je niets verliest.",
  },
  {
    number: "04",
    title: "Zorgeloos beheer",
    body: "Hosting, beveiliging, updates en kleine wijzigingen regelen wij. Jij hoeft er niet meer naar om te kijken, en je site blijft jaren actueel.",
  },
];

const BEHEER = [
  { icon: Network, title: "Hosting op een wereldwijd edge-netwerk", body: "Je site staat op servers dicht bij je bezoekers, met automatische schaal bij drukte." },
  { icon: ShieldCheck, title: "SSL en beveiligingsupdates", body: "Certificaten worden automatisch verlengd en de onderliggende software houden we actueel." },
  { icon: HardDrive, title: "Back-ups", body: "Je site en je inhoud zijn veilig opgeslagen en snel terug te zetten." },
  { icon: Activity, title: "Monitoring", body: "Gaat er iets mis, dan zien wij het vaak eerder dan je bezoekers." },
  { icon: RefreshCw, title: "Kleine wijzigingen inbegrepen", body: "Nieuwe openingstijden, een extra project of andere prijzen: gewoon even doorgeven." },
  { icon: PenTool, title: "Jaarlijkse check-up", body: "Eén keer per jaar kijken we samen wat er beter kan, en wat de site heeft opgeleverd." },
];

const FAQS = [
  {
    q: "Wat kost een website?",
    a: "Een website kost eenmalig €399 (Start), €995 (Zakelijk) of €1.695 (Plus), exclusief btw. Beheer kost vanaf €240 per jaar. Je krijgt altijd eerst een gratis ontwerpvoorstel. Alle prijzen staan op de pagina Prijzen.",
  },
  {
    q: "Blijven mijn domein en mijn gegevens van mij?",
    a: "Ja. Je domeinnaam, teksten, foto's en de aanvragen die via je site binnenkomen blijven altijd van jou. Wil je ooit overstappen, dan helpen we je daarbij.",
  },
  {
    q: "Verlies ik mijn plek in Google als ik overstap?",
    a: "Niet als het goed gebeurt. We sturen elke oude pagina door naar de juiste nieuwe pagina en nemen je bestaande vindbaarheid mee. Vaak verbetert je positie juist door de hogere snelheid.",
  },
  {
    q: "Hoe lang duurt het voordat mijn site live staat?",
    a: "Dat hangt af van de omvang en hoe snel teksten en foto's beschikbaar zijn. Een overzichtelijke bedrijfssite staat vaak binnen enkele weken live.",
  },
  {
    q: "Kan ik later nog dingen laten toevoegen?",
    a: "Ja. Een extra pagina, een nieuwe dienst of een meertalige versie: je site groeit gewoon mee. Kleine wijzigingen vallen onder het beheer, voor grotere uitbreidingen krijg je vooraf een vaste prijs.",
  },
];

export default function WebsitesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-sky relative overflow-hidden px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <CloudField variant="light" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
              Oravio Studio · Websites op maat
            </p>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
              Een website die <span className="text-gradient">klanten oplevert</span>, niet alleen bezoekers
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--slate)] md:text-lg">
              Wij ontwerpen en bouwen professionele websites met dezelfde moderne techniek als het Oravio-platform.
              Snel, veilig en vindbaar, en daarna zorgeloos beheerd. Je ziet eerst gratis hoe jouw nieuwe
              site eruitziet, en beslist dan pas.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?onderwerp=website"
                className="bg-gradient-brand rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#1d6e7d]/20 transition-transform hover:scale-[1.02]"
              >
                Vraag een gratis ontwerpvoorstel aan
              </Link>
              <Link
                href="#werkwijze"
                className="rounded-full border border-[var(--line)] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition-colors hover:border-[var(--teal)]"
              >
                Zo werken we
              </Link>
            </div>
          </div>
          <BuildConsole />
        </div>
      </section>

      {/* Techniek-strook */}
      <section className="border-y border-[var(--line)] bg-[var(--paper)] px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[var(--slate-light)]">Gebouwd met</span>
          {STACK.map((item) => (
            <span key={item} className="font-mono-label flex items-center gap-2 text-xs text-[var(--navy)]">
              <span className="bg-gradient-brand h-1.5 w-1.5 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Wat je krijgt */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Wat je krijgt</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Een visitekaartje dat ook verkoopt.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--slate)]">
              Voor veel ondernemers is de website het eerste contact met een nieuwe klant. Wij zorgen dat
              die eerste indruk klopt, en dat er daarna ook iets gebeurt.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-7 transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(28,74,120,0.25)]">
                    <div className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-xl">
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display mt-5 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{item.body}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eerst zien, dan beslissen */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Eerst zien, dan beslissen</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Je nieuwe website, voordat je er iets voor betaalt.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--slate)]">
              We beginnen met een analyse van je huidige site. Daarna maken we een uitgewerkt ontwerpvoorstel
              met jouw eigen diensten en teksten, en een korte demovideo waarin je ziet hoe bezoekers door
              je nieuwe site klikken. Pas als je enthousiast bent, gaan we bouwen.
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--sky)] p-5">
              <div className="bg-gradient-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Video className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <p className="text-sm leading-relaxed text-[var(--slate)]">
                <span className="font-semibold text-[var(--ink)]">Inclusief demovideo.</span> Ideaal om te
                laten zien aan je compagnon, je team of je familie voordat je een keuze maakt.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--sky)] p-8 md:p-10">
            <div className="flex items-center justify-between">
              <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--slate-light)]">Website-analyse</p>
              <span className="font-mono-label rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--teal)]">
                Gratis
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {SCAN.map((row, i) => {
                const Icon = row.icon;
                return (
                  <ScrollReveal key={row.label} delay={i * 70}>
                    <li className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white px-4 py-3.5">
                      <Icon className="h-4 w-4 shrink-0 text-[var(--teal)]" strokeWidth={1.9} />
                      <span className="text-sm font-medium text-[var(--navy)]">{row.label}</span>
                      <span className="font-mono-label ml-auto text-[10px] uppercase tracking-wider text-[var(--emerald)]">
                        In de analyse
                      </span>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section id="werkwijze" className="scroll-mt-24 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Werkwijze</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Van analyse tot zorgeloos beheer
            </h2>
          </div>
          <div className="relative mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-4">
            <div className="bg-gradient-brand absolute left-0 right-0 top-[11px] hidden h-px opacity-30 md:block" />
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 90}>
                <div className="relative">
                  <span className="bg-gradient-brand relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="font-mono-label mt-5 block text-sm text-[var(--slate-light)]">{step.number}</span>
                  <h3 className="font-display mt-2 text-lg font-semibold text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beheer */}
      <section className="bg-gradient-dusk relative overflow-hidden border-t border-[var(--line)] px-6 py-20 text-white md:px-10 md:py-28">
        <CloudField variant="dark" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#8fd6c2]">Beheer op jaarbasis</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Jij onderneemt. Wij houden je site in topconditie.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c3d6e5]">
              Een website is nooit af. Met beheer op jaarbasis blijft je site snel, veilig en actueel, zonder
              dat jij je met techniek hoeft bezig te houden.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEHEER.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
                >
                  <Icon className="h-5 w-5 text-[#8fd6c2]" strokeWidth={1.75} />
                  <h3 className="font-display mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#c3d6e5]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pakketten */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Pakketten</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Kies wat bij je onderneming past.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--slate)]">
              Altijd eerst een gratis ontwerpvoorstel, daarna een vaste prijs. Beheer vanaf €20 per maand.
            </p>
          </div>
          <div className="mt-14">
            <WebsitePackages showMaatwerk={false} />
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/prijzen"
              className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--teal)]"
            >
              Bekijk alle prijzen, beheer en extra&apos;s
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Veelgestelde vragen */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Veelgestelde vragen</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Goed om te weten
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[var(--slate)]">
              Staat je vraag er niet tussen? Neem gerust contact op, we denken graag mee.
            </p>
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

      {/* Afsluiter */}
      <section className="border-t border-[var(--line)] px-6 py-20 md:px-10 md:py-28">
        <div className="bg-gradient-brand mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl px-8 py-14 text-white md:flex-row md:items-center md:px-14">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Benieuwd hoe jouw nieuwe
              <br />
              website eruitziet?
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/85 md:text-base">
              Vraag een gratis analyse en ontwerpvoorstel aan. Vrijblijvend, en je ziet het resultaat voordat
              je iets beslist.
            </p>
          </div>
          <Link
            href="/contact?onderwerp=website"
            className="flex-shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-lg transition-transform hover:scale-[1.02]"
          >
            Vraag een ontwerpvoorstel aan
          </Link>
        </div>
      </section>
    </>
  );
}
