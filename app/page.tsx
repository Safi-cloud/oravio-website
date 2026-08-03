import Link from "next/link";
import {
  ShoppingBag,
  CalendarClock,
  CalendarCheck,
  Users,
  CreditCard,
  Package,
  Megaphone,
  BarChart3,
  Sparkles,
  Layers,
  Palette,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import CloudPlatform from "@/components/CloudPlatform";
import CloudField from "@/components/CloudField";
import ScrollReveal from "@/components/ScrollReveal";

const PILLARS = [
  {
    title: "Jouw eigen afgeschermde omgeving",
    body: "Iedere onderneming beschikt over een volledig eigen omgeving, met eigen gegevens, gebruikers, instellingen en branding — nooit gedeeld met een andere klant op het platform.",
  },
  {
    title: "Alles onder één dak",
    body: "Webshop, verhuur, reserveringen, betalingen en teambeheer zijn geen losse systemen die je zelf aan elkaar moet knopen. Je zet aan wat je nodig hebt — de rest staat klaar voor later.",
  },
  {
    title: "Meegroeien zonder om te bouwen",
    body: "Van de eerste tien producten tot een landelijk opererende keten: hetzelfde platform groeit mee, zonder dat je ooit naar een ander systeem hoeft over te stappen.",
  },
];

const MODULES = [
  { icon: ShoppingBag, label: "Webshop" },
  { icon: CalendarClock, label: "Verhuur" },
  { icon: CalendarCheck, label: "Boekingen" },
  { icon: Users, label: "Klantbeheer" },
  { icon: CreditCard, label: "Betalingen" },
  { icon: Package, label: "Voorraad" },
  { icon: Megaphone, label: "Marketing" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Sparkles, label: "AI (binnenkort)" },
];

const WHY_ORAVIO = [
  { icon: Layers, title: "Geen losse systemen", body: "Verkoop, verhuur, betalingen en klantbeheer werken al standaard samen — niks los te koppelen." },
  { icon: RefreshCw, title: "Verkoop én verhuur in één platform", body: "De enige oplossing die beide bedrijfsmodellen écht native ondersteunt, in plaats van er losse plug-ins voor te plakken." },
  { icon: TrendingUp, title: "Altijd inzicht in je onderneming", body: "Je ziet niet alleen wát er gebeurt, maar ook wat dat betekent — zonder zelf rapportages te moeten bouwen." },
  { icon: Palette, title: "Volledig onder jouw eigen merk", body: "Eigen domein, eigen ontwerp, eigen uitstraling. Bezoekers zien nergens dat het platform gedeeld wordt." },
  { icon: Layers, title: "Schaalbaar zonder opnieuw te bouwen", body: "Wat vandaag werkt voor tien producten, werkt over drie jaar nog steeds voor tienduizend." },
  { icon: Sparkles, title: "Doorlopend doorontwikkeld", body: "Nieuwe functionaliteit komt automatisch beschikbaar — geen nieuw project, geen nieuwe factuur." },
];

const STEPS = [
  { number: "01", title: "Kennismaking", body: "We brengen samen in kaart waar je nu tegenaan loopt, en wat er nodig is om dat op te lossen." },
  { number: "02", title: "Inrichting", body: "Je omgeving wordt opgezet: ontwerp, domein, producten en teamtoegang — klaar om mee te werken." },
  { number: "03", title: "Livegang", body: "Je gaat live onder je eigen domein, met volledige ondersteuning tijdens de eerste periode." },
  { number: "04", title: "Doorlopende optimalisatie", body: "Nieuwe functionaliteit wordt automatisch beschikbaar. Je platform blijft meegroeien, zonder opnieuw te hoeven investeren." },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-sky relative overflow-hidden px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <CloudField variant="light" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
              Voor verhuur-, verkoop- en reserveringsbedrijven
            </p>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
              De complete software voor <span className="text-gradient">moderne ondernemingen</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--slate)] md:text-lg">
              Verkoop, verhuur, reserveringen, betalingen en klantbeheer in één schaalbaar cloudplatform.
              Onder jouw eigen merk en domein — zonder dat je hier zelf software voor hoeft te bouwen.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="bg-gradient-brand rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#1d6e7d]/20 transition-transform hover:scale-[1.02]"
              >
                Plan een gesprek
              </Link>
              <Link
                href="/platform"
                className="rounded-full border border-[var(--line)] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition-colors hover:border-[var(--teal)]"
              >
                Bekijk het platform
              </Link>
            </div>
          </div>

          <CloudPlatform />
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Wat je ermee bereikt</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Meer dan een webshop. Een compleet bedrijfsplatform.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--slate)]">
              Oravio helpt ondernemingen hun volledige bedrijfsvoering te digitaliseren — van webshop en
              reserveringen tot voorraad, betalingen, klanten en rapportages. Alles draait in één veilige
              cloudomgeving, onder jouw eigen merk.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <div className="bg-gradient-brand h-1 w-10 rounded-full" />
                <h3 className="font-display mt-5 text-xl font-semibold text-[var(--ink)]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-label text-center text-xs uppercase tracking-[0.2em] text-[var(--slate-light)]">
            Alles in één platform — zet aan wat je nodig hebt
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <ScrollReveal key={mod.label} delay={i * 60}>
                  <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-6 text-center">
                    <Icon className="h-5 w-5 text-[var(--teal)]" strokeWidth={1.75} />
                    <span className="text-sm font-medium text-[var(--navy)]">{mod.label}</span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Waarom Oravio</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Geen webshopje. Een besturingssysteem voor je onderneming.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ORAVIO.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 70}>
                  <div className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{item.body}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-dusk relative overflow-hidden border-t border-[var(--line)] px-6 py-20 text-white md:px-10 md:py-28">
        <CloudField variant="dark" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#8fd6c2]">Platform</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Alles wat je nodig hebt om te groeien
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.1]">
              <h3 className="font-display text-lg font-semibold">Verkoop én verhuur in één systeem</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                Een volwaardige webshop, of een beschikbaarheidskalender met reserveringsbeheer — of allebei
                tegelijk, binnen dezelfde omgeving.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.1]">
              <h3 className="font-display text-lg font-semibold">Eigen domein, eigen merk</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                Je draait onder je eigen domeinnaam, met je eigen uitstraling — bezoekers zien nooit dat het
                platform gedeeld wordt.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.1]">
              <h3 className="font-display text-lg font-semibold">Teams met de juiste rechten</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                Eigenaar, manager of medewerker: iedereen ziet en beheert precies wat bij zijn taak hoort —
                financiële gegevens blijven waar ze horen.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.1]">
              <h3 className="font-display text-lg font-semibold">Rechtstreekse betalingen</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                Je koppelt je eigen betaalaccount. De opbrengst gaat altijd rechtstreeks naar jouw eigen
                rekening — nooit via een tussenpartij.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-colors hover:bg-white/[0.1] sm:col-span-2 lg:col-span-1">
              <h3 className="font-display text-lg font-semibold">Inzicht in plaats van alleen cijfers</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                Ontdek welke producten het beste verkopen, waar bezoekers afhaken en welke trends zich
                ontwikkelen. Geen losse cijfertabellen, maar inzichten waarmee je betere beslissingen neemt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Traject</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Van kennismaking tot doorlopende groei
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-mono-label text-sm text-[var(--slate-light)]">{step.number}</span>
                <h3 className="font-display mt-3 text-lg font-semibold text-[var(--ink)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-6 py-20 md:px-10 md:py-28">
        <div className="bg-gradient-brand mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl px-8 py-14 text-white md:flex-row md:items-center md:px-14">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Minder handmatig werk.<br />Meer overzicht en omzet.
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/85 md:text-base">
              We denken graag mee over waar je nu tegenaan loopt, en wat het platform daarin voor je kan
              betekenen.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-lg transition-transform hover:scale-[1.02]"
          >
            Plan een gesprek
          </Link>
        </div>
      </section>
    </>
  );
}
