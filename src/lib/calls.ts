import { db } from "@/lib/db";

export const RING_TIMEOUT_MS = 45_000;
const PING_TIMEOUT_MS = 30_000;

type Outcome = "ENDED" | "DECLINED" | "MISSED" | "CANCELLED";

/**
 * Termine un appel UNE seule fois (la mise à jour conditionnelle sert de verrou) puis
 * laisse une trace dans la conversation : « Appel vidéo manqué », « Appel audio · 3:12 »…
 */
export async function finishCall(callId: string, outcome: Outcome) {
  const call = await db.callSession.findUnique({ where: { id: callId } });
  if (!call) return null;

  const claimed = await db.callSession.updateMany({
    where: { id: callId, status: { in: ["RINGING", "ACTIVE"] } },
    data: { status: outcome, endedAt: new Date() },
  });
  if (claimed.count === 0) return call;

  const duration =
    outcome === "ENDED" && call.answeredAt ? Math.max(1, Math.round((Date.now() - call.answeredAt.getTime()) / 1000)) : null;
  const label = outcome === "ENDED" ? "ended" : outcome === "DECLINED" ? "declined" : "missed";

  await db.$transaction([
    db.directMessage.create({
      data: { conversationId: call.conversationId, senderId: call.callerId, type: "CALL", content: `${call.kind}|${label}`, duration },
    }),
    db.conversation.update({ where: { id: call.conversationId }, data: { updatedAt: new Date() } }),
    db.callSignal.deleteMany({ where: { callId } }),
  ]);
  return { ...call, status: outcome };
}

/** Clôture les appels « fantômes » : sonnerie trop longue, ou un participant qui a fermé son onglet. */
export async function expireStaleCalls(userId: string) {
  const mine = await db.callSession.findMany({
    where: { status: { in: ["RINGING", "ACTIVE"] }, OR: [{ callerId: userId }, { calleeId: userId }] },
  });
  const now = Date.now();
  for (const c of mine) {
    if (c.status === "RINGING" && now - c.createdAt.getTime() > RING_TIMEOUT_MS) {
      await finishCall(c.id, "MISSED");
    } else if (c.status === "ACTIVE" && (now - c.callerPingAt.getTime() > PING_TIMEOUT_MS || now - c.calleePingAt.getTime() > PING_TIMEOUT_MS)) {
      await finishCall(c.id, "ENDED");
    }
  }
}
