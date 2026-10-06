/* ============================================================
   RODLAB STUDIO — Service Worker (PWA)
   - Mode hors-ligne : page de secours + cache des ressources
   - Notifications push (web-push)
   ============================================================ */

const VERSION = "rodlab-v8.9.0";
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/hors-ligne";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/",
  "/services",
  "/realisations",
  "/a-propos",
  "/blog",
  "/faq",
  "/contact",
  "/telecharger",
  "/formation",
  "/live",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/images/logo-original.png",
  "/images/site/hero-formation.jpg",
  "/images/site/carousel-formation.jpg",
  "/images/site/carousel-agence.jpg",
  "/images/site/carousel-bureau.jpg",
  "/images/site/cta-lome.jpg",
  "/screenshots/app-client-accueil.png",
  "/screenshots/app-client-projets.png",
  "/screenshots/app-client-messagerie.png",
  "/screenshots/app-admin-desktop.png",
];

// — Installation : pré-cache du strict minimum —
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// — Activation : purge des anciens caches —
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// — Stratégies de récupération —
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1) Navigations : réseau d'abord, page hors-ligne en secours
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          const offline = await caches.match(OFFLINE_URL);
          return (
            offline ||
            new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain" } })
          );
        })
    );
    return;
  }

  // 2) Ressources statiques (icônes, images, fonts) : cache d'abord
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/api/site-image/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  // 3) Pages Next.js pré-rendues : réseau d'abord avec repli cache
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// — Réception des notifications push —
const CALL_TAG = "rodlab-call";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Appel entrant : la notification est ré-affichée toutes les ~3,5 s (vibration + son de notification
 * du téléphone) tant que l'appel sonne, même application fermée. Elle s'arrête dès que l'appel est
 * décroché, raccroché, expiré, ou que la notification est fermée.
 * Limite du web : le navigateur ne peut pas utiliser la vraie sonnerie d'appel du téléphone.
 */
async function ringForCall(data) {
  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/maskable-192.png",
    tag: CALL_TAG,
    renotify: true,
    requireInteraction: true,
    vibrate: [600, 200, 600, 200, 600],
    data: { url: data.url || "/dashboard", call: true, callId: data.callId },
    actions: [
      { action: "answer", title: "Répondre" },
      { action: "decline", title: "Refuser" },
    ],
  };

  await self.registration.showNotification(data.title, options);

  const startedAt = Date.now();
  while (Date.now() - startedAt < 42000) {
    await sleep(3500);

    // Notification fermée ou tapée : on arrête de sonner.
    const shown = await self.registration.getNotifications({ tag: CALL_TAG });
    if (shown.length === 0) return;

    // L'application est ouverte et visible : c'est elle qui sonne.
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (windows.some((c) => c.visibilityState === "visible")) {
      shown.forEach((n) => n.close());
      return;
    }

    // L'appel sonne-t-il encore ? (en cas de réseau coupé, on continue de sonner)
    try {
      const res = await fetch("/api/calls/poll", { cache: "no-store", credentials: "same-origin" });
      if (res.ok) {
        const state = await res.json();
        if (!state.incoming || (data.callId && state.incoming.id !== data.callId)) {
          shown.forEach((n) => n.close());
          return;
        }
      }
    } catch {
      /* hors connexion : on laisse la notification affichée */
    }

    await self.registration.showNotification(data.title, options);
  }
  (await self.registration.getNotifications({ tag: CALL_TAG })).forEach((n) => n.close());
}

self.addEventListener("push", (event) => {
  let data = { title: "RodLab Studio", body: "Vous avez une nouvelle activité.", url: "/dashboard" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    if (event.data) data.body = event.data.text();
  }

  if (data.call) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
        // Application déjà visible : la sonnerie intégrée s'en charge, pas de notification en double.
        if (windows.some((c) => c.visibilityState === "visible")) return undefined;
        return ringForCall(data);
      })
    );
    return;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/maskable-192.png",
      tag: data.tag || "rodlab",
      data: { url: data.url || "/dashboard" },
      vibrate: [80, 40, 80],
    })
  );
});

// — Clic sur la notification : ouvrir/focaliser l'URL cible (ou refuser l'appel) —
self.addEventListener("notificationclick", (event) => {
  const info = event.notification.data || {};
  event.notification.close();

  // « Refuser » : on refuse l'appel sans ouvrir l'application.
  if (info.call && info.callId && event.action === "decline") {
    event.waitUntil(
      fetch("/api/calls/" + info.callId, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      }).catch(() => {})
    );
    return;
  }

  let target = info.url || "/dashboard";
  // « Répondre » : l'application s'ouvre et décroche automatiquement.
  if (info.call && info.callId && event.action === "answer") {
    target += (target.includes("?") ? "&" : "?") + "answer=" + encodeURIComponent(info.callId);
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
