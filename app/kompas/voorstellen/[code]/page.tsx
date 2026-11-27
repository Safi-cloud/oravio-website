import { notFound } from "next/navigation";
import VoorstelDetail from "@/components/kompas/VoorstelDetail";
import { rijen, tijd, voorstelLink, waLink, whatsappTekst, WARMTE } from "@/lib/kompas-data";
import { LEAD_STATUSSEN } from "@/lib/voorstellen-live";

export default async function Detail({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const r = (await rijen()).find((x) => x.v.code === code);
  if (!r) notFound();
  const { v, s, lead, geldig, w } = r;
  return (
    <VoorstelDetail
      v={v}
      lead={lead}
      geldig={geldig}
      geldigTotTekst={tijd(v.geldigTot, true)}
      warmte={{ ...WARMTE[w] }}
      stats={{
        geopend: s.geopend,
        gestart: s.gestart,
        afgekeken: s.afgekeken,
        maxPct: s.maxPct,
        eerste: tijd(s.eerste, true),
        laatst: tijd(s.laatst),
        akkoord: s.akkoord ? tijd(s.akkoord, true) : "",
      }}
      sessies={s.sessies.map((x) => ({ ...x, wanneer: tijd(x.start, true) }))}
      logboek={lead.log.map((l) => ({ ...l, wanneer: tijd(l.t, true) }))}
      link={voorstelLink(v.code)}
      wa={waLink(lead.telefoon, whatsappTekst(v, lead.contact))}
      waTekst={whatsappTekst(v, lead.contact)}
      statussen={LEAD_STATUSSEN}
    />
  );
}
