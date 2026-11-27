"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { ACTIE, BEHEER_FEATURES, BEHEER_PLANS, euro } from "@/lib/pricing";

export default function BeheerPlans() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-[var(--line)] bg-white p-1 text-sm">
          {[
            { label: "Per maand", value: false },
            { label: "Per jaar", value: true },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setYearly(opt.value)}
              aria-pressed={yearly === opt.value}
              className={`rounded-full px-5 py-2 font-semibold transition-colors ${
                yearly === opt.value ? "bg-gradient-brand text-white" : "text-[var(--slate)] hover:text-[var(--ink)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {BEHEER_PLANS.map((plan) => {
          const actie = ACTIE.actief && plan.id === ACTIE.beheer;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 ${
                plan.featured
                  ? "bg-white shadow-[0_30px_60px_-35px_rgba(15,40,65,0.45)] ring-2 ring-[var(--teal)]"
                  : "border border-[var(--line)] bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-label rounded-full bg-[var(--sky)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--teal)]">
                  {plan.tag}
                </span>
                {actie && (
                  <span className="rounded-full bg-[#fff1ed] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e85c44]">
                    Hoort bij de actie
                  </span>
                )}
              </div>
              <h3 className="font-display mt-5 text-2xl font-semibold text-[var(--ink)]">Beheer {plan.name}</h3>
              <p className="mt-2 text-sm text-[var(--slate)]">{plan.body}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
                  {euro(yearly ? plan.perYear : plan.perMonth)}
                </span>
                <span className="text-sm text-[var(--slate)]">{yearly ? "per jaar" : "per maand"}</span>
              </p>
              <p className="mt-1 text-xs text-[var(--slate)]">
                {actie
                  ? "Bij de actie: maandelijks via automatische incasso"
                  : yearly
                    ? `Komt neer op ${euro(plan.perMonth)} per maand`
                    : `Jaarlijks gefactureerd: ${euro(plan.perYear)}`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--line)] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="font-mono-label px-6 py-4 text-[11px] font-normal uppercase tracking-[0.15em] text-[var(--slate)]">
                Wat zit erin
              </th>
              {BEHEER_PLANS.map((p) => (
                <th key={p.id} className={`font-display px-6 py-4 font-semibold ${p.featured ? "text-[var(--teal)]" : "text-[var(--ink)]"}`}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BEHEER_FEATURES.map((row) => (
              <tr key={row.label} className="border-b border-[var(--line)] last:border-0">
                <td className="px-6 py-3.5 text-[var(--navy)]">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i} className={`px-6 py-3.5 ${i === 1 ? "bg-[#f0f7fa]" : ""}`}>
                    {v === true ? (
                      <Check className="h-4 w-4 text-[var(--teal)]" strokeWidth={2.5} aria-label="Inbegrepen" />
                    ) : v === false ? (
                      <Minus className="h-4 w-4 text-[var(--slate)]/40" aria-label="Niet inbegrepen" />
                    ) : (
                      <span className="text-sm text-[var(--ink)]">{v}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
