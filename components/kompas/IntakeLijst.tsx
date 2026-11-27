"use client";
import { useState, useTransition } from "react";
import { Check, ChevronDown, Download, Inbox } from "lucide-react";
import { intakeAfvinken } from "@/app/kompas/acties";
import { KopieerKnop } from "@/components/kompas/Knoppen";

type Bestand = { url: string; naam: string };
type Item = {
  id: string;
  wanneer: string;
  klant: string | null;
  velden: [string, string][];
  logo: Bestand | null;
  fotos: Bestand[];
  extra: Bestand[];
  klaar?: boolean;
};

export default function IntakeLijst({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(items.find((i) => !i.klaar)?.id || null);
  const [, start] = useTransition();
  if (items.length === 0)
    return (
      <div className="kp-kaart kp-in mt-6 flex flex-col items-center p-12 text-center">
        <Inbox className="h-8 w-8 text-[var(--teal)]" />
        <p className="font-display mt-4 text-lg font-semibold text-[var(--ink)]">Nog geen intakes</p>
        <p className="mt-1 text-sm text-[var(--slate)]">Na een akkoord sturen klanten hier hun logo, foto&apos;s en gegevens naartoe.</p>
      </div>
    );
  return (
    <ul className="mt-6 space-y-4">
      {items.map((i) => {
        const bedrijf = i.velden.find(([k]) => k === "Bedrijf")?.[1] || i.klant || "Onbekend";
        const tekst = i.velden.map(([k, v]) => `${k}: ${v}`).join("\n");
        const isOpen = open === i.id;
        return (
          <li key={i.id} className={`kp-kaart kp-in overflow-hidden ${i.klaar ? "opacity-70" : ""}`}>
            <button onClick={() => setOpen(isOpen ? null : i.id)} className="flex w-full items-center gap-4 p-5 text-left">
              {i.fotos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.fotos[0].url} alt="" className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#eef3f7] text-[var(--slate)]">
                  <Inbox className="h-5 w-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate text-lg font-semibold text-[var(--ink)]">{bedrijf}</span>
                <span className="text-xs text-[var(--slate)]">
                  {i.wanneer} · {i.fotos.length} foto&apos;s{i.logo ? " · logo" : ""}
                </span>
              </span>
              {i.klaar ? (
                <span className="rounded-full bg-[#e6f5ee] px-2.5 py-1 text-[10px] font-bold uppercase text-[#1f6b52]">Verwerkt</span>
              ) : (
                <span className="rounded-full bg-[#ff7a66] px-2.5 py-1 text-[10px] font-bold uppercase text-white">Nieuw</span>
              )}
              <ChevronDown className={`h-5 w-5 text-[var(--slate)] transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="border-t border-[var(--line)] p-5 md:p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                  <dl className="space-y-2.5 text-sm">
                    {i.velden.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[130px_1fr] gap-3">
                        <dt className="text-[var(--slate)]">{k}</dt>
                        <dd className="whitespace-pre-wrap text-[var(--ink)]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    {i.logo && (
                      <a href={i.logo.url} target="_blank" rel="noreferrer" className="mb-4 flex items-center gap-3 rounded-xl bg-[#f6f9fb] p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={i.logo.url} alt="Logo" className="h-12 w-12 rounded-lg bg-white object-contain p-1" />
                        <span className="text-sm font-medium text-[var(--ink)]">Logo openen</span>
                      </a>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {i.fotos.map((f) => (
                        <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.url} alt={f.naam} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                          <span className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100">
                            <Download className="h-3.5 w-3.5" />
                          </span>
                        </a>
                      ))}
                    </div>
                    {i.extra.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {i.extra.map((f) => (
                          <li key={f.url}>
                            <a href={f.url} className="text-[var(--teal)] underline">
                              {f.naam}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-5">
                  <KopieerKnop tekst={tekst} label="Alle gegevens kopiëren" />
                  <KopieerKnop tekst={[i.logo?.url, ...i.fotos.map((f) => f.url)].filter(Boolean).join("\n")} label="Fotolinks kopiëren" />
                  <button
                    onClick={() => start(() => intakeAfvinken(i.id, !i.klaar))}
                    className="bg-gradient-brand ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    <Check className="h-3.5 w-3.5" /> {i.klaar ? "Terug naar nieuw" : "Markeer als verwerkt"}
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
