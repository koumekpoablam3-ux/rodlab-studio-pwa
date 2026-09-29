"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Eye, Loader2, Building2, UserRound, Mail, Phone, MapPin, Briefcase,
  FolderKanban, FileText, Receipt, Save, KeyRound, X, Download, ShieldOff, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {PageHeader, EmptyState, StatusBadge} from "@/components/shared";
import { Avatar } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ROLE_LABELS, ROLE_COLORS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, Role } from "@/lib/roles";
import { formatFCFA, formatDate } from "@/lib/format";
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
  active: boolean;
  createdAt: string | Date;
  _count: { projects: number; quotes: number; invoices: number };
};

type UserDetail = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  jobTitle: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatarColor: string | null;
  active: boolean;
  createdAt: string | Date;
  projects: { id: string; title: string; status: string; progress: number; budget: number | null }[];
  quotes: { id: string; number: string; title: string; total: number; status: string; createdAt: string | Date }[];
  invoices: { id: string; number: string; total: number; status: string; createdAt: string | Date }[];
};

const AVATAR_CHOICES = ["#bd4f2b", "#276144", "#b98224", "#1b6fa8", "#7c3aed", "#be185d"];

export function ClientsBoard({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab, setTab] = useState<"profil" | "projets" | "devis" | "factures">("profil");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdForm, setPwdForm] = useState({ newPassword: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", jobTitle: "", companyName: "", city: "", address: "", avatarColor: "#bd4f2b" });

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!`${u.name} ${u.email} ${u.companyName ?? ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [users, roleFilter, search]);

  async function openDetail(u: UserRow) {
    setDetailLoading(true);
    setTab("profil");
    setEditing(false);
    const res = await fetch(`/api/admin/users/${u.id}`);
    setDetailLoading(false);
    if (!res.ok) {
      toast.error("Impossible de charger le profil");
      return;
    }
    const data = await res.json();
    setDetail(data.user);
  }

  function startEdit() {
    if (!detail) return;
    setForm({
      name: detail.name,
      phone: detail.phone ?? "",
      jobTitle: detail.jobTitle ?? "",
      companyName: detail.companyName ?? "",
      city: detail.city ?? "",
      address: detail.address ?? "",
      avatarColor: detail.avatarColor ?? "#bd4f2b",
    });
    setEditing(true);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${detail.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Impossible d'enregistrer");
      return;
    }
    toast.success("Profil mis à jour");
    setEditing(false);
    setDetail((d) => (d ? { ...d, ...form } : d));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === detail.id
          ? { ...u, name: form.name, phone: form.phone, jobTitle: form.jobTitle, companyName: form.companyName, city: form.city, avatarColor: form.avatarColor }
          : u
      )
    );
    router.refresh();
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!detail || pwdForm.newPassword.length < 8) {
      toast.error("8 caractères minimum");
      return;
    }
    setSavingPwd(true);
    const res = await fetch(`/api/admin/users/${detail.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: pwdForm.newPassword }),
    });
    setSavingPwd(false);
    if (!res.ok) {
      toast.error("Impossible de réinitialiser le mot de passe");
      return;
    }
    toast.success("Mot de passe réinitialisé");
    setPwdForm({ newPassword: "" });
  }

  const displayName = (u: { name: string; role: string; companyName: string | null }) =>
    u.role === "ENTREPRISE" ? u.companyName || u.name : u.name;

  async function toggleActive(u: UserDetail | UserRow) {
    const nextActive = !u.active;
    if (!confirm(nextActive ? `Réactiver le compte de ${displayName(u)} ?` : `Suspendre le compte de ${displayName(u)} ? Il ne pourra plus se connecter tant que vous ne le réactivez pas.`)) {
      return;
    }
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: nextActive }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Action impossible");
      return;
    }
    toast.success(nextActive ? "Compte réactivé" : "Compte suspendu");
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, active: nextActive } : x)));
    setDetail((d) => (d && d.id === u.id ? { ...d, active: nextActive } : d));
    router.refresh();
  }

  function exportCsv() {
    const header = ["Nom", "Email", "Rôle", "Téléphone", "Entreprise", "Ville", "Statut", "Créé le"];
    const rows = filtered.map((u) => [
      displayName(u),
      u.email,
      ROLE_LABELS[u.role as Role],
      u.phone ?? "",
      u.companyName ?? "",
      u.city ?? "",
      u.active ? "Actif" : "Suspendu",
      formatDate(u.createdAt),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients-rodlab-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} client(s) exporté(s)`);
  }

  return (
    <>
      <PageHeader title="Clients" description="Consultez et modifiez les profils de vos clients et entreprises." />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Filtrer par type">
          {(["ALL", "CLIENT", "ENTREPRISE"] as const).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={roleFilter === r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                roleFilter === r ? "border-terra-600 bg-terra-600 text-cream-50 shadow-chip" : "border-cream-300 bg-card text-ink-500 hover:text-ink-900"
              )}
            >
              {r === "ALL" ? "Tous" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client…" className="h-11 rounded-xl bg-card pl-10" aria-label="Recherche client" />
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-cream-300 bg-card px-4 text-sm font-medium text-ink-600 transition hover:bg-cream-100"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Exporter
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserRound} title="Aucun client trouvé" description="Les comptes créés via l'inscription ou la conversion apparaîtront ici." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => openDetail(u)}
              className={cn(
                "group rounded-3xl border border-cream-300 bg-card p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift",
                !u.active && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={displayName(u)} color={u.avatarColor} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-ink-900">{displayName(u)}</p>
                    <p className="truncate text-xs text-ink-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge label={ROLE_LABELS[u.role as Role]} colorClass={ROLE_COLORS[u.role as Role]} />
                  {!u.active && <StatusBadge label="Suspendu" colorClass="bg-red-100 text-red-700" />}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-cream-100 py-2.5">
                  <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink-900"><FolderKanban className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />{u._count.projects}</p>
                  <p className="text-[11px] text-ink-400">projets</p>
                </div>
                <div className="rounded-xl bg-cream-100 py-2.5">
                  <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink-900"><FileText className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />{u._count.quotes}</p>
                  <p className="text-[11px] text-ink-400">devis</p>
                </div>
                <div className="rounded-xl bg-cream-100 py-2.5">
                  <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink-900"><Receipt className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />{u._count.invoices}</p>
                  <p className="text-[11px] text-ink-400">factures</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
                <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Cliquer pour voir et modifier le profil
              </p>
            </button>
          ))}
        </div>
      )}

      {/* ——— Dialogue détail / édition ——— */}
      <Dialog open={!!detail || detailLoading} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl bg-white sm:rounded-3xl">
          {detailLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-terra-500" aria-hidden="true" />
            </div>
          )}
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-3 pr-8 font-display text-xl">
                  <span className="flex items-center gap-3">
                    <Avatar name={displayName(detail)} color={detail.avatarColor} />
                    {displayName(detail)}
                    {!detail.active && <StatusBadge label="Suspendu" colorClass="bg-red-100 text-red-700" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleActive(detail)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                      detail.active
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-forest-300 text-forest-700 hover:bg-forest-50"
                    )}
                  >
                    {detail.active ? <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" /> : <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                    {detail.active ? "Suspendre" : "Réactiver"}
                  </button>
                </DialogTitle>
              </DialogHeader>

              {/* Onglets */}
              <div className="flex gap-1 rounded-xl bg-cream-100 p-1" role="tablist" aria-label="Sections du profil">
                {([["profil", "Profil"], ["projets", "Projets"], ["devis", "Devis"], ["factures", "Factures"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                      tab === key ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "profil" && (
                <div className="space-y-4">
                  {!editing ? (
                    <>
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <p className="flex items-center gap-2 text-ink-700"><Mail className="h-4 w-4 text-ink-400" aria-hidden="true" />{detail.email}</p>
                        <p className="flex items-center gap-2 text-ink-700"><Phone className="h-4 w-4 text-ink-400" aria-hidden="true" />{detail.phone ?? "—"}</p>
                        <p className="flex items-center gap-2 text-ink-700"><Briefcase className="h-4 w-4 text-ink-400" aria-hidden="true" />{detail.jobTitle ?? "—"}</p>
                        {detail.role === "ENTREPRISE" && (
                          <p className="flex items-center gap-2 text-ink-700"><Building2 className="h-4 w-4 text-ink-400" aria-hidden="true" />{detail.companyName ?? "—"}</p>
                        )}
                        <p className="flex items-center gap-2 text-ink-700"><MapPin className="h-4 w-4 text-ink-400" aria-hidden="true" />{[detail.address, detail.city].filter(Boolean).join(", ") || "—"}</p>
                        <p className="flex items-center gap-2 text-ink-700">Client depuis le {formatDate(detail.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 border-t border-cream-200 pt-4">
                        <button onClick={startEdit} className="rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700">
                          Modifier le profil
                        </button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={saveProfile} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="cl-name">Nom complet</Label>
                          <Input id="cl-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cl-phone">Téléphone</Label>
                          <Input id="cl-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cl-job">Fonction</Label>
                          <Input id="cl-job" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} className="h-11 bg-white" />
                        </div>
                        {detail.role === "ENTREPRISE" && (
                          <div className="space-y-1.5">
                            <Label htmlFor="cl-company">Entreprise</Label>
                            <Input id="cl-company" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} className="h-11 bg-white" />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <Label htmlFor="cl-city">Ville</Label>
                          <Input id="cl-city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="h-11 bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cl-address">Adresse</Label>
                          <Input id="cl-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-11 bg-white" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Couleur d&apos;avatar</Label>
                        <div className="flex gap-2">
                          {AVATAR_CHOICES.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                              aria-label={`Couleur ${c}`}
                              className={cn("h-8 w-8 rounded-full border-2 transition", form.avatarColor === c ? "border-ink-900 scale-110" : "border-transparent")}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-700 disabled:opacity-60">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                          Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-100">
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Réinitialisation mot de passe */}
                  <form onSubmit={resetPassword} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                      <KeyRound className="h-4 w-4 text-terra-600" aria-hidden="true" /> Réinitialiser le mot de passe
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Input
                        type="password"
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ newPassword: e.target.value })}
                        placeholder="Nouveau mot de passe (8 caractères min.)"
                        className="h-11 flex-1 bg-white"
                        aria-label="Nouveau mot de passe"
                      />
                      <button type="submit" disabled={savingPwd || pwdForm.newPassword.length < 8} className="rounded-xl bg-forest-700 px-4 text-sm font-semibold text-cream-50 transition hover:bg-forest-800 disabled:opacity-50">
                        {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Réinitialiser"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {tab === "projets" && (
                <ul className="grid gap-2">
                  {detail.projects.length === 0 && <p className="py-6 text-center text-sm text-ink-400">Aucun projet</p>}
                  {detail.projects.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-cream-200 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{p.title}</p>
                        <p className="text-xs text-ink-500">{p.progress} % · {formatFCFA(p.budget)}</p>
                      </div>
                      <StatusBadge label={PROJECT_STATUS_LABELS[p.status as keyof typeof PROJECT_STATUS_LABELS]} colorClass={PROJECT_STATUS_COLORS[p.status as keyof typeof PROJECT_STATUS_COLORS]} />
                    </li>
                  ))}
                </ul>
              )}

              {tab === "devis" && (
                <ul className="grid gap-2">
                  {detail.quotes.length === 0 && <p className="py-6 text-center text-sm text-ink-400">Aucun devis</p>}
                  {detail.quotes.map((q) => (
                    <li key={q.id} className="flex items-center justify-between gap-3 rounded-2xl border border-cream-200 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{q.number} — {q.title}</p>
                        <p className="text-xs text-ink-500">{formatFCFA(q.total)}</p>
                      </div>
                      <StatusBadge label={QUOTE_STATUS_LABELS[q.status as keyof typeof QUOTE_STATUS_LABELS]} colorClass={QUOTE_STATUS_COLORS[q.status as keyof typeof QUOTE_STATUS_COLORS]} />
                    </li>
                  ))}
                </ul>
              )}

              {tab === "factures" && (
                <ul className="grid gap-2">
                  {detail.invoices.length === 0 && <p className="py-6 text-center text-sm text-ink-400">Aucune facture</p>}
                  {detail.invoices.map((inv) => (
                    <li key={inv.id} className="flex items-center justify-between gap-3 rounded-2xl border border-cream-200 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{inv.number}</p>
                        <p className="text-xs text-ink-500">{formatFCFA(inv.total)} · {formatDate(inv.createdAt)}</p>
                      </div>
                      <StatusBadge label={INVOICE_STATUS_LABELS[inv.status as keyof typeof INVOICE_STATUS_LABELS]} colorClass={INVOICE_STATUS_COLORS[inv.status as keyof typeof INVOICE_STATUS_COLORS]} />
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={() => setDetail(null)} className="absolute right-4 top-4 text-ink-400 hover:text-ink-900 sm:hidden" aria-label="Fermer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
