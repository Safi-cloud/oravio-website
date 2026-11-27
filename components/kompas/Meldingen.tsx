"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Download, Loader2, Smartphone } from "lucide-react";

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

function b64(s: string) {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
function apparaatNaam() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad/i.test(ua)) return "iPhone";
  if (/mac/i.test(ua)) return "Mac";
  if (/windows/i.test(ua)) return "Windows";
  return "Apparaat";
}

// Registreert de service worker op elke Kompas-pagina.
export function SwRegistratie() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/kompas-sw.js", { scope: "/kompas" }).catch(() => {});
  }, []);
  return null;
}

export default function Meldingen() {
  const [staat, setStaat] = useState<"laden" | "niet-ondersteund" | "niet-ingesteld" | "uit" | "aan" | "geweigerd">("laden");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [installeer, setInstalleer] = useState<BIP | null>(null);
  const [geinstalleerd, setGeinstalleerd] = useState(false);
  const [ios, setIos] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [probleem, setProbleem] = useState<string | null>(null);

  useEffect(() => {
    setIos(/iphone|ipad/i.test(navigator.userAgent));
    setInApp(/OravioApp/.test(navigator.userAgent));
    fetch("/api/kompas/push")
      .then((x) => x.json())
      .then((r) => {
        setTopic(r.ntfy || null);
        setProbleem(r.probleem || null);
      })
      .catch(() => {});
    setGeinstalleerd(window.matchMedia("(display-mode: standalone)").matches);
    const h = (e: Event) => {
      e.preventDefault();
      setInstalleer(e as BIP);
    };
    window.addEventListener("beforeinstallprompt", h);
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return setStaat("niet-ondersteund");
      const r = await fetch("/api/kompas/push").then((x) => x.json()).catch(() => ({}));
      if (!r.aan) return setStaat("niet-ingesteld");
      if (Notification.permission === "denied") return setStaat("geweigerd");
      const reg = await navigator.serviceWorker.register("/kompas-sw.js", { scope: "/kompas" });
      const sub = await reg.pushManager.getSubscription();
      setStaat(sub ? "aan" : "uit");
    })();
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  const aanzetten = async () => {
    setBezig(true);
    setMelding("");
    try {
      const toestemming = await Notification.requestPermission();
      if (toestemming !== "granted") {
        setStaat("geweigerd");
        return;
      }
      const { sleutel } = await fetch("/api/kompas/push").then((x) => x.json());
      const reg = await navigator.serviceWorker.register("/kompas-sw.js", { scope: "/kompas" });
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(sleutel) });
      await fetch("/api/kompas/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub: sub.toJSON(), apparaat: apparaatNaam() }),
      });
      setStaat("aan");
      await fetch("/api/kompas/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ actie: "test" }) });
      setMelding("Gelukt. Je krijgt zo een testmelding.");
    } catch (e) {
      setMelding(`Aanzetten mislukt: ${(e as Error).message}`);
    } finally {
      setBezig(false);
    }
  };

  const uitzetten = async () => {
    setBezig(true);
    const reg = await navigator.serviceWorker.getRegistration("/kompas");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/kompas/push", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
      await sub.unsubscribe();
    }
    setStaat("uit");
    setBezig(false);
  };

  const test = async () => {
    setBezig(true);
    const r = await fetch("/api/kompas/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ actie: "test" }) }).then((x) => x.json());
    setMelding(r.verstuurd ? "Testmelding verstuurd." : "Geen apparaten gevonden.");
    setBezig(false);
  };

  return (
    <div className="space-y-4">
      {/* Installeren */}
      {!inApp && (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
        <span className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-xl text-white">
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-auto">
          <p className="font-medium text-[var(--ink)]">Kompas als app</p>
          <p className="text-sm text-[var(--slate)]">
            {geinstalleerd
              ? "Geïnstalleerd. Je opent het Kompas nu als app."
              : ios
                ? "Tik in Safari op Delen en kies 'Zet op beginscherm'."
                : installeer
                  ? "Zet het Kompas met één tik als app op dit apparaat."
                  : "Open het menu van Chrome (drie puntjes) en kies 'App installeren'."}
          </p>
        </div>
        {installeer && !geinstalleerd && (
          <button
            onClick={async () => {
              await installeer.prompt();
              const k = await installeer.userChoice;
              if (k.outcome === "accepted") setGeinstalleerd(true);
              setInstalleer(null);
            }}
            className="bg-gradient-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
          >
            <Download className="h-4 w-4" /> Installeren
          </button>
        )}
      </div>
      )}

      {/* Meldingen via ntfy: alleen tonen als het is ingesteld of in de Android-app */}
      {(topic || inApp) && (
      <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${topic ? "bg-[#2f9e6e] text-white" : "bg-[#eef3f7] text-[var(--slate)]"}`}>
            <BellRing className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-auto">
            <p className="font-medium text-[var(--ink)]">Meldingen via de ntfy-app{inApp ? " (aanbevolen in de app)" : ""}</p>
            <p className="text-sm text-[var(--slate)]">
              {topic
                ? "Installeer de gratis app ntfy uit de Play Store en abonneer je op jouw kanaal. Dan krijg je elke melding direct, ook als het Kompas dicht is."
                : "Nog niet ingesteld: voeg NTFY_TOPIC toe in Vercel."}
            </p>
          </div>
        </div>
        {topic && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-[#f1f5f8] px-3 py-1.5 text-xs text-[var(--navy)]">{topic}</code>
            <a href={`ntfy://ntfy.sh/${topic}`} className="bg-gradient-brand rounded-full px-4 py-2 text-xs font-semibold text-white">
              Open in ntfy
            </a>
            <a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--navy)] ring-1 ring-[var(--line)]">
              ntfy downloaden
            </a>
            <button onClick={test} disabled={bezig} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--navy)] ring-1 ring-[var(--line)]">
              Test
            </button>
          </div>
        )}
      </div>
      )}

      {/* Meldingen */}
      {!inApp && (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[var(--line)]">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${staat === "aan" ? "bg-[#2f9e6e] text-white" : "bg-[#eef3f7] text-[var(--slate)]"}`}>
          {staat === "aan" ? <BellRing className="h-5 w-5" /> : staat === "geweigerd" ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-auto">
          <p className="font-medium text-[var(--ink)]">Meldingen op dit apparaat</p>
          <p className="text-sm text-[var(--slate)]">
            {staat === "laden" && "Even kijken…"}
            {staat === "aan" && "Aan. Je krijgt een melding bij openen, afkijken, akkoord en nieuwe intakes."}
            {staat === "uit" && "Uit. Zet ze aan om direct te weten wanneer een klant kijkt."}
            {staat === "niet-ingesteld" && (probleem || "Nog niet ingesteld: voeg VAPID_PUBLIC_KEY en VAPID_PRIVATE_KEY toe in Vercel.")}
            {staat === "geweigerd" && "Geblokkeerd. Sta meldingen toe in de instellingen van je browser of app, en probeer opnieuw."}
            {staat === "niet-ondersteund" &&
              (ios ? "Op iPhone werkt dit pas nadat je het Kompas op je beginscherm hebt gezet en vanaf daar opent." : "Deze browser ondersteunt geen meldingen.")}
          </p>
          {melding && <p className="mt-1 text-xs font-medium text-[var(--teal)]">{melding}</p>}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {staat === "uit" && (
            <button onClick={aanzetten} disabled={bezig} className="bg-gradient-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white sm:w-auto">
              {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />} Aanzetten
            </button>
          )}
          {staat === "aan" && (
            <>
              <button onClick={test} disabled={bezig} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--navy)] ring-1 ring-[var(--line)]">
                Test
              </button>
              <button onClick={uitzetten} disabled={bezig} className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--slate)]">
                Uitzetten
              </button>
            </>
          )}
        </div>
      </div>
      )}
      {melding && inApp && <p className="text-xs font-medium text-[var(--teal)]">{melding}</p>}
    </div>
  );
}
