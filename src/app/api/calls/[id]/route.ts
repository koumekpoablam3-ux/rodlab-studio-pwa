import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { finishCall } from "@/lib/calls";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("accept") }),
  z.object({ action: z.literal("decline") }),
  z.object({ action: z.literal("end") }),
  z.object({ action: z.literal("signal"), type: z.enum(["offer", "answer", "ice"]), payload: z.string().min(1).max(30000) }),
]);

/** Actions sur un appel : accept | decline | end | signal (offre / réponse / candidat ICE). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const call = await db.callSession.findUnique({ where: { id } });
  if (!call || (call.callerId !== me.id && call.calleeId !== me.id)) {
    return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });
  }
  const isCaller = call.callerId === me.id;
  const body = parsed.data;

  switch (body.action) {
    case "accept": {
      if (isCaller) return NextResponse.json({ error: "Action impossible" }, { status: 400 });
      const res = await db.callSession.updateMany({
        where: { id, status: "RINGING" },
        data: { status: "ACTIVE", answeredAt: new Date(), callerPingAt: new Date(), calleePingAt: new Date() },
      });
      if (res.count === 0) return NextResponse.json({ error: "L'appel est terminé." }, { status: 409 });
      return NextResponse.json({ status: "ACTIVE" });
    }
    case "decline": {
      if (isCaller) return NextResponse.json({ error: "Action impossible" }, { status: 400 });
      const done = await finishCall(id, "DECLINED");
      return NextResponse.json({ status: done?.status });
    }
    case "end": {
      let outcome: "ENDED" | "DECLINED" | "CANCELLED" = "ENDED";
      if (call.status === "RINGING") outcome = isCaller ? "CANCELLED" : "DECLINED";
      const done = await finishCall(id, outcome);
      return NextResponse.json({ status: done?.status });
    }
    case "signal": {
      if (call.status !== "RINGING" && call.status !== "ACTIVE") return NextResponse.json({ error: "Appel terminé" }, { status: 409 });
      await db.callSignal.create({
        data: { callId: id, fromId: me.id, toId: isCaller ? call.calleeId : call.callerId, type: body.type, payload: body.payload },
      });
      return NextResponse.json({ ok: true });
    }
  }
}
