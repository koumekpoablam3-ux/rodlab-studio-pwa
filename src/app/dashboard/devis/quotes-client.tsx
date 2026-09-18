"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Eye, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge } from "@/components/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS, QuoteStatus } from "@/lib/roles";
import { formatFCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

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
  decidedAt: string | Date | null;
  createdAt: string | Date;
};

export function QuotesClient({ quotes: initial }: { quotes: Quote[] }) {
  const router = useRouter();
  const [quotes, setQuotes] = useState(initial);
  const [viewing, setViewing] = useState<Quote | null>(null);
  const [deciding, setDeciding] = useState<"ACCEPTED" | "REFUSED" | null>(null);

  async function decide(quote: Quote, decision: "ACCEPTED" | "REFUSED") {
    setDeciding(decision);
    const res = await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: decision }),
    });
    setDeciding(null);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Action impossible");
      return;
    }
    toast.success(decision === "ACCEPTED" ? "Devis accepté — l'équipe RodLab a été notifiée 🎉" : "Devis refusé — l'équipe a été notifiée");
    setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, status: decision, decidedAt: new Date().toISOString() } : q)));
    setViewing(null);
    router.refresh();
  }

  const pending = quotes.filter((q) => q.status === "SENT");

  return (
    <>
      <PageHeader
        title="Mes devis"
        description={pending.length > 0 ? `${pending.length} devis attend(ent) votre décision.` : "Aucune décision en attente."}
      />

      {quotes.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun devis" description="Les devis envoyés par RodLab Studio apparaîtront ici avec une notification." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <div key={q.id} className="flex flex-col rounded-3xl border border-cream-300 bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-terra-700">{q.number}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">{q.title}</h3>
                  <p className="mt-1 text-xs text-ink-400">Reçu le {formatDate(q.createdAt)}</p>
                </div>
                <StatusBadge label={QUOTE_STATUS_LABELS[q.status as QuoteStatus]} colorClass={QUOTE_STATUS_COLORS[q.status as QuoteStatus]} />
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-cream-200 pt-3">
                <p className="text-sm text-ink-500">Total TTC</p>
                <p className="font-display text-xl font-semibold text-ink-900">{formatFCFA(q.total)}</p>
              </div>
              {q.validUntil && q.status === "SENT" && (
                <p className="mt-1 text-xs text-gold-600">Valable jusqu&apos;au {formatDate(q.validUntil)}</p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setViewing(q)} className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:bg-cream-100">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Détails
                </button>
                {q.status === "SENT" && (
                  <>
                    <button onClick={() => decide(q, "ACCEPTED")} disabled={deciding !== null} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
                      {deciding === "ACCEPTED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      Accepter
                    </button>
                    <button onClick={() => decide(q, "REFUSED")} disabled={deciding !== null} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60">
                      <X className="h-3.5 w-3.5" aria-hidden="true" /> Refuser
                    </button>
                  </>
                )}
              </div>
              {q.decidedAt && (q.status === "ACCEPTED" || q.status === "REFUSED") && (
                <p className="mt-2 text-[11px] text-ink-400">Décision rendue le {formatDate(q.decidedAt)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ——— Détail ——— */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg rounded-3xl bg-white sm:rounded-3xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{viewing.number} — {viewing.title}</DialogTitle>
              </DialogHeader>
              <QuoteDetail quote={viewing} onDecide={decide} deciding={deciding} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuoteDetail({
  quote,
  onDecide,
  deciding,
}: {
  quote: Quote;
  onDecide: (q: Quote, d: "ACCEPTED" | "REFUSED") => Promise<void>;
  deciding: "ACCEPTED" | "REFUSED" | null;
}) {
  const items = (() => {
    try {
      return JSON.parse(quote.items) as { label: string; qty: number; unitPrice: number }[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-2xl border border-cream-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase text-ink-400">
              <th className="px-4 py-2.5 font-medium">Prestation</th>
              <th className="px-4 py-2.5 font-medium">Qté</th>
              <th className="px-4 py-2.5 text-right font-medium">Prix U.</th>
              <th className="px-4 py-2.5 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {items.map((it, i) => (
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
        <div className="flex justify-between text-ink-500"><span>Sous-total</span><span>{formatFCFA(quote.subtotal)}</span></div>
        <div className="flex justify-between text-ink-500"><span>TVA ({quote.taxRate} %)</span><span>{formatFCFA(quote.taxAmount)}</span></div>
        <div className="flex justify-between font-display text-lg font-semibold text-ink-900"><span>Total TTC</span><span>{formatFCFA(quote.total)}</span></div>
      </div>
      {quote.notes && <p className="rounded-2xl bg-cream-100 p-3.5 text-xs leading-relaxed text-ink-700">{quote.notes}</p>}

      {quote.status === "SENT" ? (
        <div className={cn("flex items-center gap-2 border-t border-cream-200 pt-4")}>
          <button onClick={() => onDecide(quote, "ACCEPTED")} disabled={deciding !== null} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest-600 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
            {deciding === "ACCEPTED" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            Accepter le devis
          </button>
          <button onClick={() => onDecide(quote, "REFUSED")} disabled={deciding !== null} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60">
            <X className="h-4 w-4" aria-hidden="true" /> Refuser
          </button>
        </div>
      ) : (
        <div className="border-t border-cream-200 pt-4">
          <StatusBadge label={QUOTE_STATUS_LABELS[quote.status as QuoteStatus]} colorClass={QUOTE_STATUS_COLORS[quote.status as QuoteStatus]} />
        </div>
      )}
    </div>
  );
}
