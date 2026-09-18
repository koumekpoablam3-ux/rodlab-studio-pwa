"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, LayoutTemplate, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Content = { id: string; key: string; section: string; label: string; value: string; type: string };

const SECTION_LABELS: Record<string, string> = {
  hero: "Section d'accueil (Hero)",
  stats: "Chiffres clés",
  contact: "Coordonnées affichées",
  cta: "Appel à l'action",
};

export function ContentEditor({ initialContents }: { initialContents: Content[] }) {
  const router = useRouter();
  const [contents, setContents] = useState(initialContents);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, Content[]>();
    for (const c of contents) {
      if (!map.has(c.section)) map.set(c.section, []);
      map.get(c.section)!.push(c);
    }
    return Array.from(map.entries());
  }, [contents]);

  const changedKeys = useMemo(() => {
    const initial = new Map(initialContents.map((c) => [c.key, c.value]));
    return contents.filter((c) => initial.get(c.key) !== c.value).map((c) => c.key);
  }, [contents, initialContents]);

  function update(key: string, value: string) {
    setContents((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  }

  async function save() {
    if (changedKeys.length === 0) {
      toast.info("Aucune modification à enregistrer");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/site-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: contents.filter((c) => changedKeys.includes(c.key)).map((c) => ({ key: c.key, value: c.value })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Impossible d'enregistrer le contenu");
      return;
    }
    toast.success("Contenu enregistré — visible immédiatement sur le site public");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Contenu du site"
        description="Modifiez les textes et coordonnées affichés sur la page d'accueil publique."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setContents(initialContents)}
              disabled={changedKeys.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2.5 text-sm font-medium text-ink-500 transition hover:bg-cream-100 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Annuler
            </button>
            <button
              onClick={save}
              disabled={saving || changedKeys.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              Enregistrer {changedKeys.length > 0 && `(${changedKeys.length})`}
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {grouped.map(([section, items]) => (
          <section key={section} className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <LayoutTemplate className="h-5 w-5 text-terra-600" aria-hidden="true" />
              {SECTION_LABELS[section] ?? section}
            </h2>
            <div className="mt-5 grid gap-5">
              {items.map((c) => (
                <div key={c.key} className="space-y-1.5">
                  <Label htmlFor={`ct-${c.key}`} className="flex items-baseline gap-2">
                    {c.label}
                    <span className="font-mono text-[10px] font-normal text-ink-300">{c.key}</span>
                  </Label>
                  {c.key === "hero.subtitle" || c.value.length > 90 ? (
                    <Textarea id={`ct-${c.key}`} rows={3} value={c.value} onChange={(e) => update(c.key, e.target.value)} className="resize-none bg-white" />
                  ) : (
                    <Input id={`ct-${c.key}`} value={c.value} onChange={(e) => update(c.key, e.target.value)} className="h-11 bg-white" />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
