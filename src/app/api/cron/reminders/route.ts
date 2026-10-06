import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { notifyUser } from "@/lib/push";
import { formatFCFA, formatDate } from "@/lib/format";
import { PROJECT_STATUS_LABELS, type ProjectStatus } from "@/lib/roles";

/**
 * Tâche planifiée (Vercel Cron, voir vercel.json) — une fois par jour à 8 h :
 *
 *  1) FACTURES — Passe en OVERDUE les factures SENT dont l'échéance est
 *     dépassée, puis envoie un rappel au client pour chaque facture qui vient
 *     de passer en retard (une seule fois par facture, grâce à reminderSentAt).
 *
 *  2) DEVIS — Passe en EXPIRED les devis SENT dont la date de validité est
 *     dépassée, puis relance une seule fois les devis SENT restés sans réponse
 *     depuis 3 jours ou plus (grâce à Quote.reminderSentAt — jamais de spam).
 *
 *  3) PROJETS (client) — Rappel à J-3 de l'échéance d'un projet actif
 *     (PENDING / IN_PROGRESS / REVIEW), une seule fois par projet
 *     (grâce à Project.deadlineReminderAt).
 *
 *  4) PROJETS (admin) — Alerte l'équipe si un projet actif a dépassé son
 *     échéance, une seule fois par projet (grâce à Project.overdueNotifiedAt).
 *
 * Chaque envoi est isolé dans un try/catch : un email en échec (SMTP
 * momentanément indisponible…) n'interrompt ni n'annule les autres rappels.
 *
 * Protégée par CRON_SECRET : Vercel l'envoie automatiquement en en-tête
 * Authorization quand un cron est déclaré dans vercel.json avec cette variable
 * définie côté projet. Sans CRON_SECRET configuré, la route refuse tout appel
 * (fermé par défaut, jamais ouvert par erreur).
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Libellé lisible d'un statut projet, même si un statut inconnu traîne en base. */
function projectLabel(status: string): string {
  return PROJECT_STATUS_LABELS[status as ProjectStatus] ?? status;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const errors: string[] = [];

  // ————————————————————————————————— 1) FACTURES —————————————————————————————————

  // 1a) Bascule automatique SENT → OVERDUE
  const justOverdue = await db.invoice.findMany({
    where: { status: "SENT", dueDate: { lt: now } },
    select: { id: true, number: true },
  });
  if (justOverdue.length > 0) {
    await db.invoice.updateMany({
      where: { id: { in: justOverdue.map((i) => i.id) } },
      data: { status: "OVERDUE" },
    });
  }

  // 1b) Rappel email pour toute facture en retard jamais encore relancée
  const toRemind = await db.invoice.findMany({
    where: { status: "OVERDUE", reminderSentAt: null },
    include: { client: { select: { id: true, name: true, companyName: true, role: true, email: true } } },
  });

  let invoiceReminders = 0;
  for (const inv of toRemind) {
    try {
      const clientName = inv.client.role === "ENTREPRISE" ? inv.client.companyName || inv.client.name : inv.client.name;
      const body = `Bonjour ${clientName}, la facture ${inv.number} d'un montant de ${formatFCFA(inv.total)} était due le ${formatDate(inv.dueDate)}. Merci de procéder au règlement dès que possible, ou de nous contacter si un délai est nécessaire.`;

      await sendEmail(inv.client.email, `Rappel — Facture ${inv.number} en retard`, body, "/dashboard/factures");
      await notifyUser(inv.client.id, {
        title: `Rappel : facture ${inv.number} en retard`,
        body: `${formatFCFA(inv.total)} — échéance dépassée le ${formatDate(inv.dueDate)}`,
        url: "/dashboard/factures",
        email: false, // déjà envoyé ci-dessus avec un message plus détaillé
      });
      await db.invoice.update({ where: { id: inv.id }, data: { reminderSentAt: now } });
      invoiceReminders++;
    } catch (e) {
      errors.push(`facture ${inv.number} : ${e instanceof Error ? e.message : "erreur inconnue"}`);
    }
  }

  // ————————————————————————————————— 2) DEVIS ————————————————————————————————————

  // 2a) Bascule automatique SENT → EXPIRED (validité dépassée)
  const justExpired = await db.quote.findMany({
    where: { status: "SENT", validUntil: { lt: now } },
    select: { id: true, number: true },
  });
  if (justExpired.length > 0) {
    await db.quote.updateMany({
      where: { id: { in: justExpired.map((q) => q.id) } },
      data: { status: "EXPIRED" },
    });
  }

  // 2b) Relance unique des devis SENT restés sans réponse depuis 3 jours ou plus.
  //     « Sans réponse » = aucune modification du devis depuis 3 jours et le
  //     client n'a ni accepté ni refusé. Une seule relance par devis :
  //     dès que reminderSentAt est renseigné, il n'est plus jamais relancé.
  const threeDaysAgo = new Date(now.getTime() - 3 * DAY_MS);
  const toFollowUp = await db.quote.findMany({
    where: { status: "SENT", reminderSentAt: null, updatedAt: { lt: threeDaysAgo } },
    include: { client: { select: { id: true, name: true, companyName: true, role: true, email: true } } },
  });

  let quoteReminders = 0;
  for (const quote of toFollowUp) {
    try {
      const clientName = quote.client.role === "ENTREPRISE" ? quote.client.companyName || quote.client.name : quote.client.name;
      const validLine = quote.validUntil
        ? `Il reste valable jusqu'au ${formatDate(quote.validUntil)}.`
        : "N'hésitez pas à nous contacter pour prolonger sa validité.";
      const body = `Bonjour ${clientName}, avez-vous eu le temps d'examiner le devis ${quote.number} « ${quote.title} » (${formatFCFA(quote.total)}) ? ${validLine} Pour l'accepter, refusez ou demander des ajustements, rendez-vous dans votre espace client, rubrique Devis — ou répondez simplement à cet email.`;

      await sendEmail(quote.client.email, `Relance — Devis ${quote.number} en attente de votre réponse`, body, "/dashboard/devis");
      await notifyUser(quote.client.id, {
        title: `Relance : devis ${quote.number} en attente`,
        body: `« ${quote.title} » — ${formatFCFA(quote.total)}${quote.validUntil ? ` · valable jusqu'au ${formatDate(quote.validUntil)}` : ""}`,
        url: "/dashboard/devis",
        email: false,
      });
      await db.quote.update({ where: { id: quote.id }, data: { reminderSentAt: now } });
      quoteReminders++;
    } catch (e) {
      errors.push(`devis ${quote.number} : ${e instanceof Error ? e.message : "erreur inconnue"}`);
    }
  }

  // —————————————————————————————— 3) PROJETS — rappel client J-3 ————————————————————

  const inThreeDays = new Date(now.getTime() + 3 * DAY_MS);
  const approaching = await db.project.findMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] },
      deadline: { gte: now, lte: inThreeDays },
      deadlineReminderAt: null,
    },
    include: { client: { select: { id: true, name: true, companyName: true, role: true, email: true } } },
  });

  let projectReminders = 0;
  for (const project of approaching) {
    try {
      const clientName = project.client.role === "ENTREPRISE" ? project.client.companyName || project.client.name : project.client.name;
      const body = `Bonjour ${clientName}, le projet « ${project.title} » arrive à échéance le ${formatDate(project.deadline)} (statut actuel : ${projectLabel(project.status)}, avancement ${project.progress} %). N'hésitez pas à nous faire part de vos retours ou demandes d'ajustement via la messagerie de votre espace client pour tenir le délai.`;

      await sendEmail(project.client.email, `Échéance proche — Projet « ${project.title} »`, body, "/dashboard/projets");
      await notifyUser(project.client.id, {
        title: `Projet « ${project.title} » : échéance le ${formatDate(project.deadline)}`,
        body: `Statut : ${projectLabel(project.status)} · avancement ${project.progress} %`,
        url: "/dashboard/projets",
        email: false,
      });
      await db.project.update({ where: { id: project.id }, data: { deadlineReminderAt: now } });
      projectReminders++;
    } catch (e) {
      errors.push(`projet « ${project.title} » (rappel client) : ${e instanceof Error ? e.message : "erreur inconnue"}`);
    }
  }

  // ————————————————————————————— 4) PROJETS — alerte admin dépassement ———————————————

  const overdue = await db.project.findMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] },
      deadline: { lt: now },
      overdueNotifiedAt: null,
    },
    include: {
      client: { select: { name: true, companyName: true, role: true } },
    },
  });

  let adminAlerts = 0;
  if (overdue.length > 0) {
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    for (const project of overdue) {
      try {
        const clientName = project.client.role === "ENTREPRISE" ? project.client.companyName || project.client.name : project.client.name;
        for (const admin of admins) {
          await notifyUser(admin.id, {
            title: `Projet en retard : « ${project.title} »`,
            body: `Échéance dépassée (${formatDate(project.deadline)}) — client : ${clientName} · statut : ${projectLabel(project.status)}`,
            url: "/admin/projets",
            email: false,
          });
        }
        await db.project.update({ where: { id: project.id }, data: { overdueNotifiedAt: now } });
        adminAlerts++;
      } catch (e) {
        errors.push(`projet « ${project.title} » (alerte admin) : ${e instanceof Error ? e.message : "erreur inconnue"}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    invoices: { passedOverdue: justOverdue.length, remindersSent: invoiceReminders },
    quotes: { passedExpired: justExpired.length, followUpsSent: quoteReminders },
    projects: { deadlineReminders: projectReminders, adminAlerts },
    errors: errors.length > 0 ? errors : undefined,
  });
}
