"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RefreshCw, Send, Sparkles, Trash2, X } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { localReply } from "@/lib/rodbot-local";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
  at?: number;
}

const STORAGE_KEY = "rodlab-chat-history";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Bonjour ! Je suis **RodBot**, l'assistant de RodLab Studio. Posez-moi vos questions sur nos services, nos tarifs, nos délais ou l'installation de l'application — je vous réponds en quelques secondes.",
};

const SUGGESTIONS = [
  "Quels sont vos tarifs pour un logo ?",
  "Combien de temps pour créer un site web ?",
  "Comment installer l'application ?",
  "Comment vous contacter à Lomé ?",
];

/** Transforme le markdown léger du bot (**gras**) et les chemins du site en liens cliquables. */
function renderRich(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*|\/(?:contact|telecharger|connexion|inscription|services|realisations|faq|a-propos)\b)/g);
  return parts.map((part, i) => {
    const sitePath = /^\/(contact|telecharger|connexion|inscription|services|realisations|faq|a-propos)$/.exec(
      part.startsWith("**") && part.endsWith("**") ? part.slice(2, -2) : part
    );
    if (sitePath) {
      return (
        <Link
          key={i}
          href={sitePath[1]}
          className="font-medium text-terra-700 underline decoration-terra-400/60 underline-offset-2 hover:text-terra-800"
        >
          {sitePath[1] === "/telecharger" ? "/télécharger" : sitePath[1]}
        </Link>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function formatTime(at?: number) {
  if (!at) return null;
  return new Date(at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedPayload, setFailedPayload] = useState<{ role: ChatRole; content: string }[] | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Montage : on ne rend le widget qu'après l'hydratation (aucun écart SSR)
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
      if (Array.isArray(saved) && saved.length > 0) {
        setMessages(saved.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-40));
      }
    } catch {
      // historique illisible : on repart d'une conversation vierge
    }
  }, []);

  // Persistance locale de la conversation
  useEffect(() => {
    if (!mounted) return;
    try {
      if (messages.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // quota / navigation privée : la conversation reste en mémoire
    }
  }, [messages, mounted]);

  // Décalage au-dessus de la bannière d'installation PWA lorsqu'elle est visible
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setBannerOpen(root.getAttribute("data-install-banner") === "open");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-install-banner"] });
    return () => observer.disconnect();
  }, []);

  // Défilement automatique vers le dernier message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  // Escape ferme le panneau
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string, isRetry = false) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed, at: Date.now() };
      let payload: { role: ChatRole; content: string }[];

      if (isRetry && failedPayload) {
        payload = failedPayload;
      } else {
        payload = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      }

      if (!isRetry) setMessages((prev) => [...prev, userMsg]);
      setBusy(true);
      setError(null);
      setFailedPayload(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload.slice(-20) }),
        });
        const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
        if (!res.ok || !data.reply) {
          throw new Error(data.error || "RodBot est momentanément indisponible. Réessayez dans un instant.");
        }
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string, at: Date.now() }]);
      } catch (err) {
        // Réseau coupé (hors-ligne) → RodBot répond localement avec les infos de l'agence
        const offline = err instanceof TypeError;
        const local = offline ? localReply(trimmed) : null;
        if (local) {
          setMessages((prev) => [...prev, { role: "assistant", content: local, at: Date.now() }]);
        } else {
          const message = err instanceof Error ? err.message : "Une erreur est survenue.";
          setError(message);
          setFailedPayload(payload);
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, failedPayload]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input;
    setInput("");
    void send(text);
  }

  function resetConversation() {
    setMessages([]);
    setError(null);
    setFailedPayload(null);
    setInput("");
  }

  if (!mounted) return null;

  const showSuggestions = messages.length === 0;

  return (
    <>
      {/* ── Panneau de conversation ─────────────────────────────────────────── */}
      <div
        aria-hidden={!open}
        className={`no-print fixed right-4 z-[60] w-[min(calc(100vw-2rem),380px)] sm:right-6 ${
          bannerOpen ? "bottom-60 sm:bottom-60" : "bottom-20 sm:bottom-24"
        } ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"} transition-all duration-300 ease-out`}
      >
        <div
          role="dialog"
          aria-label="Chat RodBot, assistant RodLab Studio"
          className="flex h-[min(64vh,540px)] flex-col overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 shadow-lift"
        >
          {/* En-tête */}
          <div className="flex items-center gap-3 bg-forest-900 px-4 py-3.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-50 shadow-sm">
              <LogoMark className="h-8 w-8 rounded-full" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-forest-900 bg-emerald-400" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-cream-50">RodBot</p>
              <p className="text-[11px] text-cream-200/90">
                {busy ? "En train d'écrire…" : "Assistant RodLab Studio · en ligne"}
              </p>
            </div>
            <button
              type="button"
              onClick={resetConversation}
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
              className="rounded-lg p-1.5 text-cream-200/80 transition hover:bg-forest-800 hover:text-cream-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="rounded-lg p-1.5 text-cream-200/80 transition hover:bg-forest-800 hover:text-cream-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cream-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
          >
            {messages.length === 0 ? (
              <ChatBubble message={WELCOME} />
            ) : (
              messages.map((m, i) => <ChatBubble key={`${m.at ?? "m"}-${i}`} message={m} />)
            )}

            {busy && <TypingIndicator />}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-relaxed text-red-700">
                <p>{error}</p>
                {failedPayload && (
                  <button
                    type="button"
                    onClick={() => void send("", true)}
                    disabled={busy}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    Réessayer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Suggestions rapides */}
          {showSuggestions && !busy && (
            <div className="flex flex-wrap gap-1.5 border-t border-cream-200 bg-cream-100/60 px-4 py-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="inline-flex items-center gap-1 rounded-full border border-forest-200 bg-white px-3 py-1.5 text-[11px] font-medium text-forest-800 transition hover:border-gold-400 hover:bg-gold-100"
                >
                  <Sparkles className="h-3 w-3 text-gold-500" aria-hidden="true" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Zone de saisie */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-cream-200 bg-white px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message…"
              aria-label="Votre message pour RodBot"
              maxLength={2000}
              autoComplete="off"
              className="h-11 min-w-0 flex-1 rounded-full border border-cream-300 bg-cream-50 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
            />
            <button
              type="submit"
              disabled={busy || input.trim().length === 0}
              aria-label="Envoyer le message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terra-600 text-cream-50 transition hover:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Bouton flottant ─────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le chat RodBot" : "Ouvrir le chat RodBot, assistant RodLab Studio"}
        aria-expanded={open}
        className={`no-print group fixed right-4 z-[61] flex h-14 items-center gap-2 rounded-full bg-forest-900 pl-4 pr-4 text-cream-50 shadow-lift transition-all duration-300 hover:bg-forest-800 sm:right-6 ${
          bannerOpen ? "bottom-44" : "bottom-4 sm:bottom-6"
        }`}
      >
        <span className="relative flex items-center justify-center">
          {open ? (
            <X className="h-5.5 w-5.5" aria-hidden="true" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 shadow-sm">
              <LogoMark className="h-7 w-7 rounded-full" />
            </span>
          )}
          {!open && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-forest-900 bg-gold-400" />
            </span>
          )}
        </span>
        <span className="hidden text-sm font-semibold lg:block">
          {open ? "Fermer" : "Besoin d'aide ?"}
        </span>
      </button>
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const time = formatTime(message.at);
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-forest-900 text-cream-50"
            : "rounded-bl-md border border-cream-200 bg-white text-ink-700 shadow-sm"
        }`}
      >
        {renderRich(message.content)}
      </div>
      {time && <span className="mt-1 px-1 text-[10px] text-ink-400">{time}</span>}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2" aria-label="RodBot est en train d'écrire">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-cream-200 bg-white px-3.5 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-600 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-600 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-600 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default ChatWidget;
