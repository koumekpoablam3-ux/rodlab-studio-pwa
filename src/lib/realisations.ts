import { db } from "@/lib/db";
import { REALISATIONS as DEFAULTS } from "@/lib/site-data-content";
import { categoryLabel } from "@/lib/realisation-types";
import { IMG } from "@/lib/site-data";

export const REALISATION_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS "Realisation" ( "id" TEXT NOT NULL PRIMARY KEY, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "category" TEXT NOT NULL DEFAULT 'web', "client" TEXT NOT NULL DEFAULT '', "year" TEXT NOT NULL DEFAULT '', "duration" TEXT NOT NULL DEFAULT '', "summary" TEXT NOT NULL DEFAULT '', "challenge" TEXT NOT NULL DEFAULT '', "solution" TEXT NOT NULL DEFAULT '', "image" TEXT NOT NULL DEFAULT '', "gallery" TEXT NOT NULL DEFAULT '[]', "liveUrl" TEXT, "results" TEXT NOT NULL DEFAULT '[]', "features" TEXT NOT NULL DEFAULT '[]', "tags" TEXT NOT NULL DEFAULT '[]', "testimonialQuote" TEXT NOT NULL DEFAULT '', "testimonialName" TEXT NOT NULL DEFAULT '', "testimonialRole" TEXT NOT NULL DEFAULT '', "accent" TEXT NOT NULL DEFAULT 'terra', "published" BOOLEAN NOT NULL DEFAULT true, "position" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Realisation_slug_key" ON "Realisation"("slug")`,
  `CREATE INDEX IF NOT EXISTS "Realisation_published_position_idx" ON "Realisation"("published", "position")`,
];

export const REALISATIONS_SEEDED_KEY = "realisations.seeded";

const json = (v: unknown) => JSON.stringify(v);

export function parseList<T>(raw: string | null | undefined, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function slugify(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "projet"
  );
}

/** Slug libre : « mon-projet », puis « mon-projet-2 »… */
export async function uniqueSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  for (let i = 2; await db.realisation.findUnique({ where: { slug }, select: { id: true } }); i++) slug = `${base}-${i}`;
  return slug;
}

/**
 * Importe UNE fois les 6 exemples d'origine dans la base (en reprenant les photos/textes déjà modifiés
 * depuis l'ancien éditeur) pour qu'ils soient modifiables ou supprimables comme n'importe quelle réalisation.
 * Un marqueur évite de les recréer si le directeur les supprime.
 */
export async function ensureRealisationsSeeded() {
  const marker = await db.siteContent.findUnique({ where: { key: REALISATIONS_SEEDED_KEY } });
  if (marker) return;

  const overrides = await db.siteContent.findMany({ where: { key: { startsWith: "real." } } });
  const hides = await db.siteContent.findMany({ where: { key: { startsWith: "hide.real." } } });
  const o = Object.fromEntries(overrides.map((r) => [r.key, r.value]));
  const hidden = new Set(hides.filter((h) => h.value === "1").map((h) => h.key.replace("hide.real.", "")));
  const pick = (key: string, fallback: string) => (o[key]?.trim() ? o[key] : fallback);

  await db.realisation.createMany({
    skipDuplicates: true,
    data: DEFAULTS.map((r, i) => ({
      slug: r.slug,
      title: pick(`real.${r.slug}.title`, r.title),
      category: r.category,
      client: r.client,
      year: r.year,
      duration: r.duration,
      summary: pick(`real.${r.slug}.summary`, r.summary),
      challenge: r.challenge,
      solution: r.solution,
      image: pick(`real.${r.slug}.image`, r.image),
      results: json(r.results),
      features: json(r.features),
      tags: json(r.tags),
      testimonialQuote: r.testimonial.quote,
      testimonialName: r.testimonial.name,
      testimonialRole: r.testimonial.role,
      accent: r.accent,
      published: !hidden.has(r.slug),
      position: i,
    })),
  });
  await db.siteContent.upsert({
    where: { key: REALISATIONS_SEEDED_KEY },
    update: { value: "1" },
    create: { key: REALISATIONS_SEEDED_KEY, value: "1", section: "realisations", label: "Réalisations importées", type: "TEXT" },
  });
}

type Row = Awaited<ReturnType<typeof db.realisation.findFirst>> & object;

/** Forme attendue par les pages publiques. */
export function toPublic(r: Row) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryLabel: categoryLabel(r.category),
    client: r.client,
    year: r.year,
    duration: r.duration,
    summary: r.summary,
    challenge: r.challenge,
    solution: r.solution,
    image: r.image || `${IMG}/carousel-agence.jpg`,
    gallery: parseList<string>(r.gallery),
    liveUrl: r.liveUrl,
    results: parseList<{ value: string; label: string }>(r.results),
    features: parseList<string>(r.features),
    tags: parseList<string>(r.tags),
    testimonial: r.testimonialQuote.trim()
      ? { quote: r.testimonialQuote, name: r.testimonialName, role: r.testimonialRole }
      : null,
    accent: (["terra", "forest", "gold"].includes(r.accent) ? r.accent : "terra") as "terra" | "forest" | "gold",
  };
}
export type PublicRealisation = ReturnType<typeof toPublic>;
