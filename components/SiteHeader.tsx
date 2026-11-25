"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import OravioMark from "./OravioMark";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/websites", label: "Websites" },
  { href: "/branches", label: "Branches" },
  { href: "/faq", label: "FAQ" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Sluit het menu automatisch bij navigatie naar een andere pagina (via
  // onClick op de links zelf hieronder, niet via een effect).

  // Escape-toets sluit het menu.
  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Klikken/tikken buiten het menu sluit het — pointerdown werkt
  // betrouwbaar op zowel muis als aanraakschermen, in tegenstelling tot
  // mousedown, dat op mobiel soms net anders (of vertraagd) afgaat.
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [menuOpen]);

  // Voorkomt dat de pagina eronder meescrollt terwijl het menu open staat.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header ref={menuRef} className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <OravioMark className="h-7 w-7" />
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">ORAVIO</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${isActive ? "text-[var(--ink)]" : "text-[var(--slate)] hover:text-[var(--ink)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="bg-gradient-brand rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
          >
            Plan een gesprek
          </Link>
        </div>

        <button
          className="relative z-10 flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
          aria-expanded={menuOpen}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-5 bg-[var(--ink)] transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-[var(--ink)] transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-[var(--ink)] transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Achtergrond-overlay die de rest van de pagina dimt terwijl het menu open staat. */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[65px] z-40 bg-[var(--ink)]/20 backdrop-blur-[2px] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {menuOpen && (
        <div
          className="absolute left-0 right-0 top-full z-40 animate-[menu-slide-in_0.18s_ease-out] border-t border-[var(--line)] bg-[var(--paper)] px-6 shadow-lg md:hidden"
        >
          <nav className="flex flex-col gap-4 py-5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium ${isActive ? "text-[var(--teal)]" : "text-[var(--ink)]"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-brand mt-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Plan een gesprek
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
