"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, ingelogd, klopt, token } from "@/lib/kompas-auth";
import { alleVoorstellen, leegLead, leesData, schrijfData, type Lead, type LeadStatus } from "@/lib/voorstellen-live";
import { leesJson, schrijfJson } from "@/lib/store";
import type { Voorstel } from "@/lib/voorstellen";

const pogingen = new Map<string, { n: number; t: number }>();

export async function inloggen(_: unknown, form: FormData) {
  const k = "login";
  const p = pogingen.get(k);
  if (p && Date.now() - p.t < 10 * 60 * 1000 && p.n >= 8) return { fout: "Te veel pogingen. Probeer het over 10 minuten opnieuw." };
  if (!klopt(String(form.get("sleutel") || ""))) {
    pogingen.set(k, { n: (p && Date.now() - p.t < 10 * 60 * 1000 ? p.n : 0) + 1, t: Date.now() });
    return { fout: "Dat wachtwoord klopt niet." };
  }
  pogingen.delete(k);
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/kompas");
}

export async function uitloggen() {
  (await cookies()).delete(COOKIE);
  redirect("/kompas");
}

async function eis() {
  if (!(await ingelogd())) throw new Error("Niet ingelogd.");
}

function vernieuw(code?: string) {
  revalidatePath("/kompas", "layout");
  if (code) revalidatePath(`/voorstel/${code}`);
}

const nu = () => new Date().toISOString();

export async function verlengen(code: string, dagen: number) {
  await eis();
  const d = await leesData();
  const v = (await alleVoorstellen({ ookVerborgen: true })).find((x) => x.code === code);
  if (!v) throw new Error("Voorstel niet gevonden.");
  const basis = Math.max(Date.now(), new Date(v.geldigTot).getTime());
  const nieuw = new Date(basis + dagen * 86_400_000);
  // Altijd eindigen om 23:59 Nederlandse tijd
  const datum = nieuw.toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });
  const geldigTot = `${datum}T23:59:00+01:00`;
  d.wijzigingen[code] = { ...(d.wijzigingen[code] || {}), geldigTot };
  const lead = d.leads[code] || leegLead();
  lead.log.unshift({ t: nu(), tekst: `Link verlengd tot ${datum}` });
  d.leads[code] = lead;
  await schrijfData(d);
  vernieuw(code);
  return { geldigTot };
}

export async function zetGeldigTot(code: string, datum: string) {
  await eis();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) throw new Error("Ongeldige datum.");
  const d = await leesData();
  d.wijzigingen[code] = { ...(d.wijzigingen[code] || {}), geldigTot: `${datum}T23:59:00+01:00` };
  await schrijfData(d);
  vernieuw(code);
}

const TEKSTVELDEN = ["klant", "sub", "demoLabel", "extraUit", "aanbodLabel", "betaalt", "toelichting"] as const;

export async function voorstelOpslaan(code: string, invoer: Partial<Voorstel>) {
  await eis();
  const d = await leesData();
  const w: Partial<Voorstel> = { ...(d.wijzigingen[code] || {}) };
  for (const k of TEKSTVELDEN) if (typeof invoer[k] === "string") (w as Record<string, unknown>)[k] = String(invoer[k]).slice(0, 400);
  if (typeof invoer.prijs === "number" && invoer.prijs >= 0) w.prijs = Math.round(invoer.prijs);
  if (typeof invoer.normaal === "number" && invoer.normaal >= 0) w.normaal = Math.round(invoer.normaal);
  if (invoer.aanspreken === "u" || invoer.aanspreken === "je") w.aanspreken = invoer.aanspreken;
  if (Array.isArray(invoer.basis)) w.basis = invoer.basis.map((x) => String(x).slice(0, 200)).filter(Boolean).slice(0, 12);
  if (Array.isArray(invoer.extra)) w.extra = invoer.extra.map((x) => String(x).slice(0, 200)).filter(Boolean).slice(0, 12);
  if (typeof invoer.videoUrl === "string" && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(invoer.videoUrl)) w.videoUrl = invoer.videoUrl;
  if (typeof invoer.verborgen === "boolean") w.verborgen = invoer.verborgen;
  d.wijzigingen[code] = w;
  await schrijfData(d);
  vernieuw(code);
}

