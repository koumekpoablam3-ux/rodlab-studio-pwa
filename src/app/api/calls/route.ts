import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { getMemberConversation, messagesUrlFor, toPublicUser, touchPresence } from "@/lib/chat";
import { expireStaleCalls } from "@/lib/calls";
import { notifyUser } from "@/lib/push";

/** Lance un appel audio ou vidéo vers l'autre membre d'une conversation à deux. */
export async function POST(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = z.object({ conversationId: z.string().min(1), kind: z.enum(["AUDIO", "VIDEO"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const conversation = await getMemberConversation(parsed.data.conversationId, me.id);
  if (!conversation) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const others = conversation.members.filter((m) => m.userId !== me.id);
  if (others.length !== 1) return NextResponse.json({ error: "Les appels ne sont possibles que dans une conversation à deux." }, { status: 400 });
  const callee = others[0];

  await touchPresence(me.id);
  await expireStaleCalls(me.id);
  await expireStaleCalls(callee.userId);

  const busy = await db.callSession.findFirst({
    where: { status: { in: ["RINGING", "ACTIVE"] }, OR: [{ callerId: callee.userId }, { calleeId: callee.userId }, { callerId: me.id }, { calleeId: me.id }] },
  });
  if (busy) {
    const mineBusy = busy.callerId === me.id || busy.calleeId === me.id;
    return NextResponse.json({ error: mineBusy ? "Vous êtes déjà en appel." : "Cette personne est déjà en appel." }, { status: 409 });
  }

  const call = await db.callSession.create({
    data: { conversationId: conversation.id, callerId: me.id, calleeId: callee.userId, kind: parsed.data.kind },
  });

  const callerName = toPublicUser(conversation.members.find((m) => m.userId === me.id)!.user).name;
  await notifyUser(callee.userId, {
    title: `Appel ${parsed.data.kind === "VIDEO" ? "vidéo" : "audio"} entrant`,
    body: callerName,
    url: messagesUrlFor(callee.user.role, conversation.id),
    tag: "call",
    email: false,
  });

  return NextResponse.json({ call: { id: call.id, kind: call.kind, status: call.status, conversationId: call.conversationId } }, { status: 201 });
}
