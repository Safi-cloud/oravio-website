"use client";

import { useState } from "react";

const CONTACT_EMAIL = "contact@oravio.nl";

export default function ContactForm({ initialTopic = "Het Oravio-platform" }: { initialTopic?: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState(initialTopic);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${topic} — ${company || name}`);
    const body = encodeURIComponent(
      `Onderwerp: ${topic}\nNaam: ${name}\nOnderneming: ${company}\nE-mailadres: ${email}\n\nBericht:\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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

        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 md:p-10">
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
          <button
            type="submit"
            className="bg-gradient-brand w-full rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01]"
          >
            Bericht versturen
          </button>
        </form>
      </div>
    </section>
  );
}
