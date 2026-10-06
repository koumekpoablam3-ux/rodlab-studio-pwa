import webpush from "web-push";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

let configured = false;

function ensureConfigured() {
  if (configured) return true;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:contact@rodlabstudio.tg",
    publicKey,
    privateKey
  );
  configured = true;
  return true;
}

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  /** Passer à false pour ne pas envoyer d'email pour cette notification précise (email envoyé par défaut). */
  email?: boolean;
};

/** Enregistre une notification en base, envoie un email, puis pousse vers tous les abonnements de l'utilisateur. */
export async function notifyUser(userId: string, payload: PushPayload) {
  try {
    await db.notification.create({
      data: {
        userId,
        title: payload.title,
        body: payload.body,
        url: payload.url,
      },
    });
  } catch {
    // la notification en base ne doit jamais casser le flux métier
  }

  if (payload.email !== false) {
    try {
      const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user?.email) {
        // Ne bloque jamais le flux métier : erreurs déjà gérées dans sendEmail.
        void sendEmail(user.email, payload.title, payload.body, payload.url);
      }
    } catch {
      // idem : l'email est une amélioration, jamais un point de blocage
    }
  }

  if (!ensureConfigured()) return;

  const subs = await db.pushSubscription.findMany({ where: { userId } });
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 24 }
        );
      } catch (error: unknown) {
        const statusCode = (error as { statusCode?: number })?.statusCode;
        // Abonnement expiré ou invalide : on le retire
        if (statusCode === 404 || statusCode === 410) {
          await db.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );
}
