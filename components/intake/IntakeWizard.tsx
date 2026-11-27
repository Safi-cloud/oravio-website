"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Globe,
  ImagePlus,
  Loader2,
  Lock,
  PenLine,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { ACTIE, ACTIE_SCOPE } from "@/lib/pricing";

type Dag = { open: boolean; van: string; tot: string };
type Bestand = { id: string; naam: string; url?: string; preview?: string; voortgang: number; fout?: string };

const DAGEN = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const MAX_FOTOS = 10;
const KLEUREN = [
  { naam: "Zacht roze", hex: "#e9b8c4" },
  { naam: "Lila", hex: "#b7a3dc" },
  { naam: "Turquoise", hex: "#5fc3c8" },
  { naam: "Diepblauw", hex: "#2864a0" },
  { naam: "Groen", hex: "#2f9e6e" },
  { naam: "Zand", hex: "#d8c3a5" },
  { naam: "Goud", hex: "#c9a24a" },
  { naam: "Koraal", hex: "#ff7a66" },
  { naam: "Antraciet", hex: "#3d4650" },
];

const STAPPEN = [
  { id: "zaak", titel: "Je zaak", icon: Building2 },
  { id: "online", titel: "Online", icon: Globe },
  { id: "tijden", titel: "Tijden en prijzen", icon: Clock },
  { id: "beeld", titel: "Logo en foto's", icon: ImagePlus },
  { id: "tekst", titel: "Teksten en wensen", icon: PenLine },
  { id: "check", titel: "Versturen", icon: Send },
] as const;

const leegTijden = (): Dag[] =>
  DAGEN.map((_, i) => ({ open: i < 5, van: "09:00", tot: i === 4 ? "17:00" : "17:30" }));

type Form = {
  bedrijf: string;
  contact: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  plaats: string;
  kvk: string;
  huidigeSite: string;
  domein: string;
  domeinBeheer: string;
  instagram: string;
  facebook: string;
  google: string;
  opAfspraak: boolean;
  tijden: Dag[];
  prijzen: string;
  diensten: string;
  overOns: string;
  kleuren: string[];
  kleurEigen: string;
  videoLinks: string;
  wensen: string;
};

const leegForm = (bedrijf = ""): Form => ({
  bedrijf,
  contact: "",
  email: "",
  telefoon: "",
  adres: "",
  postcode: "",
  plaats: "",
  kvk: "",
  huidigeSite: "",
  domein: "",
  domeinBeheer: "",
  instagram: "",
  facebook: "",
  google: "",
  opAfspraak: false,
  tijden: leegTijden(),
  prijzen: "",
  diensten: "",
  overOns: "",
  kleuren: [],
  kleurEigen: "",
  videoLinks: "",
  wensen: "",
});

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Verkleint grote foto's in de browser voordat ze geüpload worden: sneller en zuiniger.
async function verklein(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.5 * 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const max = 2400;
    const schaal = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * schaal);
    c.height = Math.round(bmp.height * schaal);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function veilig(naam: string) {
  return naam.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").slice(-60);
}

