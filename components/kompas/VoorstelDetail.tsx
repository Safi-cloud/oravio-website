"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { ArrowLeft, Check, ExternalLink, Film, Loader2, Phone, Save, Trash2, Upload } from "lucide-react";
import { leadOpslaan, verwijderVoorstel, voorstelOpslaan, zetGeldigTot } from "@/app/kompas/acties";
import { BelKnop, KopieerKnop, VerlengKnop, WhatsAppKnop } from "@/components/kompas/Knoppen";
import type { Voorstel } from "@/lib/voorstellen";

type Lead = { status: string; contact?: string; telefoon?: string; email?: string; plaats?: string; volgende?: string; volgendeTekst?: string };
type Props = {
  v: Voorstel;
  lead: Lead;
  geldig: boolean;
  geldigTotTekst: string;
  warmte: { label: string; kleur: string; tekst: string };
  stats: { geopend: number; gestart: number; afgekeken: number; maxPct: number; eerste: string; laatst: string; akkoord: string };
  sessies: { id: string; wanneer: string; apparaat: string; starts: number; maxPct: number; afgekeken: number }[];
  logboek: { t: string; tekst: string; wanneer: string }[];
  link: string;
  wa: string;
  waTekst: string;
  statussen: { id: string; label: string; kleur: string }[];
};

const veld = "w-full rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/10";
const label = "mb-1 block text-xs font-medium text-[var(--slate)]";

function Opgeslagen({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2f9e6e]">
      <Check className="h-3.5 w-3.5" /> Opgeslagen
    </span>
  ) : null;
}

