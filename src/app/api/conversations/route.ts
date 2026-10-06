import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { canChat, getOrCreateDirect, messagePreview, PUBLIC_USER_SELECT, toPublicUser, touchPresence } from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Liste des conversations de l'utilisateur (avec non-lus et dernier message). */
export async function GET() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await touchPresence(me.id);

  const rows = await db.conversation.findMany({
    where: { members: { some: { userId: me.id } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      members: { include: { user: { select: PUBLIC_USER_SELECT } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const visible = rows.filter((c) => c.messages.length > 0 || c.createdById === me.id);
  const conversations = await Promise.all(
    visible.map(async (c) => {
      const mine = c.members.find((m) => m.userId === me.id);
      const unread = await db.directMessage.count({
        where: { conversationId: c.id, senderId: { not: me.id }, createdAt: { gt: mine?.lastReadAt ?? new Date(0) } },
      });
      const last = c.messages[0];
      return {
        id: c.id,
        others: c.members.filter((m) => m.userId !== me.id).map((m) => toPublicUser(m.user)),
        unread,
        updatedAt: c.updatedAt.toISOString(),
        last: last
          ? { preview: messagePreview(last), senderId: last.senderId, type: last.type, createdAt: last.createdAt.toISOString() }
          : null,
      };
    })
  );

  return NextResponse.json({ conversations });
}

/** Ouvre (ou crée) la conversation avec un utilisateur — sans qu'il ait écrit en premier. */
export async function POST(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = z.object({ userId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const target = await db.user.findFirst({ where: { id: parsed.data.userId, active: true }, select: { id: true, role: true } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (!(await canChat(me, target))) {
    return NextResponse.json({ error: "La messagerie entre clients est désactivée par l'administrateur." }, { status: 403 });
  }

  const id = await getOrCreateDirect(me.id, target.id);
  return NextResponse.json({ id });
}
