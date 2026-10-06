import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  status: z.enum(["INVITED", "ACTIVE", "SUSPENDED"]).optional(),
  position: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ENTREPRISE") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const member = await db.teamMember.findFirst({
      where: { id, ownerId: session.user.id },
    });
    if (!member) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });

    const updated = await db.teamMember.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("TEAM_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de modifier le membre" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ENTREPRISE") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const member = await db.teamMember.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!member) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });

  await db.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
