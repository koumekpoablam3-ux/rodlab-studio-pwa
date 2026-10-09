"use client";

import { usePathname } from "next/navigation";

/**
 * Les boutons flottants d'aide (RodBot, WhatsApp) sont réservés au site public : dans l'espace connecté
 * ils recouvraient les boutons « Enregistrer », « Envoyer » et le champ de saisie, surtout sur téléphone.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
