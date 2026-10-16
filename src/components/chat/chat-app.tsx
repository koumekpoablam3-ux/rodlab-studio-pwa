"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Check, CheckCheck, FileText, Download, Loader2, MessageSquare, Mic, Paperclip, Phone, PhoneMissed, Search, Send, Trash2, Video, X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";
import { Switch } from "@/components/ui/switch";
import { useCalls } from "@/components/chat/call-provider";
import { compressImage } from "@/lib/image-compress";
import { formatTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

type User = { id: string; name: string; role: string; subtitle: string; avatarColor: string | null; avatarUrl?: string | null; online: boolean; lastSeenAt: string | null };
type Conversation = {
  id: string;
  others: User[];
  unread: number;
  updatedAt: string;
  last: { preview: string; senderId: string; type: string; createdAt: string } | null;
};
type Msg = {
  id: string; senderId: string; type: "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "CALL"; content: string;
  fileUrl: string | null; fileName: string | null; fileMime: string | null; fileSize: number | null; duration: number | null; createdAt: string;
};
type Typing = { userId: string; name: string; state: string };

const MAX_FILE = 4 * 1024 * 1024;
const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(b / 1024))} Ko`);
const roleLabel = (r: string) => (r === "ADMIN" ? "Équipe" : r === "ENTREPRISE" ? "Entreprise" : "Client");

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function linkify(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-all">{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function statusOf(u: User) {
  return u.online ? "En ligne" : u.lastSeenAt ? `Vu ${timeAgo(u.lastSeenAt)}` : "Hors ligne";
}

function PresenceAvatar({ user, size = "md" }: { user: User; size?: "sm" | "md" | "lg" }) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar name={user.name} color={user.avatarColor} src={user.avatarUrl} size={size} />
      <span
        className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white", user.online ? "bg-green-500" : "bg-ink-300")}
        title={user.online ? "En ligne" : "Hors ligne"}
      />
    </span>
  );
}

export function ChatApp({
  myId,
  isAdmin,
  initialConversationId,
  clientsCanChat,
}: {
  myId: string;
  isAdmin: boolean;
  initialConversationId?: string | null;
  clientsCanChat: boolean;
}) {
  const { startCall, inCall } = useCalls();

  const [tab, setTab] = useState<"chats" | "directory">("chats");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [directory, setDirectory] = useState<User[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(initialConversationId ?? null);
  const [mobileChat, setMobileChat] = useState(!!initialConversationId);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [othersReadAt, setOthersReadAt] = useState<string | null>(null);
  const [typing, setTyping] = useState<Typing[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState<{ file: File; preview: string | null } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [canClientsChat, setCanClientsChat] = useState(clientsCanChat);

  // Vocal
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recCancelled = useRef(false);

  const endRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const lastCreated = useRef<string | null>(null);
  const activeRef = useRef<string | null>(activeId);
  const lastTypingPing = useRef(0);
  const stickToBottom = useRef(true);

  activeRef.current = activeId;
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const others = useMemo(() => members.filter((m) => m.id !== myId), [members, myId]);
  const peer = others[0] ?? active?.others[0] ?? null;
  const title = others.length > 0 ? others.map((o) => o.name).join(", ") : active?.others.map((o) => o.name).join(", ") ?? "";
  const nameById = useMemo(() => new Map(members.map((m) => [m.id, m.name])), [members]);

  // ───── Chargement des listes ─────
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" });
      if (res.ok) setConversations((await res.json()).conversations);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadDirectory = useCallback(async () => {
    const res = await fetch("/api/conversations/directory", { cache: "no-store" });
    if (res.ok) setDirectory((await res.json()).users);
  }, []);

  useEffect(() => {
    void loadConversations();
    void loadDirectory();
    const a = setInterval(() => { if (!document.hidden) void loadConversations(); }, 6000);
    const b = setInterval(() => { if (!document.hidden) void loadDirectory(); }, 15000);
    return () => { clearInterval(a); clearInterval(b); };
  }, [loadConversations, loadDirectory]);

  // ───── Messages de la conversation ouverte ─────
  const loadMessages = useCallback(async (id: string, full: boolean) => {
    const since = !full && lastCreated.current ? `?since=${encodeURIComponent(new Date(new Date(lastCreated.current).getTime() - 3000).toISOString())}` : "";
    const res = await fetch(`/api/conversations/${id}/messages${since}`, { cache: "no-store" });
    if (!res.ok || activeRef.current !== id) return;
    const data = await res.json();
    setMembers(data.members);
    setOthersReadAt(data.othersReadAt);
    setTyping(data.typing);
    setMessages((prev) => {
      const base = full ? [] : prev;
      const seen = new Set(base.map((m) => m.id));
      const fresh = (data.messages as Msg[]).filter((m) => !seen.has(m.id));
      if (!full && fresh.length === 0) return prev;
      const merged = [...base, ...fresh];
      lastCreated.current = merged.length ? merged[merged.length - 1].createdAt : null;
      return merged;
    });
  }, []);

  useEffect(() => {
    setMessages([]); setMembers([]); setTyping([]); setOthersReadAt(null); setPending(null); setInput("");
    lastCreated.current = null;
    stickToBottom.current = true;
    if (!activeId) return;
    void loadMessages(activeId, true).then(loadConversations);
    const t = setInterval(() => { if (!document.hidden) void loadMessages(activeId, false); }, 2500);
    return () => clearInterval(t);
  }, [activeId, loadMessages, loadConversations]);

  // Descend dans la liste de messages (jamais dans la page entière), uniquement quand un nouveau message
  // arrive ou qu'on ouvre la conversation — et seulement si l'on était déjà en bas.
  const lastMessageId = messages.length ? messages[messages.length - 1].id : null;
  const someoneTyping = typing.length > 0;
  useEffect(() => {
    const el = scroller.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [lastMessageId, someoneTyping]);

  // ───── Ouvrir une conversation avec n'importe qui (sans attendre qu'il écrive) ─────
  async function openWith(userId: string) {
    const res = await fetch("/api/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(data.error ?? "Impossible d'ouvrir la conversation"); return; }
    await loadConversations();
    setTab("chats");
    setActiveId(data.id);
    setMobileChat(true);
  }

  // ───── Envoi ─────
  async function postMessage(body: BodyInit, json: boolean) {
    if (!activeId) return false;
    const res = await fetch(`/api/conversations/${activeId}/messages`, { method: "POST", headers: json ? { "Content-Type": "application/json" } : undefined, body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(data.error ?? "Envoi impossible"); return false; }
    stickToBottom.current = true;
    setMessages((prev) => (prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message]));
    lastCreated.current = data.message.createdAt;
    void loadConversations();
    return true;
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    if (sending || !activeId) return;
    const text = input.trim();
    if (!text && !pending) return;
    setSending(true);
    let ok = false;
    if (pending) {
      const form = new FormData();
      form.append("file", pending.file);
      if (text) form.append("caption", text);
      ok = await postMessage(form, false);
    } else {
      ok = await postMessage(JSON.stringify({ content: text }), true);
    }
    setSending(false);
    if (ok) { setInput(""); setPending(null); void pingTyping("idle"); }
  }

  async function pingTyping(state: "typing" | "recording" | "idle") {
    if (!activeId) return;
    await fetch(`/api/conversations/${activeId}/typing`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state }) }).catch(() => {});
  }

  function onInput(v: string) {
    setInput(v);
    if (v && Date.now() - lastTypingPing.current > 3000) { lastTypingPing.current = Date.now(); void pingTyping("typing"); }
  }

  // ───── Pièces jointes ─────
  async function onPickFile(file?: File | null) {
    if (!file) return;
    let f = file;
    if (f.type.startsWith("image/")) f = await compressImage(f).catch(() => file);
    if (f.size > MAX_FILE) { toast.error("Fichier trop lourd (4 Mo maximum)."); return; }
    setPending({ file: f, preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null });
    if (fileInput.current) fileInput.current.value = "";
  }

  // ───── Message vocal ─────
  async function startRecording() {
    if (!activeId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : undefined);
      chunks.current = [];
      recCancelled.current = false;
      rec.ondataavailable = (ev) => { if (ev.data.size > 0) chunks.current.push(ev.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recTimer.current) clearInterval(recTimer.current);
        setRecording(false);
        void pingTyping("idle");
        if (recCancelled.current) return;
        const duration = Math.max(1, recSecondsRef.current);
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > MAX_FILE) { toast.error("Vocal trop long."); return; }
        const form = new FormData();
        form.append("file", new File([blob], "vocal", { type: blob.type }));
        form.append("voice", "1");
        form.append("duration", String(duration));
        setSending(true);
        await postMessage(form, false);
        setSending(false);
      };
      recorder.current = rec;
      rec.start();
      recSecondsRef.current = 0;
      setRecSeconds(0);
      setRecording(true);
      void pingTyping("recording");
      recTimer.current = setInterval(() => {
        recSecondsRef.current += 1;
        setRecSeconds(recSecondsRef.current);
        if (recSecondsRef.current % 3 === 0) void pingTyping("recording");
        if (recSecondsRef.current >= 180 && rec.state !== "inactive") rec.stop();
      }, 1000);
    } catch {
      toast.error("Autorisez le micro dans votre navigateur pour envoyer un vocal.");
    }
  }
  const recSecondsRef = useRef(0);
  function stopRecording(cancel: boolean) {
    recCancelled.current = cancel;
    if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
  }
  useEffect(() => () => { if (recorder.current?.state === "recording") { recCancelled.current = true; recorder.current.stop(); } }, []);

  // ───── Réglage admin ─────
  async function toggleClientsChat(on: boolean) {
    setCanClientsChat(on);
    const res = await fetch("/api/admin/site-content", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(on ? { resetKeys: ["chat.clientsCanChat"] } : { values: [{ key: "chat.clientsCanChat", value: "0" }] }),
    });
    if (!res.ok) { setCanClientsChat(!on); toast.error("Réglage non enregistré"); } else { toast.success(on ? "Les clients peuvent s'écrire entre eux" : "Les clients ne peuvent écrire qu'à l'équipe"); void loadDirectory(); }
  }

  // ───── Listes filtrées ─────
  const q = search.trim().toLowerCase();
  const filteredConvs = conversations.filter((c) => !q || c.others.some((o) => o.name.toLowerCase().includes(q)));
  const filteredDir = directory.filter((u) => !q || u.name.toLowerCase().includes(q) || u.subtitle.toLowerCase().includes(q));
  const onlineUsers = directory.filter((u) => u.online);
  const typingText = typing.length > 0 ? (typing[0].state === "recording" ? "enregistre un vocal…" : "écrit…") : null;

  // Liste des messages avec séparateurs de jours
  const rows = useMemo(() => {
    const out: ({ kind: "day"; label: string; key: string } | { kind: "msg"; msg: Msg })[] = [];
    let lastDay = "";
    for (const m of messages) {
      const day = new Date(m.createdAt).toDateString();
      if (day !== lastDay) { out.push({ kind: "day", label: dayLabel(m.createdAt), key: `d-${m.id}` }); lastDay = day; }
      out.push({ kind: "msg", msg: m });
    }
    return out;
  }, [messages]);

  const isGroup = others.length > 1;

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] min-h-[420px] overflow-hidden rounded-3xl sm:h-[calc(100dvh-16rem)] lg:h-[calc(100dvh-18.5rem)] border border-cream-300 bg-white shadow-card">
      {/* ═════════ Colonne gauche ═════════ */}
      <aside className={cn("flex w-full shrink-0 flex-col border-r border-cream-300 md:w-80 lg:w-96", mobileChat ? "hidden md:flex" : "flex")}>
        <div className="space-y-3 border-b border-cream-300 p-4">
          <div className="flex rounded-full bg-cream-100 p-1 text-sm font-medium" role="tablist">
            {(["chats", "directory"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={cn("flex-1 rounded-full px-3 py-1.5 transition", tab === t ? "bg-forest-900 text-cream-50 shadow-chip" : "text-ink-500 hover:text-ink-900")}>
                {t === "chats" ? "Discussions" : `Annuaire (${directory.length})`}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une personne…" aria-label="Rechercher"
              className="h-10 w-full rounded-full border border-cream-300 bg-cream-50 pl-9 pr-3 text-sm outline-none focus:border-terra-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "chats" && onlineUsers.length > 0 && !q && (
            <div className="border-b border-cream-200 px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400">En ligne maintenant ({onlineUsers.length})</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {onlineUsers.map((u) => (
                  <button key={u.id} onClick={() => openWith(u.id)} className="flex w-16 shrink-0 flex-col items-center gap-1 text-center" title={`Écrire à ${u.name}`}>
                    <PresenceAvatar user={u} />
                    <span className="w-full truncate text-[11px] text-ink-600">{u.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "chats" && (
            loadingList ? (
              <div className="flex justify-center p-8"><Loader2 className="h-5 w-5 animate-spin text-ink-400" aria-hidden="true" /></div>
            ) : filteredConvs.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-500">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-ink-300" aria-hidden="true" />
                Aucune discussion.
                <button onClick={() => setTab("directory")} className="mt-2 block w-full font-semibold text-terra-600 hover:underline">Démarrer une conversation</button>
              </div>
            ) : (
              <ul>
                {filteredConvs.map((c) => {
                  const o = c.others[0];
                  return (
                    <li key={c.id}>
                      <button onClick={() => { setActiveId(c.id); setMobileChat(true); }}
                        className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cream-50", c.id === activeId && "bg-cream-100")}>
                        {o ? <PresenceAvatar user={o} /> : <Avatar name="?" />}
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-ink-900">{c.others.map((x) => x.name).join(", ") || "Conversation"}</span>
                            {c.last && <span className="shrink-0 text-[11px] text-ink-400">{formatTime(c.last.createdAt)}</span>}
                          </span>
                          <span className="mt-0.5 flex items-center justify-between gap-2">
                            <span className={cn("truncate text-xs", c.unread > 0 ? "font-semibold text-ink-800" : "text-ink-500")}>
                              {c.last ? `${c.last.senderId === myId ? "Vous : " : ""}${c.last.preview}` : "Nouvelle conversation"}
                            </span>
                            {c.unread > 0 && (
                              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-terra-600 px-1.5 text-[11px] font-bold text-white">{c.unread}</span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          )}

          {tab === "directory" && (
            filteredDir.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink-500">Aucune personne trouvée.</p>
            ) : (
              <ul>
                {filteredDir.map((u) => (
                  <li key={u.id}>
                    <button onClick={() => openWith(u.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cream-50">
                      <PresenceAvatar user={u} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900">{u.name}</span>
                        <span className="block truncate text-xs text-ink-500">{roleLabel(u.role)} · {u.subtitle}</span>
                        <span className={cn("block text-[11px]", u.online ? "font-medium text-green-600" : "text-ink-400")}>{statusOf(u)}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-forest-900 px-3 py-1 text-xs font-semibold text-cream-50">Écrire</span>
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        {isAdmin && (
          <label className="flex items-center justify-between gap-3 border-t border-cream-300 bg-cream-50 px-4 py-3 text-xs text-ink-600">
            <span>Les clients peuvent s&apos;écrire entre eux</span>
            <Switch checked={canClientsChat} onCheckedChange={toggleClientsChat} aria-label="Autoriser la messagerie entre clients" />
          </label>
        )}
      </aside>

      {/* ═════════ Conversation ═════════ */}
      <section className={cn("min-w-0 flex-1 flex-col", mobileChat ? "flex" : "hidden md:flex")}>
        {!activeId ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-ink-500">
            <MessageSquare className="mb-3 h-12 w-12 text-ink-300" aria-hidden="true" />
            <p className="font-display text-lg font-semibold text-ink-800">Sélectionnez une discussion</p>
            <p className="mt-1 max-w-xs text-sm">ou ouvrez l&apos;annuaire pour écrire ou appeler n&apos;importe qui, même s&apos;il ne vous a pas encore écrit.</p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-cream-300 px-4 py-3">
              <button onClick={() => setMobileChat(false)} aria-label="Retour aux discussions" className="rounded-full p-1.5 text-ink-500 hover:bg-cream-100 md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </button>
              {peer && <PresenceAvatar user={peer} />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink-900">{title}</p>
                <p className={cn("truncate text-xs", typingText || peer?.online ? "text-green-600" : "text-ink-400")} aria-live="polite">
                  {typingText ? `${isGroup ? typing[0].name + " " : ""}${typingText}` : peer ? statusOf(peer) : ""}
                </p>
              </div>
              {!isGroup && peer && (
                <div className="flex gap-1.5">
                  <button disabled={inCall} onClick={() => startCall(activeId, "AUDIO", { name: peer.name, avatarColor: peer.avatarColor, avatarUrl: peer.avatarUrl })} aria-label={`Appel audio avec ${peer.name}`} title="Appel audio"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition hover:bg-cream-100 disabled:opacity-40"><Phone className="h-5 w-5" /></button>
                  <button disabled={inCall} onClick={() => startCall(activeId, "VIDEO", { name: peer.name, avatarColor: peer.avatarColor, avatarUrl: peer.avatarUrl })} aria-label={`Appel vidéo avec ${peer.name}`} title="Appel vidéo"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition hover:bg-cream-100 disabled:opacity-40"><Video className="h-5 w-5" /></button>
                </div>
              )}
            </header>

            <div ref={scroller} onScroll={(e) => { const el = e.currentTarget; stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120; }}
              className="flex-1 space-y-1.5 overflow-y-auto bg-cream-50 px-3 py-4 sm:px-6">
              {messages.length === 0 && <p className="py-10 text-center text-sm text-ink-400">Aucun message. Dites bonjour 👋</p>}
              {rows.map((row) => {
                if (row.kind === "day") {
                  return <div key={row.key} className="py-2 text-center"><span className="rounded-full bg-white px-3 py-1 text-[11px] text-ink-500 shadow-sm">{row.label}</span></div>;
                }
                const m = row.msg;
                const mine = m.senderId === myId;

                if (m.type === "CALL") {
                  const [k, outcome] = m.content.split("|");
                  const video = k === "VIDEO";
                  const label = outcome === "ended" ? `Appel ${video ? "vidéo" : "audio"}${m.duration ? ` · ${fmtDur(m.duration)}` : ""}` : outcome === "declined" ? `Appel ${video ? "vidéo" : "audio"} refusé` : `Appel ${video ? "vidéo" : "audio"} manqué`;
                  return (
                    <div key={m.id} className="flex justify-center py-1">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-ink-600 shadow-sm">
                        {outcome === "ended" ? (video ? <Video className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />) : <PhoneMissed className="h-3.5 w-3.5 text-red-500" />}
                        {label} · {formatTime(m.createdAt)}
                        {!isGroup && peer && !inCall && (
                          <button onClick={() => startCall(activeId, video ? "VIDEO" : "AUDIO", { name: peer.name, avatarColor: peer.avatarColor, avatarUrl: peer.avatarUrl })} className="font-semibold text-terra-600 hover:underline">Rappeler</button>
                        )}
                      </span>
                    </div>
                  );
                }

                const read = mine && !!othersReadAt && new Date(m.createdAt) <= new Date(othersReadAt);
                return (
                  <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[70%]", mine ? "rounded-br-md bg-forest-900 text-cream-50" : "rounded-bl-md bg-white text-ink-800")}>
                      {isGroup && !mine && <p className="mb-0.5 text-xs font-semibold text-terra-600">{nameById.get(m.senderId) ?? ""}</p>}

                      {m.type === "IMAGE" && m.fileUrl && (
                        <button onClick={() => setLightbox(m.fileUrl)} className="mb-1 block overflow-hidden rounded-xl" aria-label="Agrandir la photo">
                          <img src={m.fileUrl} alt={m.fileName ?? "Photo"} className="max-h-64 w-full object-cover" loading="lazy" />
                        </button>
                      )}
                      {m.type === "AUDIO" && m.fileUrl && (
                        <div className="flex items-center gap-2">
                          <audio controls preload="metadata" src={m.fileUrl} className="h-10 w-56 max-w-full" />
                          {m.duration ? <span className="text-[11px] opacity-70">{fmtDur(m.duration)}</span> : null}
                        </div>
                      )}
                      {m.type === "FILE" && m.fileUrl && (
                        <a href={`${m.fileUrl}?download=1`} className={cn("mb-1 flex items-center gap-3 rounded-xl px-3 py-2", mine ? "bg-white/10" : "bg-cream-100")}>
                          <FileText className="h-8 w-8 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{m.fileName}</span>
                            <span className="block text-[11px] opacity-70">{m.fileSize ? fmtSize(m.fileSize) : ""}</span>
                          </span>
                          <Download className="h-4 w-4 shrink-0" aria-label="Télécharger" />
                        </a>
                      )}
                      {m.content && <p className="whitespace-pre-wrap break-words">{m.type === "TEXT" ? linkify(m.content) : m.content}</p>}

                      <p className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", mine ? "text-cream-200/70" : "text-ink-400")}>
                        {formatTime(m.createdAt)}
                        {mine && (read ? <CheckCheck className="h-3.5 w-3.5 text-sky-300" aria-label="Lu" /> : <Check className="h-3.5 w-3.5" aria-label="Envoyé" />)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {typingText && <div className="px-2 text-xs italic text-ink-400">{isGroup ? `${typing[0].name} ` : ""}{typingText}</div>}
              <div ref={endRef} />
            </div>

            {/* ───── Zone de saisie ───── */}
            <div className="border-t border-cream-300 bg-white p-3">
              {pending && (
                <div className="mb-2 flex items-center gap-3 rounded-2xl bg-cream-100 p-2">
                  {pending.preview ? (
                    <img src={pending.preview} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <FileText className="h-10 w-10 text-ink-500" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-medium text-ink-800">{pending.file.name}</span>
                    <span className="text-xs text-ink-500">{fmtSize(pending.file.size)} · ajoutez une légende ci-dessous (facultatif)</span>
                  </span>
                  <button onClick={() => setPending(null)} aria-label="Retirer la pièce jointe" className="rounded-full p-1.5 text-ink-500 hover:bg-cream-200"><X className="h-4 w-4" /></button>
                </div>
              )}

              {recording ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => stopRecording(true)} aria-label="Annuler l'enregistrement" className="flex h-11 w-11 items-center justify-center rounded-full text-red-600 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>
                  <div className="flex flex-1 items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" aria-hidden="true" />
                    Enregistrement… {fmtDur(recSeconds)}
                  </div>
                  <button onClick={() => stopRecording(false)} aria-label="Envoyer le vocal" className="flex h-11 w-11 items-center justify-center rounded-full bg-terra-600 text-white hover:bg-terra-700"><Send className="h-5 w-5" /></button>
                </div>
              ) : (
                <form onSubmit={send} className="flex items-end gap-2">
                  <input ref={fileInput} type="file" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileInput.current?.click()} aria-label="Joindre un fichier ou une photo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100"><Paperclip className="h-5 w-5" /></button>
                  <textarea
                    value={input}
                    onChange={(e) => onInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
                    rows={1}
                    placeholder={pending ? "Ajouter une légende…" : "Écrire un message…"}
                    aria-label="Votre message"
                    maxLength={4000}
                    className="max-h-32 min-h-11 flex-1 resize-none rounded-3xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-terra-600"
                  />
                  {input.trim() || pending ? (
                    <button type="submit" disabled={sending} aria-label="Envoyer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terra-600 text-white transition hover:bg-terra-700 disabled:opacity-60">
                      {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                  ) : (
                    <button type="button" onClick={startRecording} aria-label="Enregistrer un message vocal" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-cream-50 transition hover:bg-forest-700"><Mic className="h-5 w-5" /></button>
                  )}
                </form>
              )}
            </div>
          </>
        )}
      </section>

      {lightbox && (
        <div role="dialog" aria-label="Photo" onClick={() => setLightbox(null)} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4">
          <button onClick={() => setLightbox(null)} aria-label="Fermer" className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"><X className="h-6 w-6" /></button>
          <a href={`${lightbox}?download=1`} onClick={(e) => e.stopPropagation()} aria-label="Télécharger" className="absolute right-16 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"><Download className="h-6 w-6" /></a>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
