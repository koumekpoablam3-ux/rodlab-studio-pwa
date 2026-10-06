import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { AVATAR_COLORS } from "@/lib/roles";

const updateSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "CONVERTED", "ARCHIVED"]).optional(),
  notes: z.string().optional().nullable(),
  /** Conversion : créer le compte client + le projet lié */
  convert: z
    .object({
      createAccount: z.boolean(),
      projectTitle: z.string().min(2, "Le titre du projet est requis"),
      projectDescription: z.string().min(10, "Décrivez le projet (10 caractères minimum)"),
      budget: z.number().nonnegative().optional().nullable(),
    })
    .optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const request = await db.quoteRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });

    const data: Record<string, unknown> = {
      status: parsed.data.status,
      notes: parsed.data.notes,
      handledAt: new Date(),
    };

    // — Conversion en client + projet —
    if (parsed.data.convert) {
      if (request.status === "CONVERTED") {
        return NextResponse.json({ error: "Cette demande a déjà été convertie" }, { status: 400 });
      }

      let client = await db.user.findUnique({ where: { email: request.email } });

      if (!client && parsed.data.convert.createAccount) {
        // Mot de passe temporaire : prénom en minuscules + année
        const tempPassword = `RodLab${new Date().getFullYear()}!`;
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        client = await db.user.create({
          data: {
            name: request.name,
            email: request.email,
            phone: request.phone,
            companyName: request.company,
            passwordHash,
            role: request.company ? "ENTREPRISE" : "CLIENT",
            avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]!,
          },
        });
      }

      if (!client) {
        return NextResponse.json(
          { error: "Aucun compte client existant pour cet email. Cochez « créer le compte »." },
          { status: 400 }
        );
      }

      const project = await db.project.create({
        data: {
          title: parsed.data.convert.projectTitle,
          description: parsed.data.convert.projectDescription,
          serviceType: request.serviceType,
          clientId: client.id,
          budget: parsed.data.convert.budget ?? null,
          status: "PENDING",
        },
      });

      data.convertedUserId = client.id;
      data.convertedProjectId = project.id;
      data.status = "CONVERTED";

      await notifyUser(client.id, {
        title: "Bienvenue chez RodLab Studio",
        body: `Votre projet « ${project.title} » est créé. Retrouvez son suivi dans votre espace.`,
        url: `/dashboard/projets/${project.id}`,
        tag: "project",
      });
    }

    const updated = await db.quoteRequest.update({ where: { id }, data });
    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error("REQUEST_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de traiter la demande" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await db.quoteRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }
}
