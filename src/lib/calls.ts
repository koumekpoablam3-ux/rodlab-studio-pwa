import { db } from "@/lib/db";

export const RING_TIMEOUT_MS = 45_000;
const PING_TIMEOUT_MS = 30_000;
/** Maillage WebRTC : chaque participant envoie son flux à chaque autre → au-delà de 6, ça ne tient pas. */
export const MAX_PARTICIPANTS = 6;

type Outcome = "ENDED" | "DECLINED" | "MISSED" | "CANCELLED";

/**
 * Termine un appel UNE seule fois (la mise à jour conditionnelle sert de verrou) puis laisse une trace
 * dans la conversation d'origine : « Appel vidéo manqué », « Appel audio · 3:12 »…
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
    db.callParticipant.updateMany({ where: { callId, status: { in: ["INVITED", "JOINED"] } }, data: { status: "LEFT" } }),
    db.directMessage.create({
      data: { conversationId: call.conversationId, senderId: call.callerId, type: "CALL", content: `${call.kind}|${label}`, duration },
    }),
    db.conversation.update({ where: { id: call.conversationId }, data: { updatedAt: new Date() } }),
    db.callSignal.deleteMany({ where: { callId } }),
  ]);
  return { ...call, status: outcome };
}

/** Un participant quitte l'appel. L'appel continue tant qu'il reste au moins deux personnes. */
export async function leaveCall(callId: string, userId: string) {
  const call = await db.callSession.findUnique({ where: { id: callId } });
  if (!call || (call.status !== "RINGING" && call.status !== "ACTIVE")) return;

  const mine = await db.callParticipant.findUnique({ where: { callId_userId: { callId, userId } } });
  if (!mine) return;

  if (mine.status === "INVITED") {
    await declineInvite(callId, userId);
    return;
  }
  await db.callParticipant.updateMany({ where: { callId, userId, status: "JOINED" }, data: { status: "LEFT" } });
  await db.callSignal.deleteMany({ where: { callId, OR: [{ fromId: userId }, { toId: userId }] } });

  if (call.status === "RINGING") {
    // L'hôte raccroche avant que quiconque décroche
    if (userId === call.callerId) await finishCall(callId, "CANCELLED");
    return;
  }
  const joined = await db.callParticipant.count({ where: { callId, status: "JOINED" } });
  if (joined < 2) await finishCall(callId, "ENDED");
}

/** Un invité refuse. Si l'appel sonnait encore et que plus personne n'est invité : appel refusé. */
export async function declineInvite(callId: string, userId: string) {
  await db.callParticipant.updateMany({ where: { callId, userId, status: "INVITED" }, data: { status: "DECLINED" } });
  const call = await db.callSession.findUnique({ where: { id: callId } });
  if (call?.status === "RINGING") {
    const stillInvited = await db.callParticipant.count({ where: { callId, status: "INVITED" } });
    if (stillInvited === 0) await finishCall(callId, "DECLINED");
  }
}

/** Écarte les participants « fantômes » d'un appel (onglet fermé, réseau perdu). */
export async function expireStaleInCall(callId: string) {
  const stale = await db.callParticipant.findMany({
    where: { callId, status: "JOINED", pingAt: { lt: new Date(Date.now() - PING_TIMEOUT_MS) } },
    select: { userId: true },
  });
  for (const p of stale) await leaveCall(callId, p.userId);
}

/** Nettoyage opportuniste à chaque sondage : invitations restées sans réponse, appels sans signe de vie. */
export async function expireStaleCalls(userId: string) {
  const now = Date.now();

  const unanswered = await db.callParticipant.findMany({
    where: { userId, status: "INVITED", invitedAt: { lt: new Date(now - RING_TIMEOUT_MS) } },
  });
  for (const inv of unanswered) {
    await db.callParticipant.updateMany({ where: { callId: inv.callId, userId, status: "INVITED" }, data: { status: "MISSED" } });
    const call = await db.callSession.findUnique({ where: { id: inv.callId } });
    if (call?.status === "RINGING") {
      const stillInvited = await db.callParticipant.count({ where: { callId: inv.callId, status: "INVITED" } });
      if (stillInvited === 0) await finishCall(inv.callId, "MISSED");
    }
  }

  const mine = await db.callParticipant.findMany({ where: { userId, status: "JOINED" }, select: { callId: true } });
  for (const m of mine) await expireStaleInCall(m.callId);

  const abandoned = await db.callSession.findMany({
    where: { callerId: userId, status: "RINGING", createdAt: { lt: new Date(now - RING_TIMEOUT_MS - 10_000) } },
    select: { id: true },
  });
  for (const c of abandoned) await finishCall(c.id, "MISSED");
}

/** La personne est-elle déjà prise dans un appel (en cours ou qui sonne) ? */
export async function isBusy(userId: string) {
  const row = await db.callParticipant.findFirst({
    where: {
      userId,
      OR: [{ status: "JOINED" }, { status: "INVITED", invitedAt: { gt: new Date(Date.now() - RING_TIMEOUT_MS) } }],
    },
    select: { callId: true },
  });
  if (!row) return false;
  const call = await db.callSession.findUnique({ where: { id: row.callId }, select: { status: true } });
  return call?.status === "RINGING" || call?.status === "ACTIVE";
}
