"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { BEHEER_FEATURES, BEHEER_PLANS, euro } from "@/lib/pricing";

export default function BeheerPlans() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-sm">
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
                yearly === opt.value ? "bg-white text-[var(--ink)]" : "text-white/70 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {BEHEER_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-7 ${
              plan.featured
                ? "bg-white text-[var(--ink)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
                : "border border-white/12 bg-white/[0.04] text-white"
            }`}
          >
            <span
              className={`font-mono-label rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                plan.featured ? "bg-[var(--sky)] text-[var(--teal)]" : "bg-white/10 text-[#8fd6c2]"
              }`}
            >
              {plan.tag}
            </span>
            <h3 className="font-display mt-5 text-2xl font-semibold">Beheer {plan.name}</h3>
            <p className={`mt-2 text-sm ${plan.featured ? "text-[var(--slate)]" : "text-[#c3d6e5]"}`}>{plan.body}</p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-semibold tracking-tight">
                {euro(yearly ? plan.perYear : plan.perMonth)}
              </span>
              <span className={`text-sm ${plan.featured ? "text-[var(--slate)]" : "text-[#a9bcc7]"}`}>
                {yearly ? "per jaar" : "per maand"}
              </span>
            </p>
            <p className={`mt-1 text-xs ${plan.featured ? "text-[var(--slate)]" : "text-[#a9bcc7]"}`}>
              {yearly ? `Komt neer op ${euro(plan.perMonth)} per maand` : `Jaarlijks gefactureerd: ${euro(plan.perYear)}`}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-3xl border border-white/12 bg-white/[0.03]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="font-mono-label px-6 py-4 text-[11px] font-normal uppercase tracking-[0.15em] text-[#a9bcc7]">
                Wat zit erin
              </th>
              {BEHEER_PLANS.map((p) => (
                <th key={p.id} className="font-display px-6 py-4 font-semibold text-white">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BEHEER_FEATURES.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.06] last:border-0">
                <td className="px-6 py-3.5 text-[#c4d2db]">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i} className="px-6 py-3.5 text-white">
                    {v === true ? (
                      <Check className="h-4 w-4 text-[#8fd6c2]" strokeWidth={2.5} aria-label="Inbegrepen" />
                    ) : v === false ? (
                      <Minus className="h-4 w-4 text-white/30" aria-label="Niet inbegrepen" />
                    ) : (
                      <span className="text-sm">{v}</span>
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
