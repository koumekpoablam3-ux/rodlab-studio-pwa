import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Redirection de compatibilité (v8.5 → v8.6) :
 * les notifications et favoris pointant vers /dashboard/formation/certificat
 * sont dirigés vers le certificat du cours concerné.
 */
export default async function LegacyCertificateRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const enrollment = await db.enrollment.findFirst({
    where: { userId: session.user.id, certificate: { isNot: null } },
    include: { course: { select: { slug: true } } },
    orderBy: { startedAt: "desc" },
  });

  redirect(enrollment ? `/dashboard/formation/${enrollment.course.slug}/certificat` : "/dashboard/formation");
}
