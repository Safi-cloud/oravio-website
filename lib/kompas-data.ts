import "server-only";
import { isGeldig, type Voorstel } from "@/lib/voorstellen";
import { alleVoorstellen, leegLead, leesData, type Lead } from "@/lib/voorstellen-live";
import { leesStats, type Stats } from "@/lib/stats";
import { leesJson } from "@/lib/store";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://oravio.nl";

export type Warmte = "akkoord" | "heet" | "warm" | "bekeken" | "koud";
export const WARMTE: Record<Warmte, { label: string; kleur: string; tekst: string }> = {
  akkoord: { label: "Akkoord", kleur: "#2f9e6e", tekst: "#ffffff" },
  heet: { label: "Heet", kleur: "#ff7a66", tekst: "#ffffff" },
  warm: { label: "Warm", kleur: "#f5a35b", tekst: "#ffffff" },
  bekeken: { label: "Geopend", kleur: "#dbeafe", tekst: "#1d4f86" },
  koud: { label: "Nog niet geopend", kleur: "#eef3f7", tekst: "#4c6478" },
};

export function warmte(s: Stats): Warmte {
  if (s.akkoord) return "akkoord";
  if (s.afgekeken > 0 && s.geopend > 1) return "heet";
  if (s.afgekeken > 0 || s.maxPct >= 50) return "warm";
  if (s.geopend > 0) return "bekeken";
  return "koud";
}

export function score(s: Stats) {
  const recent = s.laatst ? Math.max(0, 72 - (Date.now() - new Date(s.laatst).getTime()) / 3_600_000) : 0;
  return (s.akkoord ? 500 : 0) + s.afgekeken * 40 + s.geopend * 8 + s.gestart * 10 + s.maxPct / 2 + recent;
}

export type Rij = { v: Voorstel; s: Stats; lead: Lead; geldig: boolean; w: Warmte; score: number; urenOver: number };

export async function rijen(): Promise<Rij[]> {
  const [lijst, data] = await Promise.all([alleVoorstellen(), leesData()]);
  const out = await Promise.all(
    lijst.map(async (v) => {
      const s = await leesStats(v.code);
      return {
        v,
        s,
        lead: { ...leegLead(), ...(data.leads[v.code] || {}) },
        geldig: isGeldig(v),
        w: warmte(s),
        score: score(s),
        urenOver: (new Date(v.geldigTot).getTime() - Date.now()) / 3_600_000,
      };
    }),
  );
  return out;
}

export type Intake = {
  id: string;
  datum: string;
  code: string | null;
  klant: string | null;
  velden: [string, string][];
  logo: { url: string; naam: string } | null;
  fotos: { url: string; naam: string }[];
  extra: { url: string; naam: string }[];
  klaar?: boolean;
};
export async function intakes() {
  return leesJson<Intake[]>("intakes", []);
}

export function tijd(iso?: string, lang = false) {
  if (!iso) return "nog niet";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 60000;
  if (!lang) {
    if (diff < 1) return "zojuist";
    if (diff < 60) return `${Math.round(diff)} min geleden`;
    if (diff < 60 * 24) return `${Math.round(diff / 60)} uur geleden`;
  }
  return d.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function voorstelLink(code: string) {
  return `${SITE}/voorstel/${code}`;
}
export function whatsappTekst(v: Voorstel, naam?: string) {
  const je = v.aanspreken === "je";
  const aanhef = naam ? `${je ? "Hoi" : "Beste"} ${naam.split(" ")[0]}` : je ? "Hoi" : "Goedemiddag";
  return `${aanhef}, zoals besproken ${je ? "stuur ik je" : "stuur ik u"} hierbij ${je ? "je" : "uw"} persoonlijke voorstel met een korte video van ${je ? "je" : "uw"} nieuwe website: ${voorstelLink(v.code)}\n\nDe link is een paar dagen geldig. Groet, Xaverio van Oravio`;
}
export function telLink(t?: string) {
  return t ? `tel:${t.replace(/[^\d+]/g, "")}` : undefined;
}
export function waLink(t: string | undefined, tekst: string) {
  const n = (t || "").replace(/[^\d]/g, "").replace(/^0/, "31");
  return `https://wa.me/${n}?text=${encodeURIComponent(tekst)}`;
}
