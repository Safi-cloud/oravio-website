"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { KopieerKnop, VerlengKnop, WhatsAppKnop } from "@/components/kompas/Knoppen";

type Item = {
  code: string;
  klant: string;
  sub: string;
  prijs: number;
  geldig: boolean;
  urenOver: number;
  status: string;
  contact: string;
  telefoon: string;
  warmte: string;
  warmteLabel: string;
  warmteKleur: string;
  warmteTekst: string;
  geopend: number;
  gestart: number;
  afgekeken: number;
  maxPct: number;
  laatst: string;
  link: string;
  wa: string;
};

export default function VoorstellenLijst({ items, statussen }: { items: Item[]; statussen: { id: string; label: string; kleur: string }[] }) {
  const [zoek, setZoek] = useState("");
  const [filter, setFilter] = useState<string>("alle");
  const lijst = useMemo(
    () =>
      items.filter(
        (i) =>
          (filter === "alle" || (filter === "verlopen" ? !i.geldig : filter === "actief" ? i.geldig : i.status === filter)) &&
          (!zoek || `${i.klant} ${i.sub} ${i.contact}`.toLowerCase().includes(zoek.toLowerCase())),
      ),
    [items, zoek, filter],
  );
  const status = (id: string) => statussen.find((s) => s.id === id);
  const chips = [
    { id: "alle", label: `Alle ${items.length}` },
    { id: "actief", label: "Actief" },
    { id: "verlopen", label: "Verlopen" },
    ...statussen.filter((s) => items.some((i) => i.status === s.id)).map((s) => ({ id: s.id, label: s.label })),
  ];

  return (
    <>
      <div className="kp-in mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="kp-kaart flex flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 text-[var(--slate)]" />
          <input value={zoek} onChange={(e) => setZoek(e.target.value)} placeholder="Zoek op klant of contact" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${filter === c.id ? "bg-gradient-brand text-white" : "bg-white text-[var(--slate)] ring-1 ring-[var(--line)]"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {lijst.map((i, n) => {
          const st = status(i.status);
          return (
            <li key={i.code} className="kp-kaart kp-in p-5" style={{ animationDelay: `${Math.min(n, 8) * 40}ms` }}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/kompas/voorstellen/${i.code}`} className="font-display truncate text-lg font-semibold text-[var(--ink)] hover:text-[var(--teal)]">
                      {i.klant}
                    </Link>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: i.warmteKleur, color: i.warmteTekst }}>
                      {i.warmteLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[var(--slate)]">{i.sub}</p>
                </div>
                <Link href={`/kompas/voorstellen/${i.code}`} aria-label="Openen" className="rounded-full p-2 text-[var(--slate)] hover:bg-[#eef3f7] hover:text-[var(--teal)]">
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                {st && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-medium text-[var(--navy)] ring-1 ring-[var(--line)]">
                    <span className="h-2 w-2 rounded-full" style={{ background: st.kleur }} /> {st.label}
                  </span>
                )}
                <span className={`rounded-full px-2.5 py-1 font-medium ${i.geldig ? (i.urenOver < 24 ? "bg-[#fff1e6] text-[#c2681b]" : "bg-[#e6f5ee] text-[#1f6b52]") : "bg-[#f1f4f7] text-[var(--slate)]"}`}>
                  {i.geldig ? (i.urenOver < 24 ? `Nog ${Math.max(1, Math.round(i.urenOver))} uur` : `Nog ${Math.floor(i.urenOver / 24)} dagen`) : "Verlopen"}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-[var(--navy)] ring-1 ring-[var(--line)]">€{i.prijs}</span>
                <span className="ml-auto text-[var(--slate)]">{i.laatst}</span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[
                  ["geopend", i.geopend],
                  ["gestart", i.gestart],
                  ["afgekeken", i.afgekeken],
                  ["verst", `${i.maxPct}%`],
                ].map(([k, val]) => (
                  <div key={k as string} className="rounded-xl bg-[#f6f9fb] py-2">
                    <p className="font-display text-base font-semibold text-[var(--ink)]">{val}</p>
                    <p className="text-[10px] text-[var(--slate)]">{k}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <KopieerKnop tekst={i.link} label="Link" />
                <WhatsAppKnop href={i.wa} />
                <VerlengKnop code={i.code} />
              </div>
            </li>
          );
        })}
      </ul>
      {lijst.length === 0 && <p className="mt-10 text-center text-sm text-[var(--slate)]">Geen voorstellen gevonden.</p>}
    </>
  );
}
