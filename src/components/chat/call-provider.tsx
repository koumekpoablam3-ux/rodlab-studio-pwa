"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";

/**
 * Appels audio / vidéo 1-à-1 (WebRTC).
 * Signalisation : sondage de l'API /api/calls/* (Vercel n'héberge pas de WebSocket).
 * Monté une seule fois dans le shell : un appel entrant sonne sur n'importe quelle page de l'espace connecté.
 */

type Kind = "AUDIO" | "VIDEO";
type Phase = "idle" | "outgoing" | "incoming" | "active";
type Peer = { name: string; avatarColor: string | null };
type Incoming = { id: string; kind: Kind; conversationId: string; caller: { name: string; avatarColor: string | null } | null };

type CallContextValue = { startCall: (conversationId: string, kind: Kind, peer: Peer) => Promise<void>; inCall: boolean };
const CallContext = createContext<CallContextValue>({ startCall: async () => {}, inCall: false });
export const useCalls = () => useContext(CallContext);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [kind, setKind] = useState<Kind>("AUDIO");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incoming, setIncoming] = useState<Incoming | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const callIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const pendingIce = useRef<RTCIceCandidateInit[]>([]);
  const outbox = useRef<{ type: string; payload: string }[]>([]);
  const iceCache = useRef<RTCIceServer[] | null>(null);
  const ringTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const disconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const setPhaseBoth = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  // ───── Sonnerie (aucun fichier audio : oscillateur Web Audio) ─────
  const stopRing = useCallback(() => {
    if (ringTimer.current) clearInterval(ringTimer.current);
    ringTimer.current = null;
  }, []);
  const startRing = useCallback(() => {
    stopRing();
    const beep = () => {
      try {
        audioCtx.current ??= new AudioContext();
        const ctx = audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
        navigator.vibrate?.([300, 150, 300]);
      } catch { /* le navigateur peut bloquer le son sans geste utilisateur */ }
    };
    beep();
    ringTimer.current = setInterval(beep, 2200);
  }, [stopRing]);

  // ───── Nettoyage complet ─────
  const cleanup = useCallback(() => {
    stopRing();
    if (disconnectTimer.current) clearTimeout(disconnectTimer.current);
    pcRef.current?.close();
    pcRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    callIdRef.current = null;
    pendingIce.current = [];
    outbox.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setIncoming(null);
    setConnected(false);
    setMuted(false);
    setCamOff(false);
    setSeconds(0);
    setPeer(null);
    setPhaseBoth("idle");
  }, [stopRing]);

  const sendSignal = useCallback(async (type: string, payload: string) => {
    const id = callIdRef.current;
    if (!id) { outbox.current.push({ type, payload }); return; }
    await post(`/api/calls/${id}`, { action: "signal", type, payload });
  }, []);

  const flushOutbox = useCallback(async () => {
    const items = outbox.current;
    outbox.current = [];
    for (const s of items) await sendSignal(s.type, s.payload);
  }, [sendSignal]);

  async function iceServers(): Promise<RTCIceServer[]> {
    if (iceCache.current) return iceCache.current;
    try {
      const res = await fetch("/api/calls/ice");
      const data = await res.json();
      iceCache.current = data.iceServers ?? [{ urls: "stun:stun.l.google.com:19302" }];
    } catch {
      iceCache.current = [{ urls: "stun:stun.l.google.com:19302" }];
    }
    return iceCache.current!;
  }

  async function openMedia(k: Kind) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: k === "VIDEO" ? { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      });
      localRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (e) {
      const name = (e as DOMException)?.name;
      toast.error(
        name === "NotAllowedError"
          ? `Autorisez ${k === "VIDEO" ? "la caméra et " : ""}le micro dans votre navigateur pour passer l'appel.`
          : `Impossible d'accéder ${k === "VIDEO" ? "à la caméra ou " : ""}au micro.`
      );
      return null;
    }
  }

  async function createPeer(stream: MediaStream) {
    const pc = new RTCPeerConnection({ iceServers: await iceServers() });
    pcRef.current = pc;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.onicecandidate = (e) => { if (e.candidate) void sendSignal("ice", JSON.stringify(e.candidate.toJSON())); };
    pc.ontrack = (e) => setRemoteStream(e.streams[0] ?? new MediaStream([e.track]));
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        if (disconnectTimer.current) clearTimeout(disconnectTimer.current);
        setConnected(true);
      } else if (pc.connectionState === "failed") {
        toast.error("Connexion impossible (réseau bloqué). Réessayez, ou configurez un serveur TURN.");
        void endCall();
      } else if (pc.connectionState === "disconnected") {
        disconnectTimer.current = setTimeout(() => { if (pcRef.current?.connectionState !== "connected") void endCall(); }, 10000);
      }
    };
    return pc;
  }

  // ───── Actions ─────
  const endCall = useCallback(async () => {
    const id = callIdRef.current;
    cleanup();
    if (id) await post(`/api/calls/${id}`, { action: "end" }).catch(() => {});
  }, [cleanup]);

  const startCall = useCallback(async (conversationId: string, k: Kind, p: Peer) => {
    if (phaseRef.current !== "idle") { toast.info("Vous êtes déjà en appel."); return; }
    if (typeof RTCPeerConnection === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Votre navigateur ne gère pas les appels.");
      return;
    }
    setKind(k); setPeer(p); setPhaseBoth("outgoing");
    const stream = await openMedia(k);
    if (!stream) { cleanup(); return; }
    try {
      const pc = await createPeer(stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      outbox.current.unshift({ type: "offer", payload: JSON.stringify(offer) });
      const res = await post("/api/calls", { conversationId, kind: k });
      if (!res.ok) { toast.error(res.data.error ?? "Impossible de lancer l'appel"); cleanup(); return; }
      callIdRef.current = res.data.call.id;
      await flushOutbox();
    } catch {
      toast.error("Impossible de lancer l'appel");
      cleanup();
    }
  }, [cleanup, flushOutbox]);

  async function acceptCall() {
    if (!incoming) return;
    const call = incoming;
    stopRing();
    setKind(call.kind);
    setPeer(call.caller ?? { name: "Appel", avatarColor: null });
    const stream = await openMedia(call.kind);
    if (!stream) { await post(`/api/calls/${call.id}`, { action: "decline" }).catch(() => {}); cleanup(); return; }
    try {
      await createPeer(stream);
      callIdRef.current = call.id;
      const res = await post(`/api/calls/${call.id}`, { action: "accept" });
      if (!res.ok) { toast.error(res.data.error ?? "L'appel est terminé."); cleanup(); return; }
      setIncoming(null);
      setPhaseBoth("active");
    } catch {
      toast.error("Impossible de répondre à l'appel");
      cleanup();
    }
  }

  async function declineCall() {
    const call = incoming;
    cleanup();
    if (call) await post(`/api/calls/${call.id}`, { action: "decline" }).catch(() => {});
  }

  async function handleSignal(s: { type: string; payload: string }) {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      if (s.type === "offer") {
        await pc.setRemoteDescription(JSON.parse(s.payload));
        for (const c of pendingIce.current.splice(0)) await pc.addIceCandidate(c).catch(() => {});
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await sendSignal("answer", JSON.stringify(answer));
      } else if (s.type === "answer") {
        if (!pc.currentRemoteDescription) await pc.setRemoteDescription(JSON.parse(s.payload));
        for (const c of pendingIce.current.splice(0)) await pc.addIceCandidate(c).catch(() => {});
      } else if (s.type === "ice") {
        const cand = JSON.parse(s.payload);
        if (pc.remoteDescription) await pc.addIceCandidate(cand).catch(() => {});
        else pendingIce.current.push(cand);
      }
    } catch (e) {
      console.error("CALL_SIGNAL_ERROR", e);
    }
  }

  // ───── Boucle de sondage (présence + appel entrant + signalisation) ─────
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    async function tick() {
      let next = document.hidden ? 8000 : 3500;
      try {
        const id = callIdRef.current;
        const res = await fetch(id ? `/api/calls/poll?callId=${id}` : "/api/calls/poll", { cache: "no-store" });
        if (res.ok && !stopped) {
          const data = await res.json();
          const p = phaseRef.current;

          if (p === "idle" || p === "incoming") {
            if (data.incoming) {
              if (p === "idle") { setIncoming(data.incoming); setPhaseBoth("incoming"); startRing(); }
            } else if (p === "incoming") {
              stopRing(); setIncoming(null); setPhaseBoth("idle");
              toast.info("Appel manqué");
            }
            if (p === "incoming") next = 1500;
          } else {
            next = 1000;
            const status: string | undefined = data.call?.status;
            if (status && ["ENDED", "DECLINED", "MISSED", "CANCELLED"].includes(status)) {
              toast.info(status === "DECLINED" ? "Appel refusé" : status === "MISSED" ? "Pas de réponse" : "Appel terminé");
              cleanup();
            } else {
              if (p === "outgoing" && status === "ACTIVE") setPhaseBoth("active");
              for (const s of data.signals ?? []) await handleSignal(s);
            }
          }
        }
      } catch { /* réseau instable : on retente au prochain tour */ }
      if (!stopped) timer = setTimeout(tick, next);
    }

    timer = setTimeout(tick, 800);
    return () => { stopped = true; clearTimeout(timer); };
  }, []);

  // Durée de l'appel
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  // Brancher les flux sur les <video>
  useEffect(() => { if (localVideo.current) localVideo.current.srcObject = localStream; }, [localStream, phase]);
  useEffect(() => { if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream; }, [remoteStream, phase]);

  // Fermer proprement si l'onglet est quitté pendant un appel
  useEffect(() => {
    const onUnload = () => {
      const id = callIdRef.current;
      if (id) navigator.sendBeacon?.(`/api/calls/${id}`, new Blob([JSON.stringify({ action: "end" })], { type: "application/json" }));
    };
    window.addEventListener("pagehide", onUnload);
    return () => window.removeEventListener("pagehide", onUnload);
  }, []);

  function toggleMic() {
    const next = !muted;
    localRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  }
  function toggleCam() {
    const next = !camOff;
    localRef.current?.getVideoTracks().forEach((t) => (t.enabled = !next));
    setCamOff(next);
  }

  const value = useMemo(() => ({ startCall, inCall: phase !== "idle" }), [startCall, phase]);
  const peerName = peer?.name ?? incoming?.caller?.name ?? "";
  const peerColor = peer?.avatarColor ?? incoming?.caller?.avatarColor ?? null;
  const statusText = phase === "outgoing" ? "Appel en cours…" : connected ? fmt(seconds) : "Connexion…";

  return (
    <CallContext.Provider value={value}>
      {children}

      {phase === "incoming" && incoming && (
        <div role="alertdialog" aria-label="Appel entrant" className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest-900/95 p-6 text-center text-cream-50 backdrop-blur-sm">
          <span className="relative mb-6 inline-flex">
            <span className="absolute inset-0 animate-ping rounded-full bg-terra-600/40" aria-hidden="true" />
            <Avatar name={peerName || "?"} color={peerColor} size="lg" className="relative h-28 w-28 text-4xl" />
          </span>
          <p className="font-display text-2xl font-semibold">{peerName}</p>
          <p className="mt-1 text-sm text-cream-200/80">Appel {incoming.kind === "VIDEO" ? "vidéo" : "audio"} entrant…</p>
          <div className="mt-10 flex gap-10">
            <button onClick={declineCall} aria-label="Refuser l'appel" className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition hover:bg-red-700">
              <PhoneOff className="h-7 w-7" />
            </button>
            <button onClick={acceptCall} aria-label="Répondre à l'appel" className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-600 shadow-lg transition hover:bg-green-700">
              {incoming.kind === "VIDEO" ? <Video className="h-7 w-7" /> : <Phone className="h-7 w-7" />}
            </button>
          </div>
        </div>
      )}

      {(phase === "outgoing" || phase === "active") && (
        <div role="dialog" aria-label="Appel en cours" className="fixed inset-0 z-[100] flex flex-col bg-forest-900 text-cream-50">
          {/* Flux distant (toujours monté : c'est lui qui joue le son) */}
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className={kind === "VIDEO" && remoteStream ? "absolute inset-0 h-full w-full object-cover" : "pointer-events-none absolute h-px w-px opacity-0"}
          />

          {(kind === "AUDIO" || !remoteStream) && (
            <div className="relative flex flex-1 flex-col items-center justify-center p-6 text-center">
              <Avatar name={peerName || "?"} color={peerColor} size="lg" className="h-28 w-28 text-4xl" />
              <p className="mt-5 font-display text-2xl font-semibold">{peerName}</p>
              <p className="mt-1 text-sm text-cream-200/80" aria-live="polite">{statusText}</p>
            </div>
          )}

          {kind === "VIDEO" && remoteStream && (
            <div className="pointer-events-none relative z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
              <p className="font-semibold">{peerName}</p>
              <p className="text-xs text-cream-100/80" aria-live="polite">{statusText}</p>
            </div>
          )}

          {kind === "VIDEO" && (
            <video
              ref={localVideo}
              autoPlay
              muted
              playsInline
              className="absolute right-4 top-4 z-20 h-40 w-28 rounded-2xl border-2 border-white/30 bg-black object-cover shadow-lg [transform:scaleX(-1)] sm:h-48 sm:w-36"
            />
          )}

          <div className="relative z-10 mt-auto flex items-center justify-center gap-5 bg-gradient-to-t from-black/60 to-transparent p-6 pb-8">
            <button onClick={toggleMic} aria-label={muted ? "Réactiver le micro" : "Couper le micro"} aria-pressed={muted}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition ${muted ? "bg-white text-forest-900" : "bg-white/15 hover:bg-white/25"}`}>
              {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            {kind === "VIDEO" && (
              <button onClick={toggleCam} aria-label={camOff ? "Activer la caméra" : "Couper la caméra"} aria-pressed={camOff}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition ${camOff ? "bg-white text-forest-900" : "bg-white/15 hover:bg-white/25"}`}>
                {camOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </button>
            )}
            <button onClick={endCall} aria-label="Raccrocher" className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition hover:bg-red-700">
              <PhoneOff className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
}
