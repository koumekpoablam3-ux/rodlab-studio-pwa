import type { PrismaClient } from "@prisma/client";
import { ACADEMY_COURSES, quizSeedForCourse } from "@/lib/academy";

/**
 * Insère en base tout cours présent dans ACADEMY_COURSES mais absent de la table
 * Course — utile quand un nouveau cours est ajouté au code APRÈS que la base a
 * déjà été peuplée une première fois (le seed initial ne tourne qu'une seule
 * fois, quand la base est totalement vide — voir src/lib/bootstrap.ts).
 *
 * Idempotent et bon marché une fois les cours créés : une seule requête de
 * lecture (les slugs existants) si rien à faire.
 */
export async function syncMissingAcademyCourses(db: PrismaClient) {
  const existing = await db.course.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((c) => c.slug));
  const missing = ACADEMY_COURSES.filter((c) => !existingSlugs.has(c.slug));
  if (missing.length === 0) return;

  console.log(`[academy-sync] ${missing.length} cours manquant(s) — création : ${missing.map((c) => c.slug).join(", ")}`);

  for (const courseSeed of missing) {
    const course = await db.course.create({
      data: {
        slug: courseSeed.slug,
        title: courseSeed.title,
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        level: courseSeed.level,
        durationHours: courseSeed.durationHours,
        skills: JSON.stringify(courseSeed.skills),
        published: true,
      },
    });

    for (const mod of courseSeed.modules) {
      await db.courseModule.create({
        data: {
          courseId: course.id,
          order: mod.order,
          title: mod.title,
          summary: mod.summary,
          minutes: mod.minutes,
          lessons: {
            create: mod.lessons.map((les) => ({
              order: les.order,
              title: les.title,
              minutes: les.minutes,
              content: les.content,
            })),
          },
        },
      });
    }

    const quizSeed = quizSeedForCourse(courseSeed.slug);
    if (quizSeed) {
      await db.quiz.create({
        data: {
          courseId: course.id,
          title: quizSeed.title,
          passScore: quizSeed.passScore,
          questions: {
            create: quizSeed.questions.map((q, i) => ({
              order: i + 1,
              prompt: q.prompt,
              options: JSON.stringify(q.options),
              answer: q.answer,
              explanation: q.explanation,
            })),
          },
        },
      });
    }
  }

  console.log("[academy-sync] Terminé.");
}
