// Niveaux d'accès — sans dépendance serveur (utilisable côté navigateur).
//
//  • DIRECTEUR  : accès complet + SEUL à gérer les comptes administrateur (création, droits,
//                 suspension, suppression), à vider les données de démo et à régler la messagerie.
//  • ADMIN      : n'accède qu'aux sections que le directeur lui a accordées.
//  • La messagerie, le profil et les statistiques générales sont ouverts à tous les administrateurs.

export const PERMISSIONS = [
  { key: "requests", label: "Demandes de devis", description: "Recevoir et traiter les demandes du site" },
  { key: "clients", label: "Clients & comptes", description: "Gérer les comptes clients et entreprises" },
  { key: "projects", label: "Projets", description: "Créer et suivre les projets des clients" },
  { key: "quotes", label: "Devis", description: "Créer, envoyer et suivre les devis" },
  { key: "invoices", label: "Factures & revenus", description: "Factures, paiements et chiffres financiers" },
  { key: "training", label: "Academy & sessions live", description: "Formations, certificats et sessions en direct" },
  { key: "content", label: "Contenu du site", description: "Photos, équipe, textes du site public" },
] as const;

export type Permission = (typeof PERMISSIONS)[number]["key"];
export const ALL_PERMISSIONS: Permission[] = PERMISSIONS.map((p) => p.key);

/** Profils types : pré-cochent des droits, modifiables ensuite au cas par cas. */
export const PRESETS: { id: string; label: string; jobTitle: string; permissions: Permission[] }[] = [
  { id: "manager", label: "Responsable (tout sauf la gestion des admins)", jobTitle: "Responsable", permissions: [...ALL_PERMISSIONS] },
  { id: "commercial", label: "Commercial", jobTitle: "Chargé(e) de clientèle", permissions: ["requests", "clients", "quotes"] },
  { id: "chef-projet", label: "Chef de projet", jobTitle: "Chef(fe) de projet", permissions: ["projects", "clients", "requests"] },
  { id: "designer", label: "Designer", jobTitle: "Designer UI/UX", permissions: ["projects", "content"] },
  { id: "developpeur", label: "Développeur", jobTitle: "Développeur", permissions: ["projects"] },
  { id: "comptable", label: "Comptable", jobTitle: "Comptable", permissions: ["quotes", "invoices"] },
  { id: "formateur", label: "Formateur", jobTitle: "Formateur", permissions: ["training"] },
  { id: "communication", label: "Communication", jobTitle: "Community manager", permissions: ["content", "requests"] },
];

/** Page admin → permission requise (les pages absentes de cette liste sont ouvertes à tous les admins). */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/admin/demandes": "requests",
  "/admin/clients": "clients",
  "/admin/equipe": "clients",
  "/admin/projets": "projects",
  "/admin/devis": "quotes",
  "/admin/factures": "invoices",
  "/admin/formation": "training",
  "/admin/live": "training",
  "/admin/contenu": "content",
  "/admin/realisations": "content",
};

const VALID = new Set<string>(ALL_PERMISSIONS);

/** null (ancien compte sans réglage) = accès complet, pour ne rien casser à la mise à jour. */
export function parsePermissions(raw: string | null | undefined): Permission[] {
  if (raw == null) return [...ALL_PERMISSIONS];
  return raw.split(",").map((p) => p.trim()).filter((p): p is Permission => VALID.has(p));
}

export function serializePermissions(list: string[]): string {
  return Array.from(new Set(list.filter((p) => VALID.has(p)))).join(",");
}
