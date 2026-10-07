import { NextRequest, NextResponse } from "next/server";
import { resolveMx, resolveTxt } from "node:dns/promises";
import { z } from "zod";
import { requireAdmin } from "@/lib/access";
import { EMAIL_SITE_URL, isEmailConfigured, senderAddress, sendEmailStrict, verifySmtp } from "@/lib/email";

export const runtime = "nodejs";

type Status = "ok" | "warn" | "error" | "info";
type Check = { id: string; label: string; status: Status; detail: string };

const txt = async (name: string) => {
  try {
    return (await resolveTxt(name)).map((parts) => parts.join(""));
  } catch {
    return [];
  }
};

/**
 * Diagnostic de délivrabilité des emails (directeur uniquement) : configuration, connexion SMTP,
 * enregistrements DNS du domaine d'envoi (SPF, DMARC, MX) et — si une adresse est donnée — email de test.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;

  const parsed = z.object({ to: z.string().trim().email().optional() }).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Adresse de test invalide" }, { status: 400 });

  const checks: Check[] = [];
  const add = (id: string, label: string, status: Status, detail: string) => checks.push({ id, label, status, detail });

  // 1) Configuration
  if (!isEmailConfigured()) {
    add("config", "Configuration SMTP", "error", "SMTP_USER et SMTP_PASS ne sont pas définis sur le serveur : aucun email ne peut partir.");
    return NextResponse.json({ checks });
  }
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  add("config", "Configuration SMTP", "ok", `Serveur ${host}, port ${process.env.SMTP_PORT || 465}.`);

  // 2) Expéditeur
  const from = senderAddress();
  const address = (/<([^>]+)>/.exec(from)?.[1] ?? from).trim().toLowerCase();
  const domain = address.split("@")[1] ?? "";
  const isGmail = /(^|\.)gmail\.com$|(^|\.)googlemail\.com$/.test(domain);
  if (!domain) {
    add("from", "Adresse d'expéditeur", "error", "Adresse d'expéditeur introuvable (EMAIL_FROM / SMTP_USER).");
  } else if (host.includes("gmail") && address !== (process.env.SMTP_USER ?? "").toLowerCase()) {
    add("from", "Adresse d'expéditeur", "warn", `Gmail remplace d'office l'expéditeur par ${process.env.SMTP_USER} : EMAIL_FROM (${address}) doit être la même adresse, sinon les filtres se méfient.`);
  } else {
    add("from", "Adresse d'expéditeur", "ok", `Les emails partent de ${address}.`);
  }

  // 3) Connexion SMTP
  const smtp = await verifySmtp();
  add("smtp", "Connexion au serveur d'envoi", smtp.ok ? "ok" : "error", smtp.ok ? "Identifiants acceptés." : `Échec : ${smtp.reason}. Avec Gmail, utilisez un « mot de passe d'application » (pas votre mot de passe habituel).`);

  // 4) Authentification du domaine (SPF / DKIM / DMARC)
  if (isGmail) {
    add("auth", "Authentification (SPF / DKIM / DMARC)", "ok", "Adresse Gmail : Google signe et authentifie vos messages, ce qui donne une bonne délivrabilité.");
    add("limit", "Limites d'envoi", "info", "Gmail limite l'envoi à environ 500 emails par jour. Pour une image plus professionnelle et une réputation à vous, passez à une adresse sur votre propre domaine (ex. contact@votre-domaine) avec Google Workspace, Brevo, Resend ou Mailjet.");
  } else if (domain) {
    const [spfRecords, dmarcRecords, mx] = await Promise.all([
      txt(domain),
      txt(`_dmarc.${domain}`),
      resolveMx(domain).catch(() => []),
    ]);
    const spf = spfRecords.find((r) => r.toLowerCase().startsWith("v=spf1"));
    add("spf", "SPF", spf ? "ok" : "error", spf ? `Trouvé : ${spf.slice(0, 120)}` : `Aucun enregistrement SPF pour ${domain}. Ajoutez un enregistrement TXT « v=spf1 include:… ~all » fourni par votre service d'emails.`);
    const dmarc = dmarcRecords.find((r) => r.toLowerCase().startsWith("v=dmarc1"));
    add("dmarc", "DMARC", dmarc ? "ok" : "warn", dmarc ? `Trouvé : ${dmarc.slice(0, 120)}` : `Aucun DMARC pour ${domain}. Ajoutez un TXT sur _dmarc.${domain} : « v=DMARC1; p=none; rua=mailto:vous@${domain} » (Gmail et Yahoo l'exigent de plus en plus).`);
    const selector = process.env.DKIM_SELECTOR;
    if (selector) {
      const dkim = (await txt(`${selector}._domainkey.${domain}`)).find((r) => /v=dkim1|p=/i.test(r));
      add("dkim", "DKIM", dkim ? "ok" : "error", dkim ? `Clé publique trouvée pour le sélecteur « ${selector} ».` : `Aucune clé DKIM sur ${selector}._domainkey.${domain}.`);
    } else {
      add("dkim", "DKIM", "info", "Non vérifiable automatiquement : activez la signature DKIM chez votre fournisseur d'emails et publiez la clé dans votre DNS.");
    }
    add("mx", "Réception sur le domaine", mx.length ? "ok" : "warn", mx.length ? "Le domaine peut recevoir les réponses." : `Aucun MX pour ${domain} : les réponses à vos emails seront perdues.`);
  }

  // 5) Adresse du site dans les liens
  const siteOk = /^https:\/\//.test(EMAIL_SITE_URL) && !/localhost|127\.0\.0\.1/.test(EMAIL_SITE_URL);
  add("site", "Adresse du site dans les liens", siteOk ? "ok" : "warn", siteOk ? `Les liens pointent vers ${EMAIL_SITE_URL}.` : `Les liens pointent vers ${EMAIL_SITE_URL} : définissez NEXT_PUBLIC_SITE_URL avec l'adresse https de votre site.`);

  // 6) Email de test
  if (parsed.data.to && smtp.ok) {
    const result = await sendEmailStrict(
      parsed.data.to,
      "Test d'envoi — RodLab Studio",
      "Bonjour,\n\nCeci est un email de test envoyé depuis l'espace administrateur de RodLab Studio.\n\nS'il est arrivé dans vos spams, marquez-le « Pas un spam » et ajoutez l'expéditeur à vos contacts : cela apprend à votre messagerie à faire confiance aux prochains messages.",
      "/admin",
      "Ouvrir l'espace admin"
    );
    add("test", "Email de test", result.ok ? "ok" : "error", result.ok ? `Envoyé à ${parsed.data.to}. Vérifiez sa boîte de réception ET ses spams.` : result.reason);
  }

  return NextResponse.json({ checks });
}
