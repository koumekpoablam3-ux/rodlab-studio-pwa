"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, FolderKanban, Loader2, CalendarDays, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge, ProgressRing } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, SERVICE_TYPES, serviceTypeLabel, ProjectStatus } from "@/lib/roles";
import { formatFCFA, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type ClientLite = { id: string; name: string; email: string; companyName: string | null; role: string };
type Project = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  status: string;
  progress: number;
  budget: number | null;
  deadline: string | Date | null;
  createdAt: string | Date;
  client: ClientLite;
};

export function ProjectsBoard({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<"ALL" | ProjectStatus>("ALL");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", serviceType: "design-graphique",
    clientId: "", status: "PENDING", budget: "", deadline: "",
  });

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter !== "ALL" && p.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!`${p.title} ${p.client.name} ${p.client.companyName ?? ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [projects, filter, search]);

  async function openCreate() {
    setForm({ title: "", description: "", serviceType: "design-graphique", clientId: "", status: "PENDING", budget: "", deadline: "" });
    setCreateOpen(true);
    if (clients.length === 0) {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setClients(data.users.filter((u: { role: string }) => u.role !== "ADMIN"));
      }
    }
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        serviceType: form.serviceType,
        clientId: form.clientId,
        status: form.status,
        budget: form.budget ? Number(form.budget) : null,
        deadline: form.deadline || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Création impossible");
      return;
    }
    toast.success("Projet créé — le client a été notifié");
    setCreateOpen(false);
    router.refresh();
    router.push(`/admin/projets/${data.project.id}`);
  }

  const displayName = (c: ClientLite) => (c.role === "ENTREPRISE" ? c.companyName || c.name : c.name);

  return (
    <>
      <PageHeader
        title="Projets"
        description="Créez, suivez et livrez les projets de vos clients."
        actions={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau projet
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par statut">
          <button
            role="tab"
            aria-selected={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === "ALL" ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}
          >
            Tous <span className="ml-1 text-[11px] opacity-70">{projects.length}</span>
          </button>
          {PROJECT_STATUSES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === s ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}
            >
              {PROJECT_STATUS_LABELS[s]} <span className="ml-1 text-[11px] opacity-70">{projects.filter((p) => p.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un projet…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche projet" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Aucun projet" description="Créez votre premier projet pour commencer le suivi client." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projets/${p.id}`}
              className="group flex flex-col rounded-3xl border border-cream-300 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <StatusBadge label={PROJECT_STATUS_LABELS[p.status as ProjectStatus]} colorClass={PROJECT_STATUS_COLORS[p.status as ProjectStatus]} />
                <ProgressRing value={p.progress} size={48} />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-900 leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-500">
                {displayName(p.client)} · {serviceTypeLabel(p.serviceType)}
              </p>
              <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{p.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-3 text-xs text-ink-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {p.deadline ? `Échéance ${formatShortDate(p.deadline)}` : "Sans échéance"}
                </span>
                <span className="font-semibold text-ink-700">{p.budget ? formatFCFA(p.budget) : "—"} </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ——— Création ——— */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouveau projet</DialogTitle>
          </DialogHeader>
          <form onSubmit={createProject} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pj-title">Titre *</Label>
              <Input id="pj-title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex. Refonte du site vitrine" className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pj-client">Client *</Label>
              <select
                id="pj-client"
                required
                value={form.clientId}
                onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none transition focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20"
              >
                <option value="">Sélectionner un client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{displayName(c)} — {c.email}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pj-service">Service</Label>
                <select
                  id="pj-service"
                  value={form.serviceType}
                  onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none"
                >
                  {SERVICE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pj-status">Statut</Label>
                <select
                  id="pj-status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none"
                >
                  {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pj-budget">Budget (FCFA)</Label>
                <Input id="pj-budget" type="number" min={0} value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} placeholder="Ex. 450000" className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pj-deadline">Échéance</Label>
                <Input id="pj-deadline" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="h-11 bg-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pj-desc">Description *</Label>
              <Textarea id="pj-desc" required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Objectifs, périmètre, livrables attendus…" className="resize-none bg-white" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Créer le projet
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
