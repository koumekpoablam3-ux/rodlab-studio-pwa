"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarDays, UserRound, Save, Loader2, Plus, Trash2,
  FileText, Receipt, CheckCircle2, Circle,
} from "lucide-react";
import { toast } from "sonner";
import {StatusBadge} from "@/components/shared";
import { Avatar } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, SERVICE_TYPES, serviceTypeLabel, ProjectStatus } from "@/lib/roles";
import { formatFCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Task = { id?: string; title: string; done: boolean; order: number };
type Project = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  status: string;
  progress: number;
  budget: number | null;
  currency: string;
  deadline: string | Date | null;
  deliveredAt: string | Date | null;
  startDate: string | Date;
  client: { id: string; name: string; email: string; role: string; companyName: string | null; phone: string | null; avatarColor: string | null };
  tasks: Task[];
  quotes: { id: string; number: string; title: string; total: number; status: string }[];
  invoices: { id: string; number: string; total: number; status: string }[];
};

export function ProjectEditor({ project }: { project: Project }) {
  const router = useRouter();
  const [status, setStatus] = useState(project.status);
  const [progress, setProgress] = useState(project.progress);
  const [budget, setBudget] = useState(project.budget?.toString() ?? "");
  const [deadline, setDeadline] = useState(project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : "");
  const [tasks, setTasks] = useState<Task[]>(project.tasks.map((t) => ({ title: t.title, done: t.done, order: t.order })));
  const [newTask, setNewTask] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        progress: Number(progress),
        budget: budget ? Number(budget) : null,
        deadline: deadline || null,
        tasks: tasks.map((t, i) => ({ title: t.title, done: t.done, order: i })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Impossible d'enregistrer le projet");
      return;
    }
    toast.success("Projet enregistré — le client est notifié des changements");
    router.refresh();
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { title: newTask.trim(), done: false, order: t.length }]);
    setNewTask("");
  }

  async function removeProject() {
    if (!confirm("Supprimer définitivement ce projet ? Les devis et factures associés seront conservés.")) return;
    const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Projet supprimé");
    router.push("/admin/projets");
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <>
      <Link href="/admin/projets" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les projets
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ——— Colonne principale ——— */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink-900">{project.title}</h1>
                <p className="mt-1 text-sm text-ink-500">{serviceTypeLabel(project.serviceType)} · Démarré le {formatDate(project.startDate)}</p>
              </div>
              <StatusBadge label={PROJECT_STATUS_LABELS[status as ProjectStatus]} colorClass={PROJECT_STATUS_COLORS[status as ProjectStatus]} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{project.description}</p>

            <div className="mt-6 grid gap-4 border-t border-cream-200 pt-5 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pe-status">Statut</Label>
                <select id="pe-status" value={status} onChange={(e) => {
                  const v = e.target.value;
                  setStatus(v);
                  if (v === "DELIVERED") setProgress(100);
                }} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pe-progress">Avancement : {progress} %</Label>
                <input
                  id="pe-progress"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="mt-3 w-full accent-terra-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pe-deadline">Échéance</Label>
                <Input id="pe-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11 bg-white" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-40 space-y-1.5">
                <Label htmlFor="pe-budget">Budget (FCFA)</Label>
                <Input id="pe-budget" type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} className="h-11 bg-white" />
              </div>
              <button onClick={save} disabled={saving} className="mt-auto inline-flex h-11 items-center gap-2 self-end rounded-xl bg-terra-600 px-6 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                Enregistrer
              </button>
            </div>
          </div>

          {/* Jalons */}
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-900">Jalons du projet</h2>
              <p className="text-xs text-ink-400">{doneCount}/{tasks.length} terminés</p>
            </div>
            <ul className="mt-4 space-y-2">
              {tasks.map((t, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-cream-200 px-4 py-3">
                  <button
                    onClick={() => setTasks((prev) => prev.map((task, j) => (j === i ? { ...task, done: !task.done } : task)))}
                    aria-label={t.done ? `Marquer « ${t.title} » à faire` : `Marquer « ${t.title} » terminé`}
                    className="shrink-0"
                  >
                    {t.done ? <CheckCircle2 className="h-5 w-5 text-forest-600" aria-hidden="true" /> : <Circle className="h-5 w-5 text-ink-300" aria-hidden="true" />}
                  </button>
                  <span className={cn("flex-1 text-sm", t.done ? "text-ink-400 line-through" : "text-ink-900")}>{t.title}</span>
                  <button onClick={() => setTasks((prev) => prev.filter((_, j) => j !== i))} aria-label={`Supprimer le jalon ${t.title}`} className="text-ink-300 transition hover:text-red-600">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
                placeholder="Ajouter un jalon (ex. Maquettes validées)"
                className="h-11 bg-white"
                aria-label="Nouveau jalon"
              />
              <button onClick={addTask} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-cream-50 transition hover:bg-forest-800" aria-label="Ajouter le jalon">
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ——— Colonne latérale ——— */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <UserRound className="h-5 w-5 text-terra-600" aria-hidden="true" /> Client
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={project.client.role === "ENTREPRISE" ? project.client.companyName || project.client.name : project.client.name} color={project.client.avatarColor} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {project.client.role === "ENTREPRISE" ? project.client.companyName || project.client.name : project.client.name}
                </p>
                <p className="truncate text-xs text-ink-500">{project.client.email}</p>
              </div>
            </div>
            <Link href={`/admin/clients`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terra-600 hover:text-terra-700">
              Voir le profil complet →
            </Link>
          </div>

          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <CalendarDays className="h-5 w-5 text-forest-600" aria-hidden="true" /> Échéance
            </h2>
            <p className="mt-2 text-sm text-ink-700">{deadline ? formatDate(deadline) : "Non définie"}</p>
            {project.deliveredAt && (
              <p className="mt-1 text-xs text-forest-600">Livré le {formatDate(project.deliveredAt)}</p>
            )}
          </div>

          <div className="rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink-900">Documents liés</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-2.5">
                <span className="flex items-center gap-2 text-ink-700"><FileText className="h-4 w-4 text-terra-600" aria-hidden="true" /> Devis</span>
                <span className="font-semibold text-ink-900">{project.quotes.length}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-2.5">
                <span className="flex items-center gap-2 text-ink-700"><Receipt className="h-4 w-4 text-forest-600" aria-hidden="true" /> Factures</span>
                <span className="font-semibold text-ink-900">{project.invoices.length}</span>
              </li>
            </ul>
          </div>

          <button onClick={removeProject} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer le projet
          </button>
        </div>
      </div>
    </>
  );
}
