import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Redirection de compatibilité (v8.5 → v8.6) :
 * /dashboard/formation/quiz pointe désormais vers l'examen du cours
 * le plus récent suivi par l'utilisateur (ou du cours vedette).
 */
export default async function LegacyQuizRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const enrollment = await db.enrollment.findFirst({
    where: { userId: session.user.id, course: { published: true } },
    include: { course: { select: { slug: true } } },
    orderBy: { startedAt: "desc" },
  });
  const slug = enrollment?.course.slug ?? "site-web-professionnel";

  redirect(`/dashboard/formation/${slug}/quiz`);
}
