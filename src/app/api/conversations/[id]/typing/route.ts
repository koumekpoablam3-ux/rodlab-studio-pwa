import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { getMemberConversation } from "@/lib/chat";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const parsed = z.object({ state: z.enum(["typing", "recording", "idle"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  if (!(await getMemberConversation(id, me.id))) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  if (parsed.data.state === "idle") {
    await db.chatTyping.deleteMany({ where: { conversationId: id, userId: me.id } });
  } else {
    await db.chatTyping.upsert({
      where: { conversationId_userId: { conversationId: id, userId: me.id } },
      create: { conversationId: id, userId: me.id, state: parsed.data.state },
      update: { state: parsed.data.state },
    });
  }
  return NextResponse.json({ ok: true });
}
