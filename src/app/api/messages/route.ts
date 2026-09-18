import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { presenceCamp, otherPresenceRole, readPresence } from "@/lib/chat-presence";

const sendSchema = z
  .object({
    clientId: z.string().min(1),
    content: z.string().min(1, "Le message ne peut pas être vide"),
    type: z.enum(["TEXT", "AUDIO"]).default("TEXT"),
    audioDuration: z.number().int().positive().max(180).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "TEXT" && data.content.length > 4000) {
      ctx.addIssue({ code: z.ZodIssueCode.too_big, maximum: 4000, type: "string", inclusive: true, path: ["content"], message: "Message trop long (max 4000 caractères)" });
    }
    // Un vocal encodé en base64 : ~180s à 24 kbps ≈ 700 Ko bruts ≈ 950 Ko en base64. On plafonne large à 2 Mo de texte.
    if (data.type === "AUDIO" && data.content.length > 2_000_000) {
      ctx.addIssue({ code: z.ZodIssueCode.too_big, maximum: 2_000_000, type: "string", inclusive: true, path: ["content"], message: "Message vocal trop volumineux" });
    }
    if (data.type === "AUDIO" && !data.audioDuration) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["audioDuration"], message: "Durée manquante pour le message vocal" });
    }
  });

/**
 * Messagerie unifiée :
 *  - GET  ?clientId=… : messages du fil (client courant ou client ciblé par l'admin) + présence de l'autre camp
 *  - GET  sans param : liste des fils pour l'admin / fil du client sinon
 *  - POST : envoi d'un message texte ou vocal (client → studio, ou studio → client)
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const myCamp = presenceCamp(session.user.role);

  if (session.user.role === "ADMIN") {
    if (clientId) {
      const messages = await db.message.findMany({
        where: { threadId: clientId },
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true, avatarColor: true } } },
      });
      // marquer comme lus (messages du client vus par l'admin)
      await db.message.updateMany({
        where: { threadId: clientId, senderRole: { not: "ADMIN" }, readAt: null },
        data: { readAt: new Date() },
      });
      const presence = await readPresence(clientId, otherPresenceRole(myCamp));
      return NextResponse.json({ messages, presence });
    }

    // Liste des fils : tous les clients ayant au moins un message
    const clients = await db.user.findMany({
      where: { role: { in: ["CLIENT", "ENTREPRISE"] } },
      select: {
        id: true,
        name: true,
        role: true,
        companyName: true,
        avatarColor: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    const threads = await Promise.all(
      clients
        .filter((c) => c.messages.length > 0)
        .map(async (c) => ({
          clientId: c.id,
          clientName: c.role === "ENTREPRISE" ? c.companyName || c.name : c.name,
          role: c.role,
          avatarColor: c.avatarColor,
          lastMessage: c.messages[0],
          unreadCount: await db.message.count({ where: { threadId: c.id, senderRole: { not: "ADMIN" }, readAt: null } }),
        }))
    );

    return NextResponse.json({ threads });
  }

  // Client / Entreprise : son propre fil
  if (clientId && clientId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const messages = await db.message.findMany({
    where: { threadId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, role: true, avatarColor: true } } },
  });

  await db.message.updateMany({
    where: { threadId: session.user.id, senderRole: "ADMIN", readAt: null },
    data: { readAt: new Date() },
  });

  const presence = await readPresence(session.user.id, otherPresenceRole(myCamp));
  return NextResponse.json({ messages, presence });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const targetClientId =
      session.user.role === "ADMIN" ? parsed.data.clientId : session.user.id;

    const target = await db.user.findUnique({ where: { id: targetClientId } });
    if (!target) return NextResponse.json({ error: "Destinataire introuvable" }, { status: 404 });

    const message = await db.message.create({
      data: {
        threadId: targetClientId,
        senderId: session.user.id,
        senderRole: session.user.role,
        content: parsed.data.type === "AUDIO" ? parsed.data.content : parsed.data.content.trim(),
        type: parsed.data.type,
        audioDuration: parsed.data.audioDuration,
      },
      include: { sender: { select: { id: true, name: true, role: true, avatarColor: true } } },
    });

    // On vient d'envoyer : plus la peine d'afficher « en train d'écrire » à l'autre camp
    await db.chatPresence.deleteMany({ where: { threadId: targetClientId, role: presenceCamp(session.user.role) } });

    const notifBody = parsed.data.type === "AUDIO"
      ? "🎤 Message vocal"
      : parsed.data.content.length > 90
        ? `${parsed.data.content.slice(0, 90)}…`
        : parsed.data.content;

    // Notification push au destinataire
    if (session.user.role === "ADMIN") {
      await notifyUser(targetClientId, {
        title: "Nouveau message de RodLab Studio",
        body: notifBody,
        url: "/dashboard/messagerie",
        tag: "message",
      });
    } else {
      const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      await Promise.all(
        admins.map((admin) =>
          notifyUser(admin.id, {
            title: `Message de ${target.role === "ENTREPRISE" ? target.companyName || target.name : target.name}`,
            body: notifBody,
            url: `/admin/messagerie?client=${targetClientId}`,
            tag: "message",
          })
        )
      );
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("MESSAGE_SEND_ERROR", error);
    return NextResponse.json({ error: "Impossible d'envoyer le message" }, { status: 500 });
  }
}
