import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { canChat, messagesUrlFor } from "@/lib/chat";
import { declineInvite, isBusy, leaveCall, MAX_PARTICIPANTS, RING_TIMEOUT_MS } from "@/lib/calls";
import { notifyUser } from "@/lib/push";

const signalItem = z.object({
  to: z.string().min(1),
  type: z.enum(["offer", "answer", "ice", "meta"]),
  payload: z.string().min(1).max(30000),
});

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("accept") }),
  z.object({ action: z.literal("decline") }),
  z.object({ action: z.literal("end") }),
  z.object({ action: z.literal("invite"), userId: z.string().min(1) }),
  z.object({ action: z.literal("signal"), items: z.array(signalItem).min(1).max(60) }),
]);

/** Actions sur un appel : accept | decline | end | invite (ajouter une personne) | signal (WebRTC, par lots). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const call = await db.callSession.findUnique({ where: { id } });
  const mine = call ? await db.callParticipant.findUnique({ where: { callId_userId: { callId: id, userId: me.id } } }) : null;
  if (!call || !mine) return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });
  const live = call.status === "RINGING" || call.status === "ACTIVE";
  const body = parsed.data;

  switch (body.action) {
    case "accept": {
      if (!live || mine.status !== "INVITED" || Date.now() - mine.invitedAt.getTime() > RING_TIMEOUT_MS + 5000) {
        return NextResponse.json({ error: "L'appel est terminé." }, { status: 409 });
      }
      const now = new Date();
      await db.$transaction([
        db.callParticipant.update({ where: { callId_userId: { callId: id, userId: me.id } }, data: { status: "JOINED", joinedAt: now, pingAt: now } }),
        db.callSession.updateMany({ where: { id, status: "RINGING" }, data: { status: "ACTIVE", answeredAt: now } }),
      ]);
      return NextResponse.json({ status: "ACTIVE" });
    }

    case "decline": {
      if (mine.status !== "INVITED") return NextResponse.json({ status: call.status });
      await declineInvite(id, me.id);
      return NextResponse.json({ ok: true });
    }

    case "end": {
      await leaveCall(id, me.id);
      return NextResponse.json({ ok: true });
    }

    case "invite": {
      if (!live || mine.status !== "JOINED") return NextResponse.json({ error: "Rejoignez l'appel pour inviter quelqu'un." }, { status: 409 });
      const target = await db.user.findFirst({ where: { id: body.userId, active: true }, select: { id: true, role: true } });
      if (!target || target.id === me.id) return NextResponse.json({ error: "Personne introuvable" }, { status: 404 });
      if (!(await canChat({ id: me.id, role: me.role }, target))) {
        return NextResponse.json({ error: "Vous ne pouvez pas inviter cette personne." }, { status: 403 });
      }
      const active = await db.callParticipant.count({ where: { callId: id, status: { in: ["JOINED", "INVITED"] } } });
      if (active >= MAX_PARTICIPANTS) {
        return NextResponse.json({ error: `Un appel est limité à ${MAX_PARTICIPANTS} personnes.` }, { status: 409 });
      }
      const existing = await db.callParticipant.findUnique({ where: { callId_userId: { callId: id, userId: target.id } } });
      if (existing && (existing.status === "JOINED" || (existing.status === "INVITED" && Date.now() - existing.invitedAt.getTime() < RING_TIMEOUT_MS))) {
        return NextResponse.json({ error: "Cette personne est déjà dans l'appel ou en train d'être appelée." }, { status: 409 });
      }
      if (await isBusy(target.id)) return NextResponse.json({ error: "Cette personne est déjà en appel." }, { status: 409 });

      const now = new Date();
      await db.callParticipant.upsert({
        where: { callId_userId: { callId: id, userId: target.id } },
        create: { callId: id, userId: target.id, status: "INVITED", invitedById: me.id, invitedAt: now },
        update: { status: "INVITED", invitedById: me.id, invitedAt: now, joinedAt: null, pingAt: now },
      });

      await notifyUser(target.id, {
        title: `Invitation à un appel ${call.kind === "VIDEO" ? "vidéo" : "audio"}`,
        body: `${me.name || "Un collègue"} vous invite à rejoindre l'appel`,
        url: messagesUrlFor(target.role, call.conversationId).split("?")[0],
        tag: "call",
        email: false,
        call: true,
        callId: id,
      });
      return NextResponse.json({ ok: true });
    }

    case "signal": {
      if (!live || mine.status !== "JOINED") return NextResponse.json({ error: "Appel terminé" }, { status: 409 });
      const joined = new Set(
        (await db.callParticipant.findMany({ where: { callId: id, status: "JOINED" }, select: { userId: true } })).map((p) => p.userId)
      );
      const items = body.items.filter((i) => i.to !== me.id && joined.has(i.to));
      if (items.length > 0) {
        await db.callSignal.createMany({
          data: items.map((i) => ({ callId: id, fromId: me.id, toId: i.to, type: i.type, payload: i.payload })),
        });
      }
      return NextResponse.json({ ok: true, sent: items.length });
    }
  }
}
