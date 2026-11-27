import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Toegang tot het Kompas met één wachtwoord: de omgevingsvariabele OVERZICHT_SLEUTEL.
export const COOKIE = "kp_s";

export function sleutelIngesteld() {
  return !!process.env.OVERZICHT_SLEUTEL;
}
export function token() {
  return createHmac("sha256", process.env.OVERZICHT_SLEUTEL || "x").update("oravio-kompas-v1").digest("hex");
}
export function klopt(invoer: string) {
  const a = Buffer.from(createHmac("sha256", process.env.OVERZICHT_SLEUTEL || "x").update("oravio-kompas-v1").digest("hex"));
  const b = Buffer.from(createHmac("sha256", invoer || "").update("oravio-kompas-v1").digest("hex"));
  return sleutelIngesteld() && a.length === b.length && timingSafeEqual(a, b);
}
export async function ingelogd() {
  if (!sleutelIngesteld()) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return c === token();
}
export function ingelogdVanRequest(req: Request) {
  if (!sleutelIngesteld()) return false;
  const raw = req.headers.get("cookie") || "";
  const m = raw.split(/;\s*/).find((x) => x.startsWith(`${COOKIE}=`));
  return !!m && m.slice(COOKIE.length + 1) === token();
}
