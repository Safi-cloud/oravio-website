import "server-only";
import { createHash } from "crypto";
import { get, put } from "@vercel/blob";

// Kleine JSON-opslag in Vercel Blob voor het Kompas. De bestandsnaam bevat een geheime hash.
export const opslagAan = () => !!process.env.BLOB_READ_WRITE_TOKEN;

function pad(naam: string) {
  const h = createHash("sha256").update(`${process.env.BLOB_READ_WRITE_TOKEN}:kompas:${naam}`).digest("hex").slice(0, 24);
  return `kompas/${naam}-${h}.json`;
}

export async function leesJson<T>(naam: string, standaard: T): Promise<T> {
  if (!opslagAan()) return standaard;
  try {
    const r = await get(pad(naam), { access: "public", useCache: false });
    if (!r || r.statusCode !== 200 || !r.stream) return standaard;
    return JSON.parse(await new Response(r.stream).text()) as T;
  } catch {
    return standaard;
  }
}

export async function schrijfJson(naam: string, data: unknown) {
  if (!opslagAan()) throw new Error("Vercel Blob is niet gekoppeld.");
  await put(pad(naam), JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