export async function leadOpslaan(code: string, invoer: Partial<Lead> & { notitie?: string }) {
  await eis();
  const d = await leesData();
  const lead: Lead = { ...leegLead(), ...(d.leads[code] || {}) };
  if (invoer.status && invoer.status !== lead.status) {
    lead.log.unshift({ t: nu(), tekst: `Status: ${invoer.status}` });
    lead.status = invoer.status as LeadStatus;
  }
  for (const k of ["contact", "telefoon", "email", "plaats", "volgende", "volgendeTekst"] as const) {
    if (typeof invoer[k] === "string") lead[k] = String(invoer[k]).slice(0, 200);
  }
  if (invoer.notitie && invoer.notitie.trim()) lead.log.unshift({ t: nu(), tekst: invoer.notitie.trim().slice(0, 1000) });
  lead.log = lead.log.slice(0, 100);
  d.leads[code] = lead;
  await schrijfData(d);
  vernieuw();
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function nieuwVoorstel(invoer: {
  klant: string;
  sub: string;
  aanspreken: "u" | "je";
  prijs: number;
  normaal: number;
  aanbodLabel: string;
  betaalt: string;
  dagen: number;
  videoUrl?: string;
  extra: string[];
  basis: string[];
  toelichting: string;
  contact?: string;
  telefoon?: string;
}) {
  await eis();
  if (!invoer.klant?.trim()) throw new Error("Vul de naam van de klant in.");
  const d = await leesData();
  const code = `${slug(invoer.klant)}-${Math.random().toString(36).slice(2, 6)}`;
  const datum = new Date(Date.now() + Math.max(1, invoer.dagen || 3) * 86_400_000).toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });
  const v: Voorstel = {
    code,
    klant: invoer.klant.trim().slice(0, 120),
    sub: (invoer.sub || "").slice(0, 200),
    video: "",
    videoUrl: invoer.videoUrl,
    geldigTot: `${datum}T23:59:00+01:00`,
    demoLabel: "Website Zakelijk",
    basis: invoer.basis.filter(Boolean).slice(0, 12),
    extra: invoer.extra.filter(Boolean).slice(0, 12),
    extraUit: "Zakelijk",
    aanbodLabel: invoer.aanbodLabel || "Tijdelijke actie",
    betaalt: invoer.betaalt || "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: Math.round(invoer.prijs),
    normaal: Math.round(invoer.normaal),
    toelichting: (invoer.toelichting || "").slice(0, 400),
    aanspreken: invoer.aanspreken,
    eigen: true,
  };
  d.wijzigingen[code] = v;
  d.leads[code] = {
    ...leegLead(),
    status: "link-gestuurd",
    contact: invoer.contact,
    telefoon: invoer.telefoon,
    log: [{ t: nu(), tekst: "Voorstel aangemaakt" }],
  };
  await schrijfData(d);
  vernieuw();
  return { code };
}

export async function verwijderVoorstel(code: string) {
  await eis();
  const d = await leesData();
  if (d.wijzigingen[code]?.eigen) {
    delete d.wijzigingen[code];
    delete d.leads[code];
  } else {
    d.wijzigingen[code] = { ...(d.wijzigingen[code] || {}), verborgen: true };
  }
  await schrijfData(d);
  vernieuw(code);
  redirect("/kompas/voorstellen");
}

export async function intakeAfvinken(id: string, klaar: boolean) {
  await eis();
  const lijst = await leesJson<{ id: string; klaar?: boolean }[]>("intakes", []);
  const i = lijst.find((x) => x.id === id);
  if (i) i.klaar = klaar;
  await schrijfJson("intakes", lijst);
  vernieuw();
}
