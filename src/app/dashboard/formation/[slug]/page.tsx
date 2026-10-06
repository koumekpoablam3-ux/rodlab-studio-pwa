import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, Clock, Download,
  Flame, GraduationCap, HelpCircle, Lock, ShieldCheck,
} from "lucide-react";
import { EnrollButton } from "@/components/academy/enroll-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseVisual } from "@/lib/academy/course-visuals";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug }, select: { title: true } });
  return { title: course ? `${course.title} — RodLab Academy` : "Formation — RodLab Academy" };
}

export default async function CourseDashboardPage({ params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      quiz: { select: { passScore: true, _count: { select: { questions: true } } } },
    },
  });
  if (!course || !course.published) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    include: { certificate: true, quizAttempts: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const completed = await db.lessonProgress.findMany({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
    select: { lessonId: true },
  });
  const completedSet = new Set(completed.map((c) => c.lessonId));
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const doneLessons = completedSet.size;
  const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
  const quizUnlocked = Boolean(enrollment) && doneLessons >= totalLessons && totalLessons > 0;
  const quizQuestions = course.quiz?._count.questions ?? 0;

  // Première leçon non terminée → bouton « Reprendre »
  const nextLesson = course.modules
    .flatMap((m) => m.lessons.map((l) => ({ moduleOrder: m.order, lesson: l })))
    .find((x) => !completedSet.has(x.lesson.id));

  const bestAttempt = enrollment?.quizAttempts.reduce((best, a) => (a.score > best ? a.score : best), 0) ?? null;
  const visual = courseVisual(course.slug);
  const Icon = visual.icon;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Fil d'ariane */}
      <Link
        href="/dashboard/formation"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Mes formations
      </Link>

      {/* En-tête */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${visual.chip}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">{course.title}</h1>
            <p className="mt-1 text-xs text-ink-400">
              {course.level} · {course.modules.length} modules · {totalLessons} leçons · examen final {quizQuestions} questions
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              {enrollment
                ? `Inscrit depuis le ${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(enrollment.startedAt)} — suivez les modules à votre rythme, chaque leçon cochée fait avancer votre barre.`
                : course.subtitle}
            </p>
          </div>
        </div>
        {enrollment ? (
          <div className="rounded-2xl border border-cream-300 bg-white px-5 py-4 text-center">
            <p className="font-display text-3xl font-semibold text-forest-700">{percent} %</p>
            <p className="text-[11px] text-ink-400">{doneLessons}/{totalLessons} leçons terminées</p>
          </div>
        ) : null}
      </div>

      {/* ————— Pas encore inscrit ————— */}
      {!enrollment && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-forest-200 bg-forest-900 p-8 sm:p-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> Formation gratuite certifiante
          </p>
          <h2 className="mt-3 max-w-xl font-display text-xl font-semibold text-cream-50 sm:text-2xl">
            Activez votre accès : {course.modules.length} modules, {totalLessons} leçons, un certificat à la clé
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest-100/85">
            L&apos;inscription est instantanée et gratuite : elle crée votre progression, débloque les modules
            dans l&apos;ordre et prépare votre examen final. Vous obtiendrez un certificat PDF vérifiable une
            fois l&apos;examen réussi.
          </p>
          <div className="mt-6">
            <EnrollButton courseId={course.id} label="Activer ma formation" />
          </div>
        </div>
      )}

      {/* ————— Inscrit : parcours ————— */}
      {enrollment && (
        <>
          {/* Barre de progression */}
          <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-5">
            <div className="flex items-center justify-between text-xs font-medium text-ink-500">
              <span>Progression du parcours</span>
              <span className="text-forest-700">{percent} %</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-forest-600 transition-all"
                style={{ width: `${percent}%` }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {nextLesson && (
              <Link
                href={`/dashboard/formation/${course.slug}/modules/${nextLesson.moduleOrder}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-xs font-semibold text-cream-50 transition hover:bg-terra-500"
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {doneLessons === 0 ? "Commencer le module 1" : "Reprendre où j'en étais"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Liste des modules */}
          <div className="mt-6 grid gap-3">
            {course.modules.map((mod) => {
              const modDone = mod.lessons.filter((l) => completedSet.has(l.id)).length;
              const modTotal = mod.lessons.length;
              const isDone = modDone === modTotal && modTotal > 0;
              const isStarted = modDone > 0 && !isDone;
              return (
                <Link
                  key={mod.id}
                  href={`/dashboard/formation/${course.slug}/modules/${mod.order}`}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 transition sm:p-5 ${
                    isDone
                      ? "border-forest-200 bg-forest-50"
                      : isStarted
                        ? "border-terra-300 bg-terra-50/60"
                        : "border-cream-300 bg-white hover:border-forest-300"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-semibold ${
                      isDone ? "bg-forest-700 text-cream-50" : "bg-forest-100 text-forest-700"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : mod.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink-900">{mod.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {mod.minutes} min
                      <span aria-hidden="true">·</span>
                      {isDone ? (
                        <span className="font-medium text-forest-700">Module terminé</span>
                      ) : isStarted ? (
                        <span className="font-medium text-terra-600">En cours — {modDone}/{modTotal}</span>
                      ) : (
                        <span>{modTotal} leçons</span>
                      )}
                    </span>
                    {/* mini-barre */}
                    <span className="mt-2 block h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-cream-200">
                      <span
                        className={`block h-full rounded-full ${isDone ? "bg-forest-600" : "bg-terra-500"}`}
                        style={{ width: `${modTotal ? (modDone / modTotal) * 100 : 0}%` }}
                      />
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-terra-600" aria-hidden="true" />
                </Link>
              );
            })}
          </div>

          {/* Examen final + certificat */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className={`rounded-2xl border p-6 ${quizUnlocked ? "border-gold-400/60 bg-gold-100/30" : "border-cream-300 bg-cream-100"}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${quizUnlocked ? "bg-gold-400 text-forest-900" : "bg-cream-200 text-ink-400"}`}>
                  {quizUnlocked ? <HelpCircle className="h-5 w-5" aria-hidden="true" /> : <Lock className="h-5 w-5" aria-hidden="true" />}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">Examen final</h2>
                  <p className="text-xs text-ink-500">
                    {quizUnlocked
                      ? "Débloqué — montrez ce que vous avez appris !"
                      : `Se débloque à 100 % du parcours (${doneLessons}/${totalLessons} leçons)`}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                {quizUnlocked
                  ? `${quizQuestions} questions à choix multiple couvrant les ${course.modules.length} modules.`
                  : "Des questions à choix multiple couvrant l'ensemble des modules."}{" "}
                Score requis : {course.quiz?.passScore ?? 70} %. Vous pouvez repasser l&apos;examen pour améliorer votre score.
                {bestAttempt !== null && (
                  <> Meilleur score jusqu&apos;ici : <strong className="text-forest-700">{bestAttempt} %</strong>.</>
                )}
              </p>
              {quizUnlocked && (
                <Link
                  href={`/dashboard/formation/${course.slug}/quiz`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
                >
                  Passer l&apos;examen final <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className={`rounded-2xl border p-6 ${enrollment.certificate ? "border-forest-300 bg-forest-50" : "border-cream-300 bg-cream-100"}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${enrollment.certificate ? "bg-forest-700 text-gold-100" : "bg-cream-200 text-ink-400"}`}>
                  <Award className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">Certificat RodLab</h2>
                  <p className="text-xs text-ink-500">
                    {enrollment.certificate ? "Félicitations, il est à vous !" : "Émis après la réussite de l'examen final (70 %)"}
                  </p>
                </div>
              </div>
              {enrollment.certificate ? (
                <>
                  <p className="mt-4 text-xs leading-relaxed text-ink-500">
                    Code de vérification : <span className="font-mono font-semibold text-forest-800">{enrollment.certificate.code}</span> —
                    toute personne peut vérifier son authenticité en ligne.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/formation/${course.slug}/certificat`}
                      className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" /> Voir & télécharger
                    </Link>
                    <Link
                      href={`/certificats/${enrollment.certificate.code}`}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-5 py-3 text-xs font-semibold text-forest-700 transition hover:bg-forest-50"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Page de vérification
                    </Link>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                  Un certificat PDF officiel portant votre nom, votre score et un code de vérification unique.
                  Ajoutez-le à votre CV ou montrez-le à vos clients.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Rappel catalogue */}
      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-cream-300 bg-white p-5 sm:flex-row sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terra-100 text-terra-600">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="flex-1 text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-900">Envie d&apos;aller plus loin ?</strong> Le catalogue RodLab Academy
          compte six formations complémentaires — enchaînez les certificats à votre rythme.
        </p>
        <Link
          href="/dashboard/formation"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-forest-300 bg-forest-50 px-4 py-2.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-100"
        >
          Mes formations <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
