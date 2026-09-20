"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Pencil, X, Users, ExternalLink } from "lucide-react";

export type LiveSessionAdmin = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  platform: string;
  joinUrl: string | null;
  startsAt: string;
  durationMin: number;
  capacity: number;
  status: string;
  registrations: number;
};

const PLATFORMS = ["ZOOM", "MEET", "YOUTUBE", "STREAMYARD"];
const PLATFORM_LABELS: Record<string, string> = {
  ZOOM: "Zoom", MEET: "Google Meet", YOUTUBE: "YouTube Live", STREAMYARD: "StreamYard",
};
const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Planifiée", LIVE: "En direct", DONE: "Terminée", CANCELLED: "Annulée",
};
const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-forest-100 text-forest-700",
  LIVE: "bg-red-600 text-white",
  DONE: "bg-cream-200 text-ink-500",
  CANCELLED: "bg-red-100 text-red-700",
};

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Gestion des sessions RodLab Live : création, édition de statut/lien, suppression. */
export function LiveManager({ sessions }: { sessions: LiveSessionAdmin[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<LiveSessionAdmin | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulaire
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("ZOOM");
  const [joinUrl, setJoinUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [durationMin, setDurationMin] = useState(90);
  const [capacity, setCapacity] = useState(200);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setSummary("");
    setDescription("");
    setPlatform("ZOOM");
    setJoinUrl("");
    setStartsAt("");
    setDurationMin(90);
    setCapacity(200);
    setCreating(true);
    setError(null);
  };

  const openEdit = (s: LiveSessionAdmin) => {
    setCreating(false);
    setEditing(s);
    setTitle(s.title);
    setSummary(s.summary);
    setDescription(s.summary);
    setPlatform(s.platform);
    setJoinUrl(s.joinUrl ?? "");
    setStartsAt(toDatetimeLocal(s.startsAt));
    setDurationMin(s.durationMin);
    setCapacity(s.capacity);
    setError(null);
  };

  const closeForm = () => { setCreating(false); setEditing(null); setError(null); };

  const submitForm = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = { title, summary, description, platform, joinUrl, startsAt, durationMin, capacity };
      const res = await fetch("/api/admin/live", {
        method: creating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creating ? payload : { ...payload, id: editing?.id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Enregistrement impossible");
      closeForm();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (s: LiveSessionAdmin, status: string) => {
    setBusy(true);
    try {
      await fetch("/api/admin/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, status }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (s: LiveSessionAdmin) => {
    if (!window.confirm(`Supprimer la session « ${s.title} » ? Cette action est définitive.`)) return;
    setBusy(true);
    try {
      await fetch("/api/admin/live", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const formOpen = creating || editing !== null;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {sessions.length} session(s) au total — créez vos prochaines dates et passez une session « En direct »
          au moment du lancement.
        </p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-3 text-xs font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle session
        </button>
      </div>

      {/* Formulaire création / édition */}
      {formOpen && (
        <div className="rounded-2xl border border-forest-300 bg-forest-50/60 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">
              {creating ? "Créer une session live" : `Modifier — ${editing?.title}`}
            </h3>
            <button
              onClick={closeForm}
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-cream-200 hover:text-ink-700"
              aria-label="Fermer le formulaire"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-medium text-ink-700 sm:col-span-2">
              Titre de la session *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                placeholder="Masterclass : …"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-ink-700 sm:col-span-2">
              Résumé (affiché sur la carte publique) *
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                placeholder="En 90 minutes, …"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-ink-700 sm:col-span-2">
              Description complète (paragraphes séparés par une ligne vide, « - » pour les puces)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-ink-700">
              Plateforme
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-ink-700">
              Lien de la salle (Zoom / Meet / StreamYard…)
              <input
                value={joinUrl}
                onChange={(e) => setJoinUrl(e.target.value)}
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                placeholder="https://zoom.us/j/…"
                type="url"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-ink-700">
              Date et heure de début * (heure de Lomé, GMT)
              <input
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                type="datetime-local"
                className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-xs font-medium text-ink-700">
                Durée (min)
                <input
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value) || 90)}
                  type="number"
                  min={15}
                  step={5}
                  className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-ink-700">
                Places
                <input
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value) || 200)}
                  type="number"
                  min={5}
                  className="rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500"
                />
              </label>
            </div>
          </div>
          {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-700">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              onClick={submitForm}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-600 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              {creating ? "Créer la session" : "Enregistrer les modifications"}
            </button>
            <button
              onClick={closeForm}
              className="rounded-full border border-cream-300 bg-white px-5 py-3 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des sessions */}
      <div className="grid gap-3">
        {sessions.map((s) => (
          <article key={s.id} className="rounded-2xl border border-cream-300 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[s.status] ?? "bg-cream-200"}`}>
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                  <span className="text-[11px] text-ink-400">
                    {PLATFORM_LABELS[s.platform] ?? s.platform}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-ink-400">
                    <Users className="h-3 w-3" aria-hidden="true" /> {s.registrations}/{s.capacity}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1 text-xs text-ink-500">
                  {new Intl.DateTimeFormat("fr-FR", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  }).format(new Date(s.startsAt))} · {s.durationMin} min
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <select
                  value={s.status}
                  onChange={(e) => changeStatus(s, e.target.value)}
                  disabled={busy}
                  className="rounded-lg border border-cream-300 bg-cream-50 px-2.5 py-2 text-[11px] font-medium text-ink-700 outline-none focus:border-forest-500"
                  aria-label={`Changer le statut de « ${s.title} »`}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <a
                  href={`/live/${s.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cream-300 p-2 text-ink-500 transition hover:bg-cream-100 hover:text-ink-900"
                  aria-label="Ouvrir la page publique"
                  title="Ouvrir la page publique"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  onClick={() => openEdit(s)}
                  className="rounded-lg border border-cream-300 p-2 text-ink-500 transition hover:bg-cream-100 hover:text-ink-900"
                  aria-label={`Modifier « ${s.title} »`}
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => remove(s)}
                  disabled={busy}
                  className="rounded-lg border border-cream-300 p-2 text-ink-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Supprimer « ${s.title} »`}
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
        {sessions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-6 py-10 text-center text-sm text-ink-400">
            Aucune session pour le moment — créez la première avec le bouton « Nouvelle session ».
          </p>
        )}
      </div>
    </div>
  );
}
