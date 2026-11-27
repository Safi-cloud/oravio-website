import VoorstellenLijst from "@/components/kompas/VoorstellenLijst";
import { rijen, tijd, voorstelLink, waLink, whatsappTekst, WARMTE } from "@/lib/kompas-data";
import { LEAD_STATUSSEN } from "@/lib/voorstellen-live";

export default async function Voorstellen() {
  const alle = (await rijen()).sort((a, b) => b.score - a.score);
  const items = alle.map(({ v, s, lead, geldig, w, urenOver }) => ({
    code: v.code,
    klant: v.klant,
    sub: v.sub,
    prijs: v.prijs,
    geldig,
    urenOver,
    status: lead.status,
    contact: lead.contact || "",
    telefoon: lead.telefoon || "",
    warmte: w,
    warmteLabel: WARMTE[w].label,
    warmteKleur: WARMTE[w].kleur,
    warmteTekst: WARMTE[w].tekst,
    geopend: s.geopend,
    gestart: s.gestart,
    afgekeken: s.afgekeken,
    maxPct: s.maxPct,
    laatst: tijd(s.laatst),
    link: voorstelLink(v.code),
    wa: waLink(lead.telefoon, whatsappTekst(v, lead.contact)),
  }));
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display kp-in text-3xl font-semibold tracking-tight text-[var(--ink)]">Voorstellen</h1>
      <p className="kp-in mt-1 text-[var(--slate)]">Gesorteerd op kans: de warmste bovenaan.</p>
      <VoorstellenLijst items={items} statussen={LEAD_STATUSSEN} />
    </div>
  );
}
