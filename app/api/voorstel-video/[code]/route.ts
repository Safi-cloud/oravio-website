import { createReadStream, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { isGeldig } from "@/lib/voorstellen";
import { vindLive } from "@/lib/voorstellen-live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Streamt de video alleen zolang de link geldig is. Ondersteunt Range-verzoeken (nodig voor Safari en iPhone).
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await vindLive(code);
  if (!v || !isGeldig(v)) return new Response("Deze link is verlopen.", { status: 410 });

  // Video geüpload via het Kompas: doorgeven vanuit Vercel Blob, met ondersteuning voor Range.
  if (v.videoUrl) {
    const range = req.headers.get("range");
    const r = await fetch(v.videoUrl, { headers: range ? { Range: range } : {} });
    if (!r.ok && r.status !== 206) return new Response("Niet gevonden.", { status: 404 });
    const h = new Headers({
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "Content-Disposition": "inline",
      "X-Robots-Tag": "noindex",
    });
    for (const k of ["content-length", "content-range"]) {
      const val = r.headers.get(k);
      if (val) h.set(k, val);
    }
    return new Response(r.body, { status: r.status, headers: h });
  }

  const file = path.join(process.cwd(), "private", "demos", v.video);
  let size: number;
  try {
    size = statSync(file).size;
  } catch {
    return new Response("Niet gevonden.", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "Content-Disposition": "inline",
    "X-Robots-Tag": "noindex",
  };

  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? Math.min(parseInt(m[2], 10), size - 1) : Math.min(start + 2_000_000, size - 1);
    if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    const stream = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }

  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(stream, { status: 200, headers: { ...headers, "Content-Length": String(size) } });
}
