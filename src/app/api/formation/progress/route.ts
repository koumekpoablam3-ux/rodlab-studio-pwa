import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** Marque une leçon comme terminée (et permet de l'annuler). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const lessonId = typeof body?.lessonId === "string" ? body.lessonId : null;
  const done = body?.done !== false;
  if (!lessonId) return NextResponse.json({ error: "lessonId requis" }, { status: 400 });

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "Leçon introuvable" }, { status: 404 });

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } },
  });
  if (!enrollment)
    return NextResponse.json({ error: "Inscrivez-vous d'abord à la formation" }, { status: 403 });

  const totalLessons = await db.lesson.count({
    where: { module: { courseId: lesson.module.courseId } },
  });
  const completedLessons = await db.lessonProgress.count({
    where: { userId: session.user.id, lesson: { module: { courseId: lesson.module.courseId } } },
  });

  if (done) {
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: { userId: session.user.id, lessonId },
      update: {},
    });
  } else {
    await db.lessonProgress.deleteMany({ where: { userId: session.user.id, lessonId } });
  }

  const nowCompleted = done ? completedLessons + 1 : completedLessons - 1;
  const percent = totalLessons > 0 ? Math.round((nowCompleted / totalLessons) * 100) : 0;

  // Fin du parcours : tous les modules terminés → statut COMPLETED
  if (nowCompleted >= totalLessons && totalLessons > 0) {
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  } else if (enrollment.status === "COMPLETED") {
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "ACTIVE", completedAt: null },
    });
  }

  return NextResponse.json({ completedLessons: nowCompleted, totalLessons, percent });
}
