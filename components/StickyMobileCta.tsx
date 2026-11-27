"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StickyMobileCta() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname?.startsWith("/intake")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--paper)]/95 p-3 backdrop-blur-md md:hidden">
      <Link
        href="/contact"
        className="bg-gradient-brand block w-full rounded-full py-3 text-center text-sm font-semibold text-white shadow-md"
      >
        Plan een gesprek
      </Link>
    </div>
  );
}
