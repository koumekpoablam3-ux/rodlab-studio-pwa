import { COURSE_META, MODULES_1_4 } from "./content-part1";
import { MODULES_5_8 } from "./content-part2";
import { QUIZ_QUESTIONS } from "./quiz";
import { COURSE_DESIGN } from "./catalog-design";
import { COURSE_COMMUNITY } from "./catalog-community";
import { COURSE_BUREAUTIQUE } from "./catalog-bureautique";
import { COURSE_MARQUE } from "./catalog-marque";
import { COURSE_PHOTO } from "./catalog-photo";
import { CATALOG_QUIZZES } from "./catalog-quizzes";
import type { CourseSeed, CourseQuizSeed } from "./types";

export const ACADEMY_MODULES = [...MODULES_1_4, ...MODULES_5_8];

/** Compétences acquises du cours vedette (ex-page /formation). */
export const FLAGSHIP_SKILLS = [
  "Comprendre comment fonctionne le web et choisir le bon type de site",
  "Rédiger un cahier des charges et maquetter son projet comme une agence",
  "Écrire du HTML propre et sémantique (textes, images, formulaires)",
  "Mettre en page avec CSS et Flexbox, parfaitement sur mobile",
  "Construire des palettes, des typographies et des composants professionnels",
  "Choisir entre code, WordPress et no-code en connaissance de cause",
  "Mettre un site en ligne avec domaine, hébergement et HTTPS",
  "Trouver des clients et chiffrer des devis rentables",
];

/** Le cours vedette : « Créez votre premier site web professionnel ». */
export const FLAGSHIP_COURSE: CourseSeed = {
  ...COURSE_META,
  skills: FLAGSHIP_SKILLS,
  modules: ACADEMY_MODULES,
};

/** Compatibilité v8.5 : l'ancien nom du cours unique. */
export const ACADEMY_COURSE = FLAGSHIP_COURSE;

/** CATALOGUE COMPLET v8.6 : le cours vedette + 5 nouvelles formations. */
export const ACADEMY_COURSES: CourseSeed[] = [
  FLAGSHIP_COURSE,
  COURSE_DESIGN,
  COURSE_COMMUNITY,
  COURSE_BUREAUTIQUE,
  COURSE_MARQUE,
  COURSE_PHOTO,
];

export const ACADEMY_QUIZ = {
  title: "Examen final — Certification RodLab",
  passScore: 70,
  questions: QUIZ_QUESTIONS,
};

/** Tous les examens, indexés par slug de cours. */
export const ACADEMY_QUIZZES: CourseQuizSeed[] = [
  { courseSlug: FLAGSHIP_COURSE.slug, ...ACADEMY_QUIZ },
  ...CATALOG_QUIZZES,
];

export function quizSeedForCourse(slug: string): CourseQuizSeed | undefined {
  return ACADEMY_QUIZZES.find((q) => q.courseSlug === slug);
}

export const TOTAL_LESSONS = ACADEMY_MODULES.reduce((n, mod) => n + mod.lessons.length, 0);
export const TOTAL_MINUTES = ACADEMY_MODULES.reduce((n, mod) => n + mod.minutes, 0);

/** Nombre total de leçons dans tout le catalogue (utile pour les stats). */
export const TOTAL_LESSONS_CATALOG = ACADEMY_COURSES.reduce(
  (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
  0
);
