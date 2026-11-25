"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BEHEER_PLANS, WEBSITE_PACKAGES, euro } from "@/lib/pricing";

const ADDONS = [
  { id: "taal", label: "Extra taal", price: 195 },
  { id: "logo", label: "Logo opfrissen", price: 195 },
  { id: "gbp", label: "Google Bedrijfsprofiel inrichten", price: 95 },
  { id: "mail", label: "Zakelijke e-mail instellen", price: 45 },
  { id: "whatsapp", label: "WhatsApp Business inrichten", price: 75 },
];

function useAnimatedNumber(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    const diff = value - start;
    if (diff === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 450);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + diff * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return shown;
}

export default function PriceCalculator() {
  const [site, setSite] = useState("zakelijk");
  const [plan, setPlan] = useState("zorgeloos");
  const [addons, setAddons] = useState<string[]>([]);

  const pkg = WEBSITE_PACKAGES.find((p) => p.id === site)!;
  const beheer = BEHEER_PLANS.find((p) => p.id === plan)!;
  const extras = ADDONS.filter((a) => addons.includes(a.id) && !(a.id === "taal" && site === "plus") && !(a.id === "gbp" && site === "plus"));
  const oneOff = pkg.price + extras.reduce((s, a) => s + a.price, 0);
  const year1 = oneOff + beheer.perYear;

  const shownOneOff = useAnimatedNumber(oneOff);
  const shownYear1 = useAnimatedNumber(year1);

  const toggle = (id: string) => setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-8 rounded-3xl border border-[var(--line)] bg-white p-7 md:p-9">
        <fieldset>
          <legend className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">1 · Je website</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {WEBSITE_PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSite(p.id)}
                aria-pressed={site === p.id}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  site === p.id
                    ? "border-transparent bg-[var(--sky)] ring-2 ring-[var(--teal)]"
                    : "border-[var(--line)] hover:border-[var(--teal)]/50"
                }`}
              >
                <p className="font-display text-sm font-semibold text-[var(--ink)]">{p.name}</p>
                <p className="mt-1 text-xs text-[var(--slate)]">{euro(p.price)} eenmalig</p>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">2 · Beheer</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {BEHEER_PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                aria-pressed={plan === p.id}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  plan === p.id
                    ? "border-transparent bg-[var(--sky)] ring-2 ring-[var(--teal)]"
                    : "border-[var(--line)] hover:border-[var(--teal)]/50"
                }`}
              >
                <p className="font-display text-sm font-semibold text-[var(--ink)]">{p.name}</p>
                <p className="mt-1 text-xs text-[var(--slate)]">{euro(p.perMonth)} per maand</p>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">3 · Extra&apos;s (optioneel)</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ADDONS.map((a) => {
              const included = site === "plus" && (a.id === "taal" || a.id === "gbp");
              const on = addons.includes(a.id) || included;
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={included}
                  onClick={() => toggle(a.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    on ? "border-[var(--teal)]/40 bg-[var(--sky)]" : "border-[var(--line)] hover:border-[var(--teal)]/50"
                  } ${included ? "cursor-default" : ""}`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      on ? "bg-gradient-brand border-transparent text-white" : "border-[var(--line)]"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 text-sm text-[var(--ink)]">{a.label}</span>
                  <span className="text-xs font-semibold text-[var(--slate)]">{included ? "Inbegrepen" : `+${euro(a.price)}`}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="bg-gradient-dusk relative overflow-hidden rounded-3xl p-8 text-white md:p-10 lg:sticky lg:top-28 lg:self-start">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#2f9e6e] opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#2864a0] opacity-30 blur-3xl" />
        <div className="relative">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[#8fd6c2]">Jouw samenstelling</p>
          <p className="font-display mt-3 text-xl font-semibold">
            Website {pkg.name} + Beheer {beheer.name}
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#c3d6e5]">Eenmalig</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{euro(shownOneOff)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#c3d6e5]">Beheer per maand</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{euro(beheer.perMonth)}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-[#c3d6e5]">Totaal eerste jaar</p>
            <p className="font-display mt-1 text-5xl font-semibold tracking-tight tabular-nums">{euro(shownYear1)}</p>
            <p className="mt-2 text-xs text-[#a9bcc7]">
              Daarna {euro(beheer.perYear)} per jaar. Alle bedragen exclusief 21% btw.
            </p>
          </div>

          <Link
            href="/contact?onderwerp=website"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:scale-[1.02]"
          >
            Vraag gratis een ontwerpvoorstel aan
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <p className="mt-3 text-center text-xs text-[#a9bcc7]">Eerst zien, dan pas beslissen.</p>
        </div>
      </div>
    </div>
  );
}
