import { db } from "@/lib/db";

/**
 * Présence temps quasi-réel dans un fil de messagerie (façon WhatsApp) :
 * « est en train d'écrire » / « est en train d'enregistrer un vocal ».
 *
 * Un fil de messagerie n'a que deux camps : le studio (ADMIN) et le client
 * (CLIENT ou ENTREPRISE, regroupés sous le même « camp » pour cette présence).
 * On stocke une ligne par (fil, camp), périmée automatiquement après quelques
 * secondes sans nouvelle mise à jour — pas besoin de nettoyage explicite.
 */

const STALE_AFTER_MS = 6000;

export type PresenceCamp = "ADMIN" | "CLIENT";

/** Réduit un rôle utilisateur (ADMIN | CLIENT | ENTREPRISE) à son « camp » de présence. */
export function presenceCamp(role: string): PresenceCamp {
  return role === "ADMIN" ? "ADMIN" : "CLIENT";
}

/** Le camp opposé à celui donné — pratique pour savoir qui regarder côté lecture. */
export function otherPresenceRole(camp: PresenceCamp): PresenceCamp {
  return camp === "ADMIN" ? "CLIENT" : "ADMIN";
}

/** Enregistre que quelqu'un est en train d'écrire ou d'enregistrer dans ce fil. */
export async function writePresence(threadId: string, camp: PresenceCamp, state: "typing" | "recording") {
  await db.chatPresence.upsert({
    where: { threadId_role: { threadId, role: camp } },
    create: { threadId, role: camp, state },
    update: { state },
  });
}

/** Efface la présence (l'utilisateur a arrêté d'écrire / d'enregistrer). */
export async function clearPresence(threadId: string, camp: PresenceCamp) {
  await db.chatPresence.deleteMany({ where: { threadId, role: camp } });
}

/** Lit la présence actuelle d'un camp dans un fil, en respectant l'expiration. */
export async function readPresence(threadId: string, camp: PresenceCamp): Promise<"typing" | "recording" | null> {
  const row = await db.chatPresence.findUnique({ where: { threadId_role: { threadId, role: camp } } });
  if (!row) return null;
  if (Date.now() - row.updatedAt.getTime() > STALE_AFTER_MS) return null;
  return row.state as "typing" | "recording";
}
