import Link from "next/link";
import { CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";
import { ACTIE, ACTIE_SCOPE, BEHEER_PLANS, WEBSITE_PACKAGES } from "@/lib/pricing";
import { SITE } from "@/lib/kompas-data";
import Meldingen from "@/components/kompas/Meldingen";

function Rij({ ok, titel, tekst }: { ok: boolean; titel: string; tekst: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
      {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2f9e6e]" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#f5a35b]" />}
      <div>
        <p className="font-medium text-[var(--ink)]">{titel}</p>
        <p className="text-sm text-[var(--slate)]">{tekst}</p>
      </div>
    </li>
  );
}

export default function Instellingen() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display kp-in text-3xl font-semibold tracking-tight text-[var(--ink)]">Instellingen</h1>
      <p className="kp-in mt-1 text-[var(--slate)]">Hoe alles is gekoppeld, en waar je wat aanpast.</p>

      <section className="kp-kaart kp-in mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">App en meldingen</h2>
        <div className="mt-4">
          <Meldingen />
        </div>
      </section>

      <section className="kp-kaart kp-in mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Koppelingen</h2>
        <ul className="mt-4 space-y-3">
          <Rij ok={!!process.env.BLOB_READ_WRITE_TOKEN} titel="Vercel Blob" tekst="Opslag voor statistieken, notities, intakes, foto's en video's." />
          <Rij ok={!!process.env.RESEND_API_KEY} titel="Resend" tekst="Meldingen per mail en bevestigingen naar klanten." />
          <Rij ok={!!process.env.OVERZICHT_SLEUTEL} titel="Wachtwoord Kompas" tekst="OVERZICHT_SLEUTEL. Wijzigen in Vercel logt alle apparaten uit." />
          <Rij ok={!!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)} titel="Pushmeldingen" tekst="VAPID_PUBLIC_KEY en VAPID_PRIVATE_KEY, voor meldingen op je telefoon." />
          <Rij ok={!!process.env.NTFY_TOPIC} titel="Meldingen via ntfy" tekst="NTFY_TOPIC, voor meldingen in de ntfy-app naast de Android-app." />
          <Rij ok={!!process.env.CONTACT_TO} titel="Ontvanger meldingen" tekst={process.env.CONTACT_TO || "Standaard: contact@oravio.nl (zet CONTACT_TO om te wijzigen)"} />
        </ul>
      </section>

      <section className="kp-kaart kp-in mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Actie en prijzen</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
            <p className="text-xs text-[var(--slate)]">Actie</p>
            <p className="font-display mt-1 text-xl font-semibold text-[var(--ink)]">{ACTIE.actief ? "Aan" : "Uit"}</p>
            <p className="text-xs text-[var(--slate)]">
              €{ACTIE.voor} i.p.v. €{ACTIE.van} + €{ACTIE.perMaand} p/m
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
            <p className="text-xs text-[var(--slate)]">Pakketten</p>
            <p className="mt-1 text-sm text-[var(--ink)]">{WEBSITE_PACKAGES.map((p) => `${p.name} €${p.price}`).join(" · ")}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
            <p className="text-xs text-[var(--slate)]">Beheer per maand</p>
            <p className="mt-1 text-sm text-[var(--ink)]">{BEHEER_PLANS.map((p) => `${p.name} €${p.perMonth}`).join(" · ")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--slate)]">
          Uurtarief buiten de actie: €{ACTIE_SCOPE.uurtarief}. Prijzen staan in <code className="rounded bg-[#eef3f7] px-1.5 py-0.5">lib/pricing.ts</code>; daar zet je de
          actie ook aan of uit. Die wijziging gaat via een nieuwe deploy, zodat de prijzen op de site altijd overeenkomen met je voorwaarden.
        </p>
      </section>

      <section className="kp-kaart kp-in mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Handige links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["Prijzenpagina", `${SITE}/prijzen`],
            ["Intakeformulier", `${SITE}/intake`],
            ["Vercel dashboard", "https://vercel.com/dashboard"],
            ["Resend", "https://resend.com/emails"],
          ].map(([l, h]) => (
            <Link key={l} href={h} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--navy)] ring-1 ring-[var(--line)] hover:text-[var(--teal)]">
              {l} <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>

      </section>
    </div>
  );
}
