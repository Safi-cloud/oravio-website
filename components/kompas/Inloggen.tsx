"use client";
import { useActionState } from "react";
import { Compass, Loader2 } from "lucide-react";
import { inloggen } from "@/app/kompas/acties";

export default function Inloggen({ ingesteld }: { ingesteld: boolean }) {
  const [staat, actie, bezig] = useActionState(inloggen, null as { fout?: string } | null);
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8fb] px-6">
      <div className="kp-orb kp-orb-a" />
      <div className="kp-orb kp-orb-b" />
      <form action={actie} className="relative w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-9 text-center shadow-[0_40px_100px_-50px_rgba(15,40,65,0.5)] backdrop-blur-xl">
        <span className="bg-gradient-brand mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
          <Compass className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <h1 className="font-display mt-6 text-2xl font-semibold tracking-tight text-[var(--ink)]">Kompas</h1>
        <p className="mt-1 text-sm text-[var(--slate)]">Jouw cockpit voor voorstellen, leads en klanten.</p>
        {ingesteld ? (
          <>
            <input
              name="sleutel"
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="Wachtwoord"
              className="mt-7 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3.5 text-center outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/10"
            />
            {staat?.fout && <p className="mt-3 text-sm text-[#c0432d]">{staat.fout}</p>}
            <button disabled={bezig} className="bg-gradient-brand mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]">
              {bezig && <Loader2 className="h-4 w-4 animate-spin" />} Openen
            </button>
            <p className="mt-4 text-xs text-[var(--slate)]">Je blijft 30 dagen ingelogd op dit apparaat.</p>
          </>
        ) : (
          <p className="mt-6 rounded-xl bg-[#fff6f3] px-4 py-3 text-sm text-[var(--navy)]">
            Stel eerst OVERZICHT_SLEUTEL in bij Vercel en deploy opnieuw.
          </p>
        )}
      </form>
    </div>
  );
}
