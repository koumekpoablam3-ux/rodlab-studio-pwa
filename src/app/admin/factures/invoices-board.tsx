"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, Receipt, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, InvoiceStatus } from "@/lib/roles";
import { formatFCFA, formatFCFACompact, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type ClientLite = { id: string; name: string; companyName: string | null; role: string; email: string };
type Invoice = {
  id: string;
  number: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  method: string | null;
  notes: string | null;
  issueDate: string | Date;
  dueDate: string | Date | null;
  paidAt: string | Date | null;
  client: ClientLite;
};

const PAYMENT_METHODS = ["Mobile Money", "T-Money", "Flooz", "Virement bancaire", "Espèces", "Carte bancaire"];

export function InvoicesBoard({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filter, setFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [form, setForm] = useState({ clientId: "", amount: "", taxRate: "18", status: "SENT", method: "", notes: "", dueDate: "" });

  const displayName = (c: ClientLite) => (c.role === "ENTREPRISE" ? c.companyName || c.name : c.name);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filter !== "ALL" && inv.status !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!`${inv.number} ${inv.client.name} ${inv.client.companyName ?? ""}`.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [invoices, filter, search]);

  const revenuePaid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const revenuePending = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);

  async function openCreate() {
    setForm({ clientId: "", amount: "", taxRate: "18", status: "SENT", method: "", notes: "", dueDate: "" });
    setCreateOpen(true);
    if (clients.length === 0) {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setClients(data.users.filter((u: { role: string }) => u.role !== "ADMIN"));
      }
    }
  }

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: form.clientId,
        amount: Number(form.amount),
        taxRate: Number(form.taxRate),
        status: form.status,
        method: form.method || null,
        notes: form.notes || null,
        dueDate: form.dueDate || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Création impossible");
      return;
    }
    toast.success("Facture créée");
    setCreateOpen(false);
    router.refresh();
  }

  async function setStatus(id: string, status: InvoiceStatus, method?: string) {
    const previous = invoices;
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(method ? { method } : {}) }),
    });
    if (!res.ok) {
      setInvoices(previous);
      toast.error("Mise à jour impossible");
      return;
    }
    toast.success(status === "PAID" ? "Paiement enregistré — client notifié" : "Statut mis à jour");
    router.refresh();
  }

  async function removeInvoice(id: string) {
    if (!confirm("Supprimer cette facture ?")) return;
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Facture supprimée");
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Factures"
        description={`${formatFCFACompact(revenuePaid)} encaissés · ${formatFCFACompact(revenuePending)} en attente`}
        actions={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle facture
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par statut">
          <button role="tab" aria-selected={filter === "ALL"} onClick={() => setFilter("ALL")} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === "ALL" ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}>
            Toutes <span className="ml-1 text-[11px] opacity-70">{invoices.length}</span>
          </button>
          {(Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatus[]).map((s) => (
            <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === s ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}>
              {INVOICE_STATUS_LABELS[s]} <span className="ml-1 text-[11px] opacity-70">{invoices.filter((i) => i.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher (n°, client)…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche facture" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="Aucune facture" description="Créez une facture pour un client en un clic." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5 font-medium">Numéro</th>
                  <th className="px-5 py-3.5 font-medium">Client</th>
                  <th className="px-5 py-3.5 font-medium">Total TTC</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium">Émission</th>
                  <th className="px-5 py-3.5 font-medium">Échéance</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-cream-50/60">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-terra-700">{inv.number}</td>
                    <td className="px-5 py-4 text-ink-700">{displayName(inv.client)}</td>
                    <td className="px-5 py-4 font-semibold text-ink-900">{formatFCFA(inv.total)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={INVOICE_STATUS_LABELS[inv.status as InvoiceStatus]} colorClass={INVOICE_STATUS_COLORS[inv.status as InvoiceStatus]} />
                    </td>
                    <td className="px-5 py-4 text-xs text-ink-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-4 text-xs text-ink-500">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                          <select
                            value=""
                            onChange={(e) => { const v = e.target.value as InvoiceStatus; if (v) setStatus(inv.id, v); e.target.value = ""; }}
                            aria-label={`Changer le statut de ${inv.number}`}
                            className="h-9 rounded-xl border border-cream-300 bg-white px-2 text-xs font-medium text-ink-700"
                          >
                            <option value="">Statut…</option>
                            {(["SENT", "PAID", "OVERDUE", "CANCELLED"] as InvoiceStatus[]).map((s) => (
                              <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        )}
                        {inv.status === "SENT" && (
                          <button onClick={() => setStatus(inv.id, "PAID")} aria-label={`Marquer ${inv.number} payée`} className="flex h-9 items-center gap-1.5 rounded-xl bg-forest-600 px-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-700">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Payée
                          </button>
                        )}
                        <button onClick={() => removeInvoice(inv.id)} aria-label={`Supprimer ${inv.number}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ——— Création ——— */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouvelle facture</DialogTitle>
          </DialogHeader>
          <form onSubmit={createInvoice} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fa-client">Client *</Label>
              <select id="fa-client" required value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                <option value="">Sélectionner…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{displayName(c)} — {c.email}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fa-amount">Montant HT (FCFA) *</Label>
                <Input id="fa-amount" type="number" min={1} required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="Ex. 450000" className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-tax">TVA</Label>
                <select id="fa-tax" value={form.taxRate} onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  <option value="18">18 %</option>
                  <option value="0">0 % (exonéré)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-status">Statut</Label>
                <select id="fa-status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  <option value="SENT">Envoyée</option>
                  <option value="PAID">Payée</option>
                  <option value="DRAFT">Brouillon</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-due">Échéance</Label>
                <Input id="fa-due" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="h-11 bg-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fa-method">Moyen de paiement</Label>
              <select id="fa-method" value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                <option value="">À définir</option>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {form.amount && (
              <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                <div className="flex justify-between text-ink-500"><span>TVA ({form.taxRate} %)</span><span>{formatFCFA(Math.round(Number(form.amount) * (Number(form.taxRate) / 100)))}</span></div>
                <div className="mt-1 flex justify-between font-display text-base font-semibold text-ink-900">
                  <span>Total TTC</span>
                  <span>{formatFCFA(Number(form.amount) + Math.round(Number(form.amount) * (Number(form.taxRate) / 100)))}</span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Receipt className="h-4 w-4" aria-hidden="true" />}
                Créer la facture
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
