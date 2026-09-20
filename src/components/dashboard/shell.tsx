"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Inbox, Users, FolderKanban, FileText, Receipt, MessageSquare,
  LayoutTemplate, UsersRound, CircleUserRound, Menu, LogOut, Bell, ExternalLink, X,
  GraduationCap, Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo, Avatar } from "@/components/brand";
import { Role, ROLE_LABELS } from "@/lib/roles";
import { timeAgo } from "@/lib/format";
import { useEffect, useRef } from "react";

type NavItem = { href: string; label: string; icon: React.ElementType; badgeKey?: "requests" | "messages" };

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Statistiques", icon: LayoutDashboard },
  { href: "/admin/demandes", label: "Demandes de devis", icon: Inbox, badgeKey: "requests" },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/devis", label: "Devis", icon: FileText },
  { href: "/admin/factures", label: "Factures", icon: Receipt },
  { href: "/admin/formation", label: "Academy", icon: GraduationCap },
  { href: "/admin/live", label: "Sessions live", icon: Video },
  { href: "/admin/messagerie", label: "Messagerie", icon: MessageSquare },
  { href: "/admin/contenu", label: "Contenu du site", icon: LayoutTemplate },
  { href: "/admin/equipe", label: "Équipe & comptes", icon: UsersRound },
  { href: "/admin/profil", label: "Mon profil", icon: CircleUserRound },
];

const CLIENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/projets", label: "Mes projets", icon: FolderKanban },
  { href: "/dashboard/formation", label: "Mes formations", icon: GraduationCap },
  { href: "/dashboard/devis", label: "Devis", icon: FileText },
  { href: "/dashboard/factures", label: "Factures", icon: Receipt },
  { href: "/dashboard/messagerie", label: "Messagerie", icon: MessageSquare },
];

const ENTREPRISE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/projets", label: "Nos projets", icon: FolderKanban },
  { href: "/dashboard/formation", label: "Mes formations", icon: GraduationCap },
  { href: "/dashboard/devis", label: "Devis", icon: FileText },
  { href: "/dashboard/factures", label: "Factures", icon: Receipt },
  { href: "/dashboard/messagerie", label: "Messagerie", icon: MessageSquare },
  { href: "/dashboard/equipe", label: "Notre équipe", icon: UsersRound },
];

export type ShellUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor?: string | null;
  companyName?: string | null;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  url?: string | null;
  readAt: string | null;
  createdAt: string;
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const baseTitleRef = useRef<string>("");

  useEffect(() => {
    baseTitleRef.current = document.title;
  }, []);

  // Titre de l'onglet façon Gmail : « (2) Espace client · RodLab Studio »
  useEffect(() => {
    if (!baseTitleRef.current) return;
    document.title = unread > 0 ? `(${unread}) ${baseTitleRef.current}` : baseTitleRef.current;
    return () => {
      document.title = baseTitleRef.current;
    };
  }, [unread]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setItems(data.notifications ?? []);
          setUnread(data.unread ?? 0);
        }
      } catch {}
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function markAllRead() {
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    await fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) markAllRead();
        }}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 bg-card text-ink-700 transition hover:bg-cream-100"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terra-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-cream-300 bg-card shadow-lift">
          <div className="border-b border-cream-200 px-4 py-3">
            <p className="font-display text-sm font-semibold text-ink-900">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink-400">Aucune notification pour le moment</p>
            )}
            {items.slice(0, 8).map((n) => (
              <Link
                key={n.id}
                href={n.url || "#"}
                onClick={() => setOpen(false)}
                className={cn(
                  "block border-b border-cream-100 px-4 py-3 transition hover:bg-cream-50",
                  !n.readAt && "bg-terra-50/50"
                )}
              >
                <p className="text-sm font-medium text-ink-900">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-300">{timeAgo(n.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({
  variant,
  user,
  badges,
  children,
}: {
  variant: "admin" | "client";
  user: ShellUser;
  badges?: { requests?: number; messages?: number };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = variant === "admin" ? ADMIN_NAV : user.role === "ENTREPRISE" ? ENTREPRISE_NAV : CLIENT_NAV;
  const displayName = user.role === "ENTREPRISE" && user.companyName ? user.companyName : user.name;

  const sidebar = (
    <div className="flex h-full flex-col bg-forest-900 text-cream-100">
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <Link href="/" aria-label="Retour au site RodLab Studio">
          <Logo light size="sm" />
        </Link>
        <button
          className="text-cream-200/70 hover:text-cream-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-2" aria-label="Navigation principale">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/dashboard" && pathname.startsWith(item.href));
          const badge = item.badgeKey === "requests" ? badges?.requests : item.badgeKey === "messages" ? badges?.messages : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-terra-600 text-cream-50 shadow-chip"
                  : "text-forest-100/80 hover:bg-forest-800 hover:text-cream-50"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {badge != null && badge > 0 && (
                <span className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  active ? "bg-cream-50 text-terra-700" : "bg-gold-500 text-forest-900"
                )}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-forest-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={displayName} color={user.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream-50">{displayName}</p>
            <p className="truncate text-xs text-forest-200/70">{ROLE_LABELS[user.role]}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-forest-200/70 transition hover:bg-forest-800 hover:text-cream-50"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream-100">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-lift">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-cream-300 bg-cream-100/85 backdrop-blur no-print">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 bg-card text-ink-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-xl border border-cream-300 bg-card px-3.5 py-2 text-xs font-medium text-ink-500 transition hover:bg-cream-200 sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Voir le site
            </Link>
            <NotificationBell />
            <Link
              href={variant === "admin" ? "/admin/profil" : "/dashboard/profil"}
              className="hidden sm:block"
              aria-label="Mon profil"
            >
              <Avatar name={displayName} color={user.avatarColor} size="sm" />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="mt-auto border-t border-cream-300 px-6 py-4 text-center text-xs text-ink-400 no-print">
          RodLab Studio — Lomé, Togo · Application PWA v8.6.0
        </footer>
      </div>
    </div>
  );
}
