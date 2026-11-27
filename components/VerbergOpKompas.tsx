"use client";
import { usePathname } from "next/navigation";

// Verbergt de gewone websitekop en -voet in het Kompas, dat een eigen indeling heeft.
export default function VerbergOpKompas({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  if (p?.startsWith("/kompas")) return null;
  return <>{children}</>;
}
