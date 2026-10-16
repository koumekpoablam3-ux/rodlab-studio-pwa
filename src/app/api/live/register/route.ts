import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** Inscription à une session RodLab Live (utilisateurs connectés). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;
  const country = typeof body?.country === "string" ? body.country.trim().slice(0, 60) : null;
  if (!sessionId) return NextResponse.json({ error: "sessionId requis" }, { status: 400 });

  const sessionLive = await db.liveSession.findUnique({ where: { id: sessionId } });
  if (!sessionLive) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  if (sessionLive.status === "CANCELLED")
    return NextResponse.json({ error: "Cette session a été annulée" }, { status: 400 });

  const registrations = await db.liveRegistration.count({ where: { sessionId } });
  if (registrations >= sessionLive.capacity)
    return NextResponse.json({ error: "Complet — toutes les places sont prises" }, { status: 400 });

  const existing = await db.liveRegistration.findUnique({
    where: { sessionId_userId: { sessionId, userId: session.user.id } },
  });
  if (existing) return NextResponse.json({ already: true, registrationId: existing.id });

  const registration = await db.liveRegistration.create({
    data: {
      sessionId,
      userId: session.user.id,
      name: session.user.name ?? "Apprenant",
      email: session.user.email ?? "",
      country,
    },
  });

  await db.notification.create({
    data: {
      userId: session.user.id,
      title: "Inscription confirmée — RodLab Live",
      body: `Vous êtes inscrit à « ${sessionLive.title} ». Le lien d'accès vous sera communiqué dans l'application avant la session.`,
      url: `/live/${sessionLive.slug}`,
    },
  });

  return NextResponse.json({ registrationId: registration.id });
}

/** Annule une inscription. */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) return NextResponse.json({ error: "sessionId requis" }, { status: 400 });

  await db.liveRegistration.deleteMany({ where: { sessionId, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
