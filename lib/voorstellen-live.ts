import "server-only";
import { VOORSTELLEN, type Voorstel } from "@/lib/voorstellen";
import { leesJson, schrijfJson } from "@/lib/store";

// Voorstellen zoals ze nu gelden: de basislijst uit de code plus alles wat in het Kompas is aangepast of toegevoegd.

export type LeadStatus = "nieuw" | "gebeld" | "link-gestuurd" | "bekeken" | "afspraak" | "klant" | "afgewezen";
export const LEAD_STATUSSEN: { id: LeadStatus; label: string; kleur: string }[] = [
  { id: "nieuw", label: "Nieuw", kleur: "#94a3b8" },
  { id: "gebeld", label: "Gebeld", kleur: "#5b8def" },
  { id: "link-gestuurd", label: "Link gestuurd", kleur: "#2864a0" },
  { id: "bekeken", label: "Bekeken", kleur: "#f5a35b" },
  { id: "afspraak", label: "Afspraak", kleur: "#ff7a66" },
  { id: "klant", label: "Klant", kleur: "#2f9e6e" },
  { id: "afgewezen", label: "Afgewezen", kleur: "#c0c8d2" },
];

export type Lead = {
  status: LeadStatus;
  contact?: string;
  telefoon?: string;
  email?: string;
  plaats?: string;
  volgende?: string; // datum (YYYY-MM-DD) voor de volgende actie
  volgendeTekst?: string;
  log: { t: string; tekst: string }[];
};

type Data = { wijzigingen: Record<string, Partial<Voorstel>>; leads: Record<string, Lead> };
const LEEG: Data = { wijzigingen: {}, leads: {} };

export async function leesData(): Promise<Data> {
  const d = await leesJson<Data>("voorstellen", LEEG);
  return { wijzigingen: d.wijzigingen || {}, leads: d.leads || {} };
}
export async function schrijfData(d: Data) {
  await schrijfJson("voorstellen", d);
}

export async function alleVoorstellen(opts: { ookVerborgen?: boolean } = {}): Promise<Voorstel[]> {
  const { wijzigingen } = await leesData();
  const basis = VOORSTELLEN.map((v) => ({ ...v, ...(wijzigingen[v.code] || {}) }));
  const eigen = Object.values(wijzigingen).filter((w) => w.eigen && w.code && !VOORSTELLEN.some((v) => v.code === w.code)) as Voorstel[];
  const lijst = [...eigen, ...basis];
  return opts.ookVerborgen ? lijst : lijst.filter((v) => !v.verborgen);
}

export async function vindLive(code: string): Promise<Voorstel | undefined> {
  return (await alleVoorstellen({ ookVerborgen: false })).find((v) => v.code === code);
}

export function leegLead(): Lead {
  return { status: "nieuw", log: [] };
}
