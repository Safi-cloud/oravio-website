import "server-only";
import * as webpush from "web-push";
type PushSubscription = webpush.PushSubscription;
import { leesJson, opslagAan, schrijfJson } from "@/lib/store";

// Pushmeldingen naar de apparaten waarop het Kompas is geïnstalleerd.
// Vereist VAPID_PUBLIC_KEY en VAPID_PRIVATE_KEY (maak ze met: npx web-push generate-vapid-keys).

export type Abonnement = { sub: PushSubscription; apparaat: string; sinds: string };

export const pushAan = () => !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && opslagAan());
export const ntfyAan = () => !!process.env.NTFY_TOPIC;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://oravio.nl";

// Meldingen via de ntfy-app (werkt ook naast de Android-app van het Kompas).
async function ntfy(titel: string, tekst: string, url: string, tag?: string) {
  if (!ntfyAan()) return 0;
  try {
    const r = await fetch(process.env.NTFY_SERVER || "https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: process.env.NTFY_TOPIC,
        title: titel,
        message: tekst,
        click: url.startsWith("http") ? url : `${SITE}${url}`,
        tags: [tag?.includes("akkoord") ? "tada" : tag?.includes("intake") ? "inbox_tray" : "eyes"],
        priority: tag?.includes("akkoord") || tag?.includes("bekeken") ? 4 : 3,
      }),
    });
    return r.ok ? 1 : 0;
  } catch {
    return 0;
  }
}

function init() {
  webpush.setVapidDetails("mailto:contact@oravio.nl", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
}

export async function abonnementen() {
  return leesJson<Abonnement[]>("push", []);
}

export async function voegToe(sub: PushSubscription, apparaat: string) {
  const lijst = (await abonnementen()).filter((a) => a.sub.endpoint !== sub.endpoint);
  lijst.push({ sub, apparaat: apparaat.slice(0, 60), sinds: new Date().toISOString() });
  await schrijfJson("push", lijst.slice(-20));
}

export async function verwijder(endpoint: string) {
  const lijst = (await abonnementen()).filter((a) => a.sub.endpoint !== endpoint);
  await schrijfJson("push", lijst);
}

export async function stuurMelding(titel: string, tekst: string, url = "/kompas", tag?: string) {
  const viaNtfy = await ntfy(titel, tekst, url, tag);
  if (!pushAan()) return viaNtfy;
  try {
    init();
    const lijst = await abonnementen();
    const payload = JSON.stringify({ titel, tekst, url, tag });
    const dood: string[] = [];
    let ok = 0;
    await Promise.all(
      lijst.map(async (a) => {
        try {
          await webpush.sendNotification(a.sub, payload, { TTL: 60 * 60 * 24 });
          ok++;
        } catch (e) {
          const code = (e as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) dood.push(a.sub.endpoint);
        }
      }),
    );
    if (dood.length) await schrijfJson("push", lijst.filter((a) => !dood.includes(a.sub.endpoint)));
    return ok + viaNtfy;
  } catch (err) {
    console.error("Push mislukt", err);
    return viaNtfy;
  }
}
