import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import CloudField from "@/components/CloudField";
import ProposalView from "@/components/voorstel/ProposalView";
import { isGeldig, resterendeTijd } from "@/lib/voorstellen";
import { vindLive } from "@/lib/voorstellen-live";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ontwerpvoorstel — Oravio",
  robots: { index: false, follow: false },
};

export default async function VoorstelPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await vindLive(code);
  if (!v) notFound();

  if (!isGeldig(v)) {
    return (
      <section className="bg-gradient-sky relative flex min-h-[70vh] items-center overflow-hidden px-6 py-24 md:px-10">
        <CloudField variant="light" />
        <div className="relative mx-auto max-w-xl rounded-3xl border border-[var(--line)] bg-white/90 p-10 text-center backdrop-blur-sm">
          <span className="bg-gradient-brand mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white">
            <Clock className="h-6 w-6" strokeWidth={2} />
          </span>
          <p className="font-mono-label mt-6 text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Ontwerpvoorstel {v.klant}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Deze link is verlopen</h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--slate)]">
            Het voorstel was een beperkte tijd te bekijken. Wilt u het nog een keer zien of heeft u vragen? Neem gerust
            contact op, dan stuur ik u een nieuwe link.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact?onderwerp=website"
              className="bg-gradient-brand rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#1d6e7d]/20"
            >
              Neem contact op
            </Link>
            <a
              href="mailto:contact@oravio.nl"
              className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              contact@oravio.nl
            </a>
          </div>
        </div>
      </section>
    );
  }

  const tot = new Date(v.geldigTot);
  const geldigTot = tot.toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const resterend = resterendeTijd(v);

  return (
    <ProposalView
      resterend={resterend}
      geldigTot={geldigTot}
      code={v.code}
      klant={v.klant}
      sub={v.sub}
      demoLabel={v.demoLabel}
      basis={v.basis}
      extra={v.extra}
      extraUit={v.extraUit}
      aanbodLabel={v.aanbodLabel}
      betaalt={v.betaalt}
      prijs={v.prijs}
      normaal={v.normaal}
      toelichting={v.toelichting}
      aanspreken={v.aanspreken ?? "u"}
    />
  );
}
