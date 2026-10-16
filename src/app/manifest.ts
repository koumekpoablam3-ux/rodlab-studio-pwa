import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RodLab Studio — Espace client",
    short_name: "RodLab",
    description:
      "Application PWA de RodLab Studio : suivi de projets, devis, factures, messagerie et notifications, même hors ligne.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#faf6ee",
    theme_color: "#102a20",
    lang: "fr",
    categories: ["business", "productivity"],
    prefer_related_applications: false,
    launch_handler: { client_mode: "navigate-existing" },
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-256.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/screenshots/app-client-accueil.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Accueil de l'espace client : projets, devis et messages en un coup d'œil",
      },
      {
        src: "/screenshots/app-client-projets.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Suivi des projets en temps réel avec avancement et échéances",
      },
      {
        src: "/screenshots/app-client-messagerie.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Messagerie directe avec l'équipe RodLab Studio",
      },
      {
        src: "/screenshots/app-admin-desktop.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "Tableau de bord d'administration : statistiques et revenus",
      },
    ],
    shortcuts: [
      {
        name: "Messagerie",
        short_name: "Messages",
        description: "Consulter la messagerie",
        url: "/dashboard/messagerie",
      },
      {
        name: "Mes projets",
        short_name: "Projets",
        description: "Suivre l'avancement de mes projets",
        url: "/dashboard/projets",
      },
    ],
  };
}
