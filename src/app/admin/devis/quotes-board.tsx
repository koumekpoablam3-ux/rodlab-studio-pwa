"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Send, Trash2, FileText, Eye, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS, QuoteStatus } from "@/lib/roles";
import { formatFCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type ClientLite = { id: string; name: string; companyName: string | null; role: string; email: string };
type Quote = {
  id: string;
  number: string;
  title: string;
  items: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  notes: string | null;
  validUntil: string | Date | null;
  createdAt: string | Date;
  client: ClientLite;
};

type LineItem = { label: string; qty: string; unitPrice: string };

export function QuotesBoard({ initialQuotes }: { initialQuotes: Quote[] }) {
  const router = useRouter();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [filter, setFilter] = useState<"ALL" | QuoteStatus>("ALL");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [viewing, setViewing] = useState<Quote | null>(null);

  const [form, setForm] = useState({
    title: "", clientId: "", taxRate: "18", notes: "", validUntil: "", sendNow: true,
    items: [{ label: "", qty: "1", unitPrice: "" }] as LineItem[],
  });

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (filter !== "ALL" && q.status !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!`${q.number} ${q.title} ${q.client.name} ${q.client.companyName ?? ""}`.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [quotes, filter, search]);

  const displayName = (c: ClientLite) => (c.role === "ENTREPRISE" ? c.companyName || c.name : c.name);

  async function openCreate() {
    setForm({ title: "", clientId: "", taxRate: "18", notes: "", validUntil: "", sendNow: true, items: [{ label: "", qty: "1", unitPrice: "" }] });
    setCreateOpen(true);
    if (clients.length === 0) {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setClients(data.users.filter((u: { role: string }) => u.role !== "ADMIN"));
      }
    }
  }

  const subtotal = form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  const taxAmount = Math.round(subtotal * ((Number(form.taxRate) || 0) / 100));
  const total = subtotal + taxAmount;

  async function createQuote(e: React.FormEvent) {
    e.preventDefault();
    const items = form.items
      .filter((it) => it.label.trim() && Number(it.unitPrice) >= 0)
      .map((it) => ({ label: it.label.trim(), qty: Number(it.qty) || 1, unitPrice: Number(it.unitPrice) || 0 }));
    if (items.length === 0) {
      toast.error("Ajoutez au moins une ligne avec un libellé");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title, clientId: form.clientId, items,
        taxRate: Number(form.taxRate) || 18, notes: form.notes || null,
        validUntil: form.validUntil || null, sendNow: form.sendNow,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Création impossible");
      return;
    }
    toast.success(form.sendNow ? "Devis créé et envoyé au client" : "Devis enregistré en brouillon");
    setCreateOpen(false);
    router.refresh();
  }

  async function sendQuote(id: string) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SENT" }),
    });
    if (!res.ok) {
      toast.error("Envoi impossible");
      return;
    }
    toast.success("Devis envoyé — le client est notifié");
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "SENT" } : q)));
    router.refresh();
  }

  async function removeQuote(id: string) {
    if (!confirm("Supprimer ce devis ?")) return;
    const res = await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Devis supprimé");
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setViewing(null);
    router.refresh();
  }

  function parseItems(quote: Quote) {
    try {
      return JSON.parse(quote.items) as { label: string; qty: number; unitPrice: number }[];
    } catch {
      return [];
    }
  }

  return (
    <>
      <PageHeader
        title="Devis"
        description="Créez, envoyez et suivez vos devis. Les clients les acceptent ou les refusent depuis leur espace."
        actions={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau devis
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par statut">
          <button role="tab" aria-selected={filter === "ALL"} onClick={() => setFilter("ALL")} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === "ALL" ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}>
            Tous <span className="ml-1 text-[11px] opacity-70">{quotes.length}</span>
          </button>
          {(Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[]).map((s) => (
            <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", filter === s ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900")}>
              {QUOTE_STATUS_LABELS[s]} <span className="ml-1 text-[11px] opacity-70">{quotes.filter((q) => q.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher (n°, titre, client)…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche devis" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun devis" description="Créez un devis pour l'envoyer à votre client depuis son espace." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5 font-medium">Numéro</th>
                  <th className="px-5 py-3.5 font-medium">Intitulé</th>
                  <th className="px-5 py-3.5 font-medium">Client</th>
                  <th className="px-5 py-3.5 font-medium">Montant TTC</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium">Validité</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="transition hover:bg-cream-50/60">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-terra-700">{q.number}</td>
                    <td className="max-w-56 px-5 py-4">
                      <p className="truncate font-medium text-ink-900">{q.title}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-700">{displayName(q.client)}</td>
                    <td className="px-5 py-4 font-semibold text-ink-900">{formatFCFA(q.total)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={QUOTE_STATUS_LABELS[q.status as QuoteStatus]} colorClass={QUOTE_STATUS_COLORS[q.status as QuoteStatus]} />
                    </td>
                    <td className="px-5 py-4 text-xs text-ink-500">{q.validUntil ? formatDate(q.validUntil) : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewing(q)} aria-label={`Voir le devis ${q.number}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100 hover:text-ink-900">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {q.status === "DRAFT" && (
                          <button onClick={() => sendQuote(q.id)} aria-label={`Envoyer le devis ${q.number}`} className="flex h-9 items-center gap-1.5 rounded-xl bg-forest-600 px-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-700">
                            <Send className="h-3.5 w-3.5" aria-hidden="true" /> Envoyer
                          </button>
                        )}
                        <a
                          href={`/api/quotes/${q.id}/pdf`}
                          aria-label={`Télécharger le devis ${q.number} en PDF`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <button onClick={() => removeQuote(q.id)} aria-label={`Supprimer le devis ${q.number}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50">
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
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouveau devis</DialogTitle>
          </DialogHeader>
          <form onSubmit={createQuote} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qt-title">Intitulé *</Label>
                <Input id="qt-title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex. Site vitrine + charte graphique" className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qt-client">Client *</Label>
                <select id="qt-client" required value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  <option value="">Sélectionner…</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{displayName(c)} — {c.email}</option>)}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">Lignes du devis</p>
                <button type="button" onClick={() => setForm((f) => ({ ...f, items: [...f.items, { label: "", qty: "1", unitPrice: "" }] }))} className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-cream-300">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Ligne
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {form.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_64px_110px_36px] items-center gap-2">
                    <Input value={item.label} onChange={(e) => setForm((f) => ({ ...f, items: f.items.map((it, j) => (j === i ? { ...it, label: e.target.value } : it)) }))} placeholder="Prestation (ex. Design UI)" className="h-10 bg-white" aria-label={`Libellé ligne ${i + 1}`} />
                    <Input type="number" min={1} value={item.qty} onChange={(e) => setForm((f) => ({ ...f, items: f.items.map((it, j) => (j === i ? { ...it, qty: e.target.value } : it)) }))} placeholder="Qté" className="h-10 bg-white" aria-label={`Quantité ligne ${i + 1}`} />
                    <Input type="number" min={0} value={item.unitPrice} onChange={(e) => setForm((f) => ({ ...f, items: f.items.map((it, j) => (j === i ? { ...it, unitPrice: e.target.value } : it)) }))} placeholder="Prix unit." className="h-10 bg-white" aria-label={`Prix unitaire ligne ${i + 1}`} />
                    <button type="button" onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} disabled={form.items.length <= 1} aria-label={`Supprimer la ligne ${i + 1}`} className="flex h-10 w-9 items-center justify-center rounded-lg text-ink-300 transition hover:text-red-600 disabled:opacity-30">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1 border-t border-cream-200 pt-3 text-sm">
                <div className="flex justify-between text-ink-500"><span>Sous-total</span><span>{formatFCFA(subtotal)}</span></div>
                <div className="flex justify-between text-ink-500">
                  <span>TVA
                    <select value={form.taxRate} onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))} className="ml-2 rounded-md border border-input bg-white px-1.5 py-0.5 text-xs" aria-label="Taux de TVA">
                      <option value="18">18 %</option>
                      <option value="0">0 % (exonéré)</option>
                    </select>
                  </span>
                  <span>{formatFCFA(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-display text-base font-semibold text-ink-900"><span>Total TTC</span><span>{formatFCFA(total)}</span></div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qt-valid">Valable jusqu&apos;au</Label>
                <Input id="qt-valid" type="date" value={form.validUntil} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qt-notes">Notes</Label>
                <Input id="qt-notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Conditions, modalités de paiement…" className="h-11 bg-white" />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-ink-700">
              <input type="checkbox" checked={form.sendNow} onChange={(e) => setForm((f) => ({ ...f, sendNow: e.target.checked }))} className="h-4 w-4 accent-terra-600" />
              Envoyer immédiatement au client (notification push)
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
                Créer le devis
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ——— Aperçu ——— */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg rounded-3xl bg-white sm:rounded-3xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{viewing.number} — {viewing.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p className="text-ink-500">Client : <span className="font-semibold text-ink-900">{displayName(viewing.client)}</span></p>
                <div className="rounded-2xl border border-cream-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase text-ink-400">
                        <th className="px-4 py-2.5 font-medium">Prestation</th>
                        <th className="px-4 py-2.5 font-medium">Qté</th>
                        <th className="px-4 py-2.5 text-right font-medium">Prix U.</th>
                        <th className="px-4 py-2.5 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {parseItems(viewing).map((it, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5 text-ink-700">{it.label}</td>
                          <td className="px-4 py-2.5 text-ink-700">{it.qty}</td>
                          <td className="px-4 py-2.5 text-right text-ink-700">{formatFCFA(it.unitPrice)}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-ink-900">{formatFCFA(it.qty * it.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-ink-500"><span>Sous-total</span><span>{formatFCFA(viewing.subtotal)}</span></div>
                  <div className="flex justify-between text-ink-500"><span>TVA ({viewing.taxRate} %)</span><span>{formatFCFA(viewing.taxAmount)}</span></div>
                  <div className="flex justify-between font-display text-lg font-semibold text-ink-900"><span>Total TTC</span><span>{formatFCFA(viewing.total)}</span></div>
                </div>
                {viewing.notes && <p className="rounded-2xl bg-cream-100 p-3.5 text-xs leading-relaxed text-ink-700">{viewing.notes}</p>}
                <div className="flex items-center justify-between border-t border-cream-200 pt-3">
                  <StatusBadge label={QUOTE_STATUS_LABELS[viewing.status as QuoteStatus]} colorClass={QUOTE_STATUS_COLORS[viewing.status as QuoteStatus]} />
                  {viewing.status === "DRAFT" && (
                    <button onClick={() => { sendQuote(viewing.id); setViewing(null); }} className="inline-flex items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-forest-700">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" /> Envoyer au client
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
