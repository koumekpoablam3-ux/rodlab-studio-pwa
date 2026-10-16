"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Mot de passe oublié — 2e étape : définition du nouveau mot de passe.
 * Le jeton arrive en paramètre d'URL (?token=…), depuis l'email reçu.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invalidToken = !token;
  const isInvitation = searchParams.get("invitation") === "1";
  const mismatch = confirm.length > 0 && password !== confirm;
  const tooShort = password.length > 0 && password.length < 8;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (tooShort) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas. Vérifiez la saisie.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Une erreur est survenue. Réessayez dans un instant.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Petite pause pour laisser lire le message de succès, puis connexion.
      setTimeout(() => router.push("/connexion"), 2500);
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez votre connexion internet, puis réessayez dans un instant.");
      setLoading(false);
    }
  }

  if (invalidToken && !success) {
    return (
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex">
            <Logo size="md" />
          </Link>
        </div>
        <div className="rounded-2xl border border-red-200 bg-white p-7 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-lg font-semibold text-ink-900">Lien incomplet</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Ce lien de réinitialisation est incomplet. Ouvrez le lien complet reçu par email, ou
            faites une nouvelle demande.
          </p>
          <Button
            asChild
            className="mt-5 h-11 w-full rounded-xl bg-terra-600 text-sm font-semibold text-white transition hover:bg-terra-700"
          >
            <Link href="/mot-de-passe-oublie">Refaire une demande</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex">
          <Logo size="md" />
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">{isInvitation ? "Bienvenue ! Créez votre mot de passe" : "Nouveau mot de passe"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {isInvitation ? "Votre compte administrateur est prêt. Ce mot de passe n'appartient qu'à vous : personne d'autre ne le connaîtra, et vous pourrez le changer à tout moment. " : ""}Choisissez un mot de passe solide : au moins 8 caractères, avec majuscules, chiffres
          ou symboles.
        </p>
      </div>

      {success ? (
        <div className="rounded-2xl border border-forest-200 bg-white p-7 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <CheckCircle2 className="h-6 w-6 text-forest-700" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">Mot de passe modifié !</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Votre nouveau mot de passe est actif. Un email de confirmation vous a été envoyé.
            Redirection vers la page de connexion…
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 h-11 w-full rounded-xl border-cream-300 bg-white text-sm font-semibold text-ink-700 hover:bg-cream-100"
          >
            <Link href="/connexion">Se connecter maintenant</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-cream-300 bg-white p-7 shadow-card">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-cream-50 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {tooShort && <p className="text-xs text-red-600">Au moins 8 caractères requis.</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="h-11 bg-cream-50"
              />
              {mismatch && <p className="text-xs text-red-600">Les deux mots de passe ne correspondent pas.</p>}
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
              Enregistrer le nouveau mot de passe
            </Button>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link href="/connexion" className="inline-flex items-center gap-1.5 font-semibold text-terra-600 hover:text-terra-700">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
