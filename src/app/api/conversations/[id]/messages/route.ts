import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import {
  fileUrl, getMemberConversation, MAX_FILE_BYTES, messagePreview, notifyMembers, toPublicUser, touchPresence, TYPING_WINDOW_MS,
} from "@/lib/chat";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Messages d'une conversation.
 *  - sans `since` : les 100 derniers messages
 *  - avec `since` (ISO) : uniquement les plus récents (le client dédoublonne par id)
 * Marque la conversation comme lue pour l'utilisateur courant.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const conversation = await getMemberConversation(id, me.id);
  if (!conversation) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  await touchPresence(me.id);

  const sinceRaw = new URL(req.url).searchParams.get("since");
  const since = sinceRaw ? new Date(sinceRaw) : null;

  let rows;
  if (since && !Number.isNaN(since.getTime())) {
    rows = await db.directMessage.findMany({ where: { conversationId: id, createdAt: { gt: since } }, orderBy: { createdAt: "asc" }, take: 200 });
  } else {
    rows = (await db.directMessage.findMany({ where: { conversationId: id }, orderBy: { createdAt: "desc" }, take: 100 })).reverse();
  }

  await db.conversationMember.update({
    where: { conversationId_userId: { conversationId: id, userId: me.id } },
    data: { lastReadAt: new Date() },
  });

  const others = conversation.members.filter((m) => m.userId !== me.id);
  const typingRows = await db.chatTyping.findMany({
    where: { conversationId: id, userId: { not: me.id }, updatedAt: { gt: new Date(Date.now() - TYPING_WINDOW_MS) } },
  });
  const nameOf = new Map(others.map((m) => [m.userId, toPublicUser(m.user).name]));

  return NextResponse.json({
    messages: rows.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      type: m.type,
      content: m.content,
      fileUrl: fileUrl(m.fileId),
      fileName: m.fileName,
      fileMime: m.fileMime,
      fileSize: m.fileSize,
      duration: m.duration,
      createdAt: m.createdAt.toISOString(),
    })),
    members: conversation.members.map((m) => toPublicUser(m.user)),
    // « Lu » : le plus ancien dernier-passage parmi les autres membres
    othersReadAt: others.length ? new Date(Math.min(...others.map((m) => m.lastReadAt.getTime()))).toISOString() : null,
    typing: typingRows.map((t) => ({ userId: t.userId, name: nameOf.get(t.userId) ?? "", state: t.state })),
  });
}

const textSchema = z.object({ content: z.string().trim().min(1, "Le message ne peut pas être vide").max(4000, "Message trop long (4000 caractères max)") });

function cleanFileName(name: string) {
  const base = name.replace(/[\\/\u0000-\u001f"<>|?*:]/g, "_").trim();
  return (base || "fichier").slice(0, 120);
}

/** Envoi : JSON {content} pour du texte, ou multipart (file, caption?, voice?, duration?) pour une pièce jointe. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const conversation = await getMemberConversation(id, me.id);
  if (!conversation) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    let data: { type: string; content: string; fileId?: string; fileName?: string; fileMime?: string; fileSize?: number; duration?: number };

    if ((req.headers.get("content-type") ?? "").startsWith("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "Fichier trop lourd (4 Mo maximum)" }, { status: 413 });
      }

      const isVoice = form.get("voice") === "1";
      const mime = (file.type || "application/octet-stream").toLowerCase();
      const caption = String(form.get("caption") ?? "").trim().slice(0, 1000);
      let duration: number | undefined;
      if (isVoice) {
        if (!mime.startsWith("audio/")) return NextResponse.json({ error: "Format audio invalide" }, { status: 400 });
        duration = Math.min(Math.max(Math.round(Number(form.get("duration")) || 1), 1), 600);
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const stored = await db.chatFile.create({ data: { mime, size: bytes.length, data: bytes }, select: { id: true } });
      const isImage = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime);
      data = {
        type: isVoice ? "AUDIO" : isImage ? "IMAGE" : "FILE",
        content: isVoice ? "" : caption,
        fileId: stored.id,
        fileName: cleanFileName(file.name),
        fileMime: mime,
        fileSize: bytes.length,
        duration,
      };
    } else {
      const parsed = textSchema.safeParse(await req.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
      data = { type: "TEXT", content: parsed.data.content };
    }

    const now = new Date();
    const [message] = await db.$transaction([
      db.directMessage.create({ data: { conversationId: id, senderId: me.id, ...data } }),
      db.conversation.update({ where: { id }, data: { updatedAt: now } }),
      db.conversationMember.update({ where: { conversationId_userId: { conversationId: id, userId: me.id } }, data: { lastReadAt: now } }),
      db.chatTyping.deleteMany({ where: { conversationId: id, userId: me.id } }),
    ]);

    const senderName = toPublicUser(conversation.members.find((m) => m.userId === me.id)!.user).name;
    await notifyMembers(id, conversation.members, me.id, `Message de ${senderName}`, messagePreview({ ...data, fileName: data.fileName }), "message");

    return NextResponse.json(
      {
        message: {
          id: message.id, senderId: message.senderId, type: message.type, content: message.content, fileUrl: fileUrl(message.fileId),
          fileName: message.fileName, fileMime: message.fileMime, fileSize: message.fileSize, duration: message.duration,
          createdAt: message.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DIRECT_MESSAGE_SEND_ERROR", error);
    return NextResponse.json({ error: "Impossible d'envoyer le message" }, { status: 500 });
  }
}
