import IntakeLijst from "@/components/kompas/IntakeLijst";
import { intakes, tijd } from "@/lib/kompas-data";

export default async function Intakes() {
  const lijst = (await intakes()).map((i) => ({ ...i, wanneer: tijd(i.datum, true) }));
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display kp-in text-3xl font-semibold tracking-tight text-[var(--ink)]">Intakes</h1>
      <p className="kp-in mt-1 text-[var(--slate)]">Alles wat klanten via het intakeformulier hebben aangeleverd.</p>
      <IntakeLijst items={lijst} />
    </div>
  );
}
