import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { PUBLIC_USER_SELECT, toPublicUser, touchPresence } from "@/lib/chat";
import { expireStaleCalls, RING_TIMEOUT_MS } from "@/lib/calls";

export const dynamic = "force-dynamic";

/**
 * Sondage unique pour toute l'application :
 *  - présence « en ligne » (signe de vie)
 *  - appel entrant éventuel
 *  - si un appel est en cours (?callId=) : son statut + les messages de signalisation WebRTC
 *    en attente (lus puis supprimés)
 */
export async function GET(req: NextRequest) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  await touchPresence(me.id);
  await expireStaleCalls(me.id);

  const incomingRow = await db.callSession.findFirst({
    where: { calleeId: me.id, status: "RINGING", createdAt: { gt: new Date(Date.now() - RING_TIMEOUT_MS) } },
    orderBy: { createdAt: "desc" },
  });
  let incoming: Record<string, unknown> | null = null;
  if (incomingRow) {
    const caller = await db.user.findUnique({ where: { id: incomingRow.callerId }, select: PUBLIC_USER_SELECT });
    incoming = {
      id: incomingRow.id,
      kind: incomingRow.kind,
      conversationId: incomingRow.conversationId,
      caller: caller ? toPublicUser(caller) : null,
    };
  }

  const callId = new URL(req.url).searchParams.get("callId");
  let call: Record<string, unknown> | null = null;
  let signals: { type: string; payload: string }[] = [];
  if (callId) {
    const row = await db.callSession.findUnique({ where: { id: callId } });
    if (row && (row.callerId === me.id || row.calleeId === me.id)) {
      const isCaller = row.callerId === me.id;
      const lastPing = (isCaller ? row.callerPingAt : row.calleePingAt).getTime();
      if (row.status === "ACTIVE" && Date.now() - lastPing > 5_000) {
        await db.callSession.update({ where: { id: row.id }, data: isCaller ? { callerPingAt: new Date() } : { calleePingAt: new Date() } });
      }
      const pending = await db.callSignal.findMany({ where: { callId, toId: me.id }, orderBy: { createdAt: "asc" }, take: 100 });
      if (pending.length > 0) await db.callSignal.deleteMany({ where: { id: { in: pending.map((s) => s.id) } } });
      signals = pending.map((s) => ({ type: s.type, payload: s.payload }));
      call = { id: row.id, status: row.status, kind: row.kind, callerId: row.callerId, calleeId: row.calleeId };
    }
  }

  return NextResponse.json({ incoming, call, signals });
}
