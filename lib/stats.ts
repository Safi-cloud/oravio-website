import "server-only";
import { createHash } from "crypto";
import { get, put } from "@vercel/blob";

// Statistieken per voorstel, opgeslagen als klein JSON-bestand in Vercel Blob.
// De bestandsnaam bevat een hash met het Blob-token, zodat niemand hem kan raden.

export type Sessie = {
  id: string;
  start: string;
  laatst: string;
  apparaat: string;
  starts: number;
  maxPct: number;
  afgekeken: number;
};
export type Stats = {
  code: string;
  geopend: number;
  gestart: number;
  afgekeken: number;
  maxPct: number;
  eerste?: string;
  laatst?: string;
  akkoord?: string;
  sessies: Sessie[];
};

const leeg = (code: string): Stats => ({ code, geopend: 0, gestart: 0, afgekeken: 0, maxPct: 0, sessies: [] });

export const statsAan = () => !!process.env.BLOB_READ_WRITE_TOKEN;

function pad(code: string) {
  const h = createHash("sha256").update(`${process.env.BLOB_READ_WRITE_TOKEN}:${code}`).digest("hex").slice(0, 20);
  return `stats/${code}-${h}.json`;
}

export async function leesStats(code: string): Promise<Stats> {
  if (!statsAan()) return leeg(code);
  try {
    const r = await get(pad(code), { access: "public", useCache: false });
    if (!r || r.statusCode !== 200 || !r.stream) return leeg(code);
    const txt = await new Response(r.stream).text();
    return { ...leeg(code), ...JSON.parse(txt) };
  } catch {
    return leeg(code);
  }
}

async function schrijf(s: Stats) {
  await put(pad(s.code), JSON.stringify(s), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export type Gebeurtenis =
  | { type: "open" }
  | { type: "start" }
  | { type: "voortgang"; pct: number }
  | { type: "bekeken" }
  | { type: "akkoord" };

// Werkt de teller bij en geeft de nieuwe stand terug. Fouten worden genegeerd: meten mag nooit de pagina breken.
export async function registreer(code: string, sessieId: string, apparaat: string, g: Gebeurtenis): Promise<Stats | null> {
  if (!statsAan()) return null;
  try {
    const s = await leesStats(code);
    const nu = new Date().toISOString();
    const id = (sessieId || "onbekend").slice(0, 40);
    let ses = s.sessies.find((x) => x.id === id);
    if (!ses) {
      ses = { id, start: nu, laatst: nu, apparaat, starts: 0, maxPct: 0, afgekeken: 0 };
      s.sessies.unshift(ses);
      s.sessies = s.sessies.slice(0, 60);
    }
    ses.laatst = nu;
    s.eerste ??= nu;
    s.laatst = nu;

    if (g.type === "open") s.geopend++;
    if (g.type === "start") {
      s.gestart++;
      ses.starts++;
    }
    if (g.type === "voortgang") {
      const p = Math.max(0, Math.min(100, Math.round(g.pct)));
      ses.maxPct = Math.max(ses.maxPct, p);
      s.maxPct = Math.max(s.maxPct, p);
    }
    if (g.type === "bekeken") {
      s.afgekeken++;
      ses.afgekeken++;
      ses.maxPct = 100;
      s.maxPct = 100;
    }
    if (g.type === "akkoord") s.akkoord = nu;
    await schrijf(s);
    return s;
  } catch (err) {
    console.error("Stats bijwerken mislukt", err);
    return null;
  }
}
