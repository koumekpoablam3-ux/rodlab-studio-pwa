// Rôles, statuts et libellés métier de RodLab Studio

export const ROLES = ["ADMIN", "CLIENT", "ENTREPRISE"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  CLIENT: "Client",
  ENTREPRISE: "Entreprise",
};

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-forest-100 text-forest-700 border-forest-200",
  CLIENT: "bg-terra-50 text-terra-700 border-terra-200",
  ENTREPRISE: "bg-gold-100 text-gold-600 border-gold-200",
};

export const PROJECT_STATUSES = ["PENDING", "IN_PROGRESS", "REVIEW", "DELIVERED", "CANCELLED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  REVIEW: "En révision",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  PENDING: "bg-cream-200 text-ink-700",
  IN_PROGRESS: "bg-terra-100 text-terra-700",
  REVIEW: "bg-gold-100 text-gold-600",
  DELIVERED: "bg-forest-100 text-forest-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const QUOTE_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REFUSED", "EXPIRED"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  EXPIRED: "Expiré",
};

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  DRAFT: "bg-cream-200 text-ink-700",
  SENT: "bg-terra-100 text-terra-700",
  ACCEPTED: "bg-forest-100 text-forest-700",
  REFUSED: "bg-red-100 text-red-700",
  EXPIRED: "bg-ink-300/20 text-ink-500",
};

export const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: "bg-cream-200 text-ink-700",
  SENT: "bg-terra-100 text-terra-700",
  PAID: "bg-forest-100 text-forest-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-ink-300/20 text-ink-500",
};

export const REQUEST_STATUSES = ["NEW", "IN_REVIEW", "CONVERTED", "ARCHIVED"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "Nouvelle",
  IN_REVIEW: "En étude",
  CONVERTED: "Convertie",
  ARCHIVED: "Archivée",
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  NEW: "bg-terra-100 text-terra-700",
  IN_REVIEW: "bg-gold-100 text-gold-600",
  CONVERTED: "bg-forest-100 text-forest-700",
  ARCHIVED: "bg-ink-300/20 text-ink-500",
};

export const SERVICE_TYPES = [
  { value: "design-graphique", label: "Design graphique" },
  { value: "developpement-numerique", label: "Développement numérique" },
  { value: "formation", label: "Formation professionnelle" },
  { value: "community-management", label: "Community management" },
] as const;

export const BUDGET_RANGES = [
  "Moins de 250 000 FCFA",
  "250 000 – 500 000 FCFA",
  "500 000 – 1 000 000 FCFA",
  "1 000 000 – 3 000 000 FCFA",
  "Plus de 3 000 000 FCFA",
] as const;

export const AVATAR_COLORS = ["#bd4f2b", "#276144", "#b98224", "#1b6fa8", "#7c3aed", "#be185d"];

export function serviceTypeLabel(value: string): string {
  return SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;
}
