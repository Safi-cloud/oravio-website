import type { Metadata } from "next";
import Link from "next/link";
import CloudField from "@/components/CloudField";

export const metadata: Metadata = {
  title: "Branches — Oravio",
  description: "Van verhuurbedrijven tot retailers: ontdek hoe Oravio aansluit op jouw branche.",
};

const INDUSTRIES = [
  {
    title: "Verhuur & reservering",
    body: "Van kleding tot materieel: een beschikbaarheidskalender die conflicten automatisch voorkomt, met een wachtrij voor drukke periodes en heldere afhandeling bij afhalen en terugbrengen.",
    fits: ["Beschikbaarheidsbeheer", "Wachtrijsysteem", "Automatische statusafhandeling"],
  },
  {
    title: "E-commerce & retail",
    body: "Een volledige webshop met voorraadbeheer, kortingsacties en retourenafhandeling — geschikt voor een enkele collectie of een uitgebreide catalogus.",
    fits: ["Productcatalogus op schaal", "Kortingscodes & acties", "Retourenbeheer"],
  },
  {
    title: "Mode & lifestyle",
    body: "Visueel sterke presentatie met maat- en kleurvarianten, stijladvies en outfit-aanbevelingen — precies waar deze branche op vertrouwt om te verkopen.",
    fits: ["Maat- en kleurbeheer", "Stijl- en outfitadvies", "Aangepaste ontwerpstijlen"],
  },
  {
    title: "Bruidsmode & feestkleding",
    body: "De combinatie van verhuur én verkoop binnen één omgeving, met een boekingsproces dat rekening houdt met pasafspraken en levertijden rond een specifieke datum.",
    fits: ["Verhuur én verkoop tegelijk", "Datumgebonden boekingen", "Persoonlijk klantcontact"],
  },
  {
    title: "Evenementen",
    body: "Reserveringen voor materiaal, locaties of diensten rond een vaste datum, met automatische opvolging zodra iets weer beschikbaar komt.",
    fits: ["Datumgebonden beschikbaarheid", "Automatische opvolging", "Teambeheer voor grotere organisaties"],
  },
];

export default function BranchesPage() {
  return (
    <>
      <section className="px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Branches</p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Eén platform, aangepast aan elke branche
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            De onderliggende infrastructuur is bewust branchevrij opgebouwd — wat verandert, is welke
            onderdelen worden ingeschakeld, en hoe de omgeving eruitziet. Geen maatwerk-traject per
            branche, maar hetzelfde, beproefde fundament.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[var(--line)] md:grid-cols-2">
          {INDUSTRIES.map((industry) => (
            <div key={industry.title} className="bg-[var(--paper)] p-8 md:p-10">
              <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{industry.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">{industry.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {industry.fits.map((fit) => (
                  <li
                    key={fit}
                    className="font-mono-label rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--navy)]"
                  >
                    {fit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-dusk relative overflow-hidden border-t border-[var(--line)] px-6 py-20 text-white md:px-10 md:py-24">
        <CloudField variant="dark" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Werkt jouw branche hier niet tussen?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#a9bcc7] md:text-base">
            De infrastructuur is nadrukkelijk niet gebonden aan één specifieke branche. We bespreken graag
            of, en hoe, het platform aansluit op jouw onderneming.
          </p>
          <Link
            href="/contact"
            className="bg-gradient-brand mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            Plan een gesprek
          </Link>
        </div>
      </section>
    </>
  );
}
