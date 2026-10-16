"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MessageSquare, ArrowLeft, Loader2, Mic, Square, Trash2, Check, CheckCheck } from "lucide-react";
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
  type: "TEXT" | "AUDIO";
  audioDuration: number | null;
  readAt: string | null;
  createdAt: string;
  sender: { id: string; name: string; role: string; avatarColor: string | null };
};

type Thread = {
  clientId: string;
  clientName: string;
  role: Role;
  avatarColor: string | null;
  lastMessage: { content: string; type?: "TEXT" | "AUDIO"; createdAt: string; senderRole: string };
  unreadCount: number;
};

type Presence = "typing" | "recording" | null;

/** Formate une durée en secondes en m:ss (0:07, 1:23…). */
function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MessageChat({ variant, myId }: { variant: "admin" | "client"; myId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(variant === "client" ? myId : null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesThread, setMessagesThread] = useState<string | null>(variant === "client" ? myId : null);
  const [otherPresence, setOtherPresence] = useState<Presence>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileList, setMobileList] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  // Enregistrement vocal
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const presencePingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTypingPingRef = useRef(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const loading = messagesThread !== activeThread;

  const loadMessages = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/messages?clientId=${threadId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    setMessagesThread(threadId);
    setOtherPresence(data.presence ?? null);
  }, []);

  const pingPresence = useCallback(
    (state: "typing" | "recording" | "idle") => {
      if (!activeThread) return;
      fetch("/api/messages/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: activeThread, state }),
      }).catch(() => {});
    },
    [activeThread]
  );

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

  // Chargement des messages du fil actif + polling (messages ET présence de l'autre camp)
  useEffect(() => {
    if (!activeThread) return;
    (async () => {
      await loadMessages(activeThread);
    })();
    const t = setInterval(() => loadMessages(activeThread), 5000);
    return () => clearInterval(t);
  }, [activeThread, loadMessages]);

  // On quitte le fil (ou le composant) : on arrête de signaler notre propre présence
  useEffect(() => {
    return () => {
      pingPresence("idle");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherPresence]);

  function handleInputChange(value: string) {
    setInput(value);
    const now = Date.now();
    if (value.trim() && now - lastTypingPingRef.current > 2000) {
      lastTypingPingRef.current = now;
      pingPresence("typing");
    } else if (!value.trim()) {
      pingPresence("idle");
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeThread) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    pingPresence("idle");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: activeThread, content, type: "TEXT" }),
    });
    setSending(false);
    if (!res.ok) {
      setInput(content);
      return;
    }
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    setMessagesThread(activeThread);
    if (variant === "admin") {
      setThreads((prev) =>
        prev.map((t) => (t.clientId === activeThread ? { ...t, lastMessage: { content, type: "TEXT", createdAt: new Date().toISOString(), senderRole: "ADMIN" } } : t))
      );
    }
  }

  // --- Enregistrement vocal ---

  async function startRecording() {
    if (!activeThread) return;
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordSeconds(0);
      pingPresence("recording");
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
      presencePingRef.current = setInterval(() => pingPresence("recording"), 2500);
    } catch {
      setMicError("Micro inaccessible : vérifiez l'autorisation du navigateur.");
    }
  }

  function stopRecordingTimers() {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    if (presencePingRef.current) clearInterval(presencePingRef.current);
    recordTimerRef.current = null;
    presencePingRef.current = null;
  }

  function cancelRecording() {
    mediaRecorderRef.current?.stop();
    stopRecordingTimers();
    setRecording(false);
    setRecordSeconds(0);
    audioChunksRef.current = [];
    pingPresence("idle");
  }

  async function sendRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || !activeThread) return;
    const duration = recordSeconds;

    const blob: Blob = await new Promise((resolve) => {
      recorder.addEventListener(
        "stop",
        () => resolve(new Blob(audioChunksRef.current, { type: "audio/webm" })),
        { once: true }
      );
      recorder.stop();
    });
    stopRecordingTimers();
    setRecording(false);
    setRecordSeconds(0);
    pingPresence("idle");

    if (blob.size === 0 || duration < 1) return; // enregistrement trop court, on ignore

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: activeThread, content: dataUrl, type: "AUDIO", audioDuration: duration }),
    });
    setSending(false);
    if (!res.ok) {
      setMicError("Impossible d'envoyer le message vocal.");
      return;
    }
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    setMessagesThread(activeThread);
    if (variant === "admin") {
      setThreads((prev) =>
        prev.map((t) => (t.clientId === activeThread ? { ...t, lastMessage: { content: "🎤 Message vocal", type: "AUDIO", createdAt: new Date().toISOString(), senderRole: "ADMIN" } } : t))
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
                <div className="relative shrink-0">
                  <Avatar name={t.clientName} color={t.avatarColor} size="sm" />
                  {t.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-terra-600 px-1 text-[10px] font-bold text-cream-50">
                      {t.unreadCount}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{t.clientName}</p>
                  <p className={cn("truncate text-xs", t.lastMessage.senderRole === "ADMIN" ? "text-ink-400" : "text-ink-700 font-medium")}>
                    {t.lastMessage.senderRole === "ADMIN" ? "Vous : " : ""}
                    {t.lastMessage.type === "AUDIO" ? "🎤 Message vocal" : t.lastMessage.content}
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
              {otherPresence === "typing"
                ? "en train d'écrire…"
                : otherPresence === "recording"
                  ? "🎤 en train d'enregistrer un vocal…"
                  : variant === "client" ? "Réponse sous 24 h ouvrées" : "Client"}
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
                <div className="max-w-[85%] sm:max-w-[70%]">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      mine ? "rounded-br-md bg-terra-600 text-cream-50" : "rounded-bl-md border border-cream-200 bg-white text-ink-900",
                      m.type === "AUDIO" && "px-3 py-2"
                    )}
                  >
                    {m.type === "AUDIO" ? (
                      <div className="flex flex-col gap-1">
                        <span className={cn("flex items-center gap-1.5 text-[11px] font-medium", mine ? "text-cream-100/80" : "text-ink-500")}>
                          <Mic className="h-3 w-3" aria-hidden="true" /> Message vocal · {formatDuration(m.audioDuration ?? 0)}
                        </span>
                        <audio controls preload="none" src={m.content} className="h-9 w-56 max-w-full" />
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                  <p className={cn("mt-1 flex items-center gap-1 text-[11px] text-ink-300", mine ? "justify-end" : "justify-start")}>
                    {mine ? "Vous" : m.sender.name} · {formatTime(m.createdAt)}
                    {mine && (
                      m.readAt
                        ? <CheckCheck className="h-3.5 w-3.5 text-terra-500" aria-label="Lu" />
                        : <Check className="h-3.5 w-3.5 text-ink-300" aria-label="Envoyé" />
                    )}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Indicateur « en train d'écrire / d'enregistrer » de l'autre camp */}
          {otherPresence && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-cream-200 bg-white px-4 py-2.5 shadow-sm">
                {otherPresence === "recording" ? (
                  <>
                    <Mic className="h-3.5 w-3.5 animate-pulse text-terra-500" aria-hidden="true" />
                    <span className="text-xs text-ink-400">enregistre un vocal…</span>
                  </>
                ) : (
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300" />
                  </span>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {micError && (
          <p className="border-t border-cream-200 bg-terra-50 px-4 py-2 text-center text-xs text-terra-700">{micError}</p>
        )}

        {/* Saisie */}
        {recording ? (
          <div className="flex items-center gap-3 border-t border-cream-200 bg-card px-4 py-3.5">
            <button
              type="button"
              onClick={cancelRecording}
              aria-label="Annuler l'enregistrement"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cream-300 text-ink-500 transition hover:bg-cream-100"
            >
              <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-terra-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-terra-600" />
              <span className="text-sm font-medium text-terra-700">Enregistrement… {formatDuration(recordSeconds)}</span>
            </div>
            <button
              type="button"
              onClick={sendRecording}
              disabled={sending}
              aria-label="Envoyer le message vocal"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-600 text-cream-50 transition hover:bg-terra-700 disabled:opacity-40"
            >
              {sending ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" /> : <Square className="h-4 w-4" aria-hidden="true" fill="currentColor" />}
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="flex items-center gap-2 border-t border-cream-200 bg-card px-4 py-3.5">
            <input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={() => pingPresence("idle")}
              placeholder="Écrivez votre message…"
              aria-label="Votre message"
              className="h-11 flex-1 rounded-xl border border-input bg-white px-4 text-sm outline-none transition focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20"
            />
            {input.trim() ? (
              <button
                type="submit"
                disabled={sending}
                aria-label="Envoyer le message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-600 text-cream-50 transition hover:bg-terra-700 disabled:opacity-40"
              >
                {sending ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" /> : <Send className="h-[18px] w-[18px]" aria-hidden="true" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                aria-label="Enregistrer un message vocal"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-cream-50 transition hover:bg-forest-800"
              >
                <Mic className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
