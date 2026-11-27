import type { Metadata } from "next";
import Inloggen from "@/components/kompas/Inloggen";
import Schil from "@/components/kompas/Schil";
import { ingelogd, sleutelIngesteld } from "@/lib/kompas-auth";
import { intakes } from "@/lib/kompas-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kompas — Oravio", robots: { index: false, follow: false } };

export default async function KompasLayout({ children }: { children: React.ReactNode }) {
  if (!(await ingelogd())) return <Inloggen ingesteld={sleutelIngesteld()} />;
  const open = (await intakes()).filter((i) => !i.klaar).length;
  return <Schil nieuweIntakes={open}>{children}</Schil>;
}