export default function VoorstelDetail(p: Props) {
  const { v } = p;
  const [tab, setTab] = useState<"lead" | "voorstel" | "bezoeken">("lead");
  const [bezig, start] = useTransition();
  const [ok, setOk] = useState("");
  const [fout, setFout] = useState("");
  const klaar = (k: string) => {
    setOk(k);
    setTimeout(() => setOk(""), 2200);
  };

  // Lead
  const [lead, setLead] = useState<Lead>(p.lead);
  const [notitie, setNotitie] = useState("");
  // Voorstel
  const [f, setF] = useState({
    klant: v.klant,
    sub: v.sub,
    prijs: v.prijs,
    normaal: v.normaal,
    aanbodLabel: v.aanbodLabel,
    betaalt: v.betaalt,
    toelichting: v.toelichting,
    aanspreken: v.aanspreken || "u",
    basis: v.basis.join("\n"),
    extra: v.extra.join("\n"),
  });
  const [datum, setDatum] = useState(new Date(v.geldigTot).toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" }));
  const [video, setVideo] = useState<{ pct: number; naam: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const st = p.statussen.find((s) => s.id === lead.status);

  const bewaarLead = (extra: Partial<Lead> & { notitie?: string } = {}) =>
    start(async () => {
      setFout("");
      try {
        await leadOpslaan(v.code, { ...lead, ...extra } as never);
        setNotitie("");
        klaar("lead");
      } catch (e) {
        setFout((e as Error).message);
      }
    });

  const bewaarVoorstel = () =>
    start(async () => {
      setFout("");
      try {
        await voorstelOpslaan(v.code, {
          ...f,
          prijs: Number(f.prijs),
          normaal: Number(f.normaal),
          aanspreken: f.aanspreken as "u" | "je",
          basis: f.basis.split("\n").map((x) => x.trim()),
          extra: f.extra.split("\n").map((x) => x.trim()),
        });
        klaar("voorstel");
      } catch (e) {
        setFout((e as Error).message);
      }
    });

  const nieuweVideo = async (file?: File) => {
    if (!file) return;
    setFout("");
    setVideo({ pct: 0, naam: file.name });
    try {
      const res = await upload(`demos/${v.code}.mp4`, file, {
        access: "public",
        handleUploadUrl: "/api/kompas/upload",
        multipart: file.size > 30 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setVideo({ pct: Math.round(percentage), naam: file.name }),
      });
      await voorstelOpslaan(v.code, { videoUrl: res.url });
      setVideo(null);
      klaar("video");
    } catch (e) {
      setVideo(null);
      setFout(`Video uploaden mislukt: ${(e as Error).message}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/kompas/voorstellen" className="kp-in inline-flex items-center gap-1.5 text-sm text-[var(--slate)] hover:text-[var(--ink)]">
        <ArrowLeft className="h-4 w-4" /> Voorstellen
      </Link>

      {/* Kop */}
      <header className="kp-kaart kp-in mt-4 p-6 md:p-8">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">{v.klant}</h1>
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: p.warmte.kleur, color: p.warmte.tekst }}>
                {p.warmte.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--slate)]">{v.sub}</p>
            <p className="mt-2 text-xs text-[var(--slate)]">
              {p.geldig ? "Geldig tot" : "Verlopen op"} {p.geldigTotTekst} · €{v.prijs} {v.prijs !== v.normaal && <s className="opacity-60">€{v.normaal}</s>}
            </p>
          </div>
          <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3f7] px-3.5 py-2 text-xs font-semibold text-[var(--navy)] hover:text-[var(--teal)]">
            Voorstel bekijken <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Geopend", p.stats.geopend],
            ["Video gestart", p.stats.gestart],
            ["Afgekeken", p.stats.afgekeken],
            ["Verst gekeken", `${p.stats.maxPct}%`],
          ].map(([k, val]) => (
            <div key={k as string} className="rounded-2xl bg-[#f6f9fb] px-4 py-3">
              <p className="font-display text-xl font-semibold text-[var(--ink)]">{val}</p>
              <p className="text-[11px] text-[var(--slate)]">{k}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <BelKnop href={lead.telefoon ? `tel:${lead.telefoon.replace(/[^\d+]/g, "")}` : undefined} />
          <WhatsAppKnop href={p.wa} label="Link via WhatsApp" />
          <KopieerKnop tekst={p.link} label="Link kopiëren" />
          <KopieerKnop tekst={p.waTekst} label="Bericht kopiëren" />
          <VerlengKnop code={v.code} />
        </div>
      </header>

      {/* Tabs */}
      <div className="kp-in mt-6 inline-flex rounded-full bg-white p-1 ring-1 ring-[var(--line)]">
        {(
          [
            ["lead", "Lead"],
            ["voorstel", "Voorstel aanpassen"],
            ["bezoeken", `Bezoeken (${p.sessies.length})`],
          ] as const
        ).map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === id ? "bg-gradient-brand text-white" : "text-[var(--slate)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {fout && <p className="mt-4 rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#b8402b]">{fout}</p>}

      {tab === "lead" && (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="kp-kaart p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.statussen.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setLead({ ...lead, status: s.id });
                    bewaarLead({ status: s.id });
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${lead.status === s.id ? "text-white shadow" : "bg-white text-[var(--navy)] ring-1 ring-[var(--line)]"}`}
                  style={lead.status === s.id ? { background: s.kleur } : undefined}
                >
                  {lead.status !== s.id && <span className="h-2 w-2 rounded-full" style={{ background: s.kleur }} />}
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["contact", "Contactpersoon"],
                  ["telefoon", "Telefoon"],
                  ["email", "E-mail"],
                  ["plaats", "Plaats"],
                ] as const
              ).map(([k, l]) => (
                <div key={k}>
                  <label className={label}>{l}</label>
                  <input className={veld} value={lead[k] || ""} onChange={(e) => setLead({ ...lead, [k]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className={label}>Volgende actie op</label>
                <input type="date" className={veld} value={lead.volgende || ""} onChange={(e) => setLead({ ...lead, volgende: e.target.value })} />
              </div>
              <div>
                <label className={label}>Wat moet er dan gebeuren?</label>
                <input className={veld} value={lead.volgendeTekst || ""} placeholder="Terugbellen na de video" onChange={(e) => setLead({ ...lead, volgendeTekst: e.target.value })} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={() => bewaarLead()} disabled={bezig} className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Opslaan
              </button>
              <Opgeslagen ok={ok === "lead"} />
              {st && <span className="ml-auto text-xs text-[var(--slate)]">Nu: {st.label}</span>}
            </div>
          </section>

          <section className="kp-kaart p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Notities en logboek</p>
            <div className="mt-3 flex gap-2">
              <input
                className={veld}
                value={notitie}
                placeholder="Bijvoorbeeld: gebeld, belt vrijdag terug"
                onChange={(e) => setNotitie(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && notitie.trim() && bewaarLead({ notitie })}
              />
              <button onClick={() => notitie.trim() && bewaarLead({ notitie })} className="bg-gradient-brand shrink-0 rounded-xl px-4 text-sm font-semibold text-white">
                +
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Gebeld, geen gehoor", "Voicemail ingesproken", "Link gestuurd", "Belt zelf terug", "Afspraak gemaakt"].map((x) => (
                <button key={x} onClick={() => bewaarLead({ notitie: x })} className="rounded-full bg-[#f1f5f8] px-2.5 py-1 text-[11px] text-[var(--navy)] hover:bg-[var(--sky-deep)]">
                  {x}
                </button>
              ))}
            </div>
            <ol className="mt-5 space-y-3">
              {p.logboek.length === 0 && <li className="text-sm text-[var(--slate)]">Nog geen notities.</li>}
              {p.logboek.map((l, i) => (
                <li key={i} className="rounded-xl bg-[#f6f9fb] px-3.5 py-2.5">
                  <p className="text-sm text-[var(--ink)]">{l.tekst}</p>
                  <p className="text-[11px] text-[var(--slate)]">{l.wanneer}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}

      {tab === "voorstel" && (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <section className="kp-kaart p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label}>Klantnaam</label>
                <input className={veld} value={f.klant} onChange={(e) => setF({ ...f, klant: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Ondertitel</label>
                <input className={veld} value={f.sub} onChange={(e) => setF({ ...f, sub: e.target.value })} />
              </div>
              <div>
                <label className={label}>Prijs (€)</label>
                <input type="number" className={veld} value={f.prijs} onChange={(e) => setF({ ...f, prijs: Number(e.target.value) })} />
              </div>
              <div>
                <label className={label}>Normale prijs (€)</label>
                <input type="number" className={veld} value={f.normaal} onChange={(e) => setF({ ...f, normaal: Number(e.target.value) })} />
              </div>
              <div>
                <label className={label}>Label aanbod</label>
                <input className={veld} value={f.aanbodLabel} onChange={(e) => setF({ ...f, aanbodLabel: e.target.value })} />
              </div>
              <div>
                <label className={label}>Aanspreken</label>
                <div className="flex gap-2">
                  {["u", "je"].map((x) => (
                    <button key={x} onClick={() => setF({ ...f, aanspreken: x as "u" | "je" })} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${f.aanspreken === x ? "bg-gradient-brand text-white" : "bg-white ring-1 ring-[var(--line)]"}`}>
                      {x}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Wat betaalt de klant (zin)</label>
                <input className={veld} value={f.betaalt} onChange={(e) => setF({ ...f, betaalt: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Toelichting onder de prijs</label>
                <textarea className={`${veld} min-h-[70px]`} value={f.toelichting} onChange={(e) => setF({ ...f, toelichting: e.target.value })} />
              </div>
              <div>
                <label className={label}>Basisonderdelen (één per regel)</label>
                <textarea className={`${veld} min-h-[150px]`} value={f.basis} onChange={(e) => setF({ ...f, basis: e.target.value })} />
              </div>
              <div>
                <label className={label}>Extra uit Zakelijk (één per regel)</label>
                <textarea className={`${veld} min-h-[150px]`} value={f.extra} onChange={(e) => setF({ ...f, extra: e.target.value })} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={bewaarVoorstel} disabled={bezig} className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Wijzigingen opslaan
              </button>
              <Opgeslagen ok={ok === "voorstel"} />
            </div>
          </section>

          <div className="space-y-6">
            <section className="kp-kaart p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Geldigheid</p>
              <div className="mt-3 flex gap-2">
                <input type="date" className={veld} value={datum} onChange={(e) => setDatum(e.target.value)} />
                <button
                  onClick={() =>
                    start(async () => {
                      await zetGeldigTot(v.code, datum);
                      klaar("datum");
                    })
                  }
                  className="bg-gradient-brand shrink-0 rounded-xl px-4 text-sm font-semibold text-white"
                >
                  Zet
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--slate)]">De link werkt tot 23:59 op die dag.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <VerlengKnop code={v.code} dagen={1} />
                <VerlengKnop code={v.code} dagen={3} />
                <VerlengKnop code={v.code} dagen={7} />
                <Opgeslagen ok={ok === "datum"} />
              </div>
            </section>

            <section className="kp-kaart p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                <Film className="h-4 w-4" /> Demovideo
              </p>
              <p className="mt-2 text-sm text-[var(--slate)]">{v.videoUrl ? "Geüpload via het Kompas." : v.video ? `Uit de code: ${v.video}` : "Nog geen video."}</p>
              <input ref={fileRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => nieuweVideo(e.target.files?.[0])} />
              {video ? (
                <div className="mt-4">
                  <p className="text-xs text-[var(--slate)]">{video.naam}</p>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef3f7]">
                    <div className="bg-gradient-brand h-full transition-all" style={{ width: `${video.pct}%` }} />
                  </div>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--navy)] ring-1 ring-[var(--line)] hover:text-[var(--teal)]">
                  <Upload className="h-4 w-4" /> {v.videoUrl || v.video ? "Video vervangen" : "Video uploaden"}
                </button>
              )}
              <Opgeslagen ok={ok === "video"} />
            </section>

            <section className="kp-kaart p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Opruimen</p>
              <p className="mt-2 text-sm text-[var(--slate)]">
                {v.eigen ? "Verwijdert dit voorstel en alle notities." : "Verbergt dit voorstel. De link werkt dan niet meer."}
              </p>
              <button
                onClick={() => {
                  if (confirm(v.eigen ? "Voorstel definitief verwijderen?" : "Voorstel verbergen?")) start(() => verwijderVoorstel(v.code));
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#c0432d] ring-1 ring-[#f3c9bf] hover:bg-[#fff1ed]"
              >
                <Trash2 className="h-4 w-4" /> {v.eigen ? "Verwijderen" : "Verbergen"}
              </button>
            </section>
          </div>
        </div>
      )}

      {tab === "bezoeken" && (
        <section className="kp-kaart mt-5 p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--slate)]">
            <span>Eerste bezoek: <b className="text-[var(--ink)]">{p.stats.eerste}</b></span>
            <span>Laatst actief: <b className="text-[var(--ink)]">{p.stats.laatst}</b></span>
            {p.stats.akkoord && <span className="text-[#1f6b52]">Akkoord: <b>{p.stats.akkoord}</b></span>}
          </div>
          {p.sessies.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--slate)]">Nog geen bezoeken.</p>
          ) : (
            <ul className="mt-6 divide-y divide-[var(--line)]">
              {p.sessies.map((x) => (
                <li key={x.id} className="flex flex-wrap items-center gap-4 py-3.5 text-sm">
                  <span className="w-44 text-[var(--ink)]">{x.wanneer}</span>
                  <span className="flex w-28 items-center gap-1.5 text-[var(--slate)]">
                    <Phone className="h-3.5 w-3.5" /> {x.apparaat}
                  </span>
                  <span className="w-32 text-[var(--slate)]">{x.starts === 0 ? "video niet gestart" : `${x.starts}× gestart`}</span>
                  <span className="min-w-[120px] flex-1">
                    <span className="block h-2 overflow-hidden rounded-full bg-[#eef3f7]">
                      <span className="bg-gradient-brand block h-full" style={{ width: `${x.maxPct}%` }} />
                    </span>
                  </span>
                  <span className="w-24 text-right font-medium text-[var(--ink)]">{x.afgekeken ? "afgekeken" : `${x.maxPct}%`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
