"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { Avatar } from "@/components/brand";
import { formatTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/roles";

type Message = {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; role: string; avatarColor: string | null };
};

type Thread = {
  clientId: string;
  clientName: string;
  role: Role;
  avatarColor: string | null;
  lastMessage: { content: string; createdAt: string; senderRole: string };
};

export function MessageChat({ variant, myId }: { variant: "admin" | "client"; myId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(variant === "client" ? myId : null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesThread, setMessagesThread] = useState<string | null>(variant === "client" ? myId : null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileList, setMobileList] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loading = messagesThread !== activeThread;

  const loadMessages = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/messages?clientId=${threadId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    setMessagesThread(threadId);
  }, []);

  // Chargement des fils (admin)
  useEffect(() => {
    if (variant !== "admin") return;
    (async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const data = await res.json();
      setThreads(data.threads ?? []);
      if (data.threads?.length > 0 && !activeThread) {
        setActiveThread(data.threads[0].clientId);
      }
    })();
  }, [variant, activeThread]);

  // Chargement des messages du fil actif + polling
  useEffect(() => {
    if (!activeThread) return;
    (async () => {
      await loadMessages(activeThread);
    })();
    const t = setInterval(() => loadMessages(activeThread), 8000);
    return () => clearInterval(t);
  }, [activeThread, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeThread) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: activeThread, content }),
    });
    setSending(false);
    if (!res.ok) {
      setInput(content);
      return;
    }
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    setMessagesThread(activeThread);
    // rafraîchir l'aperçu du fil (admin)
    if (variant === "admin") {
      setThreads((prev) =>
        prev.map((t) => (t.clientId === activeThread ? { ...t, lastMessage: { content, createdAt: new Date().toISOString(), senderRole: "ADMIN" } } : t))
      );
    }
  }

  const activeThreadData = threads.find((t) => t.clientId === activeThread);

  return (
    <div
      className={cn(
        "h-[calc(100vh-11.5rem)] min-h-[480px] overflow-hidden rounded-3xl border border-cream-300 bg-card shadow-card",
        variant === "admin" ? "grid grid-cols-1 md:grid-cols-[300px_1fr]" : "flex flex-col"
      )}
    >
      {/* Liste des fils (admin) */}
      {variant === "admin" && (
        <div className={cn("flex-col border-r border-cream-200 md:flex", mobileList ? "flex" : "hidden")}>
          <div className="border-b border-cream-200 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink-900">Conversations</h2>
            <p className="text-xs text-ink-400">{threads.length} fil(s) actif(s)</p>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {threads.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-ink-400">Aucune conversation pour le moment</p>
            )}
            {threads.map((t) => (
              <button
                key={t.clientId}
                onClick={() => { setActiveThread(t.clientId); setMobileList(false); }}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-cream-100 px-4 py-3.5 text-left transition",
                  activeThread === t.clientId ? "bg-terra-50" : "hover:bg-cream-50"
                )}
              >
                <Avatar name={t.clientName} color={t.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{t.clientName}</p>
                  <p className={cn("truncate text-xs", t.lastMessage.senderRole === "ADMIN" ? "text-ink-400" : "text-ink-700 font-medium")}>
                    {t.lastMessage.senderRole === "ADMIN" ? "Vous : " : ""}{t.lastMessage.content}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-ink-300">{timeAgo(t.lastMessage.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone de conversation */}
      <div className={cn(
        "flex min-h-0 flex-1 flex-col",
        variant === "admin" && mobileList && "hidden md:flex"
      )}>
        {/* En-tête */}
        <div className="flex items-center gap-3 border-b border-cream-200 px-5 py-3.5">
          {variant === "admin" && (
            <button onClick={() => setMobileList(true)} aria-label="Retour aux conversations" className="text-ink-500 md:hidden">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-100">
            <MessageSquare className="h-4.5 w-4.5 text-forest-700" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">
              {variant === "client" ? "RodLab Studio" : activeThreadData?.clientName ?? "Conversation"}
            </p>
            <p className="text-xs text-ink-400">
              {variant === "client" ? "Réponse sous 24 h ouvrées" : "Client"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin bg-cream-50/50 px-4 py-4 sm:px-6">
          {loading && messages.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-terra-500" aria-hidden="true" />
            </div>
          )}
          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="h-10 w-10 text-cream-400" aria-hidden="true" />
              <p className="mt-3 text-sm text-ink-400">
                {variant === "client" ? "Démarrez la discussion avec l'équipe RodLab." : "Sélectionnez une conversation."}
              </p>
            </div>
          )}
          {messages.map((m) => {
            const mine = m.senderId === myId;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] sm:max-w-[70%]")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      mine ? "rounded-br-md bg-terra-600 text-cream-50" : "rounded-bl-md border border-cream-200 bg-white text-ink-900"
                    )}
                  >
                    {m.content}
                  </div>
                  <p className={cn("mt-1 text-[11px] text-ink-300", mine ? "text-right" : "text-left")}>
                    {mine ? "Vous" : m.sender.name} · {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Saisie */}
        <form onSubmit={send} className="flex items-center gap-2 border-t border-cream-200 bg-card px-4 py-3.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message…"
            aria-label="Votre message"
            className="h-11 flex-1 rounded-xl border border-input bg-white px-4 text-sm outline-none transition focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Envoyer le message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-600 text-cream-50 transition hover:bg-terra-700 disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" /> : <Send className="h-[18px] w-[18px]" aria-hidden="true" />}
          </button>
        </form>
      </div>
    </div>
  );
}
