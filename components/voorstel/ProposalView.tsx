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
  aanspreken: "u" | "je";
};

const eur = (n: number) => `€${n.toLocaleString("nl-NL")}`;

// Telt bij in beeld komen af van de normale prijs naar de aanbiedingsprijs.
function usePriceDrop(from: number, to: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(from);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setValue(to);
          setDone(true);
          return;
        }
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0 - 500) / 1600);
          if (p > 0) setValue(Math.round(from - (from - to) * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
          else setDone(true);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to]);
  return { ref, value, done } as const;
}

function melden(code: string, type: string, extra: Record<string, string> = {}) {
  return fetch("/api/voorstel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, type, ...extra }),
    keepalive: true,
  });
}

export default function ProposalView({ code, klant, sub, geldigTot, resterend, demoLabel, basis, extra, extraUit, aanbodLabel, betaalt, prijs, normaal, toelichting, aanspreken }: Props) {
  const je = aanspreken === "je";
  const t = {
    u: je ? "je" : "u",
    U: je ? "Je" : "U",
    uw: je ? "je" : "uw",
    Uw: je ? "Jouw" : "Uw",
  };
  const gemeld = useRef(false);
  const bekeken = useRef(false);
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const { ref: dropRef, value: dropValue, done: dropDone } = usePriceDrop(normaal, prijs);
  const pct = Math.round(((normaal - prijs) / normaal) * 100);

  useEffect(() => {
    if (status !== "sent") return;
    const el = panelRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [status]);

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
            {t.Uw} nieuwe website, <span className="text-gradient">{klant}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
            {sub}. Bekijk in de video hoe {t.uw} nieuwe website eruitziet en werkt. Dit voorstel is speciaal voor {t.u} gemaakt.
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

      {/* Prijsonthulling */}
      <section className="px-6 pt-4 md:px-10">
        <div ref={dropRef} className="featured-glow relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-dusk px-7 py-12 text-white md:px-14 md:py-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2864a0] opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#2f9e6e] opacity-30 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="font-mono-label inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8fd6c2]">
                {aanbodLabel}
              </span>
              <h2 className="font-display mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]">
                Wat {t.u} in de video ziet, is <span className="text-[#8fd6c2]">pakket {extraUit}</span>.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#c3d6e5]">
                Ontwerp, teksten, slimme formulieren en doorverwijzingen: dit is een complete {extraUit}-website. {t.U} krijgt hem
                {prijs < 450 ? " voor het tarief van ons instappakket." : " voor een speciale prijs."}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm md:p-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#a9bcc7]">Pakket {extraUit}</p>
                  <p className="mt-1 text-sm text-[#c3d6e5]">normale prijs</p>
                </div>
                <span className="font-display relative text-3xl font-semibold text-white/60">
                  {eur(normaal)}
                  <span
                    className="absolute left-[-4%] top-1/2 h-[3px] w-[108%] origin-left -rotate-6 rounded bg-[#ff8a7a] transition-transform duration-500"
                    style={{ transform: `rotate(-6deg) scaleX(${dropValue < normaal ? 1 : 0})` }}
                  />
                </span>
              </div>
              <div className="pt-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#8fd6c2]">{betaalt}</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-7xl font-semibold leading-none tracking-tight tabular-nums md:text-8xl">
                    {eur(dropValue)}
                  </span>
                  <span className="pb-2 text-sm text-[#a9bcc7]">eenmalig</span>
                </div>
                <div
                  className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[#2f9e6e] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#2f9e6e]/30 transition-all duration-500 ${
                    dropDone ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  {t.U} bespaart {eur(normaal - prijs)} · {pct}% korting
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-8 md:p-10">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Wat {t.u} krijgt</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-[var(--ink)] md:text-3xl">{demoLabel}</h2>
              <span className="text-sm text-[var(--slate)]">
                waarde <span className="font-semibold text-[var(--ink)]">{eur(normaal)}</span>
              </span>
            </div>

            <div className="relative mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d6e7d] via-[#2864a0] to-[#2f9e6e] p-[1.5px]">
              <div className="rounded-[calc(1rem-1.5px)] bg-[var(--paper)] p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">Uit pakket {extraUit}</p>
                  <span className="bg-gradient-brand rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Inbegrepen
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {extra.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] font-medium text-[var(--ink)]">
                      <span className="bg-gradient-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="font-mono-label mt-8 text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]">En natuurlijk de basis</p>
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

            <p className="mt-6 text-xs leading-relaxed text-[var(--slate)]">
              <Link href="/prijzen" className="text-[var(--teal)] underline underline-offset-2">
                Bekijk alle pakketten
              </Link>{" "}
              om alle pakketten en prijzen te vergelijken.
            </p>
          </div>

          <div ref={panelRef} className="bg-gradient-dusk relative overflow-hidden rounded-3xl p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#2f9e6e] opacity-25 blur-3xl" />
            <div className="relative">
              {status === "sent" ? (
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--teal)]">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <h3 className="font-display mt-5 text-2xl font-semibold">{je ? "Dankjewel" : "Dank u wel"}{naam ? `, ${naam.split(" ")[0]}` : ""}!</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                    Ik heb {t.uw} reactie ontvangen en neem snel contact met {t.u} op om de volgende stap af te stemmen.
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
                  <h3 className="font-display mt-5 text-2xl font-semibold leading-snug">
                    {extraUit} voor <span className="text-[#8fd6c2]">{eur(prijs)}</span>. Zullen we beginnen?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#c3d6e5]">
                    Laat het weten, dan stemmen we samen de details af. {t.U} zit nergens aan vast tot {t.u} akkoord geeft.
                  </p>
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
                  <h3 className="font-display text-2xl font-semibold">Fijn! Hoe bereik ik {t.u}?</h3>
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
