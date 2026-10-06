"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox, Eye, Trash2, Search, ArrowRightLeft, Loader2, Building2, Mail, Phone,
  FileText, CheckCircle2, Archive,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, serviceTypeLabel, RequestStatus } from "@/lib/roles";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceType: string;
  budgetRange: string | null;
  message: string;
  status: string;
  notes: string | null;
  convertedProjectId: string | null;
  createdAt: string | Date;
};

const FILTERS: { value: "ALL" | RequestStatus; label: string }[] = [
  { value: "ALL", label: "Toutes" },
  { value: "NEW", label: "Nouvelles" },
  { value: "IN_REVIEW", label: "En étude" },
  { value: "CONVERTED", label: "Converties" },
  { value: "ARCHIVED", label: "Archivées" },
];

export function RequestBoard({ initialRequests }: { initialRequests: QuoteRequest[] }) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<"ALL" | RequestStatus>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [converting, setConverting] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // Formulaire de conversion
  const [convertForm, setConvertForm] = useState({
    createAccount: true,
    projectTitle: "",
    projectDescription: "",
    budget: "",
  });

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (filter !== "ALL" && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!`${r.name} ${r.email} ${r.company ?? ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [requests, filter, search]);

  async function updateStatus(id: string, status: RequestStatus) {
    const previous = requests;
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/quote-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setRequests(previous);
      toast.error("Impossible de mettre à jour la demande");
      return;
    }
    toast.success("Statut mis à jour");
    router.refresh();
  }

  async function removeRequest(id: string) {
    const previous = requests;
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setSelected(null);
    const res = await fetch(`/api/quote-requests/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setRequests(previous);
      toast.error("Impossible de supprimer la demande");
      return;
    }
    toast.success("Demande supprimée");
    router.refresh();
  }

  function openConvert(r: QuoteRequest) {
    setConvertForm({
      createAccount: true,
      projectTitle: r.serviceType === "formation" ? "Formation — " + r.name : "Projet " + serviceTypeLabel(r.serviceType) + " — " + (r.company || r.name),
      projectDescription: r.message,
      budget: "",
    });
    setConverting(r);
  }

  async function submitConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!converting) return;
    setLoading(true);
    const res = await fetch(`/api/quote-requests/${converting.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        convert: {
          createAccount: convertForm.createAccount,
          projectTitle: convertForm.projectTitle,
          projectDescription: convertForm.projectDescription,
          budget: convertForm.budget ? Number(convertForm.budget) : null,
        },
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error ?? "Conversion impossible");
      return;
    }
    toast.success("Demande convertie : client et projet créés");
    setRequests((prev) => prev.map((r) => (r.id === converting.id ? { ...r, status: "CONVERTED" } : r)));
    setConverting(null);
    setSelected(null);
    router.refresh();
  }

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f.value] = f.value === "ALL" ? requests.length : requests.filter((r) => r.status === f.value).length;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Demandes de devis"
        description="Les demandes envoyées via le formulaire du site public."
      />

      {/* Filtres + recherche */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par statut">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                filter === f.value
                  ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip"
                  : "border-cream-300 bg-card text-ink-500 hover:border-cream-400 hover:text-ink-900"
              )}
            >
              {f.label}
              <span className={cn("ml-1.5 rounded-full px-1.5 text-[11px] font-bold", filter === f.value ? "bg-cream-50/20" : "bg-cream-200 text-ink-500")}>
                {counts[f.value] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un nom, email…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Aucune demande" description="Les nouvelles demandes envoyées depuis le site apparaîtront ici." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5 font-medium">Demandeur</th>
                  <th className="px-5 py-3.5 font-medium">Service</th>
                  <th className="px-5 py-3.5 font-medium">Budget</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium">Reçue le</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition hover:bg-cream-50/60">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink-900">{r.name}</p>
                      <p className="text-xs text-ink-500">{r.company ?? r.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-700">{serviceTypeLabel(r.serviceType)}</td>
                    <td className="px-5 py-4 text-ink-700">{r.budgetRange ?? "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={REQUEST_STATUS_LABELS[r.status as RequestStatus]} colorClass={REQUEST_STATUS_COLORS[r.status as RequestStatus]} />
                    </td>
                    <td className="px-5 py-4 text-xs text-ink-500">{formatDateTime(r.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelected(r)} aria-label={`Voir la demande de ${r.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100 hover:text-ink-900">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {r.status !== "CONVERTED" && (
                          <button onClick={() => openConvert(r)} aria-label={`Convertir la demande de ${r.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-forest-200 bg-forest-50 text-forest-700 transition hover:bg-forest-100" title="Convertir en client + projet">
                            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                        {r.status !== "ARCHIVED" && r.status !== "CONVERTED" && (
                          <button onClick={() => updateStatus(r.id, "ARCHIVED")} aria-label={`Archiver la demande de ${r.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100" title="Archiver">
                            <Archive className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ——— Dialogue détail ——— */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-xl rounded-3xl bg-white sm:rounded-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Demande de {selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-ink-700"><Mail className="h-4 w-4 text-ink-400" aria-hidden="true" />{selected.email}</p>
                  <p className="flex items-center gap-2 text-ink-700"><Phone className="h-4 w-4 text-ink-400" aria-hidden="true" />{selected.phone ?? "—"}</p>
                  <p className="flex items-center gap-2 text-ink-700"><Building2 className="h-4 w-4 text-ink-400" aria-hidden="true" />{selected.company ?? "Particulier"}</p>
                  <p className="flex items-center gap-2 text-ink-700"><FileText className="h-4 w-4 text-ink-400" aria-hidden="true" />{serviceTypeLabel(selected.serviceType)}</p>
                </div>
                <div className="rounded-2xl bg-cream-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Message</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{selected.message}</p>
                </div>
                {selected.status === "CONVERTED" ? (
                  <p className="flex items-center gap-2 rounded-2xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Convertie en projet{selected.convertedProjectId ? "" : " (compte existant rattaché)"}
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 border-t border-cream-200 pt-4">
                    <button onClick={() => updateStatus(selected.id, "IN_REVIEW")} className="rounded-full border border-gold-200 bg-gold-100 px-4 py-2 text-xs font-semibold text-gold-600 transition hover:bg-gold-200">
                      Marquer en étude
                    </button>
                    <button onClick={() => openConvert(selected)} className="rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-forest-700">
                      Convertir en client + projet
                    </button>
                    <button onClick={() => updateStatus(selected.id, "ARCHIVED")} className="rounded-full border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-500 transition hover:bg-cream-100">
                      Archiver
                    </button>
                    <button onClick={() => removeRequest(selected.id)} className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ——— Dialogue conversion ——— */}
      <Dialog open={!!converting} onOpenChange={(v) => !v && setConverting(null)}>
        <DialogContent className="max-w-lg rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Convertir en projet</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitConvert} className="space-y-4">
            {converting && (
              <p className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
                {converting.name} — {converting.company ?? "Particulier"} · {converting.email}
              </p>
            )}
            <label className="flex items-center gap-2.5 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={convertForm.createAccount}
                onChange={(e) => setConvertForm((f) => ({ ...f, createAccount: e.target.checked }))}
                className="h-4 w-4 accent-terra-600"
              />
              Créer le compte client (mot de passe temporaire RodLab{new Date().getFullYear()}!)
            </label>
            <div className="space-y-1.5">
              <Label htmlFor="cv-title">Titre du projet *</Label>
              <Input id="cv-title" required value={convertForm.projectTitle} onChange={(e) => setConvertForm((f) => ({ ...f, projectTitle: e.target.value }))} className="h-11 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cv-desc">Description *</Label>
              <Textarea id="cv-desc" required rows={4} value={convertForm.projectDescription} onChange={(e) => setConvertForm((f) => ({ ...f, projectDescription: e.target.value }))} className="resize-none bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cv-budget">Budget (FCFA)</Label>
              <Input id="cv-budget" type="number" min={0} value={convertForm.budget} onChange={(e) => setConvertForm((f) => ({ ...f, budget: e.target.value }))} placeholder="Ex. 450000" className="h-11 bg-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setConverting(null)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />}
                Convertir
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
