import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Users, Award, TrendingUp, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { courseVisual } from "@/lib/academy/course-visuals";

export const metadata: Metadata = { title: "Academy — Administration RodLab" };
export const dynamic = "force-dynamic";

export default async function AdminFormationPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      modules: { select: { lessons: { select: { id: true } } } },
      quiz: { select: { _count: { select: { questions: true } } } },
      _count: { select: { enrollments: true } },
    },
  });

  const [enrollments, attempts, certificates, progresses] = await Promise.all([
    db.enrollment.findMany({
      include: {
        user: { select: { name: true, email: true, companyName: true, role: true } },
        course: { select: { slug: true, title: true } },
        quizAttempts: { orderBy: { createdAt: "desc" } },
        certificate: true,
      },
      orderBy: { startedAt: "desc" },
    }),
    db.quizAttempt.findMany({ orderBy: { createdAt: "desc" } }),
    db.certificate.findMany({ orderBy: { issuedAt: "desc" } }),
    db.lessonProgress.findMany({
      select: { userId: true, lesson: { select: { module: { select: { courseId: true } } } } },
    }),
  ]);

  // Leçons terminées par (utilisateur, cours) — le catalogue est multi-cours
  const progressMap = new Map<string, number>();
  for (const p of progresses) {
    const key = `${p.userId}:${p.lesson.module.courseId}`;
    progressMap.set(key, (progressMap.get(key) ?? 0) + 1);
  }
  const lessonCounts = new Map(courses.map((c) => [c.id, c.modules.reduce((n, m) => n + m.lessons.length, 0)]));

  const completedCount = enrollments.filter((e) => e.status === "COMPLETED").length;
  const passRate = attempts.length > 0 ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0;
  const df = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (courses.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-2xl font-semibold text-ink-900">RodLab Academy</h1>
        <p className="mt-3 rounded-2xl border border-cream-300 bg-white p-6 text-sm text-ink-500">
          Aucune formation publiée pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">RodLab Academy</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900">Suivi du catalogue</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            {courses.length} formations publiées, {lessonCounts.size > 0 ? courses.reduce((n, c) => n + (lessonCounts.get(c.id) ?? 0), 0) : 0} leçons
            au total et {courses.reduce((n, c) => n + (c.quiz?._count.questions ?? 0), 0)} questions
            d&apos;examen (seuil 70 %).
          </p>
        </div>
        <Link
          href="/admin/live"
          className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-5 py-3 text-xs font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          Gérer les sessions live <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Stats globales */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, value: enrollments.length, label: "inscriptions au catalogue" },
          {
            icon: TrendingUp,
            value: `${enrollments.length ? Math.round((completedCount / enrollments.length) * 100) : 0} %`,
            label: "parcours complets",
          },
          { icon: Award, value: certificates.length, label: "certificats émis" },
          { icon: BookOpen, value: `${passRate} %`, label: "taux de réussite examen" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-cream-300 bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
              <s.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-ink-900">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cartes par formation */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const visual = courseVisual(course.slug);
          const Icon = visual.icon;
          const lessons = lessonCounts.get(course.id) ?? 0;
          const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
          const courseCompleted = courseEnrollments.filter((e) => e.status === "COMPLETED").length;
          return (
            <div key={course.id} className="overflow-hidden rounded-2xl border border-cream-300 bg-white">
              <div className={`flex items-center gap-3 p-4 ${visual.banner}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-xs font-semibold leading-snug text-cream-50">{course.title}</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-cream-200 border-t border-cream-200 text-center">
                <div className="p-3">
                  <p className="font-display text-lg font-semibold text-ink-900">{courseEnrollments.length}</p>
                  <p className="text-[10px] text-ink-400">inscrits</p>
                </div>
                <div className="p-3">
                  <p className="font-display text-lg font-semibold text-ink-900">{courseCompleted}</p>
                  <p className="text-[10px] text-ink-400">complets</p>
                </div>
                <div className="p-3">
                  <p className="font-display text-lg font-semibold text-ink-900">{lessons}</p>
                  <p className="text-[10px] text-ink-400">leçons</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tableau des apprenants */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-cream-300 bg-white">
        <h2 className="border-b border-cream-300 px-6 py-4 text-sm font-semibold text-ink-900">Apprenants</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-6 py-3 font-medium">Apprenant</th>
                <th className="px-4 py-3 font-medium">Formation</th>
                <th className="px-4 py-3 font-medium">Progression</th>
                <th className="px-4 py-3 font-medium">Examen</th>
                <th className="px-4 py-3 font-medium">Certificat</th>
                <th className="px-6 py-3 font-medium">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {enrollments.map((e) => {
                const done = progressMap.get(`${e.userId}:${e.courseId}`) ?? 0;
                const total = lessonCounts.get(e.courseId) ?? 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                const lastAttempt = e.quizAttempts[0];
                return (
                  <tr key={e.id} className="transition hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink-900">{e.user?.companyName || e.user?.name || "—"}</p>
                      <p className="text-xs text-ink-400">{e.user?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-ink-700">{e.course.title}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-cream-200">
                          <span
                            className={`block h-full rounded-full ${percent === 100 ? "bg-forest-600" : "bg-terra-500"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </span>
                        <span className="text-xs font-medium text-ink-700">
                          {done}/{total} ({percent} %)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {lastAttempt ? (
                        <span className="text-xs">
                          <span className={`font-semibold ${lastAttempt.passed ? "text-forest-700" : "text-terra-600"}`}>
                            {lastAttempt.score} %
                          </span>
                          <span className="text-ink-400"> · {e.quizAttempts.length} tentative(s)</span>
                        </span>
                      ) : (
                        <span className="text-xs text-ink-300">Non passé</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {e.certificate ? (
                        <Link
                          href={`/certificats/${e.certificate.code}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 font-mono text-[11px] font-semibold text-forest-700 transition hover:bg-forest-100"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {e.certificate.code}
                        </Link>
                      ) : (
                        <span className="text-xs text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-500">{df.format(e.startedAt)}</td>
                  </tr>
                );
              })}
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-ink-400">
                    Aucun apprenant inscrit pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Derniers certificats */}
      {certificates.length > 0 && (
        <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <GraduationCap className="h-4 w-4 text-forest-700" aria-hidden="true" /> Derniers certificats émis
          </h2>
          <ul className="mt-3 grid gap-2">
            {certificates.slice(0, 5).map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cream-50 px-4 py-3 text-xs"
              >
                <span className="font-medium text-ink-900">{c.holderName}</span>
                <span className="font-mono text-forest-700">{c.code}</span>
                <span className="text-ink-400">{c.score} %</span>
                <span className="text-ink-400">{df.format(c.issuedAt)}</span>
                <Link href={`/certificats/${c.code}`} className="font-semibold text-terra-600 hover:underline">
                  Vérifier
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
