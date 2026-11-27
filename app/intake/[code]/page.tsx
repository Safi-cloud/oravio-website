import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntakeHero from "@/components/intake/IntakeHero";
import IntakeWizard from "@/components/intake/IntakeWizard";
import { vindLive } from "@/lib/voorstellen-live";
import { ACTIE } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Materialen aanleveren — Oravio",
  robots: { index: false, follow: false },
};

// Werkt ook als het voorstel zelf al verlopen is: na een akkoord moet de klant altijd kunnen aanleveren.
export default async function IntakeVoorstelPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await vindLive(code);
  if (!v) notFound();
  const je = v.aanspreken === "je";
  return (
    <>
      <IntakeHero klant={v.klant} je={je} />
      <section className="px-4 pb-24 pt-6 md:px-10">
        <IntakeWizard code={v.code} klant={v.klant} je={je} actie={ACTIE.actief && v.prijs === ACTIE.voor} />
      </section>
    </>
  );
}
