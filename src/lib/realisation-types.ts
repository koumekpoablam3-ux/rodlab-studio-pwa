// Types et listes partagés (navigateur + serveur) pour les réalisations.

export const CATEGORY_OPTIONS = [
  { value: "web", label: "Site web" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "branding", label: "Identité & branding" },
  { value: "mobile", label: "Application mobile" },
] as const;
export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];

export const ACCENT_OPTIONS = [
  { value: "terra", label: "Terracotta", color: "#bd4f2b" },
  { value: "forest", label: "Vert forêt", color: "#1c3829" },
  { value: "gold", label: "Or", color: "#b98a2f" },
] as const;

export const categoryLabel = (c: string) => CATEGORY_OPTIONS.find((o) => o.value === c)?.label ?? "Projet";

export type RealisationResult = { value: string; label: string };

/** Réalisation telle que l'éditeur la manipule (listes déjà décodées). */
export type RealisationForm = {
  id?: string;
  title: string;
  category: CategoryValue;
  client: string;
  year: string;
  duration: string;
  summary: string;
  challenge: string;
  solution: string;
  image: string;
  gallery: string[];
  liveUrl: string;
  results: RealisationResult[];
  features: string[];
  tags: string[];
  testimonialQuote: string;
  testimonialName: string;
  testimonialRole: string;
  accent: "terra" | "forest" | "gold";
  published: boolean;
};
