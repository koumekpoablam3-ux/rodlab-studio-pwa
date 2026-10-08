"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShieldCheck, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESETS, type Permission } from "@/lib/permissions";
import { timeAgo } from "@/lib/format";
import { PermissionPicker } from "./admins-board";

type U = {
  id: string; name: string; email: string; role: string; companyName: string | null;
  avatarColor: string | null; avatarUrl: string | null; active: boolean; lastSeenAt: string | null;
};

const displayName = (u: U) => (u.role === "ENTREPRISE" ? u.companyName || u.name : u.name);

/** Tous les utilisateurs (clients, entreprises) : le directeur change leur rôle ou les nomme administrateurs. */
export function UsersBoard({ users }: { users: U[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<U | null>(null);
  const [preset, setPreset] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [perms, setPerms] = useState<Permission[]>([]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter((u) => !s || displayName(u).toLowerCase().includes(s) || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }, [users, q]);

  function openPromote(u: U) {
    setPromoting(u); setPreset(""); setJobTitle(""); setPerms([]);
  }
  function applyPreset(id: string) {
    setPreset(id);
    const p = PRESETS.find((x) => x.id === id);
    if (p) { setPerms(p.permissions); setJobTitle(p.jobTitle); }
  }

  async function changeRole(u: U, role: string) {
    if (role === u.role) return;
    if (role === "ADMIN") { openPromote(u); return; }
    setBusy(u.id);
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) { toast.error(data.error ?? "Changement impossible"); return; }
    toast.success(`${displayName(u)} est maintenant ${role === "ENTREPRISE" ? "une entreprise" : "un(e) client(e)"}`);
    router.refresh();
  }

  async function promote() {
    if (!promoting) return;
    setBusy("promote");
    const res = await fetch("/api/admin/admins/promote", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: promoting.id, jobTitle: jobTitle || null, permissions: perms }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) { toast.error(data.error ?? "Nomination impossible", { duration: 8000 }); return; }
    toast.success(
      data.emailSent
        ? `${promoting.name} est maintenant administrateur — un email vient de lui être envoyé`
        : `${promoting.name} est maintenant administrateur, mais l'email n'a pas pu partir${data.emailError ? ` : ${data.emailError}` : ""}. Prévenez-la directement.`,
      { duration: 9000 }
    );
    setPromoting(null);
    router.refresh();
  }

  return (
    <section className="mt-8 rounded-3xl border border-cream-300 bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
        <Users className="h-5 w-5 text-terra-600" aria-hidden="true" /> Tous les utilisateurs ({users.length})
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Changez le rôle d&apos;un compte, ou nommez-le administrateur : la personne garde son email et son mot de passe, et reçoit un email pour l&apos;en informer.
      </p>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un nom ou un email…" aria-label="Rechercher un utilisateur"
          className="h-11 w-full rounded-full border border-cream-300 bg-cream-50 pl-9 pr-3 text-sm outline-none focus:border-terra-600" />
      </div>

      {list.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-500">Aucun utilisateur trouvé.</p>
      ) : (
        <ul className="mt-4 divide-y divide-cream-200">
          {list.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar name={displayName(u)} color={u.avatarColor} src={u.avatarUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {displayName(u)} {!u.active && <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">Suspendu</span>}
                </p>
                <p className="truncate text-xs text-ink-500">{u.email} · {u.lastSeenAt ? `actif ${timeAgo(u.lastSeenAt)}` : "jamais connecté"}</p>
              </div>
              <div className="flex items-center gap-2">
                {busy === u.id && <Loader2 className="h-4 w-4 animate-spin text-ink-400" aria-hidden="true" />}
                <select
                  aria-label={`Rôle de ${displayName(u)}`}
                  value={u.role}
                  disabled={busy === u.id}
                  onChange={(e) => changeRole(u, e.target.value)}
                  className="h-10 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:border-terra-600"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ENTREPRISE">Entreprise</option>
                  <option value="ADMIN">Administrateur…</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      {promoting && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={() => setPromoting(null)}>
          <div role="dialog" aria-label="Nommer administrateur" onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900"><ShieldCheck className="h-5 w-5 text-terra-600" aria-hidden="true" /> Nommer administrateur</h3>
                <p className="mt-1 text-sm text-ink-500"><strong>{displayName(promoting)}</strong> ({promoting.email}) recevra un email de nomination.</p>
              </div>
              <button onClick={() => setPromoting(null)} aria-label="Fermer" className="rounded-full p-1.5 text-ink-500 hover:bg-cream-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pr-preset">Profil type</Label>
                <select id="pr-preset" value={preset} onChange={(e) => applyPreset(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  <option value="">— Personnalisé —</option>
                  {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pr-job">Fonction</Label>
                <Input id="pr-job" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="h-11 bg-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ce qu&apos;elle pourra faire</Label>
              <PermissionPicker value={perms} onChange={setPerms} />
              <p className="text-xs text-ink-500">Sans aucune case cochée, elle n&apos;a accès qu&apos;à la messagerie et à son profil. Elle ne pourra jamais gérer les autres administrateurs.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={promote} disabled={busy === "promote"} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700 disabled:opacity-60">
                {busy === "promote" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                Nommer et envoyer l&apos;email
              </button>
              <button onClick={() => setPromoting(null)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-600 hover:bg-cream-100">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
