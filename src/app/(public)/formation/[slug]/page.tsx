import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Enrollment } from "@prisma/client";
import { getServerSession } from "next-auth";
import {
  GraduationCap, BookOpen, Clock, HelpCircle, Award, Download,
  MonitorSmartphone, BadgeCheck, ArrowRight, CheckCircle2, Users,
  Video, Globe2,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/landing/page-hero";
import { EnrollButton } from "@/components/academy/enroll-button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseVisual } from "@/lib/academy/course-visuals";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug }, select: { title: true, subtitle: true } });
  if (!course) return { title: "Formation introuvable" };
  return { title: `${course.title} — RodLab Academy`, description: course.subtitle };
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      quiz: { include: { _count: { select: { questions: true } } } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course || !course.published) notFound();

  let enrollment: Enrollment | null = null;
  if (session?.user?.id) {
    enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });
  }

  const visual = courseVisual(course.slug);
  const Icon = visual.icon;
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalMinutes = course.modules.reduce((n, m) => n + m.minutes, 0);
  const quizQuestions = course.quiz?._count.questions ?? 0;

  let skills: string[] = [];
  try {
    const parsed = JSON.parse(course.skills);
    if (Array.isArray(parsed)) skills = parsed as string[];
  } catch {
    skills = [];
  }

  const steps = [
    {
      icon: MonitorSmartphone,
      title: "1. Créez votre compte",
      desc: "Gratuit et en deux minutes. Votre progression est enregistrée dans votre espace, sur tous vos appareils.",
    },
    {
      icon: BookOpen,
      title: "2. Suivez les modules",
      desc: `${course.modules.length} modules, ${totalLessons} leçons : lisez, pratiquez, cochez. Reprenez où vous étiez quand vous voulez.`,
    },
    {
      icon: HelpCircle,
      title: "3. Passez l'examen final",
      desc: `Débloqué à 100 % du parcours : ${quizQuestions} questions à choix multiple, ${course.quiz?.passScore ?? 70} % de bonnes réponses requis.`,
    },
    {
      icon: Download,
      title: "4. Téléchargez votre certificat",
      desc: "Un certificat PDF officiel, avec code de vérification unique contrôlable par n'importe qui en ligne.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="RodLab Academy — Formation certifiante"
        title={course.title}
        description={course.subtitle}
        breadcrumbs={[{ label: "Formation", href: "/formation" }, { label: course.title }]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!session?.user && (
            <>
              <Link
                href={`/inscription?callbackUrl=${encodeURIComponent(`/dashboard/formation/${course.slug}`)}`}
                className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-8 py-4 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Commencer — gratuit
              </Link>
              <Link
                href={`/connexion?callbackUrl=${encodeURIComponent(`/dashboard/formation/${course.slug}`)}`}
                className="inline-flex items-center gap-2 rounded-full border border-forest-300 bg-white px-6 py-4 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
              >
                J&apos;ai déjà un compte
              </Link>
            </>
          )}
          {session?.user && enrollment && (
            <Link
              href={`/dashboard/formation/${course.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-8 py-4 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-forest-600"
            >
              Reprendre ma formation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          {session?.user && !enrollment && <EnrollButton courseId={course.id} />}
        </div>
      </PageHero>

      {/* Chiffres clés */}
      <section className="border-b border-cream-300 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: BookOpen, value: `${course.modules.length}`, label: "modules progressifs" },
            { icon: Clock, value: `${totalLessons}`, label: `leçons · ≈ ${Math.round(totalMinutes / 60)} h de contenu` },
            { icon: HelpCircle, value: `${quizQuestions}`, label: `questions à l'examen final (${course.quiz?.passScore ?? 70} % requis)` },
            { icon: Award, value: "1", label: "certificat PDF vérifiable en ligne" },
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

      {/* Programme + carte latérale */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Le programme</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                {course.modules.length} modules, du premier pas à la maîtrise
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">{course.description}</p>
            </div>

            <div className="mt-8 grid gap-3">
              {course.modules.map((mod) => (
                <details
                  key={mod.id}
                  className="group rounded-2xl border border-cream-300 bg-white open:border-forest-300 open:shadow-lift"
                  open={mod.order === 1}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-900 font-display text-base font-semibold text-gold-100">
                      {mod.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink-900 sm:text-base">{mod.title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-500 sm:text-sm">{mod.summary}</span>
                    </span>
                    <span className="hidden shrink-0 items-center gap-2 text-xs text-ink-400 sm:flex">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {mod.minutes} min · {mod.lessons.length} leçons
                    </span>
                  </summary>
                  <ol className="ml-6 mr-5 mb-5 grid gap-1.5 border-l-2 border-cream-300 pl-5 sm:ml-8">
                    {mod.lessons.map((les) => (
                      <li key={les.id} className="flex items-center gap-2 py-0.5 text-sm text-ink-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                        <span className="flex-1">{les.title}</span>
                        <span className="shrink-0 text-xs text-ink-400">{les.minutes} min</span>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className={`overflow-hidden rounded-3xl ${visual.banner}`}>
              <div className="p-6 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-cream-50/70">
                  Formation gratuite · {course.level}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-cream-50">{course.title}</h3>
                <ul className="mt-5 grid gap-2.5 text-xs text-cream-100/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    {course.modules.length} modules · {totalLessons} leçons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    ≈ {Math.round(totalMinutes / 60)} heures de contenu
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    Examen final : {quizQuestions} questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    Certificat PDF avec code de vérification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                    Accès illimité, à votre rythme
                  </li>
                </ul>

                <div className="mt-6">
                  {!session?.user && (
                    <Link
                      href={`/inscription?callbackUrl=${encodeURIComponent(`/dashboard/formation/${course.slug}`)}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-bold text-forest-900 transition hover:bg-gold-300"
                    >
                      <GraduationCap className="h-4 w-4" aria-hidden="true" /> M&apos;inscrire gratuitement
                    </Link>
                  )}
                  {session?.user && enrollment && (
                    <Link
                      href={`/dashboard/formation/${course.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-bold text-forest-900 transition hover:bg-gold-300"
                    >
                      Reprendre ma formation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                  {session?.user && !enrollment && <EnrollButton courseId={course.id} label="Activer cette formation" />}
                </div>

                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-cream-100/70">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  {course._count.enrollments > 0
                    ? `${course._count.enrollments} apprenant(s) déjà inscrit(s)`
                    : "Première promotion en cours"}
                </p>
              </div>
            </div>
          </aside>
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
            {steps.map((s) => (
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

      {/* Compétences acquises */}
      {skills.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">Ce que vous saurez faire</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                Des compétences réelles, utilisables dès la première semaine
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
                Cette formation condense la méthode que RodLab Studio applique chaque jour sur de vrais projets
                clients. Elle s&apos;adresse aux étudiants, entrepreneurs, assistants et salariés qui veulent
                monter en compétence rapidement — avec un programme pratique, directement applicable.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-forest-200 bg-forest-50 p-4">
                <Users className="h-8 w-8 shrink-0 text-forest-700" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-forest-800">
                  Déjà <strong>{Math.max(course._count.enrollments, 1)} apprenant(s)</strong> inscrit(s) dans
                  l&apos;application, au Togo et ailleurs. Rejoignez-les — c&apos;est gratuit.
                </p>
              </div>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2.5 rounded-xl border border-cream-300 bg-white p-3.5 text-xs leading-relaxed text-ink-700">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Certificat */}
      <section className="border-t border-cream-300 bg-forest-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Le certificat</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              Une preuve officielle, vérifiable par n&apos;importe qui
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-forest-100/85 sm:text-base">
              À la réussite de l&apos;examen final ({course.quiz?.passScore ?? 70} % ou plus), votre certificat PDF
              est généré immédiatement : votre nom, la formation suivie, votre score, la date d&apos;émission et un
              code de vérification unique. Ajoutez-le à votre CV, votre profil LinkedIn, ou montrez-le à vos
              clients — chacun peut vérifier son authenticité en ligne.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-forest-100/85">
              {[
                "PDF A4 paysage au design RodLab, prêt à imprimer",
                "Code unique : chaque certificat se vérifie en une URL",
                "Téléchargeable autant de fois que nécessaire",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-forest-700 bg-forest-800/60 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-forest-700 pb-4">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
                <Award className="h-4 w-4" aria-hidden="true" /> RodLab Studio · Academy
              </span>
              <span className="text-xs text-forest-100/60">Lomé — Togo</span>
            </div>
            <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-widest text-forest-100/60">
              Le présent certificat est délivré avec fierté à
            </p>
            <p className="mt-2 text-center font-display text-2xl font-semibold text-cream-50">Votre nom ici</p>
            <p className="mt-4 text-center text-xs leading-relaxed text-forest-100/70">
              pour avoir suivi avec succès l&apos;intégralité de la formation
            </p>
            <p className="mt-1 text-center font-display text-sm font-semibold text-gold-100">« {course.title} »</p>
            <div className="mt-6 rounded-xl border border-gold-400/40 bg-forest-900/60 px-4 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">Code de vérification</p>
              <p className="mt-1 font-mono text-sm font-semibold text-cream-50">RODLAB-XXXX-XXXXXX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Autres formations */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-cream-300 bg-white p-8 sm:flex-row sm:items-center sm:p-10">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terra-100 text-terra-600">
            <Video className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-ink-900 sm:text-2xl">
              Continuez avec une autre formation
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              Le catalogue RodLab Academy compte six formations complémentaires : création web, design graphique,
              community management, bureautique, identité de marque, photo & vidéo. Enchaînez les certificats à
              votre rythme.
            </p>
          </div>
          <Link
            href="/formation"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" /> Voir tout le catalogue
          </Link>
        </div>
      </section>

      <CtaBand
        title="Prêt à décrocher votre certificat ?"
        text="Créez votre compte gratuitement et commencez le module 1 dès aujourd'hui — votre progression vous attendra où vous la laisserez."
      />
    </>
  );
}
