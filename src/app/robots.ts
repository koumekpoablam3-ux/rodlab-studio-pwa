import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Espaces privés et pages techniques : jamais dans les résultats de recherche
        disallow: ["/admin", "/dashboard", "/api/", "/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe", "/hors-ligne"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
