import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail, isEmailConfigured, EMAIL_SITE_URL } from "@/lib/email";

/**
 * Mot de passe oublié — 1re étape : demande du lien de réinitialisation.
 *
 * Génère un jeton aléatoire de 256 bits, ne stocke en base que son hash
 * SHA-256 (jamais le jeton lui-même) avec une validité d'une heure, puis
 * envoie le lien /reinitialiser-mot-de-passe?token=… par email.
 *
 * Sécurité :
 *  - Réponse IDENTIQUE que le compte existe ou non (impossible de deviner
 *    qui possède un compte RodLab — anti-énumération d'adresses email).
 *  - Anti-spam : si une demande pour ce compte date de moins de 5 minutes,
 *    aucun nouvel email n'est envoyé (la réponse reste identique).
 *  - Le jeton est à usage unique : toute nouvelle demande invalide le
 *    précédent, et le lien meurt après usage ou après 1 h.
 */
const schema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();

    // Message générique renvoyé dans tous les cas (sauf SMTP non configuré).
    const genericResponse = {
      ok: true,
      message:
        "Si un compte existe avec cette adresse, un email contenant un lien de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.",
    };

    const user = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.active) {
      return NextResponse.json(genericResponse);
    }

    // Anti-spam : une demande existe déjà (valide pendant 1 h → si plus de
    // 55 min restent, elle date de moins de 5 min). On ne renvoie pas d'email.
    const now = new Date();
    if (!user.invitePending && user.resetTokenExpiry && user.resetTokenExpiry.getTime() - now.getTime() > 55 * 60 * 1000) {
      return NextResponse.json(genericResponse);
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          error:
            "Le service d'envoi d'emails n'est pas encore configuré sur ce serveur (variables SMTP_USER / SMTP_PASS). En attendant, contactez l'équipe RodLab Studio pour réinitialiser votre mot de passe.",
        },
        { status: 503 }
      );
    }

    // Jeton de 256 bits : le brut va dans le lien, seul son hash en base.
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiry = new Date(now.getTime() + 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: { resetTokenHash: tokenHash, resetTokenExpiry: expiry },
    });

    const link = `${EMAIL_SITE_URL}/reinitialiser-mot-de-passe?token=${token}`;
    const firstName = user.name.trim().split(/\s+/)[0] || user.name;
    const body = `Bonjour ${firstName},\n\nVous avez demandé la réinitialisation du mot de passe de votre compte RodLab Studio. Cliquez sur le bouton ci-dessous pour en définir un nouveau — ce lien est valable une heure et ne peut être utilisé qu'une seule fois.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : votre mot de passe actuel reste inchangé et personne n'y a accès.`;

    await sendEmail(user.email, "Réinitialisation de votre mot de passe RodLab Studio", body, link, "Définir un nouveau mot de passe");

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez dans un instant." },
      { status: 500 }
    );
  }
}
