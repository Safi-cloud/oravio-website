import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Geeft de browser een kortlevend token om logo en foto's rechtstreeks naar Vercel Blob te uploaden.
// Zo gaan grote bestanden niet door de server (die heeft een limiet van 4,5 MB per verzoek).
// Vereist de omgevingsvariabele BLOB_READ_WRITE_TOKEN (Vercel > Storage > Blob > Create).

const TOEGESTAAN = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/svg+xml",
  "application/pdf",
];
const perIp = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Uploaden is nog niet ingesteld." }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  const now = Date.now();
  const r = perIp.get(ip);
  if (r && now - r.t < 60 * 60 * 1000) {
    if (r.n > 60) return NextResponse.json({ error: "Te veel uploads. Probeer het later opnieuw." }, { status: 429 });
    r.n++;
  } else perIp.set(ip, { n: 1, t: now });

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("intake/")) throw new Error("Ongeldig pad.");
        return {
          allowedContentTypes: TOEGESTAAN,
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "Upload mislukt." }, { status: 400 });
  }
}
