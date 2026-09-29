"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_TYPES, BUDGET_RANGES } from "@/lib/roles";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    serviceType: defaultService ?? "design-graphique", budgetRange: "", message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setError("Impossible d'envoyer votre demande pour le moment");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-forest-200 bg-forest-50 px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
          <CheckCircle2 className="h-8 w-8 text-forest-600" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink-900">Message bien reçu !</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          Merci pour votre confiance. Notre équipe étudie votre demande et revient vers vous
          sous 24 h ouvrées avec une première proposition.
        </p>
        <button
          onClick={() => {
            setState("idle");
            setForm({ name: "", email: "", phone: "", company: "", serviceType: "design-graphique", budgetRange: "", message: "" });
          }}
          className="mt-6 rounded-full border border-forest-300 px-5 py-2.5 text-sm font-medium text-forest-700 transition hover:bg-forest-100"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-cream-300 bg-card p-6 shadow-card sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="c-name">Nom complet *</Label>
          <Input id="c-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Votre nom" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-email">Email *</Label>
          <Input id="c-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="vous@exemple.tg" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-phone">Téléphone</Label>
          <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+228 90 00 00 00" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-company">Entreprise</Label>
          <Input id="c-company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Optionnel" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-service">Service souhaité *</Label>
          <select
            id="c-service"
            required
            value={form.serviceType}
            onChange={(e) => update("serviceType", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20"
          >
            {SERVICE_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-budget">Budget estimé</Label>
          <select
            id="c-budget"
            value={form.budgetRange}
            onChange={(e) => update("budgetRange", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20"
          >
            <option value="">Sélectionner…</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-message">Votre projet *</Label>
        <Textarea
          id="c-message"
          required
          minLength={10}
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Décrivez votre besoin : objectifs, délais souhaités, exemples qui vous plaisent…"
          className="resize-none bg-white"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-terra-600 px-6 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60 sm:w-auto"
      >
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        Envoyer ma demande
      </button>
      <p className="text-xs text-ink-400">
        Réponse sous 24 h ouvrées · Sans engagement · Devis gratuit
      </p>
    </form>
  );
}
