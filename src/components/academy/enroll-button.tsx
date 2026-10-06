"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";

/**
 * Bouton « Commencer la formation » pour un utilisateur connecté non inscrit :
 * crée l'inscription puis bascule vers le tableau de bord formation.
 * `courseId` cible un cours du catalogue ; `redirectTo` la page de retour.
 */
export function EnrollButton({
  label = "Commencer la formation",
  courseId,
  redirectTo,
  compact = false,
}: {
  label?: string;
  courseId?: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/formation/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseId ? { courseId } : {}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Inscription impossible pour le moment");
      }
      const data = await res.json().catch(() => null);
      router.push(redirectTo ?? (data?.courseSlug ? `/dashboard/formation/${data.courseSlug}` : "/dashboard/formation"));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        onClick={enroll}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full bg-terra-600 font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500 disabled:opacity-60 ${
          compact ? "px-5 py-2.5 text-xs" : "px-8 py-4 text-sm"
        }`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Rocket className="h-4 w-4" aria-hidden="true" />}
        {loading ? "Inscription en cours…" : label}
      </button>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}