export default function IntakeWizard({
  code,
  klant,
  je = false,
  actie = false,
}: {
  code?: string;
  klant?: string;
  je?: boolean;
  actie?: boolean;
}) {
  const t = je
    ? { u: "je", uw: "je", U: "Je", Uw: "Je", heeft: "heb", kunt: "kunt", wilt: "wilt" }
    : { u: "u", uw: "uw", U: "U", Uw: "Uw", heeft: "heeft", kunt: "kunt", wilt: "wilt" };
  const opslagKey = `oravio-intake-${code || "algemeen"}`;

  const [stap, setStap] = useState(0);
  const [form, setForm] = useState<Form>(() => leegForm(klant || ""));
  const [logo, setLogo] = useState<Bestand | null>(null);
  const [fotos, setFotos] = useState<Bestand[]>([]);
  const [akkoord, setAkkoord] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [fout, setFout] = useState("");
  const [uploadUit, setUploadUit] = useState(false);
  const [sleep, setSleep] = useState<"logo" | "fotos" | null>(null);
  const [geladen, setGeladen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Concept bewaren in de browser, zodat de klant later verder kan.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(opslagKey);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.form) setForm((f) => ({ ...f, ...d.form }));
        if (d.logo?.url) setLogo(d.logo);
        if (Array.isArray(d.fotos)) setFotos(d.fotos.filter((f: Bestand) => f.url));
        if (typeof d.stap === "number") setStap(Math.min(d.stap, STAPPEN.length - 1));
      }
    } catch {}
    setGeladen(true);
  }, [opslagKey]);

  useEffect(() => {
    if (!geladen || status === "sent") return;
    try {
      localStorage.setItem(
        opslagKey,
        JSON.stringify({
          form,
          stap,
          logo: logo?.url ? { ...logo, preview: logo.url } : null,
          fotos: fotos.filter((f) => f.url).map((f) => ({ ...f, preview: f.url })),
        }),
      );
    } catch {}
  }, [form, stap, logo, fotos, geladen, status, opslagKey]);

  const zet = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const uploadBestand = useCallback(
    async (file: File, soort: "logo" | "foto", update: (b: Partial<Bestand>) => void) => {
      try {
        const klaar = await verklein(file);
        const map = veilig(form.bedrijf || klant || "klant") || "klant";
        const res = await upload(`intake/${map}/${soort}-${veilig(klaar.name)}`, klaar, {
          access: "public",
          handleUploadUrl: "/api/intake/upload",
          onUploadProgress: ({ percentage }) => update({ voortgang: Math.round(percentage) }),
        });
        update({ url: res.url, voortgang: 100 });
      } catch (e) {
        setUploadUit(true);
        update({ fout: "Uploaden mislukt", voortgang: 0 });
      }
    },
    [form.bedrijf, klant],
  );

  const kiesLogo = (files: FileList | File[] | null) => {
    const file = files && Array.from(files)[0];
    if (!file) return;
    const b: Bestand = { id: uid(), naam: file.name, preview: URL.createObjectURL(file), voortgang: 1 };
    setLogo(b);
    uploadBestand(file, "logo", (p) => setLogo((cur) => (cur && cur.id === b.id ? { ...cur, ...p } : cur)));
  };

  const kiesFotos = (files: FileList | File[] | null) => {
    if (!files) return;
    const vrij = MAX_FOTOS - fotos.length;
    const lijst = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, vrij));
    const nieuw = lijst.map((f) => ({ id: uid(), naam: f.name, preview: URL.createObjectURL(f), voortgang: 1 }) as Bestand);
    setFotos((cur) => [...cur, ...nieuw]);
    nieuw.forEach((b, i) =>
      uploadBestand(lijst[i], "foto", (p) => setFotos((cur) => cur.map((x) => (x.id === b.id ? { ...x, ...p } : x)))),
    );
  };

  const bezig = (logo && !logo.url && !logo.fout) || fotos.some((f) => !f.url && !f.fout);

  const geldig = useMemo(() => {
    const e = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    return [
      !!form.bedrijf.trim() && !!form.contact.trim() && e && form.telefoon.trim().length >= 8,
      true,
      true,
      true,
      true,
      akkoord && !bezig,
    ];
  }, [form, akkoord, bezig]);

  const ga = (n: number) => {
    setStap(n);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const verstuur = async () => {
    setStatus("sending");
    setFout("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kleuren: [...form.kleuren, form.kleurEigen].filter(Boolean).join(", "),
          code,
          akkoord,
          logo: logo?.url ? { url: logo.url, naam: logo.naam } : null,
          fotos: fotos.filter((f) => f.url).map((f) => ({ url: f.url, naam: f.naam })),
          website: (document.getElementById("intake-hp") as HTMLInputElement | null)?.value || "",
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Versturen mislukt.");
      setStatus("sent");
      try {
        localStorage.removeItem(opslagKey);
      } catch {}
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    } catch (e) {
      setStatus("error");
      setFout((e as Error).message);
    }
  };

  const voortgang = Math.round(((stap + (geldig[stap] ? 1 : 0.4)) / STAPPEN.length) * 100);
  const hoofdfoto = fotos.find((f) => f.preview || f.url);
  const accent = KLEUREN.find((k) => form.kleuren.includes(k.naam))?.hex || "#1d6e7d";

  if (status === "sent") {
    return (
      <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-28">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white p-8 text-center shadow-[0_40px_90px_-60px_rgba(15,40,65,0.5)] md:p-14">
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className="intake-confetti absolute block h-2 w-2 rounded-sm"
                style={{
                  left: `${(i * 37) % 100}%`,
                  background: ["#ff7a66", "#2f9e6e", "#2864a0", "#f5a35b", "#8fd6c2"][i % 5],
                  animationDelay: `${(i % 7) * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="bg-gradient-brand relative mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </span>
          <h2 className="font-display relative mt-6 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
            Alles is binnen{form.contact ? `, ${form.contact.split(" ")[0]}` : ""}!
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--slate)]">
            {t.U} ontvangt een bevestiging per mail. Wij gaan aan de slag met {t.uw} nieuwe website.
          </p>
          <ol className="relative mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
            {[
              ["Wij bouwen", `We verwerken ${t.uw} logo, foto's en gegevens.`],
              ["Binnen 2 weken", `${t.U} krijgt een link om de site te bekijken.`],
              ["Live", `Na ${t.uw} opmerkingen zetten we de site op ${t.uw} domein.`],
            ].map(([k, v], i) => (
              <li key={k} className="rounded-2xl border border-[var(--line)] bg-[#f7fafc] p-5">
                <span className="font-mono-label text-[11px] text-[var(--teal)]">0{i + 1}</span>
                <p className="font-display mt-2 font-semibold text-[var(--ink)]">{k}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--slate)]">{v}</p>
              </li>
            ))}
          </ol>
          <Link href="/" className="relative mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)]">
            Terug naar oravio.nl <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const veld = "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-[15px] text-[var(--ink)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/10";
  const label = "mb-1.5 block text-sm font-medium text-[var(--navy)]";
  const hint = "mt-1.5 text-xs text-[var(--slate)]";

  return (
    <div ref={topRef} className="mx-auto grid max-w-6xl scroll-mt-28 gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Stappenbalk */}
        <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-3 backdrop-blur md:p-4">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STAPPEN.map((s, i) => {
              const Icon = s.icon;
              const actief = i === stap;
              const klaar = i < stap;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => (i <= stap || geldig.slice(0, i).every(Boolean)) && ga(i)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    actief ? "bg-gradient-brand text-white shadow" : klaar ? "text-[var(--teal)] hover:bg-[var(--sky-deep)]" : "text-[var(--slate)]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      actief ? "bg-white/20" : klaar ? "bg-[var(--sky-deep)]" : "bg-[#eef3f7]"
                    }`}
                  >
                    {klaar ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className={actief ? "" : "hidden"}>{s.id === "zaak" ? `${t.Uw} zaak` : s.titel}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eef3f7]">
            <div className="bg-gradient-brand h-full rounded-full transition-all duration-500" style={{ width: `${voortgang}%` }} />
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_40px_90px_-70px_rgba(15,40,65,0.5)] md:p-10">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--teal)]">
            Stap {stap + 1} van {STAPPEN.length}
          </p>

          {stap === 0 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">Over {t.uw} zaak</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Deze gegevens komen op de site en in Google.</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>Bedrijfsnaam *</label>
                  <input className={veld} value={form.bedrijf} onChange={(e) => zet("bedrijf", e.target.value)} autoComplete="organization" />
                </div>
                <div>
                  <label className={label}>{t.Uw} naam *</label>
                  <input className={veld} value={form.contact} onChange={(e) => zet("contact", e.target.value)} autoComplete="name" />
                </div>
                <div>
                  <label className={label}>Telefoon *</label>
                  <input className={veld} type="tel" value={form.telefoon} onChange={(e) => zet("telefoon", e.target.value)} autoComplete="tel" />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>E-mail *</label>
                  <input className={veld} type="email" value={form.email} onChange={(e) => zet("email", e.target.value)} autoComplete="email" />
                  <p className={hint}>Hier komen ook de aanvragen van {t.uw} websiteformulier binnen.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Adres</label>
                  <input className={veld} value={form.adres} onChange={(e) => zet("adres", e.target.value)} autoComplete="street-address" placeholder="Straat en huisnummer" />
                </div>
                <div>
                  <label className={label}>Postcode</label>
                  <input className={veld} value={form.postcode} onChange={(e) => zet("postcode", e.target.value)} autoComplete="postal-code" />
                </div>
                <div>
                  <label className={label}>Plaats</label>
                  <input className={veld} value={form.plaats} onChange={(e) => zet("plaats", e.target.value)} autoComplete="address-level2" />
                </div>
                <div>
                  <label className={label}>KvK-nummer</label>
                  <input className={veld} inputMode="numeric" value={form.kvk} onChange={(e) => zet("kvk", e.target.value)} />
                  <p className={hint}>Verplicht op een zakelijke website, staat straks netjes in de footer.</p>
                </div>
              </div>
            </section>
          )}

          {stap === 1 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">{t.Uw} plek online</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Zo koppelen we {t.uw} domein en blijft {t.uw} plek in Google behouden.</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label}>Huidige website</label>
                  <input className={veld} value={form.huidigeSite} onChange={(e) => zet("huidigeSite", e.target.value)} placeholder="www.mijnzaak.nl" />
                </div>
                <div>
                  <label className={label}>Domein voor de nieuwe site</label>
                  <input className={veld} value={form.domein} onChange={(e) => zet("domein", e.target.value)} placeholder="Hetzelfde, of een nieuwe naam" />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Waar staat {t.uw} domein nu?</label>
                  <div className="flex flex-wrap gap-2">
                    {["Strato", "TransIP", "Hostnet", "Mijndomein", "Versio", "One.com", "Weet ik niet"].map((x) => (
                      <button
                        type="button"
                        key={x}
                        onClick={() => zet("domeinBeheer", form.domeinBeheer === x ? "" : x)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          form.domeinBeheer === x ? "border-transparent bg-[var(--teal)] text-white" : "border-[var(--line)] text-[var(--navy)] hover:border-[var(--teal)]"
                        }`}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                  <p className={hint}>Geen zorgen als {t.u} het niet weet: wij zoeken het uit. Wachtwoorden nooit hier invullen.</p>
                </div>
                <div>
                  <label className={label}>Instagram</label>
                  <input className={veld} value={form.instagram} onChange={(e) => zet("instagram", e.target.value)} placeholder="@mijnzaak" />
                </div>
                <div>
                  <label className={label}>Facebook</label>
                  <input className={veld} value={form.facebook} onChange={(e) => zet("facebook", e.target.value)} placeholder="facebook.com/mijnzaak" />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Link naar {t.uw} Google-bedrijfsprofiel</label>
                  <input className={veld} value={form.google} onChange={(e) => zet("google", e.target.value)} placeholder="Voor reviews op de site, mag leeg blijven" />
                </div>
              </div>
            </section>
          )}

          {stap === 2 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">Openingstijden en prijzen</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Klopt dit straks niet meer? Dan passen wij het aan, dat zit in het beheer.</p>

              <label className="mt-7 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[#f7fafc] px-5 py-4">
                <span>
                  <span className="block font-medium text-[var(--ink)]">Alleen op afspraak</span>
                  <span className="text-xs text-[var(--slate)]">Dan tonen we geen vaste tijden.</span>
                </span>
                <span className={`relative h-7 w-12 rounded-full transition ${form.opAfspraak ? "bg-[var(--teal)]" : "bg-[#cfdbe5]"}`}>
                  <input type="checkbox" className="sr-only" checked={form.opAfspraak} onChange={(e) => zet("opAfspraak", e.target.checked)} />
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${form.opAfspraak ? "left-6" : "left-1"}`} />
                </span>
              </label>

              {!form.opAfspraak && (
                <div className="mt-4 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)]">
                  {form.tijden.map((d, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <span className="w-8 font-display text-sm font-semibold text-[var(--ink)]">{DAGEN[i]}</span>
                      <button
                        type="button"
                        onClick={() => zet("tijden", form.tijden.map((x, j) => (j === i ? { ...x, open: !x.open } : x)))}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${d.open ? "bg-[#e6f5ee] text-[#1f6b52]" : "bg-[#f1f4f7] text-[var(--slate)]"}`}
                      >
                        {d.open ? "Open" : "Gesloten"}
                      </button>
                      {d.open && (
                        <div className="ml-auto flex items-center gap-2 text-sm text-[var(--slate)]">
                          <input
                            type="time"
                            value={d.van}
                            onChange={(e) => zet("tijden", form.tijden.map((x, j) => (j === i ? { ...x, van: e.target.value } : x)))}
                            className="rounded-lg border border-[var(--line)] px-2 py-1.5 text-[var(--ink)]"
                          />
                          tot
                          <input
                            type="time"
                            value={d.tot}
                            onChange={(e) => zet("tijden", form.tijden.map((x, j) => (j === i ? { ...x, tot: e.target.value } : x)))}
                            className="rounded-lg border border-[var(--line)] px-2 py-1.5 text-[var(--ink)]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!form.opAfspraak && (
                <button
                  type="button"
                  onClick={() => zet("tijden", form.tijden.map((x) => ({ ...x, van: form.tijden[0].van, tot: form.tijden[0].tot })))}
                  className="mt-3 text-xs font-semibold text-[var(--teal)]"
                >
                  Tijden van maandag voor alle open dagen gebruiken
                </button>
              )}

              <div className="mt-7">
                <label className={label}>Prijzen</label>
                <textarea
                  className={`${veld} min-h-[140px]`}
                  value={form.prijzen}
                  onChange={(e) => zet("prijzen", e.target.value)}
                  placeholder={"Bijvoorbeeld:\nKnippen dames  €32,50\nKleuren vanaf  €55"}
                />
                <p className={hint}>Een prijslijst op papier? Maak er een foto van en voeg die toe bij de foto's.</p>
              </div>
            </section>
          )}

          {stap === 3 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">Logo en foto&apos;s</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">
                Tot {MAX_FOTOS} foto&apos;s zitten in de actie. Wij snijden ze bij en maken ze scherp. Foto&apos;s van {t.uw} zaak, {t.uw} werk en {t.uw} team werken het best.
              </p>

              {uploadUit && (
                <div className="mt-5 rounded-2xl border border-[#ffd9cf] bg-[#fff6f3] px-5 py-4 text-sm text-[var(--navy)]">
                  Uploaden lukt op dit moment niet. Ga gerust verder: {t.u} kunt {t.uw} foto&apos;s ook via WhatsApp of WeTransfer sturen. Zet de link hieronder bij video&apos;s.
                </div>
              )}

              {/* Logo */}
              <div className="mt-7 grid gap-5 md:grid-cols-[220px_1fr]">
                <div>
                  <p className={label}>Logo</p>
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setSleep("logo");
                    }}
                    onDragLeave={() => setSleep(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setSleep(null);
                      kiesLogo(e.dataTransfer.files);
                    }}
                    className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition ${
                      sleep === "logo" ? "border-[var(--teal)] bg-[var(--sky-deep)]" : "border-[#cfdbe5] bg-[#f7fafc] hover:border-[var(--teal)]"
                    }`}
                  >
                    <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => kiesLogo(e.target.files)} />
                    {logo?.preview || logo?.url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.preview || logo.url} alt="Logo" className="h-full w-full object-contain p-5" />
                        <Voortgang b={logo} />
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-[var(--teal)]" />
                        <span className="mt-2 text-sm font-medium text-[var(--ink)]">Logo kiezen</span>
                        <span className="mt-0.5 text-xs text-[var(--slate)]">of hierheen slepen</span>
                      </>
                    )}
                  </label>
                  {logo && (
                    <button type="button" onClick={() => setLogo(null)} className="mt-2 text-xs font-semibold text-[var(--slate)] hover:text-[#e85c44]">
                      Logo verwijderen
                    </button>
                  )}
                  <p className={hint}>Geen logo? Dan maken we een nette naamopmaak.</p>
                </div>

                {/* Foto's */}
                <div>
                  <p className={label}>
                    Foto&apos;s <span className="text-[var(--slate)]">({fotos.length}/{MAX_FOTOS})</span>
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {fotos.map((f) => (
                      <div key={f.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-[var(--line)] bg-[#f7fafc]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.preview || f.url} alt={f.naam} className="h-full w-full object-cover" />
                        <Voortgang b={f} />
                        <button
                          type="button"
                          aria-label="Foto verwijderen"
                          onClick={() => setFotos((cur) => cur.filter((x) => x.id !== f.id))}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] opacity-100 shadow transition md:opacity-0 md:group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {fotos.length < MAX_FOTOS && (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setSleep("fotos");
                        }}
                        onDragLeave={() => setSleep(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setSleep(null);
                          kiesFotos(e.dataTransfer.files);
                        }}
                        className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${
                          sleep === "fotos" ? "border-[var(--teal)] bg-[var(--sky-deep)]" : "border-[#cfdbe5] bg-[#f7fafc] hover:border-[var(--teal)]"
                        }`}
                      >
                        <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => kiesFotos(e.target.files)} />
                        <ImagePlus className="h-6 w-6 text-[var(--teal)]" />
                        <span className="mt-1.5 px-2 text-xs font-medium text-[var(--ink)]">Foto&apos;s toevoegen</span>
                      </label>
                    )}
                  </div>
                  <p className={hint}>Direct vanaf {t.uw} telefoon kan ook. Grote foto&apos;s verkleinen we automatisch.</p>
                </div>
              </div>

              <div className="mt-7">
                <label className={label}>Video&apos;s of een map met beelden</label>
                <textarea
                  className={`${veld} min-h-[90px]`}
                  value={form.videoLinks}
                  onChange={(e) => zet("videoLinks", e.target.value)}
                  placeholder="Plak hier een link van WeTransfer, Google Drive, Dropbox of YouTube"
                />
              </div>
            </section>
          )}

          {stap === 4 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">Teksten en wensen</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Steekwoorden zijn genoeg. Wij maken er mooie teksten van.</p>
              <div className="mt-7 space-y-5">
                <div>
                  <label className={label}>Diensten of behandelingen</label>
                  <textarea className={`${veld} min-h-[110px]`} value={form.diensten} onChange={(e) => zet("diensten", e.target.value)} placeholder="Wat biedt de zaak aan? Waar is men in gespecialiseerd?" />
                </div>
                <div>
                  <label className={label}>Over de zaak</label>
                  <textarea className={`${veld} min-h-[110px]`} value={form.overOns} onChange={(e) => zet("overOns", e.target.value)} placeholder="Sinds wanneer, wie werken er, wat maakt de zaak bijzonder?" />
                </div>
                <div>
                  <p className={label}>Kleuren die bij de zaak passen</p>
                  <div className="flex flex-wrap gap-2">
                    {KLEUREN.map((k) => {
                      const aan = form.kleuren.includes(k.naam);
                      return (
                        <button
                          key={k.naam}
                          type="button"
                          onClick={() => zet("kleuren", aan ? form.kleuren.filter((x) => x !== k.naam) : [...form.kleuren, k.naam].slice(-3))}
                          className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition ${
                            aan ? "border-[var(--ink)] bg-white shadow-sm" : "border-[var(--line)] text-[var(--navy)] hover:border-[var(--teal)]"
                          }`}
                        >
                          <span className="h-6 w-6 rounded-full ring-1 ring-black/5" style={{ background: k.hex }} />
                          {k.naam}
                          {aan && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                  <input className={`${veld} mt-3`} value={form.kleurEigen} onChange={(e) => zet("kleurEigen", e.target.value)} placeholder="Of beschrijf het zelf, bijvoorbeeld de kleuren uit het logo" />
                  <p className={hint}>Kies er maximaal drie.</p>
                </div>
                <div>
                  <label className={label}>Nog andere wensen of opmerkingen?</label>
                  <textarea className={`${veld} min-h-[100px]`} value={form.wensen} onChange={(e) => zet("wensen", e.target.value)} />
                </div>
              </div>
            </section>
          )}

          {stap === 5 && (
            <section>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">Even controleren</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">Klopt alles? Dan versturen we het in één keer naar ons.</p>

              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  ["Zaak", form.bedrijf],
                  ["Contact", [form.contact, form.telefoon].filter(Boolean).join(", ")],
                  ["E-mail", form.email],
                  ["Adres", [form.adres, form.postcode, form.plaats].filter(Boolean).join(" ")],
                  ["Domein", form.domein || form.huidigeSite],
                  ["Openingstijden", form.opAfspraak ? "Alleen op afspraak" : `${form.tijden.filter((d) => d.open).length} dagen open`],
                  ["Logo", logo?.url ? "Ontvangen" : logo ? "Bezig met uploaden" : "Geen"],
                  ["Foto's", `${fotos.filter((f) => f.url).length} van ${fotos.length} geüpload`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-[var(--line)] bg-[#f7fafc] px-4 py-3">
                    <dt className="text-xs text-[var(--slate)]">{k}</dt>
                    <dd className="mt-0.5 truncate text-sm font-medium text-[var(--ink)]">{v || "Niet ingevuld"}</dd>
                  </div>
                ))}
              </dl>

              <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] p-5 transition hover:border-[var(--teal)]">
                <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--teal)]" />
                <span className="text-sm leading-relaxed text-[var(--navy)]">
                  Ik ga akkoord met de{" "}
                  <Link href="/prijzen#afspraken" target="_blank" className="font-semibold text-[var(--teal)] underline underline-offset-2">
                    afspraken
                  </Link>
                  {actie ? (
                    <>
                      , waaronder Beheer Zorgeloos voor €{ACTIE.perMaand} per maand via automatische incasso, de eerste {ACTIE.maanden} maanden verplicht.
                      Wat buiten de actie valt, kost €{ACTIE_SCOPE.uurtarief} per uur, altijd met vooraf een prijs.
                    </>
                  ) : (
                    "."
                  )}{" "}
                  Ik mag de aangeleverde foto&apos;s en teksten gebruiken.
                </span>
              </label>
              {actie && (
                <p className="mt-3 flex items-center gap-2 text-xs text-[var(--slate)]">
                  <Lock className="h-3.5 w-3.5" /> Voor de incasso ontvangt {t.u} apart een veilige link. Bankgegevens vullen {t.u} hier niet in.
                </p>
              )}

              <input id="intake-hp" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {status === "error" && <p className="mt-4 rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#b8402b]">{fout}</p>}
            </section>
          )}

          {/* Navigatie */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            {stap > 0 ? (
              <button type="button" onClick={() => ga(stap - 1)} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--slate)] hover:text-[var(--ink)]">
                <ArrowLeft className="h-4 w-4" /> Terug
              </button>
            ) : (
              <span className="text-xs text-[var(--slate)]">Wordt automatisch bewaard op dit apparaat.</span>
            )}
            {stap < STAPPEN.length - 1 ? (
              <button
                type="button"
                disabled={!geldig[stap]}
                onClick={() => ga(stap + 1)}
                className="bg-gradient-brand flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Volgende <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!geldig[5] || status === "sending"}
                onClick={verstuur}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff7a66] to-[#f5a35b] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff7a66]/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {bezig ? "Even wachten op uploads" : "Alles versturen"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live voorproefje */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="font-mono-label mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--teal)]" /> Live voorproefje
          </p>
          <div className="overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-white shadow-[0_30px_70px_-45px_rgba(15,40,65,0.55)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--line)] bg-[#f7fafc] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff8a7a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f5c35b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#8fd6c2]" />
              <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-[var(--slate)]">
                {form.domein || form.huidigeSite || "jouwzaak.nl"}
              </span>
            </div>
            <div className="relative h-40 overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)` }}>
              {hoofdfoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hoofdfoto.preview || hoofdfoto.url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
                {(logo?.preview || logo?.url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.preview || logo.url} alt="" className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow" />
                )}
                <p className="font-display text-lg font-semibold leading-tight text-[var(--ink)]">{form.bedrijf || klant || "Jouw zaak"}</p>
              </div>
            </div>
            <div className="space-y-2 p-4">
              <span className="block h-2 w-4/5 rounded-full bg-[#eef3f7]" />
              <span className="block h-2 w-3/5 rounded-full bg-[#eef3f7]" />
              <div className="flex gap-2 pt-2">
                <span className="h-7 flex-1 rounded-full" style={{ background: accent }} />
                <span className="h-7 w-16 rounded-full border border-[var(--line)]" />
              </div>
              {fotos.length > 1 && (
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  {fotos.slice(1, 4).map((f) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f.id} src={f.preview || f.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--slate)]">
            Een eerste indruk. De echte site bouwen wij in de stijl van de demo, met {t.uw} eigen beelden.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Voortgang({ b }: { b: Bestand }) {
  if (b.fout)
    return <span className="absolute inset-x-1.5 bottom-1.5 rounded-lg bg-[#fff1ed] px-2 py-1 text-center text-[10px] font-semibold text-[#b8402b]">{b.fout}</span>;
  if (b.url)
    return (
      <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2f9e6e] text-white shadow">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  return (
    <span className="absolute inset-x-2 bottom-2 h-1.5 overflow-hidden rounded-full bg-white/80">
      <span className="bg-gradient-brand block h-full transition-all" style={{ width: `${Math.max(6, b.voortgang)}%` }} />
    </span>
  );
}
