import type { Metadata, Viewport } from "next";
import Inloggen from "@/components/kompas/Inloggen";
import Schil from "@/components/kompas/Schil";
import { ingelogd, sleutelIngesteld } from "@/lib/kompas-auth";
import { intakes } from "@/lib/kompas-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kompas | Oravio",
  robots: { index: false, follow: false },
  manifest: "/kompas.webmanifest",
  appleWebApp: { capable: true, title: "Kompas", statusBarStyle: "default" },
  icons: { apple: "/kompas-icon-192.png" },
};
export const viewport: Viewport = { themeColor: "#1d6e7d" };

export default async function KompasLayout({ children }: { children: React.ReactNode }) {
  if (!(await ingelogd())) return <Inloggen ingesteld={sleutelIngesteld()} />;
  const open = (await intakes()).filter((i) => !i.klaar).length;
  return <Schil nieuweIntakes={open}>{children}</Schil>;
}
