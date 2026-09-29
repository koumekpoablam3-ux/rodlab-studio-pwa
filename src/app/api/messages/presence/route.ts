import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { presenceCamp, writePresence, clearPresence } from "@/lib/chat-presence";

const presenceSchema = z.object({
  clientId: z.string().min(1).optional(), // requis côté admin, ignoré côté client
  state: z.enum(["typing", "recording", "idle"]),
});

/**
 * Signale à l'autre camp du fil qu'on est en train d'écrire ou d'enregistrer un
 * vocal (façon WhatsApp). Appelé fréquemment (débit limité côté client), donc
 * volontairement minimal : pas de notification, pas de log, juste une ligne
 * upsertée qui se périme seule après quelques secondes sans nouvel appel.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = presenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const threadId = session.user.role === "ADMIN" ? parsed.data.clientId : session.user.id;
  if (!threadId) {
    return NextResponse.json({ error: "clientId requis" }, { status: 400 });
  }
  if (session.user.role !== "ADMIN" && threadId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const camp = presenceCamp(session.user.role);
  if (parsed.data.state === "idle") {
    await clearPresence(threadId, camp);
  } else {
    await writePresence(threadId, camp, parsed.data.state);
  }

  return NextResponse.json({ ok: true });
}
