import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AVATAR_COLORS } from "@/lib/roles";

const createSchema = z.object({
  name: z.string().min(2, "Le nom du membre est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  position: z.string().optional(),
});

/** Gestion de l'équipe interne d'un compte ENTREPRISE. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const members = await db.teamMember.findMany({
    where: { ownerId: session.user.id },
    orderBy: { invitedAt: "desc" },
  });
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ENTREPRISE") {
    return NextResponse.json(
      { error: "Seuls les comptes entreprise peuvent gérer une équipe" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await db.teamMember.findUnique({
      where: { ownerId_email: { ownerId: session.user.id, email } },
    });
    if (existing) {
      return NextResponse.json({ error: "Ce membre fait déjà partie de votre équipe" }, { status: 409 });
    }

    // Si une personne possède déjà un compte RodLab avec cet email, on la rattache
    const linkedUser = await db.user.findUnique({ where: { email } });

    const member = await db.teamMember.create({
      data: {
        ownerId: session.user.id,
        name: parsed.data.name.trim(),
        email,
        phone: parsed.data.phone?.trim() || null,
        position: parsed.data.position?.trim() || null,
        status: linkedUser ? "ACTIVE" : "INVITED",
        userId: linkedUser?.id ?? null,
        joinedAt: linkedUser ? new Date() : null,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("TEAM_CREATE_ERROR", error);
    return NextResponse.json({ error: "Impossible d'ajouter le membre" }, { status: 500 });
  }
}
