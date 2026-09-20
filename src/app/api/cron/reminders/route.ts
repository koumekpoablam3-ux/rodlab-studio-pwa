import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { notifyUser } from "@/lib/push";
import { formatFCFA, formatDate } from "@/lib/format";

/**
 * Tâche planifiée (Vercel Cron, voir vercel.json) — une fois par jour :
 *  1) Passe en OVERDUE les factures SENT dont l'échéance est dépassée.
 *  2) Envoie un rappel par email au client pour chaque facture qui vient de
 *     passer en retard (une seule fois par facture, grâce à reminderSentAt —
 *     jamais de spam quotidien pour la même facture).
 *
 * Protégée par CRON_SECRET : Vercel l'envoie automatiquement en en-tête
 * Authorization quand un cron est déclaré dans vercel.json avec cette variable
 * définie côté projet. Sans CRON_SECRET configuré, la route refuse tout appel
 * (fermé par défaut, jamais ouvert par erreur).
 */
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

  // 1) Bascule automatique SENT → OVERDUE
  const justOverdue = await db.invoice.findMany({
    where: { status: "SENT", dueDate: { lt: now } },
    select: { id: true },
  });
  if (justOverdue.length > 0) {
    await db.invoice.updateMany({
      where: { id: { in: justOverdue.map((i) => i.id) } },
      data: { status: "OVERDUE" },
    });
  }

  // 2) Rappel email pour toute facture en retard jamais encore relancée
  const toRemind = await db.invoice.findMany({
    where: { status: "OVERDUE", reminderSentAt: null },
    include: { client: { select: { id: true, name: true, companyName: true, role: true, email: true } } },
  });

  let sent = 0;
  for (const inv of toRemind) {
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
    sent++;
  }

  return NextResponse.json({
    ok: true,
    passedOverdue: justOverdue.length,
    remindersSent: sent,
  });
}
