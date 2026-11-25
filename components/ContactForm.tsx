"use client";

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
        body: JSON.stringify({ name, company, email, message, topic, website }),
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
          <div className="flex flex-col items-start justify-center rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 md:p-10">
            <div className="bg-gradient-brand flex h-12 w-12 items-center justify-center rounded-full text-xl text-white">✓</div>
            <h2 className="font-display mt-6 text-2xl font-semibold text-[var(--ink)]">Bedankt, {name.split(" ")[0] || "we hebben je bericht"}!</h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--slate)]">
              Je bericht is verstuurd. We nemen zo snel mogelijk contact met je op via {email}.
            </p>
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
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
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
