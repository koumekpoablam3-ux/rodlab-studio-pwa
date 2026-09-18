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
function buildHtml(title: string, body: string, url?: string) {
  const ctaUrl = url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : null;
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
                ? `<a href="${ctaUrl}" style="display:inline-block;background:#bd4f2b;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:10px;font-size:14px;font-weight:bold;">Voir dans mon espace client</a>`
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
 */
export async function sendEmail(to: string, subject: string, body: string, url?: string) {
  if (!isConfigured()) return;
  if (!to) return;

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: buildHtml(subject, body, url),
    });
  } catch (error) {
    console.error("[email] Erreur d'envoi:", error);
  }
}
