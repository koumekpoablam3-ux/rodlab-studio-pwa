import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { EMAIL_SITE_URL, sendEmailStrict } from "@/lib/email";

/**
 * Lien personnel pour DÉFINIR son mot de passe (invitation) ou le RÉINITIALISER.
 * Même mécanique que « mot de passe oublié » : jeton de 256 bits, seul son hash SHA-256 est
 * stocké, usage unique, durée limitée. Le directeur ne voit ni ne choisit jamais le mot de passe.
 */
/**
 * Adresse publique du site pour construire le lien : NEXT_PUBLIC_SITE_URL si elle est définie,
 * sinon l'adresse réellement utilisée par le directeur dans son navigateur (jamais une valeur
 * par défaut qui pourrait pointer vers un autre site).
 */
export function siteOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !/localhost|127\.0\.0\.1/.test(configured)) return configured;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return EMAIL_SITE_URL;
  const proto = req.headers.get("x-forwarded-proto") ?? (/^(localhost|127\.)/.test(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export async function issueSetupLink(userId: string, kind: "invite" | "reset", origin: string) {
  const token = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  const hours = kind === "invite" ? 7 * 24 : 24;
  await db.user.update({
    where: { id: userId },
    data: { resetTokenHash: hash, resetTokenExpiry: new Date(Date.now() + hours * 3600 * 1000) },
  });
  const link = `${origin}/reinitialiser-mot-de-passe?token=${token}${kind === "invite" ? "&invitation=1" : ""}`;
  return { link, hours };
}

/** Envoie le lien par email et retourne le résultat RÉEL (le lien reste de toute façon copiable). */
export async function sendSetupEmail(
  user: { email: string; name: string },
  link: string,
  kind: "invite" | "reset",
  invitedBy: string
): Promise<{ sent: boolean; reason?: string }> {
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  let result;
  if (kind === "invite") {
    result = await sendEmailStrict(
      user.email,
      "Votre compte administrateur RodLab Studio",
      `Bonjour ${firstName},\n\n${invitedBy} vous a créé un compte administrateur sur RodLab Studio avec cette adresse email.\n\nCliquez sur le bouton ci-dessous pour choisir votre mot de passe personnel — personne d'autre ne le connaîtra, et vous pourrez le modifier à tout moment depuis « Mon profil ». Ce lien est valable 7 jours et ne peut être utilisé qu'une seule fois.`,
      link,
      "Choisir mon mot de passe"
    );
  } else {
    result = await sendEmailStrict(
      user.email,
      "Réinitialisation de votre mot de passe RodLab Studio",
      `Bonjour ${firstName},\n\n${invitedBy} vous envoie un lien pour définir un nouveau mot de passe. Il est valable 24 heures et ne peut être utilisé qu'une seule fois.\n\nSi vous n'attendiez pas ce message, ignorez-le : votre mot de passe actuel reste inchangé.`,
      link,
      "Définir un nouveau mot de passe"
    );
  }
  return result.ok ? { sent: true } : { sent: false, reason: result.reason };
}
