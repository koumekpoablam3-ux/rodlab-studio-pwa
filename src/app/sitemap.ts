import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/site-data";
import { REALISATIONS, BLOG_POSTS } from "@/lib/site-data-content";
import { ACADEMY_COURSES } from "@/lib/academy";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rodlabstudio.tg";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/realisations", priority: 0.9 },
    { path: "/a-propos", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/telecharger", priority: 0.8 },
    { path: "/formation", priority: 0.9 },
    { path: "/live", priority: 0.8 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const casePages: MetadataRoute.Sitemap = REALISATIONS.map((r) => ({
    url: `${base}/realisations/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const coursePages: MetadataRoute.Sitemap = ACADEMY_COURSES.map((c) => ({
    url: `${base}/formation/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...coursePages, ...servicePages, ...casePages, ...blogPages];
}
