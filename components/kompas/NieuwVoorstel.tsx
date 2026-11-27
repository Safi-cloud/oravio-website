"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { ArrowRight, Check, Film, Loader2, Sparkles, Upload, Wand2 } from "lucide-react";
import { nieuwVoorstel } from "@/app/kompas/acties";
import { KopieerKnop, WhatsAppKnop } from "@/components/kompas/Knoppen";

const veld = "w-full rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/10";
const label = "mb-1 block text-xs font-medium text-[var(--slate)]";

const SJABLONEN: Record<string, { sub: string; basis: string[]; extra: string[] }> = {
  Salon: {
    sub: "Salon in 's-Hertogenbosch",
    basis: ["Eén overzichtelijke pagina met al uw behandelingen", "Ontwerp in uw eigen stijl, perfect op telefoon", "WhatsApp-knop, contactgegevens en openingstijden", "Basis voor Google: titels, sitemap en bedrijfsgegevens"],
    extra: ["Teksten door ons geschreven", "Online afspraak aanvragen in drie stappen", "Behandelingen met prijzen mooi in beeld", "Reviews van klanten", "Uw oude pagina's doorgestuurd, u houdt uw plek in Google"],
  },
  Vakman: {
    sub: "Vakbedrijf in 's-Hertogenbosch",
    basis: ["Eén overzichtelijke pagina met al uw diensten", "Ontwerp in uw eigen stijl, perfect op telefoon", "Telefoon en WhatsApp direct in beeld", "Basis voor Google: titels, sitemap en bedrijfsgegevens"],
    extra: ["Teksten door ons geschreven", "Offerteformulier met directe prijsindicatie", "Projecten met voor en na", "Werkgebied en reviews", "Uw oude pagina's doorgestuurd, u houdt uw plek in Google"],
  },
  Zorg: {
    sub: "Praktijk in 's-Hertogenbosch",
    basis: ["Eén overzichtelijke pagina met al uw behandelingen", "Rustig, betrouwbaar ontwerp, perfect op telefoon", "Contactgegevens, route en openingstijden", "Basis voor Google: titels, sitemap en bedrijfsgegevens"],
    extra: ["Teksten door ons geschreven", "Klachtenwijzer met persoonlijk advies", "Afspraak of intake aanvragen", "Team en specialisaties in beeld", "Uw oude pagina's doorgestuurd, u houdt uw plek in Google"],
  },
};

