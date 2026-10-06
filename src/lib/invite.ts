import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { EMAIL_SITE_URL, isEmailConfigured, sendEmail } from "@/lib/email";

/**
 * Lien personnel pour DÉFINIR son mot de passe (invitation) ou le RÉINITIALISER.
 * Même mécanique que « mot de passe oublié » : jeton de 256 bits, seul son hash SHA-256 est
 * stocké, usage unique, durée limitée. Le directeur ne voit ni ne choisit jamais le mot de passe.
 */
export async function issueSetupLink(userId: string, kind: "invite" | "reset") {
  const token = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  const hours = kind === "invite" ? 7 * 24 : 24;
  await db.user.update({
    where: { id: userId },
    data: { resetTokenHash: hash, resetTokenExpiry: new Date(Date.now() + hours * 3600 * 1000) },
  });
  const link = `${EMAIL_SITE_URL}/reinitialiser-mot-de-passe?token=${token}${kind === "invite" ? "&invitation=1" : ""}`;
  return { link, hours };
}

/** Envoie le lien par email. Retourne false si l'envoi d'emails n'est pas configuré (le lien reste copiable). */
export async function sendSetupEmail(
  user: { email: string; name: string },
  link: string,
  kind: "invite" | "reset",
  invitedBy: string
) {
  if (!isEmailConfigured()) return false;
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  if (kind === "invite") {
    await sendEmail(
      user.email,
      "Votre compte administrateur RodLab Studio",
      `Bonjour ${firstName},\n\n${invitedBy} vous a créé un compte administrateur sur RodLab Studio avec cette adresse email.\n\nCliquez sur le bouton ci-dessous pour choisir votre mot de passe personnel — personne d'autre ne le connaîtra, et vous pourrez le modifier à tout moment depuis « Mon profil ». Ce lien est valable 7 jours et ne peut être utilisé qu'une seule fois.`,
      link,
      "Choisir mon mot de passe"
    );
  } else {
    await sendEmail(
      user.email,
      "Réinitialisation de votre mot de passe RodLab Studio",
      `Bonjour ${firstName},\n\n${invitedBy} vous envoie un lien pour définir un nouveau mot de passe. Il est valable 24 heures et ne peut être utilisé qu'une seule fois.\n\nSi vous n'attendiez pas ce message, ignorez-le : votre mot de passe actuel reste inchangé.`,
      link,
      "Définir un nouveau mot de passe"
    );
  }
  return true;
}
