"use client";

import Link from "next/link";
import { useState } from "react";

const CONTACT_EMAIL = "contact@oravio.nl";

export default function ContactForm({ initialTopic = "Het Oravio-platform" }: { initialTopic?: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState(initialTopic);

  const [website, setWebsite] = useState(""); // honeypot, onzichtbaar voor mensen
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  function mailtoHref() {
    const subject = encodeURIComponent(`${topic} — ${company || name}`);
    const body = encodeURIComponent(
      `Onderwerp: ${topic}\nNaam: ${name}\nOnderneming: ${company}\nE-mailadres: ${email}\n\nBericht:\n${message}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, message, topic, hp_controle: website }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      // Nog niet ingesteld op de server: val terug op het eigen mailprogramma.
      if (res.status === 503) {
        window.location.href = mailtoHref();
        setStatus("idle");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorText(data.error || "Versturen is niet gelukt.");
      setStatus("error");
    } catch {
      setErrorText("Geen verbinding. Controleer je internet en probeer het opnieuw.");
      setStatus("error");
    }
  }

  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Contact</p>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Laten we kennismaken
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--slate)]">
            Of je nu precies weet wat je zoekt, of eerst wilt begrijpen wat het platform voor jouw
            onderneming kan betekenen — we denken graag met je mee.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <p className="font-mono-label text-xs uppercase tracking-[0.15em] text-[var(--slate-light)]">
                E-mail
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1.5 block text-base font-medium text-[var(--ink)] hover:text-[var(--teal)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {status === "sent" ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d6e7d] via-[#2864a0] to-[#2f9e6e] p-[1.5px] shadow-[0_40px_80px_-40px_rgba(28,74,120,0.45)]">
            <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-[var(--paper)] p-8 md:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#d7ece4] opacity-70 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#cfe3f7] opacity-70 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 56 56" className="h-14 w-14 shrink-0" aria-hidden="true">
                    <defs>
                      <linearGradient id="sentGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#2864a0" />
                        <stop offset="1" stopColor="#2f9e6e" />
                      </linearGradient>
                    </defs>
                    <circle cx="28" cy="28" r="25" fill="none" stroke="var(--line)" strokeWidth="2" />
                    <circle cx="28" cy="28" r="25" fill="none" stroke="url(#sentGradient)" strokeWidth="2.5" strokeLinecap="round" className="sent-ring" transform="rotate(-90 28 28)" />
                    <path d="M18 29 l7 7 l13 -15" fill="none" stroke="url(#sentGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sent-check" />
                  </svg>
                  <div>
                    <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">Bericht ontvangen</p>
                    <h2 className="font-display mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                      Dank je wel{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}.
                    </h2>
                  </div>
                </div>

                <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--slate)]">
                  Je bericht is goed bij ons aangekomen. We lezen het persoonlijk en nemen zo snel mogelijk contact
                  met je op.
                </p>

                <dl className="mt-7 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white/80 backdrop-blur-sm">
                  {[
                    ["Onderwerp", topic],
                    ["Onderneming", company || "–"],
                    ["Reactie naar", email],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-6 px-5 py-3.5">
                      <dt className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-[var(--slate-light)]">{label}</dt>
                      <dd className="truncate text-sm font-medium text-[var(--ink)]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="font-mono-label mt-8 text-[11px] uppercase tracking-[0.2em] text-[var(--slate-light)]">Wat er nu gebeurt</p>
                <ol className="mt-4 space-y-4">
                  {(topic === "Een website op maat"
                    ? [
                        ["We bekijken je huidige website", "Snelheid, mobiel, beveiliging en vindbaarheid."],
                        ["We nemen persoonlijk contact op", "Om kort af te stemmen wat je voor ogen hebt."],
                        ["Je ontvangt een ontwerpvoorstel", "Gratis, inclusief demovideo van je nieuwe site."],
                      ]
                    : [
                        ["We lezen je bericht", "En brengen in kaart wat je nodig hebt."],
                        ["We nemen persoonlijk contact op", "Om een kennismaking in te plannen."],
                        ["Samen bepalen we de volgende stap", "Zonder verplichtingen."],
                      ]
                  ).map(([title, body], i) => (
                    <li key={title} className="flex gap-4">
                      <span className="bg-gradient-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                        <p className="mt-0.5 text-sm text-[var(--slate)]">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href={topic === "Een website op maat" ? "/websites" : "/platform"}
                    className="bg-gradient-brand rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#1d6e7d]/20 transition-transform hover:scale-[1.02]"
                  >
                    {topic === "Een website op maat" ? "Bekijk websites op maat" : "Bekijk het platform"}
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--teal)]"
                  >
                    Naar de homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-5 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 md:p-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--ink)]">
                Naam
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/25"
                />
              </label>
              <label className="block text-sm font-medium text-[var(--ink)]">
                Onderneming
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/25"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-[var(--ink)]">
              Waar gaat het over?
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/25"
              >
                <option>Het Oravio-platform</option>
                <option>Een website op maat</option>
                <option>Iets anders</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-[var(--ink)]">
              E-mailadres
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/25"
              />
            </label>
            <label className="block text-sm font-medium text-[var(--ink)]">
              Bericht
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Vertel kort waar je onderneming behoefte aan heeft."
                className="mt-1.5 w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/25"
              />
            </label>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Niet invullen
                <input
                  type="text"
                  name="hp_controle"
                  tabIndex={-1}
                  autoComplete="one-time-code"
                  data-1p-ignore
                  data-lpignore="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>
            {status === "error" && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorText} Je kunt ook direct mailen naar{" "}
                <a href={mailtoHref()} className="font-semibold underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-gradient-brand w-full rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "sending" ? "Bezig met versturen..." : "Bericht versturen"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
