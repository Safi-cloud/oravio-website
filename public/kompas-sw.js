// Service worker voor het Kompas: pushmeldingen en openen vanaf de melding.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { titel: "Kompas", tekst: e.data && e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(d.titel || "Kompas", {
      body: d.tekst || "",
      icon: "/kompas-icon-192.png",
      badge: "/kompas-badge.png",
      tag: d.tag || undefined,
      renotify: !!d.tag,
      data: { url: d.url || "/kompas" },
      vibrate: [80, 40, 80],
    }),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/kompas";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lijst) => {
      for (const c of lijst) {
        if (c.url.includes("/kompas") && "focus" in c) { c.navigate(url); return c.focus(); }
      }
      return self.clients.openWindow(url);
    }),
  );
});
