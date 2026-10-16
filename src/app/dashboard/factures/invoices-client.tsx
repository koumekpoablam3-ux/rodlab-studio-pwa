"use client";

import { useState } from "react";
import { Receipt, Eye, Printer, Download } from "lucide-react";
import { PageHeader, EmptyState, StatusBadge } from "@/components/shared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, InvoiceStatus } from "@/lib/roles";
import { formatFCFA, formatDate } from "@/lib/format";
import { LogoMark } from "@/components/brand";

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
};

export function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
  const [viewing, setViewing] = useState<Invoice | null>(null);

  const totalDue = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);

  return (
    <>
      <PageHeader
        title="Mes factures"
        description={`${formatFCFA(totalPaid)} réglés · ${formatFCFA(totalDue)} en attente de paiement`}
      />

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="Aucune facture" description="Vos factures RodLab Studio seront disponibles ici." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5 font-medium">Numéro</th>
                  <th className="px-5 py-3.5 font-medium">Émission</th>
                  <th className="px-5 py-3.5 font-medium">Échéance</th>
                  <th className="px-5 py-3.5 font-medium">Total TTC</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-cream-50/60">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-terra-700">{inv.number}</td>
                    <td className="px-5 py-4 text-ink-700">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-4 text-ink-700">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                    <td className="px-5 py-4 font-semibold text-ink-900">{formatFCFA(inv.total)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge label={INVOICE_STATUS_LABELS[inv.status as InvoiceStatus]} colorClass={INVOICE_STATUS_COLORS[inv.status as InvoiceStatus]} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:bg-cream-100"
                          aria-label={`Télécharger la facture ${inv.number} en PDF`}
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
                        </a>
                        <button onClick={() => setViewing(inv)} className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:bg-cream-100" aria-label={`Voir la facture ${inv.number}`}>
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Voir
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

      {/* ——— Facture imprimable ——— */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-2xl rounded-3xl bg-white sm:rounded-3xl">
          {viewing && (
            <>
              <div className="print-area rounded-2xl bg-white p-2 text-sm">
                {/* En-tête facture */}
                <div className="flex items-start justify-between gap-6 border-b-2 border-forest-700 pb-5">
                  <div className="flex items-center gap-3">
                    <LogoMark className="h-12 w-12" />
                    <div>
                      <p className="font-display text-lg font-semibold text-ink-900">RodLab Studio</p>
                      <p className="text-xs text-ink-500">Design · Développement · Formation</p>
                      <p className="mt-1 text-xs text-ink-500">Lomé, Togo · contact@rodlabstudio.tg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-terra-700">FACTURE</p>
                    <p className="font-mono text-sm font-semibold text-ink-900">{viewing.number}</p>
                    <p className="text-xs text-ink-500">Émise le {formatDate(viewing.issueDate)}</p>
                  </div>
                </div>

                {/* Corps */}
                <div className="py-5">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-300 text-left text-xs uppercase text-ink-400">
                        <th className="py-2.5 font-medium">Prestation</th>
                        <th className="py-2.5 text-right font-medium">Montant HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-cream-100">
                        <td className="py-3 text-ink-700">Prestations RodLab Studio — voir devis associé</td>
                        <td className="py-3 text-right font-medium text-ink-900">{formatFCFA(viewing.amount)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 ml-auto max-w-xs space-y-1.5">
                    <div className="flex justify-between text-ink-500"><span>Sous-total HT</span><span>{formatFCFA(viewing.amount)}</span></div>
                    <div className="flex justify-between text-ink-500"><span>TVA ({viewing.taxRate} %)</span><span>{formatFCFA(viewing.taxAmount)}</span></div>
                    <div className="flex justify-between border-t-2 border-forest-700 pt-2 font-display text-lg font-semibold text-ink-900">
                      <span>Total TTC</span><span>{formatFCFA(viewing.total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <StatusBadge label={INVOICE_STATUS_LABELS[viewing.status as InvoiceStatus]} colorClass={INVOICE_STATUS_COLORS[viewing.status as InvoiceStatus]} />
                    {viewing.method && <span className="text-xs text-ink-500">Règlement : {viewing.method}</span>}
                    {viewing.paidAt && <span className="text-xs font-medium text-forest-600">Payée le {formatDate(viewing.paidAt)}</span>}
                    {viewing.dueDate && viewing.status !== "PAID" && (
                      <span className="text-xs text-ink-500">À régler avant le {formatDate(viewing.dueDate)}</span>
                    )}
                  </div>

                  <p className="mt-6 border-t border-cream-200 pt-4 text-[11px] leading-relaxed text-ink-400">
                    RodLab Studio — Lomé, Togo · NIF en cours · Paiement par Mobile Money (+228 70 08 86 68), virement bancaire ou espèces.
                    Merci pour votre confiance !
                  </p>
                </div>
              </div>

              <div className="no-print flex justify-end gap-2 border-t border-cream-200 pt-4">
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-cream-100">
                  <Printer className="h-4 w-4" aria-hidden="true" /> Imprimer
                </button>
                <a
                  href={`/api/invoices/${viewing.id}/pdf`}
                  className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-800"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> Télécharger le PDF
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
