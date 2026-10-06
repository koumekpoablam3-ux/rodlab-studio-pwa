"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, KeyRound, Search, ShieldCheck, Building2, UserRound } from "lucide-react";
import { toast } from "sonner";
import {PageHeader, EmptyState} from "@/components/shared";
import { Avatar } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ROLE_LABELS, ROLE_COLORS, Role } from "@/lib/roles";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  companyName: string | null;
  jobTitle: string | null;
  city: string | null;
  avatarColor: string | null;
  createdAt: string | Date;
  _count: { projects: number; messages: number };
};

export function TeamBoard({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdTarget, setPwdTarget] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CLIENT", phone: "", companyName: "" });

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => `${u.name} ${u.email} ${u.companyName ?? ""} ${ROLE_LABELS[u.role as Role]}`.toLowerCase().includes(q));
  }, [users, search]);

  const admins = users.filter((u) => u.role === "ADMIN");
  const clients = users.filter((u) => u.role === "CLIENT");
  const entreprises = users.filter((u) => u.role === "ENTREPRISE");

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Création impossible");
      return;
    }
    toast.success("Compte créé");
    setCreateOpen(false);
    setForm({ name: "", email: "", password: "", role: "CLIENT", phone: "", companyName: "" });
    router.refresh();
    // ajouter localement
    setUsers((prev) => [
      {
        id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role,
        phone: form.phone || null, companyName: form.role === "ENTREPRISE" ? form.companyName : null,
        jobTitle: null, city: null, avatarColor: "#bd4f2b", createdAt: new Date(), _count: { projects: 0, messages: 0 },
      },
      ...prev,
    ]);
  }

  async function changeRole(id: string, role: Role) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      toast.error("Impossible de changer le rôle");
      return;
    }
    toast.success(`Rôle changé : ${ROLE_LABELS[role]}`);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    router.refresh();
  }

  async function resetPwd(e: React.FormEvent) {
    e.preventDefault();
    if (!pwdTarget) return;
    setSavingPwd(true);
    const res = await fetch(`/api/admin/users/${pwdTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    setSavingPwd(false);
    if (!res.ok) {
      toast.error("Réinitialisation impossible");
      return;
    }
    toast.success(`Mot de passe de ${pwdTarget.name} réinitialisé`);
    setPwdTarget(null);
    setNewPassword("");
  }

  async function removeUser(u: UserRow) {
    if (!confirm(`Supprimer définitivement le compte de ${u.name} ? Tous ses projets, devis et factures seront supprimés.`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Suppression impossible");
      return;
    }
    toast.success("Compte supprimé");
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    router.refresh();
  }

  const RoleIcon = { ADMIN: ShieldCheck, CLIENT: UserRound, ENTREPRISE: Building2 } as const;

  return (
    <>
      <PageHeader
        title="Équipe & comptes"
        description={`${admins.length} administrateur(s) · ${clients.length} client(s) · ${entreprises.length} entreprise(s)`}
        actions={
          <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau compte
          </button>
        }
      />

      <div className="relative mb-5 w-full lg:w-96">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un membre, un client…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Aucun compte trouvé" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3.5 font-medium">Membre</th>
                  <th className="px-5 py-3.5 font-medium">Rôle</th>
                  <th className="px-5 py-3.5 font-medium">Téléphone</th>
                  <th className="px-5 py-3.5 font-medium">Inscrit le</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((u) => {
                  const Icon = RoleIcon[u.role as Role] ?? UserRound;
                  return (
                    <tr key={u.id} className="transition hover:bg-cream-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.role === "ENTREPRISE" ? u.companyName || u.name : u.name} color={u.avatarColor} size="sm" />
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 truncate font-medium text-ink-900">
                              <Icon className="h-3.5 w-3.5 text-ink-400 shrink-0" aria-hidden="true" />
                              {u.role === "ENTREPRISE" ? u.companyName || u.name : u.name}
                            </p>
                            <p className="truncate text-xs text-ink-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value as Role)}
                          aria-label={`Rôle de ${u.name}`}
                          className={cn("h-9 rounded-xl border px-2.5 text-xs font-semibold outline-none", ROLE_COLORS[u.role as Role])}
                        >
                          {(["ADMIN", "CLIENT", "ENTREPRISE"] as Role[]).map((r) => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-ink-700">{u.phone ?? "—"}</td>
                      <td className="px-5 py-4 text-xs text-ink-500">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => { setPwdTarget(u); setNewPassword(""); }} aria-label={`Réinitialiser le mot de passe de ${u.name}`} title="Réinitialiser le mot de passe" className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100 hover:text-ink-900">
                            <KeyRound className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button onClick={() => removeUser(u)} aria-label={`Supprimer le compte de ${u.name}`} title="Supprimer le compte" className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50">
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ——— Création ——— */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouveau compte</DialogTitle>
          </DialogHeader>
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nu-name">Nom complet *</Label>
                <Input id="nu-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-role">Rôle *</Label>
                <select id="nu-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none">
                  <option value="CLIENT">Client</option>
                  <option value="ENTREPRISE">Entreprise</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-email">Email *</Label>
                <Input id="nu-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-phone">Téléphone</Label>
                <Input id="nu-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 bg-white" />
              </div>
              {form.role === "ENTREPRISE" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nu-company">Nom de l&apos;entreprise *</Label>
                  <Input id="nu-company" required value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} className="h-11 bg-white" />
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="nu-pwd">Mot de passe initial *</Label>
                <Input id="nu-pwd" type="text" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="8 caractères minimum" className="h-11 bg-white" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                Créer le compte
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ——— Mot de passe ——— */}
      <Dialog open={!!pwdTarget} onOpenChange={(v) => !v && setPwdTarget(null)}>
        <DialogContent className="max-w-md rounded-3xl bg-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Réinitialiser — {pwdTarget?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={resetPwd} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rp-pwd">Nouveau mot de passe</Label>
              <Input id="rp-pwd" type="text" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8 caractères minimum" className="h-11 bg-white" />
            </div>
            <p className="text-xs text-ink-400">Communiquez ce mot de passe au membre : il pourra le modifier depuis son profil.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPwdTarget(null)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">Annuler</button>
              <button type="submit" disabled={savingPwd || newPassword.length < 8} className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-700 disabled:opacity-60">
                {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
                Réinitialiser
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
