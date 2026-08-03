import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Veelgestelde vragen — Oravio",
  description: "Antwoorden op veelgestelde vragen over het Oravio-platform: eigen domein, verkoop en verhuur, teamtoegang, betalingen en meer.",
};

const FAQS = [
  {
    q: "Kan ik zowel verkopen als verhuren binnen dezelfde omgeving?",
    a: "Ja. Verkoop en verhuur zijn allebei native onderdeel van het platform. Je kunt kiezen voor alleen verkoop, alleen verhuur, of allebei tegelijk binnen dezelfde omgeving.",
  },
  {
    q: "Draait mijn winkel onder mijn eigen domein?",
    a: "Ja. Elke onderneming draait onder haar eigen domeinnaam. Terwijl dat domein wordt gekoppeld, is je omgeving direct al bereikbaar via een gratis Oravio-adres.",
  },
  {
    q: "Zijn mijn gegevens gescheiden van andere ondernemingen op het platform?",
    a: "Ja, volledig. Elke onderneming heeft een eigen, afgeschermde omgeving. Gegevens, gebruikers en instellingen zijn nooit zichtbaar of bereikbaar voor een andere klant op het platform.",
  },
  {
    q: "Kan ik mijn team toegang geven, met verschillende rechten?",
    a: "Ja. Je kunt teamleden uitnodigen met een rol als eigenaar, manager of medewerker. Elke rol ziet en beheert alleen wat bij die taak hoort — gevoelige gegevens zoals omzet blijven voorbehouden aan wie dat mag zien.",
  },
  {
    q: "Hoe verlopen betalingen van klanten?",
    a: "Je koppelt je eigen betaalaccount. Opbrengsten gaan rechtstreeks naar jouw eigen rekening — nooit via een tussenpartij.",
  },
  {
    q: "Kan ik mijn bestaande productcatalogus overzetten?",
    a: "Ja. Een bestaand assortiment kun je in één keer overzetten via een spreadsheet, inclusief voorraad en productfoto's.",
  },
  {
    q: "Wat gebeurt er als mijn onderneming groeit?",
    a: "Het platform is gebouwd om mee te groeien. Van een eerste, kleine collectie tot een uitgebreide catalogus: hetzelfde fundament blijft werken, zonder dat je naar een ander systeem hoeft over te stappen.",
  },
  {
    q: "Voor welke branches is Oravio geschikt?",
    a: "De kern van het platform is bewust branchevrij: verhuurbedrijven, webshops, evenementenorganisatoren en modeondernemingen draaien er allemaal op. Bekijk de branchepagina voor meer voorbeelden, of neem contact op als je twijfelt of jouw onderneming past.",
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Veelgestelde vragen</p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Wat je waarschijnlijk wilt weten
          </h1>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-[var(--line)]">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-[var(--ink)] md:text-lg">
                {item.q}
                <span className="flex-shrink-0 text-xl text-[var(--teal)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)] md:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-6 py-16 text-center md:px-10 md:py-20">
        <p className="text-base text-[var(--slate)]">Staat je vraag er niet tussen?</p>
        <Link
          href="/contact"
          className="bg-gradient-brand mt-5 inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          Stel je vraag
        </Link>
      </section>
    </>
  );
}
