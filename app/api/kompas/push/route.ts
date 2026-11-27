import { NextResponse } from "next/server";
import { ingelogdVanRequest } from "@/lib/kompas-auth";
import { ntfyAan, pushAan, stuurMelding, vapidProbleem, VAPID_PUBLIEK, verwijder, voegToe } from "@/lib/push";

export async function GET(req: Request) {
  if (!ingelogdVanRequest(req)) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  return NextResponse.json({ aan: pushAan(), probleem: vapidProbleem(), sleutel: VAPID_PUBLIEK() || null, ntfy: ntfyAan() ? process.env.NTFY_TOPIC : null });
}

export async function POST(req: Request) {
  if (!ingelogdVanRequest(req)) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (b.actie === "test") {
    const n = await stuurMelding("Kompas werkt", "Je krijgt nu meldingen op dit apparaat.", "/kompas", "test");
    return NextResponse.json({ ok: true, verstuurd: n });
  }
  if (!pushAan()) return NextResponse.json({ error: "Meldingen zijn nog niet ingesteld." }, { status: 503 });
  if (!b.sub?.endpoint) return NextResponse.json({ error: "Ongeldig." }, { status: 400 });
  await voegToe(b.sub, String(b.apparaat || "apparaat"));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!ingelogdVanRequest(req)) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (b.endpoint) await verwijder(String(b.endpoint));
  return NextResponse.json({ ok: true });
}
