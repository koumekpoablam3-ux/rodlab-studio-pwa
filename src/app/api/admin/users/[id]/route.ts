import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  role: z.enum(["CLIENT", "ENTREPRISE"]).optional(),
  active: z.boolean().optional(),
  newPassword: z.string().min(8).optional().nullable(),
});


async function lockedAdminTarget(id: string) {
  const target = await db.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "ADMIN") {
    return NextResponse.json(
      { error: "Les comptes administrateur sont gérés par le directeur, depuis la page « Administrateurs »." },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Gestion d'un profil par l'admin :
 *  - GET    : détail complet (profil + projets + devis + factures)
 *  - PATCH  : modification (infos, rôle, réinitialisation de mot de passe)
 *  - DELETE : suppression du compte
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("clients");
  if (!guard.ok) return guard.response;
  const session = { user: guard.user };

  const { id } = await params;
  const locked = await lockedAdminTarget(id);
  if (locked) return locked;
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, phone: true, jobTitle: true,
      companyName: true, address: true, city: true, country: true, avatarColor: true, active: true,
      createdAt: true,
      projects: { orderBy: { createdAt: "desc" }, select: { id: true, title: true, status: true, progress: true, budget: true } },
      quotes: { orderBy: { createdAt: "desc" }, select: { id: true, number: true, title: true, total: true, status: true, createdAt: true } },
      invoices: { orderBy: { createdAt: "desc" }, select: { id: true, number: true, total: true, status: true, createdAt: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("clients");
  if (!guard.ok) return guard.response;
  const session = { user: guard.user };

  const { id } = await params;
  const locked = await lockedAdminTarget(id);
  if (locked) return locked;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { newPassword, role, active, ...rest } = parsed.data;

    const data: Record<string, unknown> = { ...rest };
    if (role) data.role = role;
    if (typeof active === "boolean") data.active = active;
    if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 12);

    const user = await db.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("ADMIN_USER_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de modifier l'utilisateur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin("clients");
  if (!guard.ok) return guard.response;
  const session = { user: guard.user };

  const { id } = await params;
  const locked = await lockedAdminTarget(id);
  if (locked) return locked;
  if (id === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
  }

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }
}
