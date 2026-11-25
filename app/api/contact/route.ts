import { NextResponse } from "next/server";

// Contactformulier van oravio.nl, verstuurd via Resend (REST API, geen
// extra npm-pakket nodig). Benodigde omgevingsvariabelen in Vercel:
//   RESEND_API_KEY  verplicht, sleutel met "Sending access" voor send.oravio.nl
//   CONTACT_FROM    optioneel, standaard "Oravio website <website@send.oravio.nl>"
//   CONTACT_TO      optioneel, standaard "contact@oravio.nl"
// Zonder RESEND_API_KEY antwoordt deze route met 503 en valt het
// formulier in de browser terug op een mailto-link.

const FROM = process.env.CONTACT_FROM || "Oravio website <website@send.oravio.nl>";
const TO = process.env.CONTACT_TO || "contact@oravio.nl";

const TOPICS = ["Het Oravio-platform", "Een website op maat", "Iets anders"];

// Eenvoudige rem tegen misbruik: hooguit 5 berichten per IP per 10 minuten.
// Werkt per serverinstantie (best effort), voldoende voor een contactformulier.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek" }, { status: 400 });
  }

  // Honeypot: dit veld is onzichtbaar voor mensen. Is het ingevuld, dan is
  // het vrijwel zeker een bot. We doen alsof het gelukt is.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const topicRaw = clean(body.topic, 60);
  const topic = TOPICS.includes(topicRaw) ? topicRaw : "Iets anders";

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Vul je naam, een geldig e-mailadres en een bericht in." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Te veel berichten in korte tijd. Probeer het later opnieuw." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Versturen is nog niet ingesteld." }, { status: 503 });
  }

  const subject = `${topic} — ${company || name}`;
  const rows: [string, string][] = [
    ["Onderwerp", topic],
    ["Naam", name],
    ["Onderneming", company || "–"],
    ["E-mailadres", email],
  ];
  const html = `<!doctype html><html><body style="margin:0;background:#f6fafd;font-family:Inter,Arial,sans-serif;color:#16283a">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#1d6e7d;font-family:monospace">Nieuw bericht via oravio.nl</div>
    <h1 style="font-size:22px;margin:10px 0 20px">${escapeHtml(subject)}</h1>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #dde8f2;border-radius:12px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 14px;color:#54697c;font-size:13px;width:130px;border-bottom:1px solid #dde8f2">${k}</td><td style="padding:10px 14px;font-size:14px;border-bottom:1px solid #dde8f2">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <div style="margin-top:20px;background:#fff;border:1px solid #dde8f2;border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>
    <p style="font-size:12px;color:#54697c;margin-top:18px">Beantwoorden gaat rechtstreeks naar ${escapeHtml(email)}.</p>
  </div></body></html>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nBericht:\n${message}`;

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, html, text }),
    });
  } catch (err) {
    console.error("Resend niet bereikbaar", err);
    return NextResponse.json({ error: "Versturen is niet gelukt." }, { status: 502 });
  }

  if (!res.ok) {
    console.error("Resend fout", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Versturen is niet gelukt." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
