"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Compass, FolderOpen, Inbox, LayoutGrid, LogOut, Plus, Settings2 } from "lucide-react";
import { uitloggen } from "@/app/kompas/acties";
import { SwRegistratie } from "@/components/kompas/Meldingen";

const NAV = [
  { href: "/kompas", label: "Vandaag", icon: LayoutGrid },
  { href: "/kompas/voorstellen", label: "Voorstellen", icon: FolderOpen },
  { href: "/kompas/nieuw", label: "Nieuw", icon: Plus },
  { href: "/kompas/intakes", label: "Intakes", icon: Inbox },
  { href: "/kompas/instellingen", label: "Instellingen", icon: Settings2 },
];

export default function Schil({ children, nieuweIntakes }: { children: React.ReactNode; nieuweIntakes: number }) {
  const p = usePathname();
  const actief = (h: string) => (h === "/kompas" ? p === h : p?.startsWith(h));

  // Dit apparaat is van de eigenaar: eigen bezoeken aan voorstellen tellen niet mee.
  useEffect(() => {
    try {
      localStorage.setItem("oravio-eigenaar", "1");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f8fb]">
      <SwRegistratie />
      <div className="kp-orb kp-orb-a" />
      <div className="kp-orb kp-orb-b" />
      {/* Zijbalk */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/60 bg-white/70 px-4 py-6 backdrop-blur-xl lg:flex">
        <Link href="/kompas" className="flex items-center gap-3 px-3">
          <span className="bg-gradient-brand flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md">
            <Compass className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span>
            <span className="font-display block text-lg font-semibold leading-none text-[var(--ink)]">Kompas</span>
            <span className="text-[11px] text-[var(--slate)]">Oravio</span>
          </span>
        </Link>
        <nav className="mt-10 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                actief(href) ? "bg-white text-[var(--ink)] shadow-[0_8px_24px_-14px_rgba(15,40,65,0.45)]" : "text-[var(--slate)] hover:bg-white/60 hover:text-[var(--ink)]"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${actief(href) ? "bg-gradient-brand text-white" : "bg-[#eef3f7] text-[var(--slate)] group-hover:text-[var(--teal)]"}`}>
                <Icon className="h-4 w-4" />
              </span>
              {label}
              {href === "/kompas/intakes" && nieuweIntakes > 0 && (
                <span className="ml-auto rounded-full bg-[#ff7a66] px-2 py-0.5 text-[10px] font-bold text-white">{nieuweIntakes}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <Link href="/" target="_blank" className="block rounded-xl px-3 py-2 text-xs text-[var(--slate)] hover:text-[var(--ink)]">
            oravio.nl bekijken
          </Link>
          <form action={uitloggen}>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--slate)] hover:text-[#c0432d]">
              <LogOut className="h-3.5 w-3.5" /> Uitloggen
            </button>
          </form>
        </div>
      </aside>

      {/* Kop op mobiel */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-white/75 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/kompas" className="flex items-center gap-2.5">
          <span className="bg-gradient-brand flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Compass className="h-4 w-4" />
          </span>
          <span className="font-display font-semibold text-[var(--ink)]">Kompas</span>
        </Link>
        <form action={uitloggen}>
          <button aria-label="Uitloggen" className="rounded-lg p-2 text-[var(--slate)]">
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </header>

      <main className="relative px-4 pb-28 pt-6 md:px-8 lg:ml-64 lg:px-12 lg:pb-16 lg:pt-10">{children}</main>

      {/* Tabbalk op mobiel */}
      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-between rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-[0_20px_50px_-20px_rgba(15,40,65,0.5)] backdrop-blur-xl lg:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition ${
              actief(href) ? "bg-gradient-brand text-white" : "text-[var(--slate)]"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
            {href === "/kompas/intakes" && nieuweIntakes > 0 && <span className="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-[#ff7a66]" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
