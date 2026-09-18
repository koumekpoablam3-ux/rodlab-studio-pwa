import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  serviceType: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "REVIEW", "DELIVERED", "CANCELLED"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  budget: z.number().nonnegative().optional().nullable(),
  deadline: z.string().optional().nullable(),
  tasks: z.array(z.object({ title: z.string().min(1), done: z.boolean(), order: z.number().int() })).optional(),
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

    const project = await db.project.findUnique({ where: { id }, include: { client: true } });
    if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

    const { tasks, deadline, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;
    if (rest.status === "DELIVERED") {
      data.deliveredAt = project.deliveredAt ?? new Date();
      if (rest.progress === undefined) data.progress = 100;
    }

    const updated = await db.project.update({ where: { id }, data });

    if (tasks) {
      await db.projectTask.deleteMany({ where: { projectId: id } });
      if (tasks.length > 0) {
        await db.projectTask.createMany({
          data: tasks.map((t, i) => ({
            projectId: id,
            title: t.title,
            done: t.done,
            order: t.order ?? i,
          })),
        });
      }
    }

    // Notifications client sur les changements significatifs
    if (rest.status && rest.status !== project.status) {
      const labels: Record<string, string> = {
        PENDING: "mise en attente",
        IN_PROGRESS: "démarré",
        REVIEW: "en révision — vos retours sont attendus",
        DELIVERED: "livré",
        CANCELLED: "annulé",
      };
      await notifyUser(project.clientId, {
        title: `Projet ${labels[rest.status] ?? "mis à jour"}`,
        body: `« ${updated.title} » : statut « ${labels[rest.status] ?? rest.status} ».`,
        url: `/dashboard/projets/${id}`,
        tag: "project",
      });
    } else if (rest.progress !== undefined && rest.progress !== project.progress) {
      await notifyUser(project.clientId, {
        title: "Avancement du projet",
        body: `« ${updated.title} » est maintenant à ${rest.progress} % d'avancement.`,
        url: `/dashboard/projets/${id}`,
        tag: "project",
      });
    }

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("PROJECT_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Impossible de modifier le projet" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }
}
