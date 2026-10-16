"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, MailCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Check = { id: string; label: string; status: "ok" | "warn" | "error" | "info"; detail: string };

const ICONS = {
  ok: <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-700" aria-label="Correct" />,
  warn: <AlertTriangle className="h-5 w-5 shrink-0 text-gold-600" aria-label="À améliorer" />,
  error: <XCircle className="h-5 w-5 shrink-0 text-red-600" aria-label="Problème" />,
  info: <Info className="h-5 w-5 shrink-0 text-ink-400" aria-label="Information" />,
};

/** Diagnostic de délivrabilité : les emails arrivent-ils en boîte de réception plutôt qu'en spam ? */
export function EmailCheck({ defaultEmail }: { defaultEmail: string }) {
  const [to, setTo] = useState(defaultEmail);
  const [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState<Check[] | null>(null);

  async function run(sendTest: boolean) {
    setBusy(true);
    const res = await fetch("/api/admin/email-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendTest && to ? { to } : {}),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { toast.error(data.error ?? "Vérification impossible"); return; }
    setChecks(data.checks);
  }

  return (
    <section className="mt-8 rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
        <MailCheck className="h-5 w-5 text-terra-600" aria-hidden="true" /> Délivrabilité des emails
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Vérifie que vos emails (invitations, devis, factures…) sont bien configurés pour arriver en boîte de réception et non dans les spams, puis envoie un email de test.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor="email-test">Envoyer un email de test à</Label>
          <Input id="email-test" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="votre@adresse.com" className="h-11 bg-white" />
        </div>
        <button onClick={() => run(true)} disabled={busy || !to} className="inline-flex h-11 items-center gap-2 rounded-full bg-forest-900 px-5 text-sm font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MailCheck className="h-4 w-4" aria-hidden="true" />}
          Vérifier et envoyer un test
        </button>
        <button onClick={() => run(false)} disabled={busy} className="inline-flex h-11 items-center rounded-full border border-cream-300 px-5 text-sm font-medium text-ink-600 hover:bg-cream-100 disabled:opacity-60">
          Vérifier seulement
        </button>
      </div>

      {checks && (
        <ul className="mt-5 space-y-3" aria-live="polite">
          {checks.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-2xl border border-cream-200 bg-white p-3">
              {ICONS[c.status]}
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink-900">{c.label}</span>
                <span className="block break-words text-sm text-ink-600">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
