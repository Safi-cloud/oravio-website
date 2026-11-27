import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Over ons | Oravio",
  description: "Waarom Oravio bestaat, en welke overtuiging aan het platform ten grondslag ligt.",
};

const PRINCIPLES = [
  {
    title: "Infrastructuur, geen maatwerk",
    body: "Elke onderneming die met een ontwikkelaar in zee gaat, loopt tegen hetzelfde probleem aan: maatwerk is duur, traag, en moeilijk te onderhouden. Oravio kiest bewust voor het tegenovergestelde: één degelijk fundament, waarop ondernemingen hun eigen omgeving inrichten zonder dat er per klant opnieuw gebouwd hoeft te worden.",
  },
  {
    title: "Scheiding is geen bijzaak",
    body: "Op een platform waar meerdere ondernemingen naast elkaar draaien, is volledige scheiding tussen klanten geen extra functie, het is de basisvoorwaarde. Gegevens, ontwerp en toegang van de ene onderneming mogen nooit, onder geen enkele omstandigheid, zichtbaar zijn voor een andere.",
  },
  {
    title: "Groei zonder om te bouwen",
    body: "Een onderneming die vandaag tien producten voert en over twee jaar tweehonderd, moet niet naar een ander systeem hoeven overstappen. Oravio is ontworpen om mee te groeien, van de eerste dag tot ver daarna.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Over ons</p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Gebouwd vanuit één overtuiging
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            Dat een onderneming nooit hoeft te kiezen tussen een platform dat bij haar past, en een
            platform dat betrouwbaar en betaalbaar blijft naarmate ze groeit.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto flex max-w-3xl justify-center">
          <Image
            src="/images/oravio-logo-cropped.png"
            alt="Het Oravio-beeldmerk"
            width={929}
            height={491}
            className="w-full max-w-lg rounded-2xl"
            priority
          />
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl space-y-16">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
              <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{principle.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--slate)] md:text-base">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">De naam</p>
          <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
            Oravio, het teken van oneindige verbinding
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--slate)] md:text-base">
            Het beeldmerk verwijst naar precies dat: één doorlopende verbinding tussen de kern van het
            platform en elke onderneming die erop draait, zonder begin- of eindpunt, en zonder grens aan
            hoeveel ondernemingen er onderdeel van kunnen zijn.
          </p>
        </div>
      </section>
    </>
  );
}
