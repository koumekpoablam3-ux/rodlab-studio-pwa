// ─────────────────────────────────────────────────────────────────────────────
// Surcharges éditables du site public (photos + textes modifiables par l'admin)
//
// Principe : les contenus par défaut restent dans site-data*.ts. Toute valeur
// enregistrée depuis /admin/contenu (table SiteContent) prend le dessus ; si rien
// n'est enregistré, ou si la base est injoignable, le site affiche le défaut.
//
// Clés utilisées :
//   carousel.slides            JSON [{src, alt}]
//   team.members               JSON [{name, role, bio, photo}]
//   agency.hero|bureau|equipe|client|lome
//   service.<slug>.image
//   real.<slug>.image|title|summary
//   blog.<slug>.cover|title|excerpt
//   testimonial.<n>.photo|name|role|quote
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from "react";
import { db } from "@/lib/db";
import { AGENCY_PHOTOS, SERVICES, TEAM, TESTIMONIALS, IMG } from "@/lib/site-data";
import { REALISATIONS, BLOG_POSTS } from "@/lib/site-data-content";

export type CarouselSlide = { src: string; alt: string };
export type TeamMemberData = { name: string; role: string; bio: string; photo: string; initials: string; color: string };

const TEAM_COLORS = ["#bd4f2b", "#102a20", "#b98a2f", "#7a4a1f"];

export const DEFAULT_CAROUSEL: CarouselSlide[] = [
  { src: `${IMG}/carousel-formation.jpg`, alt: "Session de formation RodLab Studio — Nous formons les talents de demain" },
  { src: `${IMG}/carousel-agence.jpg`, alt: "Espace de travail RodLab Studio — Des idées aujourd'hui, les solutions de demain" },
  { src: `${IMG}/carousel-bureau.jpg`, alt: "Bureau RodLab Studio — De grandes idées pour un meilleur demain" },
];

export function initialsOf(name: string) {
  const parts = name.replace(/[.\-_]/g, " ").split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "R").slice(0, 2);
  return letters.toUpperCase();
}

/** Toutes les surcharges enregistrées, en un seul aller-retour base de données par requête. */
export const getOverrides = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await db.siteContent.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch (error) {
    console.error("SITE_OVERRIDES_ERROR", error);
    return {};
  }
});

/** Valeur surchargée (non vide) ou défaut. */
function pick(o: Record<string, string>, key: string, fallback: string) {
  const v = o[key];
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

function parseList<T>(raw: string | undefined): T[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);

export async function getCarouselSlides(): Promise<CarouselSlide[]> {
  const o = await getOverrides();
  const list = parseList<Partial<CarouselSlide>>(o["carousel.slides"]);
  const slides = (list ?? [])
    .filter((s) => typeof s?.src === "string" && s.src.trim() !== "")
    .map((s) => ({ src: str(s.src), alt: str(s.alt, "RodLab Studio") }));
  return slides.length > 0 ? slides : DEFAULT_CAROUSEL;
}

export async function getTeam(): Promise<TeamMemberData[]> {
  const o = await getOverrides();
  const list = parseList<Partial<TeamMemberData>>(o["team.members"]);
  if (list && list.length > 0) {
    return list
      .filter((m) => str(m?.name).trim() !== "")
      .map((m, i) => ({
        name: str(m.name),
        role: str(m.role),
        bio: str(m.bio),
        photo: str(m.photo),
        initials: initialsOf(str(m.name)),
        color: TEAM_COLORS[i % TEAM_COLORS.length],
      }));
  }
  return TEAM.map((m) => ({ name: m.name, role: m.role, bio: m.bio, photo: m.photo, initials: m.initials, color: m.color }));
}

export async function getAgencyPhotos() {
  const o = await getOverrides();
  return {
    hero: pick(o, "agency.hero", AGENCY_PHOTOS.hero),
    bureau: pick(o, "agency.bureau", AGENCY_PHOTOS.bureau),
    equipe: pick(o, "agency.equipe", AGENCY_PHOTOS.equipe),
    client: pick(o, "agency.client", AGENCY_PHOTOS.client),
    lome: pick(o, "agency.lome", AGENCY_PHOTOS.lome),
  };
}

export async function getServices() {
  const o = await getOverrides();
  return SERVICES.map((s) => ({ ...s, image: pick(o, `service.${s.slug}.image`, s.image) }));
}

export async function getTestimonials() {
  const o = await getOverrides();
  return TESTIMONIALS.map((t, i) => ({
    ...t,
    photo: pick(o, `testimonial.${i}.photo`, t.photo),
    name: pick(o, `testimonial.${i}.name`, t.name),
    role: pick(o, `testimonial.${i}.role`, t.role),
    quote: pick(o, `testimonial.${i}.quote`, t.quote),
    initials: initialsOf(pick(o, `testimonial.${i}.name`, t.name)),
  }));
}

export async function getRealisations() {
  const o = await getOverrides();
  return REALISATIONS.map((r) => ({
    ...r,
    image: pick(o, `real.${r.slug}.image`, r.image),
    title: pick(o, `real.${r.slug}.title`, r.title),
    summary: pick(o, `real.${r.slug}.summary`, r.summary),
  }));
}

export async function getBlogPosts() {
  const o = await getOverrides();
  const team = await getTeam();
  const founderPhoto = team[0]?.photo;
  return BLOG_POSTS.map((p) => ({
    ...p,
    cover: pick(o, `blog.${p.slug}.cover`, p.cover),
    title: pick(o, `blog.${p.slug}.title`, p.title),
    excerpt: pick(o, `blog.${p.slug}.excerpt`, p.excerpt),
    // L'auteur « fondateur » suit automatiquement la photo du premier membre de l'équipe.
    author: p.author.initials === "KR" && founderPhoto ? { ...p.author, photo: founderPhoto } : p.author,
  }));
}
