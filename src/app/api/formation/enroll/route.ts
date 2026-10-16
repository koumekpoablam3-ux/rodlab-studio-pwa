import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Inscription (gratuite) à un cours RodLab Academy.
 * Body optionnel : { courseId } — sinon, premier cours publié (compat v8.5).
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const courseId = typeof body?.courseId === "string" ? body.courseId : null;

  const course = courseId
    ? await db.course.findFirst({ where: { id: courseId, published: true } })
    : await db.course.findFirst({ where: { published: true }, orderBy: { createdAt: "asc" } });
  if (!course) return NextResponse.json({ error: "Aucune formation disponible" }, { status: 404 });

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing) return NextResponse.json({ enrollmentId: existing.id, already: true });

  const enrollment = await db.enrollment.create({
    data: { userId: session.user.id, courseId: course.id },
  });

  await db.notification.create({
    data: {
      userId: session.user.id,
      title: "Bienvenue dans RodLab Academy 🎓",
      body: `Vous êtes inscrit à « ${course.title} ». Suivez les modules à votre rythme, puis passez l'examen final pour obtenir votre certificat.`,
      url: `/dashboard/formation/${course.slug}`,
    },
  });

  return NextResponse.json({ enrollmentId: enrollment.id, courseSlug: course.slug });
}
