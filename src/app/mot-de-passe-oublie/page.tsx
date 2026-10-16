"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Mot de passe oublié — demande du lien de réinitialisation.
 * La réponse du serveur est volontairement générique (on ne révèle jamais
 * si une adresse possède un compte) : le message affiché est le même dans
 * tous les cas, comme le veut l'usage de sécurité.
 */
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Cas principal : SMTP non configuré (503) — message explicite du serveur.
        setError(data?.error ?? "Une erreur est survenue. Réessayez dans un instant.");
      } else {
        setServerMessage(data?.message ?? null);
        setSent(true);
      }
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez votre connexion internet, puis réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 bg-hero-glow px-5 py-10 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex">
            <Logo size="md" />
          </Link>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">Mot de passe oublié ?</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Indiquez l&apos;adresse email de votre compte : nous vous enverrons un lien sécurisé
            pour définir un nouveau mot de passe.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-forest-200 bg-white p-7 text-center shadow-card">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
              <CheckCircle2 className="h-6 w-6 text-forest-700" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">Vérifiez votre boîte mail</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{serverMessage}</p>
            <Button
              asChild
              variant="outline"
              className="mt-5 h-11 w-full rounded-xl border-cream-300 bg-white text-sm font-semibold text-ink-700 hover:bg-cream-100"
            >
              <Link href="/connexion">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour à la connexion
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-300 bg-white p-7 shadow-card">
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.tg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-cream-50"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-terra-600 text-sm font-semibold text-white transition hover:bg-terra-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Recevoir le lien de réinitialisation
              </Button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Le lien est valable une heure et ne peut être utilisé qu&apos;une seule fois.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/connexion" className="inline-flex items-center gap-1.5 font-semibold text-terra-600 hover:text-terra-700">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
