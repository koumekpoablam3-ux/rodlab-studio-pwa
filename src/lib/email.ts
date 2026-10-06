/**
 * Envoi d'emails transactionnels via ta boîte Gmail (SMTP), avec nodemailer.
 *
 * Configuration requise dans les variables d'environnement :
 *   SMTP_USER   — ton adresse Gmail complète, ex: koumekpoablam3@gmail.com
 *   SMTP_PASS   — un "mot de passe d'application" Google (PAS ton mot de passe Gmail normal,
 *                  voir https://myaccount.google.com/apppasswords — nécessite la validation
 *                  en 2 étapes activée sur le compte Google)
 *   EMAIL_FROM  — (optionnel) nom affiché, ex: "RodLab Studio <koumekpoablam3@gmail.com>".
 *                  L'adresse doit correspondre à SMTP_USER, sinon Gmail la remplace de force.
 *
 * Si SMTP_USER / SMTP_PASS ne sont pas définis, l'envoi est silencieusement ignoré : l'email
 * est une amélioration, jamais un point de blocage pour le flux métier (comme pour les push
 * notifications avec les clés VAPID).
 */

import nodemailer from "nodemailer";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app").replace(/\/$/, "");

/** URL de base du site, réutilisée par les routes API (liens de réinitialisation…). */
export const EMAIL_SITE_URL = SITE_URL;

/** True si l'envoi d'emails est fonctionnel (SMTP configuré). */
export function isEmailConfigured() {
  return isConfigured();
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function isConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true, // port 465 = connexion chiffrée directe (recommandé avec Gmail)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Construit un email HTML simple, dans la charte RodLab (forêt / or / crème). */
function buildHtml(title: string, body: string, url?: string, ctaLabel?: string) {
  const ctaUrl = url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : null;
  const ctaText = escapeHtml(ctaLabel || "Voir dans mon espace client");
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#f3efe6;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5ddc9;">
          <tr><td style="background:#1c3829;padding:24px 28px;">
            <p style="margin:0;color:#f3efe6;font-size:13px;letter-spacing:2px;text-transform:uppercase;">RodLab Studio</p>
          </td></tr>
          <tr><td style="padding:28px 28px 8px;">
            <h1 style="margin:0 0 12px;font-size:20px;color:#1c3829;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3a3530;">${escapeHtml(body)}</p>
            ${
              ctaUrl
                ? `<a href="${ctaUrl}" style="display:inline-block;background:#bd4f2b;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:10px;font-size:14px;font-weight:bold;">${ctaText}</a>`
                : ""
            }
          </td></tr>
          <tr><td style="padding:20px 28px 28px;border-top:1px solid #efe9d8;">
            <p style="margin:0;font-size:12px;color:#9a9184;">RodLab Studio · Lomé, Togo — ${SITE_URL.replace(/^https?:\/\//, "")}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Envoie un email transactionnel via Gmail SMTP. Échoue silencieusement (log console
 * uniquement) si la configuration est absente ou si l'envoi échoue — ne doit jamais
 * interrompre le flux métier appelant (création de devis, facture, etc.).
 *
 * `ctaLabel` personnalise le libellé du bouton d'action (par défaut : « Voir dans
 * mon espace client ») — utile pour les liens de réinitialisation de mot de passe.
 */
export async function sendEmail(to: string, subject: string, body: string, url?: string, ctaLabel?: string) {
  if (!isConfigured()) return;
  if (!to) return;

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: buildHtml(subject, body, url, ctaLabel),
    });
  } catch (error) {
    console.error("[email] Erreur d'envoi:", error);
  }
}

/**
 * Comme sendEmail, mais RAPPORTE le résultat (utile quand l'utilisateur doit savoir si le message
 * est vraiment parti, ex. invitation d'un administrateur) au lieu d'ignorer les erreurs.
 */
export async function sendEmailStrict(
  to: string, subject: string, body: string, url?: string, ctaLabel?: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!isConfigured()) return { ok: false, reason: "L'envoi d'emails n'est pas configuré sur le serveur (variables SMTP_USER et SMTP_PASS)." };
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: buildHtml(subject, body, url, ctaLabel),
    });
    return { ok: true };
  } catch (error) {
    console.error("[email] Erreur d'envoi:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `Le serveur d'emails a refusé l'envoi (${msg.slice(0, 140)}).` };
  }
}

/**
 * Email de bienvenue — envoyé une seule fois par compte, à la première occasion :
 * inscription (API /api/register) OU première connexion réussie (authorize() de
 * NextAuth, pour les comptes créés par un admin, de démonstration, ou antérieurs
 * à la fonctionnalité). L'appelant marque `welcomeSentAt` côté base après l'envoi.
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const body = `Bonjour ${firstName}, et bienvenue chez RodLab Studio !

Votre espace client est prêt : suivez l'avancement de vos projets en temps réel, recevez vos devis et factures, échangez avec l'équipe par messagerie (texte ou vocal), et accédez gratuitement aux formations certifiantes de RodLab Academy — tout est accessible depuis votre téléphone, même hors ligne.

Besoin d'un coup de main ? Répondez simplement à cet email ou appelez-nous au +228 70 08 86 68 — nous répondons sous 24 h ouvrées. Encore bienvenue, et bon découverte !`;

  await sendEmail(to, "Bienvenue chez RodLab Studio — votre espace client est prêt", body, "/dashboard", "Accéder à mon espace");
}
