import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowLeft, ArrowRight, Clock, BookOpen, CheckCircle2, Lock,
} from "lucide-react";
import { LessonCompleteButton } from "@/components/academy/lesson-complete-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string; order: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { order } = await params;
  return { title: `Module ${order} — RodLab Academy` };
}

export default async function ModulePage({ params }: Params) {
  const { slug, order } = await params;
  const moduleOrder = Number(order);
  if (!Number.isInteger(moduleOrder) || moduleOrder < 1) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const course = await db.course.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!course || !course.published) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/dashboard/formation/${course.slug}`);

  const moduleIndex = course.modules.findIndex((m) => m.order === moduleOrder);
  if (moduleIndex === -1) notFound();
  const currentModule = course.modules[moduleIndex];
  const prevModule = course.modules[moduleIndex - 1] ?? null;
  const nextModule = course.modules[moduleIndex + 1] ?? null;

  const progress = await db.lessonProgress.findMany({
    where: { userId: session.user.id, lesson: { moduleId: currentModule.id } },
    select: { lessonId: true },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));
  const modDone = currentModule.lessons.filter((l) => completedSet.has(l.id)).length;
  const modTotal = currentModule.lessons.length;

  // Progression globale (pour l'en-tête)
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const doneLessons = await db.lessonProgress.count({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
  });
  const globalPercent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Fil + navigation module */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/formation/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition hover:text-terra-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> {course.title}
        </Link>
        <div className="flex items-center gap-1.5" aria-label={`Module ${moduleIndex + 1} sur ${course.modules.length}`}>
          {course.modules.map((m, i) => (
            <Link
              key={m.id}
              href={`/dashboard/formation/${course.slug}/modules/${m.order}`}
              aria-label={`Module ${m.order} : ${m.title}`}
              aria-current={m.order === moduleOrder ? "page" : undefined}
              className={`h-1.5 rounded-full transition-all ${
                m.order === moduleOrder
                  ? "w-8 bg-terra-600"
                  : m.order < moduleOrder
                    ? "w-3 bg-forest-500 hover:bg-forest-600"
                    : "w-3 bg-cream-300 hover:bg-cream-400"
              }`}
            />
          ))}
          <span className="ml-2 text-[11px] text-ink-400">
            Module {moduleIndex + 1}/{course.modules.length} · parcours à {globalPercent} %
          </span>
        </div>
      </div>

      {/* En-tête du module */}
      <header className="mt-5 overflow-hidden rounded-3xl bg-forest-900 p-6 text-cream-100 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Module {currentModule.order}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">{currentModule.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-forest-100/85">{currentModule.summary}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-forest-100/60">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> ≈ {currentModule.minutes} minutes · {modDone}/{modTotal} leçons terminées
            </p>
          </div>
          <div className="w-full max-w-48">
            <div className="h-2.5 overflow-hidden rounded-full bg-forest-700">
              <div
                className="h-full rounded-full bg-gold-400 transition-all"
                style={{ width: `${modTotal ? (modDone / modTotal) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 text-right text-[11px] text-forest-100/60">
              {modDone === modTotal ? "Module terminé ✓" : `${Math.round((modDone / Math.max(modTotal, 1)) * 100)} % du module`}
            </p>
          </div>
        </div>
      </header>

      {/* Leçons */}
      <div className="mt-6 grid gap-4">
        {currentModule.lessons.map((lesson, i) => {
          const done = completedSet.has(lesson.id);
          return (
            <section
              key={lesson.id}
              id={`lecon-${lesson.order}`}
              className={`overflow-hidden rounded-2xl border transition ${done ? "border-forest-200 bg-forest-50/50" : "border-cream-300 bg-white"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200/70 bg-cream-50/60 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-900 text-xs font-semibold text-gold-100">
                    {i + 1}
                  </span>
                  <h2 className="text-sm font-semibold text-ink-900 sm:text-base">{lesson.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-ink-400">{lesson.minutes} min</span>
                  <LessonCompleteButton lessonId={lesson.id} done={done} />
                </div>
              </div>
              <div className="grid gap-3.5 px-5 py-5 sm:px-6 sm:py-6">
                {lesson.content.split("\n\n").map((block, bi) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h3 key={bi} className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-forest-800">
                        {block.slice(3)}
                      </h3>
                    );
                  }
                  if (block.startsWith("- ")) {
                    return (
                      <ul key={bi} className="grid gap-2">
                        {block.split("\n").map((line, li) => (
                          <li key={li} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terra-600" aria-hidden="true" />
                            {line.slice(2)}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={bi} className="text-sm leading-relaxed text-ink-700">
                      {block}
                    </p>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Navigation bas de page */}
      <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-cream-300 pt-6" aria-label="Navigation entre modules">
        {prevModule ? (
          <Link
            href={`/dashboard/formation/${course.slug}/modules/${prevModule.order}`}
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-3 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Module {prevModule.order} — {prevModule.title}
          </Link>
        ) : (
          <span />
        )}
        {nextModule ? (
          <Link
            href={`/dashboard/formation/${course.slug}/modules/${nextModule.order}`}
            className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            Module {nextModule.order} — {nextModule.title}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : modDone === modTotal ? (
          <Link
            href={`/dashboard/formation/${course.slug}/quiz`}
            className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-3 text-xs font-bold text-forest-900 transition hover:bg-gold-300"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Passer l&apos;examen final
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs text-ink-400">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Terminez ce module pour débloquer l&apos;examen
          </span>
        )}
      </nav>
    </div>
  );
}
