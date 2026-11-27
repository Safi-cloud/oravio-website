import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ingelogdVanRequest } from "@/lib/kompas-auth";

// Upload van demovideo's vanuit het Kompas, rechtstreeks naar Vercel Blob.
export async function POST(req: Request) {
  if (!ingelogdVanRequest(req)) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Vercel Blob is niet gekoppeld." }, { status: 503 });
  try {
    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("demos/")) throw new Error("Ongeldig pad.");
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
