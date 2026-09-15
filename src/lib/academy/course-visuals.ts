import type { LucideIcon } from "lucide-react";
import {
  Palette, Megaphone, Laptop, Fingerprint, Camera, Globe2,
} from "lucide-react";

/**
 * RODLAB ACADEMY — Identité visuelle par cours (v8.6)
 * Chaque cours du catalogue a son icône et son accent de couleur,
 * utilisés sur le catalogue public et le hub « Mes formations ».
 */

export type CourseVisual = {
  icon: LucideIcon;
  /** Class Tailwind de la pastille : fond + texte */
  chip: string;
  /** Class Tailwind du bandeau d'en-tête de carte */
  banner: string;
};

export const COURSE_VISUALS: Record<string, CourseVisual> = {
  "site-web-professionnel": {
    icon: Globe2,
    chip: "bg-forest-100 text-forest-700",
    banner: "bg-forest-900 text-cream-50",
  },
  "design-graphique-pro": {
    icon: Palette,
    chip: "bg-terra-100 text-terra-600",
    banner: "bg-terra-700 text-cream-50",
  },
  "community-management": {
    icon: Megaphone,
    chip: "bg-gold-100 text-forest-800",
    banner: "bg-forest-700 text-cream-50",
  },
  "bureautique-essentielle": {
    icon: Laptop,
    chip: "bg-forest-100 text-forest-700",
    banner: "bg-ink-900 text-cream-50",
  },
  "identite-de-marque": {
    icon: Fingerprint,
    chip: "bg-terra-100 text-terra-600",
    banner: "bg-forest-800 text-cream-50",
  },
  "photo-video-smartphone": {
    icon: Camera,
    chip: "bg-gold-100 text-forest-800",
    banner: "bg-terra-600 text-cream-50",
  },
};

const FALLBACK: CourseVisual = {
  icon: Globe2,
  chip: "bg-forest-100 text-forest-700",
  banner: "bg-forest-900 text-cream-50",
};

export function courseVisual(slug: string | null | undefined): CourseVisual {
  if (!slug) return FALLBACK;
  return COURSE_VISUALS[slug] ?? FALLBACK;
}
