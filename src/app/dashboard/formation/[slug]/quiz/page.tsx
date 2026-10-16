import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Lock } from "lucide-react";
import { QuizRunner } from "@/components/academy/quiz-runner";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Examen final — RodLab Academy" };
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export default async function QuizPage({ params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const course = await db.course.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, published: true },
  });
  if (!course || !course.published) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/dashboard/formation/${course.slug}`);

  // Verrou : l'examen s'ouvre à 100 % du parcours
  const totalLessons = await db.lesson.count({ where: { module: { courseId: course.id } } });
  const doneLessons = await db.lessonProgress.count({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
  });
  const unlocked = totalLessons > 0 && doneLessons >= totalLessons;

  const quiz = await db.quiz.findUnique({
    where: { courseId: course.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/dashboard/formation/${course.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> {course.title}
      </Link>

      <div className="mt-5">
        {!unlocked ? (
          <div className="rounded-3xl border border-cream-300 bg-cream-100 p-8 text-center sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-ink-400">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">Examen final verrouillé</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              Vous avez terminé <strong>{doneLessons} leçon(s) sur {totalLessons}</strong>. Terminez tous les modules
              pour débloquer l&apos;examen final — chaque leçon cochée vous rapproche du certificat.
            </p>
            <Link
              href={`/dashboard/formation/${course.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
            >
              Retourner à ma progression
            </Link>
          </div>
        ) : !quiz || quiz.questions.length === 0 ? (
          <div className="rounded-3xl border border-cream-300 bg-cream-100 p-8 text-center text-sm text-ink-500">
            L&apos;examen final n&apos;est pas encore disponible. Revenez très bientôt.
          </div>
        ) : (
          <QuizRunner
            courseId={course.id}
            courseSlug={course.slug}
            questions={quiz.questions.map((q) => ({
              id: q.id,
              order: q.order,
              prompt: q.prompt,
              options: JSON.parse(q.options) as string[],
            }))}
          />
        )}
      </div>
    </div>
  );
}
