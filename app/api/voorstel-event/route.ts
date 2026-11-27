import { NextResponse } from "next/server";
import { isGeldig } from "@/lib/voorstellen";
import { vindLive } from "@/lib/voorstellen-live";
import { registreer, type Gebeurtenis } from "@/lib/stats";
import { stuurMelding } from "@/lib/push";

// Meldingen bij een voorstelpagina:
//   type "open"     klant opent de pagina (hooguit 1 mail per 30 minuten per voorstel)
//   type "bekeken"  klant heeft de video tot het einde gezien
//   type "akkoord"  klant klikt op "Ja, ik wil dit"
// Verstuurd via Resend, met dezelfde omgevingsvariabelen als het contactformulier.

const FROM = process.env.CONTACT_FROM || "Oravio website <website@send.oravio.nl>";
const TO = process.env.CONTACT_TO || "contact@oravio.nl";
const QUIET_MS = 30 * 60 * 1000;
const last = new Map<string, number>();

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function apparaat(ua: string) {
  if (/iphone|android.*mobile/i.test(ua)) return "telefoon";
  if (/ipad|tablet|android/i.test(ua)) return "tablet";
  return "computer";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }
  const code = clean(body.code, 80);
  const type = clean(body.type, 20);
  const v = await vindLive(code);
  if (!v || !isGeldig(v)) return NextResponse.json({ error: "Verlopen." }, { status: 410 });
  if (!["open", "start", "voortgang", "bekeken", "akkoord"].includes(type)) return NextResponse.json({ error: "Ongeldig." }, { status: 400 });

  const sessie = clean(body.sessie, 40);
  const device = apparaat(req.headers.get("user-agent") || "");
  const g: Gebeurtenis =
    type === "voortgang" ? { type: "voortgang", pct: Number(body.pct) || 0 } : ({ type } as Gebeurtenis);
  const stand = await registreer(code, sessie, device, g);

  // Starten en voortgang alleen tellen, daar komt geen mail van.
  if (type === "start" || type === "voortgang") return NextResponse.json({ ok: true });

  if (type !== "akkoord") {
    const key = `${code}:${type}`;
    const prev = last.get(key) ?? 0;
    if (Date.now() - prev < QUIET_MS) return NextResponse.json({ ok: true, stil: true });
    last.set(key, Date.now());
  }

  const naam = clean(body.naam, 100);
  const telefoon = clean(body.telefoon, 40);
  const opmerking = clean(body.opmerking, 1500);
  const tijd = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam", dateStyle: "full", timeStyle: "short" });

  const titel =
    type === "open"
      ? `Voorstel geopend: ${v.klant}`
      : type === "bekeken"
        ? `Video helemaal bekeken: ${v.klant}`
        : `Akkoord ontvangen: ${v.klant}`;
  const tip =
    type === "open"
      ? "Goed moment om binnen een uur te bellen of te appen."
      : type === "bekeken"
        ? "De klant heeft de hele video gezien. Bel nu, de interesse is warm."
        : "De klant wil verder. Neem vandaag contact op om de details af te stemmen.";

  const rijen: [string, string][] = [
    ["Klant", v.klant],
    ["Aanbod", `${v.aanbodLabel}: €${v.prijs} (normaal €${v.normaal})${v.prijs === 199 ? " + Beheer Zorgeloos €35 p/m" : ""}`],
    ["Wanneer", tijd],
    ["Apparaat", device],
  ];
  if (stand) {
    rijen.push([
      "Tot nu toe",
      `${stand.geopend}× geopend · video ${stand.gestart}× gestart · ${stand.afgekeken}× afgekeken · verst gekeken ${stand.maxPct}%`,
    ]);
  }
  if (naam) rijen.push(["Naam", naam]);
  if (telefoon) rijen.push(["Telefoon", telefoon]);
  if (opmerking) rijen.push(["Opmerking", opmerking]);

  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16283a">
  <div style="background:linear-gradient(135deg,#2864a0,#1d6e7d);color:#fff;padding:22px 26px;border-radius:14px 14px 0 0">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85">Oravio voorstel</div>
    <div style="font-size:20px;font-weight:700;margin-top:6px">${esc(titel)}</div>
  </div>
  <div style="border:1px solid #dde8f2;border-top:0;padding:22px 26px;border-radius:0 0 14px 14px;background:#fff">
    <p style="margin:0 0 16px;color:#1d6e7d;font-weight:600">${esc(tip)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rijen
      .map(([k, val]) => `<tr><td style="padding:8px 0;color:#4c6478;width:120px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;white-space:pre-wrap">${esc(val)}</td></tr>`)
      .join("")}</table>
  </div></div>`;
  const text = `${titel}\n${tip}\n\n${rijen.map(([k, val]) => `${k}: ${val}`).join("\n")}`;

  // Pushmelding naar het Kompas op je telefoon
  const pushTitel =
    type === "open" ? `${v.klant} opent je voorstel` : type === "bekeken" ? `${v.klant} keek de video helemaal` : `Akkoord van ${v.klant}!`;
  const pushTekst = [
    type === "akkoord" ? [naam, telefoon].filter(Boolean).join(" · ") || "Neem vandaag contact op." : tip,
    stand ? `${stand.geopend}× geopend · ${stand.afgekeken}× afgekeken · ${device}` : device,
  ].join("\n");
  await stuurMelding(pushTitel, pushTekst, `/kompas/voorstellen/${v.code}`, `${v.code}-${type}`);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: true, mail: false });
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], subject: titel, html, text }),
    });
    if (!res.ok) console.error("Resend fout", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("Resend niet bereikbaar", err);
  }
  return NextResponse.json({ ok: true });
}
