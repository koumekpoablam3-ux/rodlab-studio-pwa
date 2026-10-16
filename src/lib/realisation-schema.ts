import { z } from "zod";

// Une image est soit un fichier du site (/…), soit une adresse https:// — jamais « javascript: » ou autre.
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\//i.test(v), "Adresse d'image invalide");

export const realisationSchema = z.object({
  title: z.string().trim().min(2, "Le titre est requis").max(120),
  category: z.enum(["web", "ecommerce", "branding", "mobile"]),
  client: z.string().trim().max(160),
  year: z.string().trim().max(10),
  duration: z.string().trim().max(40),
  summary: z.string().trim().min(10, "Le résumé est trop court (10 caractères minimum)").max(400, "Le résumé est trop long (400 caractères maximum)"),
  challenge: z.string().trim().max(3000),
  solution: z.string().trim().max(3000),
  image: imageUrl.refine((v) => v.length > 0, "Ajoutez une photo de couverture"),
  gallery: z.array(imageUrl).max(12, "12 images maximum dans la galerie"),
  liveUrl: z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), "Le lien du projet doit commencer par http:// ou https://"),
  results: z.array(z.object({ value: z.string().trim().min(1).max(20), label: z.string().trim().min(1).max(80) })).max(4, "4 résultats maximum"),
  features: z.array(z.string().trim().min(1).max(120)).max(12, "12 fonctionnalités maximum"),
  tags: z.array(z.string().trim().min(1).max(40)).max(10, "10 technologies maximum"),
  testimonialQuote: z.string().trim().max(600),
  testimonialName: z.string().trim().max(80),
  testimonialRole: z.string().trim().max(120),
  accent: z.enum(["terra", "forest", "gold"]),
  published: z.boolean(),
});

export type RealisationInput = z.infer<typeof realisationSchema>;

/** Valeurs prêtes pour la base (listes en JSON, lien vide → null). */
export function toDbData(input: Partial<RealisationInput>) {
  const { gallery, results, features, tags, liveUrl, ...rest } = input;
  return {
    ...rest,
    ...(gallery !== undefined ? { gallery: JSON.stringify(gallery) } : {}),
    ...(results !== undefined ? { results: JSON.stringify(results) } : {}),
    ...(features !== undefined ? { features: JSON.stringify(features) } : {}),
    ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
    ...(liveUrl !== undefined ? { liveUrl: liveUrl || null } : {}),
  };
}
