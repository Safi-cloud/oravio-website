import { Clock, ImagePlus, ShieldCheck } from "lucide-react";
import CloudField from "@/components/CloudField";

export default function IntakeHero({ klant, je = false }: { klant?: string; je?: boolean }) {
  const t = je ? { uw: "je", u: "je", U: "Je" } : { uw: "uw", u: "u", U: "U" };
  return (
    <section className="bg-gradient-sky relative overflow-hidden px-6 pb-10 pt-16 md:px-10 md:pt-20">
      <CloudField variant="light" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
          Materialen aanleveren{klant ? ` · ${klant}` : ""}
        </p>
        <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink)] md:text-5xl">
          Alles voor {t.uw} nieuwe site, <span className="text-gradient">in één keer</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
          Zes korte stappen, rustig in te vullen op {t.uw} telefoon of computer. {t.U} kunt tussendoor stoppen: we bewaren alles.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3 text-sm">
          {[
            { icon: Clock, tekst: "Klaar in ongeveer 10 minuten" },
            { icon: ImagePlus, tekst: "Foto's direct vanaf de telefoon" },
            { icon: ShieldCheck, tekst: "Veilig verstuurd, alleen voor Oravio" },
          ].map(({ icon: Icon, tekst }) => (
            <span key={tekst} className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[var(--navy)] backdrop-blur">
              <Icon className="h-4 w-4 text-[var(--teal)]" /> {tekst}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
