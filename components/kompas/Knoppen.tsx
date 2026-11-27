"use client";
import { useState, useTransition } from "react";
import { Check, Copy, Loader2, MessageCircle, Phone, TimerReset } from "lucide-react";
import { verlengen } from "@/app/kompas/acties";

const knop =
  "inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--navy)] transition hover:border-[var(--teal)] hover:text-[var(--teal)] disabled:opacity-50";

export function KopieerKnop({ tekst, label = "Link kopiëren" }: { tekst: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={knop}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(tekst);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {}
      }}
    >
      {ok ? <Check className="h-3.5 w-3.5 text-[#2f9e6e]" /> : <Copy className="h-3.5 w-3.5" />}
      {ok ? "Gekopieerd" : label}
    </button>
  );
}

export function VerlengKnop({ code, dagen = 3 }: { code: string; dagen?: number }) {
  const [bezig, start] = useTransition();
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      disabled={bezig}
      className={knop}
      onClick={() =>
        start(async () => {
          await verlengen(code, dagen);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        })
      }
    >
      {bezig ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : ok ? <Check className="h-3.5 w-3.5 text-[#2f9e6e]" /> : <TimerReset className="h-3.5 w-3.5" />}
      {ok ? "Verlengd" : `+${dagen} dagen`}
    </button>
  );
}

export function WhatsAppKnop({ href, label = "WhatsApp" }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${knop} hover:!border-[#25d366] hover:!text-[#128c4a]`}>
      <MessageCircle className="h-3.5 w-3.5" /> {label}
    </a>
  );
}

export function BelKnop({ href }: { href?: string }) {
  if (!href) return null;
  return (
    <a href={href} className="bg-gradient-brand inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
      <Phone className="h-3.5 w-3.5" /> Bellen
    </a>
  );
}
