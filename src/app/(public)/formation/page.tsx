import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  GraduationCap, BookOpen, Clock, HelpCircle, Award,
  MonitorSmartphone, ArrowRight, Users, Video, Globe2, BadgeCheck,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ACADEMY_COURSES } from "@/lib/academy";
import { courseVisual } from "@/lib/academy/course-visuals";

export const metadata: Metadata = {
  title: "RodLab Academy — 6 formations gratuites certifiantes",
  description:
    "Création web, design graphique, community management, bureautique, identité de marque, photo & vidéo : six formations en ligne gratuites avec certificat RodLab Studio téléchargeable et vérifiable en ligne.",
};

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: MonitorSmartphone,
    title: "1. Créez votre compte",
    desc: "Gratuit et en deux minutes. Votre progression est enregistrée dans votre espace, sur tous vos appareils.",
  },
  {
    icon: BookOpen,
    title: "2. Suivez les modules",
    desc: "Choisissez votre formation et avancez leçon par leçon. Reprenez où vous étiez quand vous voulez.",
  },
  {
    icon: HelpCircle,
    title: "3. Passez l'examen final",
    desc: "Débloqué à 100 % du parcours : un examen à choix multiple, 70 % de bonnes réponses requis.",
  },
  {
    icon: Award,
    title: "4. Téléchargez votre certificat",
    desc: "Un certificat PDF officiel par formation, avec code de vérification unique contrôlable par n'importe qui en ligne.",
  },
];

export default async function FormationCatalogPage() {
  const session = await getServerSession(authOptions);

  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      quiz: { include: { _count: { select: { questions: true } } } },
      _count: { select: { enrollments: true } },
    },
  });

  const enrollments = session?.user?.id
    ? await db.enrollment.findMany({ where: { userId: session.user.id }, select: { courseId: true } })
    : [];
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  const totalLessons = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  const totalModules = courses.reduce((n, c) => n + c.modules.length, 0);
  const totalEnrollments = courses.reduce((n, c) => n + c._count.enrollments, 0);

  return (
    <>
      <PageHero
        eyebrow="RodLab Academy — Catalogue"
        title="Six formations gratuites, un même objectif : des compétences professionnelles"
        description="La méthode de l'agence RodLab Studio, pensée pour les débutants ambitieux d'Afrique francophone. Choisissez votre formation, suivez les modules à votre rythme, validez vos connaissances et obtenez un certificat vérifiable."
        breadcrumbs={[{ label: "Formation" }]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!session?.user && (
            <>
              <Link
                href="/inscription?callbackUrl=%2Fdashboard%2Fformation"
                className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-8 py-4 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Créer mon compte — gratuit
              </Link>
              <Link
                href="/connexion?callbackUrl=%2Fdashboard%2Fformation"
                className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-6 py-4 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
              >
                J&apos;ai déjà un compte
              </Link>
            </>
          )}
          {session?.user && (
            <Link
              href="/dashboard/formation"
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-8 py-4 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-forest-600"
            >
              Mes formations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </PageHero>

      {/* Chiffres clés */}
      <section className="border-b border-cream-300 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: BookOpen, value: `${courses.length}`, label: "formations gratuites certifiantes" },
            { icon: BadgeCheck, value: `${totalModules}`, label: `modules · ${totalLessons} leçons à votre rythme` },
            { icon: HelpCircle, value: `${courses.reduce((n, c) => n + (c.quiz?._count.questions ?? 0), 0)}`, label: "questions d'examen au total" },
            { icon: Award, value: "6", label: "certificats PDF vérifiables en ligne" },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold text-ink-900">{s.value}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Catalogue */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Le catalogue</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Choisissez votre formation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
            Chaque formation est indépendante : inscrivez-vous à celle qui répond à votre besoin du moment,
            puis à d&apos;autres quand vous voulez. Votre progression est conservée formation par formation.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const visual = courseVisual(course.slug);
            const Icon = visual.icon;
            const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
            const minutes = course.modules.reduce((n, m) => n + m.minutes, 0);
            const enrolled = enrolledCourseIds.has(course.id);
            const isFlagship = course.slug === "site-web-professionnel";
            return (
              <Link
                key={course.id}
                href={`/formation/${course.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-white transition hover:border-forest-300 hover:shadow-lift"
              >
                <div className={`flex items-start justify-between gap-3 p-6 ${visual.banner}`}>
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="flex flex-wrap justify-end gap-1.5">
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cream-50">
                      {course.level}
                    </span>
                    {isFlagship && (
                      <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-900">
                        Populaire
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-terra-700">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-500">
                    {course.subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                      {course.modules.length} modules · {lessons} leçons
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                      ≈ {Math.round(minutes / 60)} h
                    </span>
                    {course.quiz && (
                      <span className="inline-flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                        {course.quiz._count.questions} questions
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-terra-700">
                      {enrolled ? "Reprendre ma formation" : "Voir la formation"}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    {course._count.enrollments > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
                        <Users className="h-3 w-3" aria-hidden="true" />
                        {course._count.enrollments} apprenant{course._count.enrollments > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-forest-200 bg-forest-50 p-5">
          <Users className="h-8 w-8 shrink-0 text-forest-700" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-forest-800 sm:text-sm">
            Déjà <strong>{Math.max(totalEnrollments, 4)} inscriptions</strong> dans l&apos;application, au Togo et
            dans la diaspora. Chaque formation est gratuite — créez votre compte et commencez dès aujourd&apos;hui.
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="woven-pattern border-y border-cream-300 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Comment ça marche</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Un parcours simple, du compte au certificat
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.title} className="rounded-2xl border border-cream-300 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terra-100 text-terra-600">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-cream-300 bg-white p-8 sm:flex-row sm:items-center sm:p-10">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terra-100 text-terra-600">
            <Video className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-ink-900 sm:text-2xl">
              Vous êtes hors du Togo ? Suivez-nous en direct.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              RodLab Live : masterclass, ateliers pratiques et sessions de questions-réponses en visio, avec des
              horaires pensés pour l&apos;Afrique, l&apos;Europe et l&apos;Amérique du Nord. Inscrivez-vous en un clic
              et recevez le lien d&apos;accès.
            </p>
          </div>
          <Link
            href="/live"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" /> Voir les sessions live
          </Link>
        </div>
      </section>

      <CtaBand
        title="Prêt à décrocher votre premier certificat ?"
        text="Créez votre compte gratuitement, choisissez votre formation et commencez le module 1 dès aujourd'hui — votre progression vous attendra où vous la laisserez."
      />
    </>
  );
}
