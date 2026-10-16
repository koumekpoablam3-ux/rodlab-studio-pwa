import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { getMemberConversation, messagesUrlFor, toPublicUser, touchPresence } from "@/lib/chat";
import { expireStaleCalls, isBusy } from "@/lib/calls";
import { notifyUser } from "@/lib/push";

/** Lance un appel audio ou vidéo vers l'autre membre d'une conversation à deux (on pourra ensuite inviter d'autres personnes). */
export async function POST(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = z.object({ conversationId: z.string().min(1), kind: z.enum(["AUDIO", "VIDEO"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const conversation = await getMemberConversation(parsed.data.conversationId, me.id);
  if (!conversation) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const others = conversation.members.filter((m) => m.userId !== me.id);
  if (others.length !== 1) return NextResponse.json({ error: "Les appels se lancent depuis une conversation à deux." }, { status: 400 });
  const callee = others[0];

  await touchPresence(me.id);
  await expireStaleCalls(me.id);
  await expireStaleCalls(callee.userId);

  if (await isBusy(me.id)) return NextResponse.json({ error: "Vous êtes déjà en appel." }, { status: 409 });
  if (await isBusy(callee.userId)) return NextResponse.json({ error: "Cette personne est déjà en appel." }, { status: 409 });

  const call = await db.callSession.create({
    data: {
      conversationId: conversation.id,
      callerId: me.id,
      calleeId: callee.userId,
      kind: parsed.data.kind,
    },
  });
  await db.callParticipant.createMany({
    data: [
      { callId: call.id, userId: me.id, status: "JOINED", invitedById: me.id, joinedAt: new Date() },
      { callId: call.id, userId: callee.userId, status: "INVITED", invitedById: me.id },
    ],
  });

  const callerName = toPublicUser(conversation.members.find((m) => m.userId === me.id)!.user).name;
  await notifyUser(callee.userId, {
    title: `Appel ${parsed.data.kind === "VIDEO" ? "vidéo" : "audio"} entrant`,
    body: callerName,
    url: messagesUrlFor(callee.user.role, conversation.id),
    tag: "call",
    email: false,
    call: true,
    callId: call.id,
  });

  return NextResponse.json({ call: { id: call.id, kind: call.kind, status: call.status, conversationId: call.conversationId } }, { status: 201 });
}
