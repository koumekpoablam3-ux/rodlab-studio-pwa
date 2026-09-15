"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

/**
 * Enregistre le service worker et active les notifications push.
 *
 * v8.6 : la bannière « Installez l'application » est gérée par
 * `install-banner.tsx` (une seule bannière sur tout le site). Ce composant
 * se concentre sur l'enregistrement du SW et l'abonnement push.
 */
export function PwaRegister() {
  const { data: session, status } = useSession();

  // Enregistrement du service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Abonnement push automatique une fois connecté
  useEffect(() => {
    async function subscribePush() {
      if (!session?.user || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
      try {
        const registration = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const res = await fetch("/api/push/vapid");
        const { publicKey } = await res.json();
        if (!publicKey) return;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
          } as PushSubscriptionOptionsInit);
        }

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))),
                auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))),
              },
            },
            userAgent: navigator.userAgent,
          }),
        });
      } catch {
        // silencieux : la PWA reste fonctionnelle sans push
      }
    }
    if (status === "authenticated") subscribePush();
  }, [session, status]);

  return null;
}

export default PwaRegister;
