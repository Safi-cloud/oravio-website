"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Lock, MessageCircle } from "lucide-react";
import CloudField from "@/components/CloudField";
import OravioMark from "@/components/OravioMark";

type Props = {
  code: string;
  klant: string;
  sub: string;
  geldigTot: string;
  resterend: string;
  demoLabel: string;
  basis: string[];
  extra: string[];
  extraUit: string;
  aanbodLabel: string;
  betaalt: string;
  prijs: number;
  normaal: number;
  toelichting: string;
};

const eur = (n: number) => `€${n.toLocaleString("nl-NL")}`;

function melden(code: string, type: string, extra: Record<string, string> = {}) {
  return fetch("/api/voorstel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, type, ...extra }),
    keepalive: true,
  });
}

export default function ProposalView({ code, klant, sub, geldigTot, resterend, demoLabel, basis, extra, extraUit, aanbodLabel, betaalt, prijs, normaal, toelichting }: Props) {
  const gemeld = useRef(false);
  const bekeken = useRef(false);
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (gemeld.current) return;
    gemeld.current = true;
    melden(code, "open").catch(() => {});
  }, [code]);

  async function akkoord(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await melden(code, "akkoord", { naam, telefoon, opmerking });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="bg-gradient-sky relative overflow-hidden px-6 pb-16 pt-14 md:px-10 md:pb-20 md:pt-20">
        <CloudField variant="light" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Persoonlijk ontwerpvoorstel</p>
            <span className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-xs font-medium text-[var(--slate)] backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-[var(--teal)]" strokeWidth={2} />
              Geldig tot {geldigTot} · {resterend}
            </span>
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink)] md:text-5xl">
            Uw nieuwe website, <span className="text-gradient">{klant}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            {sub}. Bekijk in de video hoe uw nieuwe website eruitziet en werkt. Dit voorstel is speciaal voor u gemaakt.
          </p>

          <div className="relative mt-10 overflow-hidden rounded-3xl bg-[#0d1f2d] p-1.5 shadow-[0_50px_100px_-40px_rgba(15,40,65,0.6)]">
            <video
              className="aspect-video w-full rounded-[1.25rem] bg-black"
              src={`/api/voorstel-video/${code}`}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onEnded={() => {
                if (bekeken.current) return;
                bekeken.current = true;
                melden(code, "bekeken").catch(() => {});
              }}
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-[var(--slate)]">
            <Lock className="h-3.5 w-3.5" strokeWidth={2} />
            Vertrouwelijk voorstel. Deze link is persoonlijk en verloopt automatisch.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-8 md:p-10">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Wat u in de demo ziet</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-[var(--ink)] md:text-3xl">{demoLabel}</h2>

            <p className="font-mono-label mt-8 text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]">De basis</p>
            <ul className="mt-4 space-y-3">
              {basis.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-[var(--navy)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sky)] text-[var(--teal)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d6e7d] via-[#2864a0] to-[#2f9e6e] p-[1.5px]">
              <div className="rounded-[calc(1rem-1.5px)] bg-[var(--paper)] p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">Extra uit pakket {extraUit}</p>
                  <span className="bg-gradient-brand rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Inbegrepen
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {extra.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium text-[var(--ink)]">
                      <span className="bg-gradient-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[var(--slate)]">
              <Link href="/prijzen" className="text-[var(--teal)] underline underline-offset-2">
                Bekijk alle pakketten
              </Link>{" "}
              om te zien wat Start en {extraUit} normaal bevatten.
            </p>
          </div>

          <div className="bg-gradient-dusk relative overflow-hidden rounded-3xl p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#2f9e6e] opacity-25 blur-3xl" />
            <div className="relative">
              {status === "sent" ? (
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--teal)]">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <h3 className="font-display mt-5 text-2xl font-semibold">Dank u wel{naam ? `, ${naam.split(" ")[0]}` : ""}!</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                    Ik heb uw reactie ontvangen en neem snel contact met u op om de volgende stap af te stemmen.
                  </p>
                </div>
              ) : !open ? (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono-label rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-[#8fd6c2]">
                      {aanbodLabel}
                    </span>
                    <OravioMark className="h-7 w-7" />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-[#c3d6e5]">{betaalt}</p>
                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-display text-6xl font-semibold leading-none tracking-tight">{eur(prijs)}</span>
                    <span className="pb-1 text-sm text-[#a9bcc7]">eenmalig</span>
                  </div>
                  <p className="mt-3 text-sm text-[#a9bcc7]">
                    Met onderdelen uit {extraUit}, normaal <span className="line-through decoration-[#8fd6c2]/70">{eur(normaal)}</span>
                  </p>
                  <div className="mt-4 inline-flex rounded-full bg-[#2f9e6e]/20 px-3 py-1 text-xs font-semibold text-[#8fd6c2]">
                    U bespaart {eur(normaal - prijs)}
                  </div>
                  <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-relaxed text-[#a9bcc7]">
                    {toelichting} Prijzen exclusief btw. Jaarlijks beheer vanaf €240.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:scale-[1.02]"
                  >
                    Ja, ik wil dit
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <Link
                    href="/contact?onderwerp=website"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                    Ik heb eerst een vraag
                  </Link>
                </div>
              ) : (
                <form onSubmit={akkoord} className="space-y-4">
                  <h3 className="font-display text-2xl font-semibold">Fijn! Hoe bereik ik u?</h3>
                  {[
                    { label: "Naam", value: naam, set: setNaam, req: true, type: "text" },
                    { label: "Telefoon", value: telefoon, set: setTelefoon, req: true, type: "tel" },
                  ].map((f) => (
                    <label key={f.label} className="block text-sm">
                      <span className="text-[#c3d6e5]">{f.label}</span>
                      <input
                        type={f.type}
                        required={f.req}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                      />
                    </label>
                  ))}
                  <label className="block text-sm">
                    <span className="text-[#c3d6e5]">Opmerking (optioneel)</span>
                    <textarea
                      rows={3}
                      value={opmerking}
                      onChange={(e) => setOpmerking(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white focus:border-white/40 focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ink)] disabled:opacity-60"
                  >
                    {status === "sending" ? "Versturen..." : "Verstuur mijn reactie"}
                  </button>
                  {status === "error" && (
                    <p className="text-xs text-[#ffc9c9]">
                      Versturen lukte niet. Mail gerust naar contact@oravio.nl.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
