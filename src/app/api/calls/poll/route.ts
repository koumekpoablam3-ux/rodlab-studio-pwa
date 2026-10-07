import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { PUBLIC_USER_SELECT, toPublicUser, touchPresence } from "@/lib/chat";
import { expireStaleCalls, expireStaleInCall, RING_TIMEOUT_MS } from "@/lib/calls";

export const dynamic = "force-dynamic";

/**
 * Sondage unique pour toute l'application :
 *  - présence « en ligne » (signe de vie)
 *  - invitation à un appel entrante
 *  - si un appel est en cours (?callId=) : son statut, la liste des participants et les messages de
 *    signalisation WebRTC en attente (lus puis supprimés)
 */
export async function GET(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  await touchPresence(me.id);
  await expireStaleCalls(me.id);

  // Invitation en attente (appel qui sonne pour moi)
  let incoming: Record<string, unknown> | null = null;
  const invites = await db.callParticipant.findMany({
    where: { userId: me.id, status: "INVITED", invitedAt: { gt: new Date(Date.now() - RING_TIMEOUT_MS) } },
    orderBy: { invitedAt: "desc" },
    take: 3,
  });
  for (const inv of invites) {
    const call = await db.callSession.findUnique({ where: { id: inv.callId } });
    if (!call || (call.status !== "RINGING" && call.status !== "ACTIVE")) continue;
    const [inviter, joined] = await Promise.all([
      db.user.findUnique({ where: { id: inv.invitedById }, select: PUBLIC_USER_SELECT }),
      db.callParticipant.count({ where: { callId: call.id, status: "JOINED" } }),
    ]);
    incoming = { id: call.id, kind: call.kind, conversationId: call.conversationId, joined, caller: inviter ? toPublicUser(inviter) : null };
    break;
  }

  const callId = new URL(req.url).searchParams.get("callId");
  let call: Record<string, unknown> | null = null;
  let participants: Record<string, unknown>[] = [];
  let signals: { fromId: string; type: string; payload: string }[] = [];

  if (callId) {
    const mine = await db.callParticipant.findUnique({ where: { callId_userId: { callId, userId: me.id } } });
    const row = mine ? await db.callSession.findUnique({ where: { id: callId } }) : null;
    if (mine && row) {
      if (mine.status === "JOINED") {
        if (Date.now() - mine.pingAt.getTime() > 5_000) {
          await db.callParticipant.update({ where: { callId_userId: { callId, userId: me.id } }, data: { pingAt: new Date() } });
        }
        await expireStaleInCall(callId);
      }
      const rows = await db.callParticipant.findMany({ where: { callId } });
      const users = await db.user.findMany({ where: { id: { in: rows.map((r) => r.userId) } }, select: PUBLIC_USER_SELECT });
      const byId = new Map<string, ReturnType<typeof toPublicUser>>(
        users.map((u: Parameters<typeof toPublicUser>[0]) => [u.id, toPublicUser(u)] as [string, ReturnType<typeof toPublicUser>])
      );
      participants = rows.map((r) => ({
        userId: r.userId,
        name: byId.get(r.userId)?.name ?? "Participant",
        avatarColor: byId.get(r.userId)?.avatarColor ?? null,
        status: r.status,
        joinedAt: r.joinedAt ? r.joinedAt.toISOString() : null,
      }));

      const pending = await db.callSignal.findMany({ where: { callId, toId: me.id }, orderBy: { createdAt: "asc" }, take: 200 });
      if (pending.length > 0) await db.callSignal.deleteMany({ where: { id: { in: pending.map((s) => s.id) } } });
      signals = pending.map((s) => ({ fromId: s.fromId, type: s.type, payload: s.payload }));

      const fresh = await db.callSession.findUnique({ where: { id: callId } });
      call = { id: row.id, status: fresh?.status ?? row.status, kind: row.kind, hostId: row.callerId, myStatus: mine.status };
    }
  }

  return NextResponse.json({ incoming, call, participants, signals });
}
