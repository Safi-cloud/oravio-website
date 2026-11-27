import Link from "next/link";
import { ArrowRight, CalendarClock, Eye, Flame, Hourglass, Inbox, Play, Sparkles, Trophy } from "lucide-react";
import { BelKnop, KopieerKnop, VerlengKnop, WhatsAppKnop } from "@/components/kompas/Knoppen";
import { intakes, rijen, telLink, tijd, voorstelLink, waLink, WARMTE, whatsappTekst } from "@/lib/kompas-data";
import { LEAD_STATUSSEN } from "@/lib/voorstellen-live";
import { opslagAan } from "@/lib/store";

function groet() {
  const u = Number(new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam", hour: "numeric", hour12: false }));
  return u < 12 ? "Goedemorgen" : u < 18 ? "Goedemiddag" : "Goedenavond";
}

export default async function Vandaag() {
  const [alle, inbox] = await Promise.all([rijen(), intakes()]);
  const actief = alle.filter((r) => r.geldig || r.s.akkoord);
  const bellen = [...alle]
    .filter((r) => ["heet", "warm", "akkoord"].includes(r.w) && !["klant", "afgewezen"].includes(r.lead.status))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const verloopt = alle.filter((r) => r.urenOver > 0 && r.urenOver < 48 && !r.s.akkoord).sort((a, b) => a.urenOver - b.urenOver);
  const vandaag = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });
  const acties = alle.filter((r) => r.lead.volgende && r.lead.volgende <= vandaag && !["klant", "afgewezen"].includes(r.lead.status));
  const feed = alle
    .flatMap((r) => r.s.sessies.map((x) => ({ r, x })))
    .sort((a, b) => b.x.laatst.localeCompare(a.x.laatst))
    .slice(0, 12);

  const tot = alle.reduce(
    (t, { s }) => ({ geopend: t.geopend + (s.geopend > 0 ? 1 : 0), gestart: t.gestart + (s.gestart > 0 ? 1 : 0), afgekeken: t.afgekeken + (s.afgekeken > 0 ? 1 : 0), akkoord: t.akkoord + (s.akkoord ? 1 : 0) }),
    { geopend: 0, gestart: 0, afgekeken: 0, akkoord: 0 },
  );
  const funnel = [
    { label: "Verstuurd", n: alle.length, icon: ArrowRight },
    { label: "Geopend", n: tot.geopend, icon: Eye },
    { label: "Video gestart", n: tot.gestart, icon: Play },
    { label: "Afgekeken", n: tot.afgekeken, icon: Trophy },
    { label: "Akkoord", n: tot.akkoord, icon: Sparkles },
  ];
  const max = Math.max(1, funnel[0].n);
  const pipeline = LEAD_STATUSSEN.map((s) => ({ ...s, n: alle.filter((r) => r.lead.status === s.id).length }));
  const datum = new Date().toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam", weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="relative mx-auto max-w-6xl">
      <header className="kp-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--slate)]">{datum.charAt(0).toUpperCase() + datum.slice(1)}</p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">{groet()}, Xaverio</h1>
          <p className="mt-2 text-[var(--slate)]">
            {bellen.length > 0
              ? `${bellen.length} ${bellen.length === 1 ? "lead is" : "leads zijn"} warm. Bel ze vandaag.`
              : "Nog geen warme leads. Tijd om voorstellen te versturen."}
          </p>
        </div>
        <Link href="/kompas/nieuw" className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]">
          <Sparkles className="h-4 w-4" /> Nieuw voorstel
        </Link>
      </header>

      {!opslagAan() && (
        <p className="kp-in mt-6 rounded-2xl bg-[#fff6f3] px-5 py-4 text-sm text-[var(--navy)] ring-1 ring-[#ffd9cf]">
          Vercel Blob is nog niet gekoppeld. Je ziet de voorstellen, maar tellers, notities en wijzigingen worden pas bewaard na het koppelen.
        </p>
      )}

      {/* Kerncijfers */}
      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Actieve voorstellen", val: actief.length, icon: CalendarClock, kleur: "#2864a0" },
          { label: "Warm of heet", val: alle.filter((r) => r.w === "heet" || r.w === "warm").length, icon: Flame, kleur: "#ff7a66" },
          { label: "Akkoord", val: tot.akkoord, icon: Sparkles, kleur: "#2f9e6e" },
          { label: "Intakes open", val: inbox.filter((i) => !i.klaar).length, icon: Inbox, kleur: "#7a5af5" },
        ].map(({ label, val, icon: Icon, kleur }, i) => (
          <div key={label} className="kp-kaart kp-in p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${kleur}18`, color: kleur }}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="font-display mt-4 text-3xl font-semibold text-[var(--ink)]">{val}</p>
            <p className="text-xs text-[var(--slate)]">{label}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Nu bellen */}
        <section className="kp-kaart kp-in p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
              <Flame className="h-5 w-5 text-[#ff7a66]" /> Nu bellen
            </h2>
            <Link href="/kompas/voorstellen" className="text-xs font-semibold text-[var(--teal)]">
              Alle voorstellen
            </Link>
          </div>
          {bellen.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--slate)]">Zodra iemand de video bekijkt, verschijnt hij hier, met de beste kans bovenaan.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {bellen.map(({ v, s, lead, w }) => (
                <li key={v.code} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/kompas/voorstellen/${v.code}`} className="font-display font-semibold text-[var(--ink)] hover:text-[var(--teal)]">
                      {v.klant}
                    </Link>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: WARMTE[w].kleur, color: WARMTE[w].tekst }}>
                      {WARMTE[w].label}
                    </span>
                    <span className="ml-auto text-xs text-[var(--slate)]">{tijd(s.laatst)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--slate)]">
                    {s.geopend}× geopend · {s.gestart}× gestart · verst {s.maxPct}%{lead.contact ? ` · ${lead.contact}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <BelKnop href={telLink(lead.telefoon)} />
                    {lead.telefoon && <WhatsAppKnop href={waLink(lead.telefoon, whatsappTekst(v, lead.contact))} />}
                    <Link href={`/kompas/voorstellen/${v.code}`} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--teal)]">
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Funnel */}
        <section className="kp-kaart kp-in p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Van link tot klant</h2>
          <ul className="mt-5 space-y-3">
            {funnel.map(({ label, n, icon: Icon }, i) => {
              const pct = Math.round((n / max) * 100);
              const vorige = i > 0 ? funnel[i - 1].n : 0;
              return (
                <li key={label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[var(--navy)]">
                      <Icon className="h-4 w-4 text-[var(--teal)]" /> {label}
                    </span>
                    <span className="font-display font-semibold text-[var(--ink)]">
                      {n}
                      {i > 0 && vorige > 0 && <span className="ml-2 text-xs font-normal text-[var(--slate)]">{Math.round((n / vorige) * 100)}%</span>}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#eef3f7]">
                    <div className="bg-gradient-brand h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, n ? 4 : 0)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-[var(--line)] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Pijplijn</p>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#eef3f7]">
              {pipeline.filter((p) => p.n > 0).map((p) => (
                <span key={p.id} title={`${p.label}: ${p.n}`} style={{ width: `${(p.n / Math.max(1, alle.length)) * 100}%`, background: p.kleur }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {pipeline.filter((p) => p.n > 0).map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 text-xs text-[var(--slate)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.kleur }} /> {p.label} {p.n}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Taken en verlopen */}
        <section className="kp-kaart kp-in p-6">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
            <Hourglass className="h-5 w-5 text-[#f5a35b]" /> Aandacht nodig
          </h2>
          {acties.length === 0 && verloopt.length === 0 ? (
            <p className="mt-5 text-sm text-[var(--slate)]">Niets dat vandaag moet. Lekker bezig.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {acties.map(({ v, lead }) => (
                <li key={`a-${v.code}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4">
                  <span className="rounded-lg bg-[#eef3ff] px-2 py-1 text-[10px] font-bold uppercase text-[#2864a0]">Taak</span>
                  <Link href={`/kompas/voorstellen/${v.code}`} className="font-medium text-[var(--ink)]">
                    {v.klant}
                  </Link>
                  <span className="text-sm text-[var(--slate)]">{lead.volgendeTekst || "Opvolgen"}</span>
                </li>
              ))}
              {verloopt.map(({ v, urenOver }) => (
                <li key={`v-${v.code}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4">
                  <span className="rounded-lg bg-[#fff1e6] px-2 py-1 text-[10px] font-bold uppercase text-[#c2681b]">
                    Nog {urenOver < 24 ? `${Math.max(1, Math.round(urenOver))} uur` : "1 dag"}
                  </span>
                  <Link href={`/kompas/voorstellen/${v.code}`} className="font-medium text-[var(--ink)]">
                    {v.klant}
                  </Link>
                  <span className="ml-auto">
                    <VerlengKnop code={v.code} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Live activiteit */}
        <section className="kp-kaart kp-in p-6">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2f9e6e] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2f9e6e]" />
            </span>
            Activiteit
          </h2>
          {feed.length === 0 ? (
            <p className="mt-5 text-sm text-[var(--slate)]">Nog geen bezoeken gemeten.</p>
          ) : (
            <ol className="relative mt-5 space-y-4 border-l border-[var(--line)] pl-5">
              {feed.map(({ r, x }) => (
                <li key={`${r.v.code}-${x.id}`} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: x.afgekeken ? "#2f9e6e" : x.starts ? "#f5a35b" : "#94a3b8" }} />
                  <p className="text-sm text-[var(--ink)]">
                    <Link href={`/kompas/voorstellen/${r.v.code}`} className="font-semibold hover:text-[var(--teal)]">
                      {r.v.klant}
                    </Link>{" "}
                    {x.afgekeken ? "keek de video helemaal" : x.starts ? `keek tot ${x.maxPct}%` : "opende het voorstel"}
                  </p>
                  <p className="text-xs text-[var(--slate)]">
                    {tijd(x.laatst)} · {x.apparaat}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* Snel delen */}
      <section className="kp-kaart kp-in mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Snel delen</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {actief.slice(0, 6).map(({ v, lead }) => (
            <div key={v.code} className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--line)] bg-white p-3.5">
              <span className="mr-auto text-sm font-medium text-[var(--ink)]">{v.klant}</span>
              <KopieerKnop tekst={voorstelLink(v.code)} label="Link" />
              <WhatsAppKnop href={waLink(lead.telefoon, whatsappTekst(v, lead.contact))} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
