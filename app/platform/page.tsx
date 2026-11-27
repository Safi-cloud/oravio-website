import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform | Oravio",
  description:
    "Verkoop, verhuur, betalingen, teambeheer en inzicht in één platform. Ontdek wat Oravio voor jouw onderneming kan betekenen.",
};

const GROUPS = [
  {
    label: "Fundament",
    title: "Jouw eigen, afgeschermde omgeving",
    items: [
      {
        title: "Volledige scheiding per onderneming",
        body: "Elke onderneming op het platform draait in een eigen, afgeschermde omgeving. Gegevens, gebruikers en instellingen van de ene onderneming zijn nooit zichtbaar of bereikbaar voor een andere.",
      },
      {
        title: "Eigen domein, automatisch herkend",
        body: "Een bezoeker die het domein van een onderneming bezoekt, komt vanzelf in de juiste, eigen omgeving terecht, inclusief het eigen ontwerp en de eigen inhoud.",
      },
      {
        title: "Direct beschikbaar tijdens opbouw",
        body: "Elke onderneming krijgt daarnaast een permanent platformadres, direct bruikbaar terwijl een eigen domein nog wordt gekoppeld.",
      },
    ],
  },
  {
    label: "Verkoop & verhuur",
    title: "Twee bedrijfsmodellen, één systeem",
    items: [
      {
        title: "Volwaardige webshop",
        body: "Productcatalogus, winkelwagen, kortingscodes, retouren en klantaccounts: een complete verkoopomgeving, zonder losse koppelingen.",
      },
      {
        title: "Verhuur- en reserveringsbeheer",
        body: "Een beschikbaarheidskalender die botsende aanvragen automatisch herkent en afhandelt, met een wachtrijsysteem voor populaire periodes.",
      },
      {
        title: "Productimport op schaal",
        body: "Een bestaande catalogus overzetten via een spreadsheet, inclusief voorraad en productfoto's, zonder handmatig overtypen.",
      },
    ],
  },
  {
    label: "Beheer & organisatie",
    title: "Gebouwd voor teams, niet alleen eigenaren",
    items: [
      {
        title: "Rollen met precieze rechten",
        body: "Een eigenaar ziet alles, een manager beheert de dagelijkse operatie, een medewerker ziet alleen wat voor zijn taak relevant is. Financiële gegevens blijven waar ze horen.",
      },
      {
        title: "Activiteitenlog",
        body: "Elke belangrijke actie wordt vastgelegd: wie deed wat, en wanneer. Herleidbaar, niet naderhand aan te passen.",
      },
      {
        title: "Zelf te beheren inhoud",
        body: "Vaste pagina's, contactgegevens en voorwaarden pas je zelf aan, zonder tussenkomst van een ontwikkelaar.",
      },
    ],
  },
  {
    label: "Inzicht",
    title: "Van cijfers naar concrete inzichten",
    items: [
      {
        title: "Eigen, afgeschermde analytics",
        body: "Bezoekersgedrag en conversie worden gemeten binnen de eigen omgeving en nooit gedeeld met of zichtbaar voor een andere onderneming op het platform.",
      },
      {
        title: "Automatische signalering",
        body: "Groeiende omzet, producten die veel bekeken maar weinig verkocht worden, bijna uitverkochte artikelen: het platform signaleert het zelf.",
      },
      {
        title: "Klantoverzicht",
        body: "Terugkerende klanten, gemiddelde orderwaarde en de meest waardevolle klanten, automatisch samengevat.",
      },
    ],
  },
  {
    label: "Betrouwbaarheid",
    title: "Betalingen en beveiliging",
    items: [
      {
        title: "Rechtstreekse betaalkoppeling",
        body: "Elke onderneming koppelt haar eigen betaalaccount. Opbrengsten gaan altijd rechtstreeks naar de eigen rekening.",
      },
      {
        title: "Herstelbaar bij fouten",
        body: "Automatische back-ups en een herstelfunctie zorgen dat een vergissing nooit onomkeerbaar is.",
      },
      {
        title: "Doordachte toegangscontrole",
        body: "Elke gevoelige actie wordt zowel in de interface als op de achtergrond gecontroleerd, nooit alleen zichtbaar afgeschermd.",
      },
    ],
  },
];

export default function PlatformPage() {
  return (
    <>
      <section className="px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Platform</p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Alles wat je nodig hebt om je onderneming te runnen
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            Elk onderdeel van Oravio lost een concreet probleem op: van voorraad die je kwijtraakt tot
            reserveringen die je nu nog met de hand bijhoudt. Je gebruikt wat je nodig hebt; de rest staat
            klaar voor wanneer je dat wél nodig hebt.
          </p>
        </div>
      </section>

      {GROUPS.map((group, i) => (
        <section
          key={group.title}
          className={`border-t border-[var(--line)] px-6 py-16 md:px-10 md:py-20 ${i % 2 === 1 ? "bg-[var(--paper)]" : ""}`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_2fr]">
              <div>
                <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">{group.label}</p>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                  {group.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-display text-base font-semibold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--slate)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-[var(--line)] px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
            Benieuwd wat dit voor jouw onderneming betekent?
          </h2>
          <Link
            href="/contact"
            className="bg-gradient-brand rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition-transform hover:scale-[1.02]"
          >
            Plan een gesprek
          </Link>
        </div>
      </section>
    </>
  );
}
