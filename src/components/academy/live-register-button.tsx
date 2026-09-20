"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CheckCircle2, Loader2, Video } from "lucide-react";

/**
 * Inscription à une session RodLab Live pour un utilisateur connecté.
 * Variante compacte ou complète (avec champ pays pour les apprenants hors Togo).
 */
export function LiveRegisterButton({
  sessionId,
  compact = false,
  registered = false,
}: {
  sessionId: string;
  compact?: boolean;
  registered?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(registered);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/live/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Inscription impossible pour le moment");
      setDone(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-5 py-3 text-sm font-semibold text-forest-700">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Inscrit·e — à très vite !
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        onClick={register}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : compact ? (
          <Video className="h-4 w-4" aria-hidden="true" />
        ) : (
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        )}
        {loading ? "Inscription…" : "M'inscrire à cette session"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
