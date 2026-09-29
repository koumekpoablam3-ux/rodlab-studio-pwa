import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { serviceTypeLabel } from "@/lib/roles";

const createSchema = z.object({
  title: z.string().min(2, "Le titre du projet est requis"),
  description: z.string().min(10, "Décrivez le projet (10 caractères minimum)"),
  serviceType: z.string().default("design-graphique"),
  clientId: z.string().min(1, "Sélectionnez un client"),
  status: z.enum(["PENDING", "IN_PROGRESS", "REVIEW", "DELIVERED", "CANCELLED"]).default("PENDING"),
  progress: z.number().int().min(0).max(100).default(0),
  budget: z.number().nonnegative().optional().nullable(),
  deadline: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const projects = await db.project.findMany({
    include: { client: { select: { id: true, name: true, companyName: true, role: true, avatarColor: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
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

    const client = await db.user.findUnique({ where: { id: parsed.data.clientId } });
    if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

    const project = await db.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        serviceType: parsed.data.serviceType,
        clientId: parsed.data.clientId,
        status: parsed.data.status,
        progress: parsed.data.progress,
        budget: parsed.data.budget ?? null,
        deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      },
    });

    await notifyUser(client.id, {
      title: "Nouveau projet",
      body: `Votre projet « ${project.title} » a été créé chez RodLab Studio.`,
      url: `/dashboard/projets/${project.id}`,
      tag: "project",
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("PROJECT_CREATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de créer le projet" }, { status: 500 });
  }
}
