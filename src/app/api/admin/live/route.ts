import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const PLATFORMS = ["ZOOM", "MEET", "YOUTUBE", "STREAMYARD"];
const STATUSES = ["SCHEDULED", "LIVE", "DONE", "CANCELLED"];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

/** Création d'une session live (admin). */
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Réservé aux administrateurs" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : summary;
  const platform = PLATFORMS.includes(body?.platform) ? body.platform : "ZOOM";
  const joinUrl = typeof body?.joinUrl === "string" && body.joinUrl.trim() ? body.joinUrl.trim() : null;
  const startsAt = body?.startsAt ? new Date(body.startsAt) : null;
  const durationMin = Number(body?.durationMin) || 90;
  const capacity = Number(body?.capacity) || 200;

  if (!title || !summary || !startsAt || Number.isNaN(startsAt.getTime()))
    return NextResponse.json({ error: "Titre, résumé et date de début sont requis" }, { status: 400 });

  let slug = slugify(title) || `session-${Date.now()}`;
  if (await db.liveSession.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const liveSession = await db.liveSession.create({
    data: { slug, title, summary, description, platform, joinUrl, startsAt, durationMin, capacity },
  });
  return NextResponse.json({ session: liveSession });
}

/** Mise à jour (statut, lien, date…) d'une session live. */
export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Réservé aux administrateurs" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const existing = await db.liveSession.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.summary === "string" && body.summary.trim()) data.summary = body.summary.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (PLATFORMS.includes(body.platform)) data.platform = body.platform;
  if (STATUSES.includes(body.status)) data.status = body.status;
  if (body.joinUrl !== undefined) data.joinUrl = typeof body.joinUrl === "string" && body.joinUrl.trim() ? body.joinUrl.trim() : null;
  if (body.startsAt) {
    const d = new Date(body.startsAt);
    if (!Number.isNaN(d.getTime())) data.startsAt = d;
  }
  if (body.durationMin) data.durationMin = Number(body.durationMin) || 90;
  if (body.capacity) data.capacity = Number(body.capacity) || 200;

  const liveSession = await db.liveSession.update({ where: { id }, data });
  return NextResponse.json({ session: liveSession });
}

/** Suppression d'une session live. */
export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Réservé aux administrateurs" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await db.liveSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
