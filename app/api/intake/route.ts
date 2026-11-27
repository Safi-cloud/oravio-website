import { NextResponse } from "next/server";
import { vindLive } from "@/lib/voorstellen-live";
import { ACTIE } from "@/lib/pricing";
import { leesJson, opslagAan, schrijfJson } from "@/lib/store";
import { stuurMelding } from "@/lib/push";

// Ontvangt het intakeformulier en mailt alles naar Oravio, plus een bevestiging naar de klant.
const FROM = process.env.CONTACT_FROM || "Oravio website <website@send.oravio.nl>";
const TO = process.env.CONTACT_TO || "contact@oravio.nl";
const DAGEN = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

type Dag = { open: boolean; van: string; tot: string };
type Bestand = { url: string; naam: string };

function s(v: unknown, max = 300) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function esc(x: string) {
  return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function blobUrl(u: unknown) {
  return typeof u === "string" && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u) ? u : "";
}
function bestanden(v: unknown, max: number): Bestand[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, max)
    .map((b) => ({ url: blobUrl((b as Bestand)?.url), naam: s((b as Bestand)?.naam, 120) }))
    .filter((b) => b.url);
}

async function mail(to: string[], subject: string, html: string, text: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) console.error("Resend fout", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }
  if (s(b.website)) return NextResponse.json({ ok: true }); // honeypot

  const bedrijf = s(b.bedrijf, 120);
  const contact = s(b.contact, 120);
  const email = s(b.email, 160);
  const telefoon = s(b.telefoon, 40);
  if (!bedrijf || !contact || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !telefoon) {
    return NextResponse.json({ error: "Vul bedrijfsnaam, naam, e-mail en telefoon in." }, { status: 400 });
  }
  if (b.akkoord !== true) return NextResponse.json({ error: "Ga akkoord met de afspraken." }, { status: 400 });

  const code = s(b.code, 80);
  const v = code ? await vindLive(code) : undefined;
  const actie = !!v && ACTIE.actief && v.prijs === ACTIE.voor;
  const je = v?.aanspreken === "je";

  const tijden = Array.isArray(b.tijden) ? (b.tijden as Dag[]).slice(0, 7) : [];
  const opAfspraak = b.opAfspraak === true;
  const tijdTekst = opAfspraak
    ? "Alleen op afspraak"
    : tijden.map((d, i) => `${DAGEN[i]}: ${d?.open ? `${s(d.van, 5)} tot ${s(d.tot, 5)}` : "gesloten"}`).join("\n");
  const logo = bestanden(b.logo ? [b.logo] : [], 1)[0];
  const fotos = bestanden(b.fotos, 12);
  const extra = bestanden(b.extraBestanden, 5);

  const velden: [string, string][] = [
    ["Voorstel", v ? `${v.klant} (${code})${actie ? `, actie €${ACTIE.voor} + Zorgeloos €${ACTIE.perMaand} p/m` : ""}` : "Geen, algemene intake"],
    ["Bedrijf", bedrijf],
    ["Contactpersoon", contact],
    ["E-mail", email],
    ["Telefoon", telefoon],
    ["Adres", [s(b.adres, 160), [s(b.postcode, 10), s(b.plaats, 80)].filter(Boolean).join(" ")].filter(Boolean).join(", ")],
    ["KvK", s(b.kvk, 20)],
    ["Huidige website", s(b.huidigeSite, 200)],
    ["Domein", s(b.domein, 120)],
    ["Domeinbeheer", s(b.domeinBeheer, 200)],
    ["Instagram", s(b.instagram, 200)],
    ["Facebook", s(b.facebook, 200)],
    ["Google Bedrijfsprofiel", s(b.google, 300)],
    ["Openingstijden", tijdTekst],
    ["Prijzen", s(b.prijzen, 4000)],
    ["Diensten", s(b.diensten, 4000)],
    ["Over de zaak", s(b.overOns, 4000)],
    ["Kleuren", s(b.kleuren, 300)],
    ["Video-links", s(b.videoLinks, 1000)],
    ["Wensen", s(b.wensen, 3000)],
  ].filter(([, val]) => val) as [string, string][];

  const rij = ([k, val]: [string, string]) =>
    `<tr><td style="padding:9px 0;color:#4c6478;width:150px;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;white-space:pre-wrap">${esc(val)}</td></tr>`;
  const thumbs = fotos
    .map(
      (f) =>
        `<a href="${f.url}" style="display:inline-block;margin:0 8px 8px 0"><img src="${f.url}" alt="${esc(f.naam)}" width="120" style="width:120px;height:90px;object-fit:cover;border-radius:8px;border:1px solid #dde8f2"/></a>`,
    )
    .join("");
  const links = (arr: Bestand[]) => arr.map((f) => `<li><a href="${f.url}">${esc(f.naam || f.url)}</a></li>`).join("");

  const titel = `Intake ontvangen: ${bedrijf}`;
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#16283a">
  <div style="background:linear-gradient(135deg,#2864a0,#1d6e7d);color:#fff;padding:22px 26px;border-radius:14px 14px 0 0">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85">Oravio intake</div>
    <div style="font-size:20px;font-weight:700;margin-top:6px">${esc(titel)}</div>
  </div>
  <div style="border:1px solid #dde8f2;border-top:0;padding:22px 26px;border-radius:0 0 14px 14px;background:#fff">
    <table style="width:100%;border-collapse:collapse;font-size:14px">${velden.map(rij).join("")}</table>
    ${logo ? `<h3 style="margin:22px 0 8px;font-size:15px">Logo</h3><a href="${logo.url}">${esc(logo.naam || "Logo openen")}</a>` : ""}
    ${fotos.length ? `<h3 style="margin:22px 0 10px;font-size:15px">Foto's (${fotos.length})</h3>${thumbs}<ul style="font-size:13px;padding-left:18px">${links(fotos)}</ul>` : ""}
    ${extra.length ? `<h3 style="margin:22px 0 8px;font-size:15px">Overige bestanden</h3><ul style="font-size:13px;padding-left:18px">${links(extra)}</ul>` : ""}
  </div></div>`;
  const text = `${titel}\n\n${velden.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nLogo: ${logo?.url || "-"}\nFoto's:\n${fotos.map((f) => f.url).join("\n")}\n${extra.length ? `Overig:\n${extra.map((f) => f.url).join("\n")}` : ""}`;

  await mail([TO], titel, html, text, email);
  await stuurMelding(`Intake binnen: ${bedrijf}`, `${fotos.length} foto's${logo ? " en logo" : ""} · ${contact}`, "/kompas/intakes", `intake-${bedrijf}`);

  // Bewaren voor het Kompas, zodat alles ook daar terug te vinden is.
  if (opslagAan()) {
    try {
      const lijst = await leesJson<unknown[]>("intakes", []);
      lijst.unshift({
        id: Math.random().toString(36).slice(2, 10),
        datum: new Date().toISOString(),
        code: code || null,
        klant: v?.klant || null,
        velden,
        logo: logo || null,
        fotos,
        extra,
      });
      await schrijfJson("intakes", lijst.slice(0, 300));
    } catch (err) {
      console.error("Intake bewaren mislukt", err);
    }
  }

  const voornaam = contact.split(" ")[0];
  const u = je ? { u: "je", uw: "je", U: "Je" } : { u: "u", uw: "uw", U: "U" };
  const bevestigHtml = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16283a">
  <div style="background:linear-gradient(135deg,#2864a0,#1d6e7d);color:#fff;padding:24px 26px;border-radius:14px 14px 0 0">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85">Oravio</div>
    <div style="font-size:21px;font-weight:700;margin-top:6px">Alles is binnen, ${esc(voornaam)}!</div>
  </div>
  <div style="border:1px solid #dde8f2;border-top:0;padding:24px 26px;border-radius:0 0 14px 14px;background:#fff;font-size:15px;line-height:1.6">
    <p style="margin:0 0 14px">Dank ${u.u} wel voor het aanleveren van de materialen voor ${esc(bedrijf)}. We hebben ${fotos.length} foto${fotos.length === 1 ? "" : "'s"}${logo ? " en " + u.uw + " logo" : ""} ontvangen.</p>
    <p style="margin:0 0 6px;font-weight:600">Zo gaat het verder</p>
    <ol style="margin:0 0 16px;padding-left:20px">
      <li>We verwerken alles in ${u.uw} nieuwe website.</li>
      <li>Binnen 2 weken krijgt ${u.u} een link om de site te bekijken.</li>
      <li>${u.U} geeft ${u.uw} opmerkingen in één keer door, wij passen alles aan.</li>
      <li>We zetten de site live op ${u.uw} eigen domein.</li>
    </ol>
    <p style="margin:0">Vergeten iets mee te sturen? Beantwoord deze mail gewoon, dan voegen we het toe.</p>
    <p style="margin:18px 0 0;color:#4c6478">Met vriendelijke groet,<br/>Xaverio, Oravio</p>
  </div></div>`;
  await mail([email], `We hebben ${u.uw} materialen ontvangen`, bevestigHtml, `Alles is binnen, ${voornaam}! We verwerken alles en binnen 2 weken krijgt ${u.u} een link om de site te bekijken.`, TO.split(",")[0]);

  return NextResponse.json({ ok: true });
}