export default function NieuwVoorstel({ actie, site }: { actie: { voor: number; normaal: number; perMaand: number }; site: string }) {
  const [f, setF] = useState({
    klant: "",
    contact: "",
    telefoon: "",
    sub: SJABLONEN.Salon.sub,
    aanspreken: "u" as "u" | "je",
    prijs: actie.voor,
    normaal: actie.normaal,
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    dagen: 3,
    basis: SJABLONEN.Salon.basis.join("\n"),
    extra: SJABLONEN.Salon.extra.join("\n"),
    toelichting: "Wilt u later meer pagina's, dan betaalt u alleen het verschil.",
  });
  const [sjabloon, setSjabloon] = useState("Salon");
  const [video, setVideo] = useState<{ url?: string; pct: number; naam: string } | null>(null);
  const [bezig, start] = useTransition();
  const [fout, setFout] = useState("");
  const [klaar, setKlaar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const kiesSjabloon = (n: string) => {
    setSjabloon(n);
    const s = SJABLONEN[n];
    setF((x) => ({ ...x, sub: s.sub, basis: s.basis.join("\n"), extra: s.extra.join("\n") }));
  };

  const jeVorm = (tekst: string) =>
    tekst
      .replace(/\bWilt u\b/g, "Wil je")
      .replace(/\bbetaalt u\b/g, "betaal je")
      .replace(/\bu houdt\b/g, "je houdt")
      .replace(/\buw\b/g, "je").replace(/\bUw\b/g, "Je").replace(/\bu\b/g, "je").replace(/\bU\b/g, "Je");

  const uploadVideo = async (file?: File) => {
    if (!file) return;
    setFout("");
    setVideo({ pct: 0, naam: file.name });
    try {
      const res = await upload(`demos/${Date.now()}.mp4`, file, {
        access: "public",
        handleUploadUrl: "/api/kompas/upload",
        multipart: file.size > 30 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setVideo((v) => ({ ...(v || { naam: file.name }), pct: Math.round(percentage) })),
      });
      setVideo({ url: res.url, pct: 100, naam: file.name });
    } catch (e) {
      setVideo(null);
      setFout(`Uploaden mislukt: ${(e as Error).message}`);
    }
  };

  const maak = () =>
    start(async () => {
      setFout("");
      try {
        const lijst = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
        const conv = f.aanspreken === "je" ? jeVorm : (x: string) => x;
        const r = await nieuwVoorstel({
          ...f,
          prijs: Number(f.prijs),
          normaal: Number(f.normaal),
          dagen: Number(f.dagen),
          videoUrl: video?.url,
          basis: lijst(f.basis).map(conv),
          extra: lijst(f.extra).map(conv),
          toelichting: conv(f.toelichting),
        });
        setKlaar(r.code);
      } catch (e) {
        setFout((e as Error).message);
      }
    });

  if (klaar) {
    const link = `${site}/voorstel/${klaar}`;
    const tekst = `${f.aanspreken === "je" ? "Hoi" : "Goedemiddag"}${f.contact ? ` ${f.contact.split(" ")[0]}` : ""}, zoals besproken hierbij ${f.aanspreken === "je" ? "je" : "uw"} persoonlijke voorstel met een korte video van ${f.aanspreken === "je" ? "je" : "uw"} nieuwe website: ${link}\n\nDe link is ${f.dagen} dagen geldig. Groet, Xaverio van Oravio`;
    const nr = f.telefoon.replace(/[^\d]/g, "").replace(/^0/, "31");
    return (
      <div className="mx-auto max-w-2xl">
        <div className="kp-kaart kp-in p-8 text-center md:p-12">
          <span className="bg-gradient-brand mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg">
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-[var(--ink)]">Voorstel staat klaar</h1>
          <p className="mt-2 text-[var(--slate)]">Voor {f.klant}, {f.dagen} dagen geldig.</p>
          <p className="mx-auto mt-6 max-w-md break-all rounded-xl bg-[#f6f9fb] px-4 py-3 font-mono text-sm text-[var(--navy)]">{link}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <KopieerKnop tekst={link} label="Link kopiëren" />
            <WhatsAppKnop href={`https://wa.me/${nr}?text=${encodeURIComponent(tekst)}`} label="Via WhatsApp sturen" />
            <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--navy)]">
              Bekijken
            </a>
          </div>
          {!video?.url && <p className="mt-6 text-xs text-[#c2681b]">Nog geen video: voeg die toe op de detailpagina.</p>}
          <Link href={`/kompas/voorstellen/${klaar}`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)]">
            Naar de lead <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display kp-in text-3xl font-semibold tracking-tight text-[var(--ink)]">Nieuw voorstel</h1>
      <p className="kp-in mt-1 text-[var(--slate)]">In een minuut klaar: klant, video, verzenden.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="kp-kaart kp-in space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>Naam van de zaak *</label>
              <input className={veld} value={f.klant} onChange={(e) => setF({ ...f, klant: e.target.value })} placeholder="Bijvoorbeeld Salon Bella" autoFocus />
            </div>
            <div>
              <label className={label}>Contactpersoon</label>
              <input className={veld} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
            </div>
            <div>
              <label className={label}>Telefoon (voor WhatsApp)</label>
              <input className={veld} value={f.telefoon} onChange={(e) => setF({ ...f, telefoon: e.target.value })} />
            </div>
          </div>

          <div>
            <p className={label}>Sjabloon</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(SJABLONEN).map((n) => (
                <button key={n} onClick={() => kiesSjabloon(n)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${sjabloon === n ? "bg-gradient-brand text-white" : "bg-white ring-1 ring-[var(--line)]"}`}>
                  <Wand2 className="h-3.5 w-3.5" /> {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>Ondertitel</label>
              <input className={veld} value={f.sub} onChange={(e) => setF({ ...f, sub: e.target.value })} />
            </div>
            <div>
              <label className={label}>Aanspreken</label>
              <div className="flex gap-2">
                {(["u", "je"] as const).map((x) => (
                  <button key={x} onClick={() => setF({ ...f, aanspreken: x })} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${f.aanspreken === x ? "bg-gradient-brand text-white" : "bg-white ring-1 ring-[var(--line)]"}`}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={label}>Geldig (dagen)</label>
              <div className="flex gap-2">
                {[3, 5, 7].map((d) => (
                  <button key={d} onClick={() => setF({ ...f, dagen: d })} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${f.dagen === d ? "bg-gradient-brand text-white" : "bg-white ring-1 ring-[var(--line)]"}`}>
                    {d}
                  </button>
                ))}
              </div>
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
              <label className={label}>Label</label>
              <input className={veld} value={f.aanbodLabel} onChange={(e) => setF({ ...f, aanbodLabel: e.target.value })} />
            </div>
            <div>
              <label className={label}>Wat betaalt de klant</label>
              <input className={veld} value={f.betaalt} onChange={(e) => setF({ ...f, betaalt: e.target.value })} />
            </div>
            <div>
              <label className={label}>Basisonderdelen</label>
              <textarea className={`${veld} min-h-[130px]`} value={f.basis} onChange={(e) => setF({ ...f, basis: e.target.value })} />
            </div>
            <div>
              <label className={label}>Extra uit Zakelijk</label>
              <textarea className={`${veld} min-h-[130px]`} value={f.extra} onChange={(e) => setF({ ...f, extra: e.target.value })} />
            </div>
          </div>
          {f.aanspreken === "je" && <p className="text-xs text-[var(--slate)]">De teksten worden bij het aanmaken automatisch in de je-vorm gezet.</p>}
        </section>

        <aside className="space-y-6">
          <section className="kp-kaart kp-in p-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
              <Film className="h-4 w-4" /> Demovideo
            </p>
            <input ref={fileRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => uploadVideo(e.target.files?.[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cfdbe5] bg-[#f7fafc] text-center transition hover:border-[var(--teal)]"
            >
              {video ? (
                video.url ? (
                  <>
                    <Check className="h-7 w-7 text-[#2f9e6e]" />
                    <span className="mt-2 text-sm font-medium text-[var(--ink)]">{video.naam}</span>
                    <span className="text-xs text-[var(--slate)]">Klik om te vervangen</span>
                  </>
                ) : (
                  <span className="w-3/4">
                    <span className="block text-sm text-[var(--ink)]">Uploaden… {video.pct}%</span>
                    <span className="mt-2 block h-2 overflow-hidden rounded-full bg-[#e3ebf1]">
                      <span className="bg-gradient-brand block h-full transition-all" style={{ width: `${video.pct}%` }} />
                    </span>
                  </span>
                )
              ) : (
                <>
                  <Upload className="h-7 w-7 text-[var(--teal)]" />
                  <span className="mt-2 text-sm font-medium text-[var(--ink)]">Video kiezen</span>
                  <span className="text-xs text-[var(--slate)]">mp4, mag later ook</span>
                </>
              )}
            </button>
          </section>

          <section className="kp-kaart kp-in p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Samenvatting</p>
            <p className="font-display mt-3 text-xl font-semibold text-[var(--ink)]">{f.klant || "Nieuwe klant"}</p>
            <p className="mt-1 text-sm text-[var(--slate)]">
              €{f.prijs} <s className="opacity-60">€{f.normaal}</s> · {f.dagen} dagen geldig · {f.aanspreken}-vorm
            </p>
            {fout && <p className="mt-4 rounded-xl bg-[#fff1ed] px-3 py-2 text-sm text-[#b8402b]">{fout}</p>}
            <button
              onClick={maak}
              disabled={bezig || !f.klant.trim() || (!!video && !video.url)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff7a66]/25 transition hover:scale-[1.01] disabled:opacity-40"
            >
              {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Voorstel aanmaken
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
