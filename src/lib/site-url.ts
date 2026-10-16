/**
 * Adresse publique du site, utilisée pour les liens canoniques, le plan du site, les données structurées
 * et les emails. Ordre : NEXT_PUBLIC_SITE_URL (si ce n'est pas localhost), puis le domaine de production
 * fourni automatiquement par Vercel, puis l'adresse du déploiement, puis la valeur par défaut.
 * Une mauvaise adresse ici ferait référencer le site sous un faux domaine.
 */
export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !/localhost|127\.0\.0\.1/.test(explicit)) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return (explicit || "https://rodlab-studio-pwa.vercel.app").replace(/\/$/, "");
}

export const SITE_URL = resolveSiteUrl();
