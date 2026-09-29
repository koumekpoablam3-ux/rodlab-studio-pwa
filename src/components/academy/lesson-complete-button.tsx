"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

/**
 * Case « Leçon terminée » : bascule la progression via l'API et rafraîchit
 * les barres du module et du tableau de bord.
 */
export function LessonCompleteButton({
  lessonId,
  done,
  variant = "full",
}: {
  lessonId: string;
  done: boolean;
  variant?: "full" | "compact";
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(done);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const toggle = async () => {
    const next = !checked;
    setChecked(next);
    setSaving(true);
    try {
      const res = await fetch("/api/formation/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, done: next }),
      });
      if (!res.ok) throw new Error();
      startTransition(() => router.refresh());
    } catch {
      setChecked(!next); // revert visuel en cas d'échec
    } finally {
      setSaving(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={toggle}
        disabled={saving}
        aria-pressed={checked}
        aria-label={checked ? "Marquer la leçon comme non terminée" : "Marquer la leçon comme terminée"}
        className="shrink-0 transition hover:scale-110 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin text-ink-400" aria-hidden="true" />
        ) : checked ? (
          <CheckCircle2 className="h-5 w-5 text-forest-600" aria-hidden="true" />
        ) : (
          <Circle className="h-5 w-5 text-ink-300" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:opacity-60 ${
        checked
          ? "bg-forest-700 text-cream-50 hover:bg-forest-600"
          : "border border-forest-300 bg-white text-forest-700 hover:bg-forest-50"
      }`}
    >
      {saving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : checked ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Circle className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {checked ? "Leçon terminée" : "Marquer comme terminée"}
    </button>
  );
}
