import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowRight, Award, BookOpen, CheckCircle2, Clock, Download,
  GraduationCap, HelpCircle, Lock, ShieldCheck, Users, Video,
} from "lucide-react";
import { EnrollButton } from "@/components/academy/enroll-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseVisual } from "@/lib/academy/course-visuals";

export const metadata: Metadata = { title: "Mes formations — RodLab Academy" };

export const dynamic = "force-dynamic";

export default async function DashboardFormationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      _count: { select: { enrollments: true } },
    },
  });

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      certificate: true,
      course: { select: { slug: true } },
      quizAttempts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  const enrollmentByCourse = new Map(enrollments.map((e) => [e.courseId, e]));

  const completed = await db.lessonProgress.findMany({
    where: { userId: session.user.id },
    select: { lessonId: true },
  });
  const completedSet = new Set(completed.map((c) => c.lessonId));

  const active = courses.filter((c) => enrollmentByCourse.has(c.id));
  const available = courses.filter((c) => !enrollmentByCourse.has(c.id));

  return (
    <div className="mx-auto max-w-7xl">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">RodLab Academy</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900">Mes formations</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            Bienvenue dans le catalogue complet de l&apos;Academy : {courses.length} formations gratuites
            certifiantes. Suivez-en une ou plusieurs en parallèle — chaque progression est conservée séparément.
          </p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-white px-5 py-4 text-center">
          <p className="font-display text-3xl font-semibold text-forest-700">{active.length}/{courses.length}</p>
          <p className="text-[11px] text-ink-400">formations suivies</p>
        </div>
      </div>

      {/* ————— Mes formations actives ————— */}
      {active.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-500">En cours & terminées</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {active.map((course) => {
              const enrollment = enrollmentByCourse.get(course.id)!;
              const visual = courseVisual(course.slug);
              const Icon = visual.icon;
              const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
              const doneLessons = course.modules.reduce(
                (n, m) => n + m.lessons.filter((l) => completedSet.has(l.id)).length,
                0
              );
              const percent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
              const quizUnlocked = doneLessons >= totalLessons && totalLessons > 0;
              const nextLesson = course.modules
                .flatMap((m) => m.lessons.map((l) => ({ moduleOrder: m.order, lesson: l })))
                .find((x) => !completedSet.has(x.lesson.id));
              const isDone = percent === 100;

              return (
                <div
                  key={course.id}
                  className={`flex flex-col overflow-hidden rounded-3xl border transition ${
                    isDone ? "border-forest-300 bg-forest-50" : "border-cream-300 bg-white hover:border-forest-300"
                  }`}
                >
                  <div className={`flex items-center justify-between gap-3 p-5 ${visual.banner}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-cream-50">{course.title}</p>
                        <p className="mt-0.5 text-[11px] text-cream-100/70">
                          {course.level} · {course.modules.length} modules · {totalLessons} leçons
                        </p>
                      </div>
                    </div>
                    {isDone ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-forest-900">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Terminé
                      </span>
                    ) : (
                      <span className="shrink-0 font-display text-2xl font-semibold text-cream-50">{percent} %</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {/* Barre de progression */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-ink-500">
                        <span>Progression du parcours</span>
                        <span className="text-forest-700">{doneLessons}/{totalLessons} leçons</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                        <div
                          className="h-full rounded-full bg-forest-600 transition-all"
                          style={{ width: `${percent}%` }}
                          role="progressbar"
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {nextLesson && (
                        <Link
                          href={`/dashboard/formation/${course.slug}/modules/${nextLesson.moduleOrder}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-terra-600 px-4 py-2.5 text-xs font-semibold text-cream-50 transition hover:bg-terra-500"
                        >
                          {doneLessons === 0 ? "Commencer" : "Reprendre"} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/formation/${course.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
                      >
                        Voir les modules
                      </Link>
                      {quizUnlocked && !enrollment.certificate && (
                        <Link
                          href={`/dashboard/formation/${course.slug}/quiz`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2.5 text-xs font-bold text-forest-900 transition hover:bg-gold-300"
                        >
                          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" /> Passer l&apos;examen
                        </Link>
                      )}
                      {enrollment.certificate && (
                        <>
                          <Link
                            href={`/dashboard/formation/${course.slug}/certificat`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2.5 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Certificat
                          </Link>
                          <Link
                            href={`/certificats/${enrollment.certificate.code}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-forest-300 bg-white px-4 py-2.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-50"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Vérification
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Examen / certificat : état */}
                    {!enrollment.certificate && (
                      <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
                        {quizUnlocked ? (
                          <>Examen débloqué — montrez ce que vous avez appris (70 % requis pour le certificat).</>
                        ) : (
                          <>
                            <Lock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                            L&apos;examen final se débloque à 100 % du parcours.
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-forest-200 bg-forest-900 p-8 sm:p-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> {courses.length} formations gratuites certifiantes
          </p>
          <h2 className="mt-3 max-w-xl font-display text-xl font-semibold text-cream-50 sm:text-2xl">
            Vous n&apos;avez pas encore activé de formation — choisissez la vôtre ci-dessous
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest-100/85">
            L&apos;inscription est instantanée et gratuite : elle crée votre progression, débloque les modules
            dans l&apos;ordre et prépare votre examen final. Un certificat PDF vérifiable à la clé.
          </p>
        </section>
      )}

      {/* ————— Catalogue disponible ————— */}
      {available.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-500">
            Disponibles — {available.length} autre(s) formation(s)
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {available.map((course) => {
              const visual = courseVisual(course.slug);
              const Icon = visual.icon;
              const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
              const minutes = course.modules.reduce((n, m) => n + m.minutes, 0);
              return (
                <div
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-white transition hover:border-forest-300"
                >
                  <div className={`flex items-center gap-3 p-5 ${visual.banner}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="min-w-0 text-xs font-semibold leading-snug text-cream-50">{course.title}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                        {totalLessons} leçons
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                        ≈ {Math.round(minutes / 60)} h
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3 text-forest-600" aria-hidden="true" />
                        {course._count.enrollments}
                      </span>
                    </p>
                    <div className="mt-4 flex flex-1 items-end gap-2">
                      <EnrollButton courseId={course.id} label="Activer" compact />
                      <Link
                        href={`/formation/${course.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
                      >
                        Détails <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certificats obtenus */}
      {enrollments.some((e) => e.certificate) && (
        <section className="mt-10 rounded-3xl border border-gold-400/60 bg-gold-100/30 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Award className="h-5 w-5 text-forest-700" aria-hidden="true" /> Vos certificats
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {enrollments
              .filter((e) => e.certificate)
              .map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink-900">{e.courseId ? courses.find((c) => c.id === e.courseId)?.title : ""}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-ink-500">{e.certificate!.code}</p>
                  </div>
                  <Link
                    href={`/dashboard/formation/${e.course.slug}/certificat`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" /> Voir
                  </Link>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Rappel live */}
      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-cream-300 bg-white p-5 sm:flex-row sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terra-100 text-terra-600">
          <Video className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="flex-1 text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-900">Complétez avec RodLab Live :</strong> masterclass et ateliers en direct,
          ouverts aux apprenants du monde entier. Les replays sont envoyés aux inscrits.
        </p>
        <Link
          href="/live"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-forest-300 bg-forest-50 px-4 py-2.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-100"
        >
          Voir les sessions <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
