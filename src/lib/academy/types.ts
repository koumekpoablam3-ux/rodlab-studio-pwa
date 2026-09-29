/**
 * RODLAB ACADEMY — Types du contenu pédagogique (v8.5)
 * Format des leçons :
 *   - paragraphes séparés par "\n\n"
 *   - lignes commençant par "- " → puces
 *   - lignes commençant par "## " → intertitre
 */

export type LessonSeed = {
  order: number;
  title: string;
  minutes: number;
  content: string;
};

export type ModuleSeed = {
  order: number;
  title: string;
  summary: string;
  minutes: number;
  lessons: LessonSeed[];
};

export type QuizQuestionSeed = {
  prompt: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
};

/** Un cours complet du catalogue RodLab Academy (v8.6 — multi-cours). */
export type CourseSeed = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  durationHours: number;
  /** Compétences acquises, affichées sur la page publique du cours. */
  skills: string[];
  modules: ModuleSeed[];
};

/** Quiz final d'un cours du catalogue. */
export type CourseQuizSeed = {
  /** slug du cours auquel le quiz est rattaché */
  courseSlug: string;
  title: string;
  passScore: number;
  questions: QuizQuestionSeed[];
};
