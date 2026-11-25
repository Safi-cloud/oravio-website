"use client";

import { useEffect, useState } from "react";

// Illustratieve "bouwstraat" voor de pagina Websites op maat: een
// browservenster dat zichzelf opbouwt, met daarnaast een deploy-log en
// kwaliteitsscores. Puur decoratief; de getallen zijn een voorbeeld.

const LOG = [
  { tag: "ontwerp", text: "Ontwerp vastgesteld", meta: "v3 · akkoord" },
  { tag: "build", text: "Pagina's gegenereerd", meta: "statisch + dynamisch" },
  { tag: "media", text: "Afbeeldingen geoptimaliseerd", meta: "AVIF / WebP" },
  { tag: "edge", text: "Uitgerold op edge-netwerk", meta: "wereldwijd" },
  { tag: "ssl", text: "SSL-certificaat actief", meta: "automatisch verlengd" },
  { tag: "seo", text: "Redirects oude site", meta: "geen verlies in Google" },
  { tag: "live", text: "Live op eigen domein", meta: "200 OK" },
];

const SCORES = [
  { label: "Snelheid", value: 98 },
  { label: "SEO", value: 100 },
  { label: "Toegankelijk", value: 96 },
];

function Ring({ value, label, active }: { value: number; label: string; active: boolean }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = active ? c * (1 - value / 100) : c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)" }}
          />
          <defs>
            <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1D6E7D" />
              <stop offset="1" stopColor="#2F9E6E" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-display absolute inset-0 flex items-center justify-center text-sm font-semibold text-[var(--ink)]">
          {active ? value : "--"}
        </span>
      </div>
      <span className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--slate-light)]">{label}</span>
    </div>
  );
}

export default function BuildConsole() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => setStep(LOG.length), 0);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setStep((s) => (s >= LOG.length + 5 ? 0 : s + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  const shown = Math.min(step, LOG.length);
  const done = step >= LOG.length;
  const progress = Math.round((shown / LOG.length) * 100);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-b from-[#eaf4fc] to-[#f8fbfe]" />

      {/* Browservenster dat zichzelf opbouwt */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
        style={{ boxShadow: "0 30px 60px -24px rgba(28,74,120,0.35)" }}
      >
        <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--sky)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="font-mono-label flex flex-1 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 py-1 text-[11px] text-[var(--slate)]">
            <svg viewBox="0 0 12 14" className="h-3 w-3" aria-hidden="true">
              <rect x="1" y="6" width="10" height="7.5" rx="1.5" fill={done ? "#2F9E6E" : "#9aaab8"} />
              <path d="M3.2 6V4.2a2.8 2.8 0 0 1 5.6 0V6" stroke={done ? "#2F9E6E" : "#9aaab8"} strokeWidth="1.5" fill="none" />
            </svg>
            jouwbedrijf.nl
          </div>
        </div>

        <div className="relative h-56 p-5 md:h-64">
          {/* Navigatie */}
          <div className={`flex items-center justify-between transition-opacity duration-700 ${shown >= 1 ? "opacity-100" : "opacity-0"}`}>
            <div className="bg-gradient-brand h-3 w-20 rounded-full" />
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-2 w-10 rounded-full bg-[var(--sky-deep)]" />
              ))}
              <div className="h-2 w-14 rounded-full bg-[var(--teal)]/70" />
            </div>
          </div>
          {/* Hero */}
          <div className={`mt-6 grid grid-cols-[1.2fr_1fr] gap-5 transition-all duration-700 ${shown >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <div className="space-y-2.5">
              <div className="h-4 w-11/12 rounded-md bg-[var(--ink)]/85" />
              <div className="h-4 w-8/12 rounded-md bg-[var(--ink)]/85" />
              <div className="h-2 w-full rounded-full bg-[var(--sky-deep)]" />
              <div className="h-2 w-10/12 rounded-full bg-[var(--sky-deep)]" />
              <div className="flex gap-2 pt-2">
                <div className="bg-gradient-brand h-6 w-20 rounded-full" />
                <div className="h-6 w-16 rounded-full border border-[var(--line)]" />
              </div>
            </div>
            <div className={`rounded-xl bg-gradient-to-br from-[#cfe3f7] to-[#d7ece4] transition-opacity duration-700 ${shown >= 3 ? "opacity-100" : "opacity-30"}`} />
          </div>
          {/* Kaarten */}
          <div className={`mt-5 grid grid-cols-3 gap-3 transition-all duration-700 ${shown >= 4 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-[var(--line)] p-2.5">
                <div className="h-2 w-6 rounded-full bg-[var(--teal)]/60" />
                <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--sky-deep)]" />
                <div className="mt-1.5 h-1.5 w-8/12 rounded-full bg-[var(--sky-deep)]" />
              </div>
            ))}
          </div>

          {/* Voortgang */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--sky-deep)]">
            <div className="bg-gradient-brand h-1 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Deploy-log */}
      <div
        className="relative -mt-6 ml-auto w-[88%] overflow-hidden rounded-2xl border border-white/10 bg-[#0f2841] p-4 text-[#c3d6e5] md:-mt-10 md:w-[78%]"
        style={{ boxShadow: "0 24px 48px -20px rgba(15,40,65,0.6)" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#8fd6c2]">oravio · deploy</span>
          <span className="font-mono-label flex items-center gap-1.5 text-[10px] text-[#8fd6c2]">
            <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-[#2f9e6e]" : "animate-pulse bg-[#febc2e]"}`} />
            {done ? "live" : "bezig"}
          </span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {LOG.map((line, i) => (
            <li
              key={line.tag}
              className={`font-mono-label flex items-center gap-2 text-[11px] transition-all duration-500 ${i < shown ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
            >
              <span className="text-[#2f9e6e]">✓</span>
              <span className="w-14 shrink-0 text-[#6f8fa8]">{line.tag}</span>
              <span className="text-white/90">{line.text}</span>
              <span className="ml-auto hidden text-[#6f8fa8] sm:inline">{line.meta}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scores */}
      <div
        className="float-node absolute -right-4 -top-10 hidden rounded-2xl border border-[var(--line)] bg-white/95 px-4 py-3 backdrop-blur-sm md:block"
        style={{ boxShadow: "0 18px 30px -14px rgba(28,74,120,0.3)" }}
      >
        <div className="flex gap-3">
          {SCORES.map((s) => (
            <Ring key={s.label} value={s.value} label={s.label} active={done} />
          ))}
        </div>
        <p className="font-mono-label mt-2 text-center text-[9px] uppercase tracking-wider text-[var(--slate-light)]">Voorbeeldmeting</p>
      </div>
    </div>
  );
}
