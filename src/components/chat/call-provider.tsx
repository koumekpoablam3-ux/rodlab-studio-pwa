"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic, MicOff, MonitorOff, MonitorUp, Phone, PhoneOff, Search, UserPlus, Video, VideoOff, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/brand";
import { cn } from "@/lib/utils";

/**
 * Appels audio / vidéo de 2 à 6 personnes (WebRTC en maillage : chacun envoie son flux à chacun).
 *  • Partage d'écran : le flux caméra est remplacé à la volée par l'écran (sans renégocier).
 *  • Ajout de personnes en cours d'appel : elles reçoivent une invitation qui sonne comme un appel.
 * Signalisation : sondage de /api/calls/* (Vercel n'héberge pas de WebSocket).
 * Monté une seule fois dans le shell : un appel entrant sonne sur n'importe quelle page de l'espace connecté.
 */

type Kind = "AUDIO" | "VIDEO";
type Phase = "idle" | "incoming" | "outgoing" | "active";
type PeerInfo = { name: string; avatarColor: string | null; avatarUrl?: string | null };
type Participant = { userId: string; name: string; avatarColor: string | null; avatarUrl?: string | null; status: string; joinedAt: string | null };
type Meta = { sharing: boolean; muted: boolean; camOff: boolean };
type Incoming = { id: string; kind: Kind; conversationId: string; joined: number; caller: PeerInfo | null };
type DirUser = { id: string; name: string; subtitle: string; avatarColor: string | null; avatarUrl?: string | null; online: boolean };
type PeerState = { pc: RTCPeerConnection; stream: MediaStream; pending: RTCIceCandidateInit[]; videoSender: RTCRtpSender | null; connected: boolean };

type CallContextValue = { startCall: (conversationId: string, kind: Kind, peer: PeerInfo) => Promise<void>; inCall: boolean };
const CallContext = createContext<CallContextValue>({ startCall: async () => {}, inCall: false });
export const useCalls = () => useContext(CallContext);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const ENDED = ["ENDED", "DECLINED", "MISSED", "CANCELLED"];

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Une tuile : la vidéo (ou l'écran partagé) du participant, sinon son avatar. Le <video> reste monté : c'est lui qui joue le son. */
function Tile({
  stream, name, color, photo, showVideo, contain, muted, ringing, badge, className,
}: {
  stream: MediaStream | null; name: string; color: string | null; photo?: string | null; showVideo: boolean; contain?: boolean;
  muted?: boolean; ringing?: boolean; badge?: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (ref.current) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-forest-800", className)}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={cn("absolute inset-0 h-full w-full bg-black", contain ? "object-contain" : "object-cover", showVideo ? "opacity-100" : "opacity-0", muted && !contain && "[transform:scaleX(-1)]")}
      />
      {!showVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center">
          <Avatar name={name || "?"} color={color} src={photo} size="lg" className="h-20 w-20 text-2xl sm:h-28 sm:w-28 sm:text-3xl" />
          {ringing && <span className="text-xs text-cream-200/80">Appel en cours…</span>}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 left-2 flex max-w-[85%] items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
        <span className="truncate">{name}</span>
        {badge}
      </div>
    </div>
  );
}

export function CallProvider({ myId, children }: { myId: string; children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [kind, setKind] = useState<Kind>("AUDIO");
  const [incoming, setIncoming] = useState<Incoming | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [metas, setMetas] = useState<Record<string, Meta>>({});
  const [, setVersion] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [canShare, setCanShare] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [dir, setDir] = useState<DirUser[]>([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirSearch, setDirSearch] = useState("");
  const [inviting, setInviting] = useState<string | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const callIdRef = useRef<string | null>(null);
  const peersRef = useRef(new Map<string, PeerState>());
  const creatingRef = useRef(new Map<string, Promise<PeerState>>());
  const localRef = useRef<MediaStream | null>(null);
  const screenRef = useRef<MediaStream | null>(null);
  const participantsRef = useRef<Participant[]>([]);
  const mutedRef = useRef(false);
  const camOffRef = useRef(true);
  const sharingRef = useRef(false);
  const outbox = useRef<{ to: string; type: string; payload: string }[]>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iceCache = useRef<RTCIceServer[] | null>(null);
  const ringTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const autoAnswerId = useRef<string | null>(null);

  const setPhaseBoth = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const bump = () => setVersion((v) => v + 1);

  useEffect(() => { setCanShare(typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getDisplayMedia === "function"); }, []);

  // ───── Sonnerie (deux tons, sans fichier audio) ─────
  const stopRing = useCallback(() => {
    if (ringTimer.current) clearInterval(ringTimer.current);
    ringTimer.current = null;
  }, []);
  const startRing = useCallback(() => {
    stopRing();
    const burst = (ctx: AudioContext, at: number) => {
      for (const freq of [440, 480]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.18, at + 0.04);
        gain.gain.setValueAtTime(0.18, at + 0.38);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.44);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.5);
      }
    };
    const beep = () => {
      try {
        audioCtx.current ??= new AudioContext();
        const ctx = audioCtx.current;
        void ctx.resume();
        burst(ctx, ctx.currentTime);
        burst(ctx, ctx.currentTime + 0.6);
        navigator.vibrate?.([400, 200, 400]);
      } catch { /* son bloqué sans geste de l'utilisateur */ }
    };
    beep();
    ringTimer.current = setInterval(beep, 3000);
  }, [stopRing]);

  // ───── Signalisation sortante (envoyée par lots toutes les 250 ms) ─────
  const flush = useCallback(async () => {
    flushTimer.current = null;
    const id = callIdRef.current;
    if (!id || outbox.current.length === 0) return;
    const items = outbox.current.splice(0, 60);
    await post(`/api/calls/${id}`, { action: "signal", items }).catch(() => {});
    if (outbox.current.length > 0) flushTimer.current = setTimeout(flush, 250);
  }, []);
  const queueSignal = useCallback((to: string, type: string, payload: string) => {
    outbox.current.push({ to, type, payload });
    if (!flushTimer.current) flushTimer.current = setTimeout(flush, 250);
  }, [flush]);

  const myMeta = (): string => JSON.stringify({ sharing: sharingRef.current, muted: mutedRef.current, camOff: camOffRef.current && !sharingRef.current } satisfies Meta);
  const broadcastMeta = () => { for (const id of peersRef.current.keys()) queueSignal(id, "meta", myMeta()); };

  // ───── Nettoyage complet ─────
  const cleanup = useCallback(() => {
    stopRing();
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = null;
    for (const p of peersRef.current.values()) p.pc.close();
    peersRef.current.clear();
    creatingRef.current.clear();
    localRef.current?.getTracks().forEach((t) => t.stop());
    screenRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    screenRef.current = null;
    callIdRef.current = null;
    outbox.current = [];
    participantsRef.current = [];
    mutedRef.current = false; camOffRef.current = true; sharingRef.current = false;
    setIncoming(null); setParticipants([]); setMetas({});
    setMuted(false); setCamOff(true); setSharing(false); setSeconds(0);
    setShowInvite(false); setDirSearch("");
    setPhaseBoth("idle");
  }, [stopRing]);

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
      camOffRef.current = k !== "VIDEO";
      setCamOff(k !== "VIDEO");
      return stream;
    } catch (e) {
      const name = (e as DOMException)?.name;
      toast.error(
        name === "NotAllowedError"
          ? `Autorisez ${k === "VIDEO" ? "la caméra et " : ""}le micro dans votre navigateur pour rejoindre l'appel.`
          : `Impossible d'accéder ${k === "VIDEO" ? "à la caméra ou " : ""}au micro.`
      );
      return null;
    }
  }

  /** Ce que j'envoie comme vidéo : l'écran partagé, sinon la caméra, sinon rien. */
  const outgoingVideoTrack = (): MediaStreamTrack | null =>
    screenRef.current?.getVideoTracks()[0] ?? localRef.current?.getVideoTracks()[0] ?? null;

  const closePeer = useCallback((userId: string) => {
    const peer = peersRef.current.get(userId);
    if (!peer) return;
    peer.pc.close();
    peersRef.current.delete(userId);
    bump();
  }, []);

  /** Crée la connexion vers un participant. `initiator` = c'est moi qui envoie l'offre (le dernier arrivé). */
  const ensurePeer = useCallback(async (userId: string, initiator: boolean): Promise<PeerState> => {
    const existing = peersRef.current.get(userId);
    if (existing) return existing;
    const inFlight = creatingRef.current.get(userId);
    if (inFlight) return inFlight;

    const creation = (async () => {
      const pc = new RTCPeerConnection({ iceServers: await iceServers() });
      const stream = new MediaStream();
      const local = localRef.current!;
      const state: PeerState = { pc, stream, pending: [], videoSender: null, connected: false };

      // Un émetteur audio + un émetteur vidéo TOUJOURS présents : partager l'écran ou allumer la caméra
      // plus tard se fait par simple remplacement de piste, sans renégocier la connexion.
      // Seul celui qui envoie l'offre crée ses émetteurs d'avance. Celui qui répond DOIT réutiliser ceux
      // créés par l'offre reçue (voir handleSignal) : sinon il ne renvoie rien et l'autre ne le voit/entend pas.
      if (initiator) {
        const audioTrack = local.getAudioTracks()[0];
        pc.addTransceiver(audioTrack ?? "audio", { direction: "sendrecv", streams: [local] });
        const videoTrack = outgoingVideoTrack();
        state.videoSender = pc.addTransceiver(videoTrack ?? "video", { direction: "sendrecv", streams: [local] }).sender;
      }

      pc.onicecandidate = (e) => { if (e.candidate) queueSignal(userId, "ice", JSON.stringify(e.candidate.toJSON())); };
      pc.ontrack = (e) => {
        if (!stream.getTracks().includes(e.track)) stream.addTrack(e.track);
        e.track.onmute = bump;
        e.track.onunmute = bump;
        bump();
      };
      let dropTimer: ReturnType<typeof setTimeout> | null = null;
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          if (dropTimer) clearTimeout(dropTimer);
          state.connected = true;
          bump();
        } else if (pc.connectionState === "failed") {
          const who = participantsRef.current.find((p) => p.userId === userId)?.name ?? "ce participant";
          toast.error(`Connexion impossible avec ${who} (réseau bloqué). Un serveur TURN est nécessaire sur ce réseau.`);
          closePeer(userId);
        } else if (pc.connectionState === "disconnected") {
          dropTimer = setTimeout(() => { if (pc.connectionState !== "connected") closePeer(userId); }, 10000);
        }
      };

      peersRef.current.set(userId, state);
      queueSignal(userId, "meta", myMeta());
      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        queueSignal(userId, "offer", JSON.stringify(offer));
      }
      return state;
    })().finally(() => creatingRef.current.delete(userId));

    creatingRef.current.set(userId, creation);
    return creation;
  }, [closePeer, queueSignal]);

  async function handleSignal(s: { fromId: string; type: string; payload: string }) {
    if (s.type === "meta") {
      try { const m = JSON.parse(s.payload) as Meta; setMetas((prev) => ({ ...prev, [s.fromId]: m })); } catch { /* ignoré */ }
      return;
    }
    try {
      const peer = await ensurePeer(s.fromId, false);
      const pc = peer.pc;
      const flushPending = async () => { for (const c of peer.pending.splice(0)) await pc.addIceCandidate(c).catch(() => {}); };
      if (s.type === "offer") {
        if (pc.signalingState !== "stable") return;
        await pc.setRemoteDescription(JSON.parse(s.payload));
        // On répond en envoyant NOS flux : on branche micro et caméra sur les émetteurs créés par l'offre.
        const local = localRef.current;
        for (const t of pc.getTransceivers()) {
          const trackKind = t.receiver.track.kind;
          (t.sender as unknown as { setStreams?: (...streams: MediaStream[]) => void }).setStreams?.(...(local ? [local] : []));
          t.direction = "sendrecv";
          if (trackKind === "audio") {
            const audio = local?.getAudioTracks()[0];
            if (audio) await t.sender.replaceTrack(audio).catch(() => {});
          } else if (trackKind === "video") {
            peer.videoSender = t.sender;
            await t.sender.replaceTrack(outgoingVideoTrack()).catch(() => {});
          }
        }
        await flushPending();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        queueSignal(s.fromId, "answer", JSON.stringify(answer));
      } else if (s.type === "answer") {
        if (pc.signalingState === "have-local-offer") { await pc.setRemoteDescription(JSON.parse(s.payload)); await flushPending(); }
      } else if (s.type === "ice") {
        const cand = JSON.parse(s.payload) as RTCIceCandidateInit;
        if (pc.remoteDescription) await pc.addIceCandidate(cand).catch(() => {});
        else peer.pending.push(cand);
      }
    } catch (e) {
      console.error("CALL_SIGNAL_ERROR", e);
    }
  }

  /** Aligne les connexions sur la liste officielle des participants. Le dernier arrivé envoie l'offre. */
  const reconcile = useCallback((list: Participant[]) => {
    const me = list.find((p) => p.userId === myId);
    const joined = list.filter((p) => p.userId !== myId && p.status === "JOINED");

    if (me?.status === "JOINED" && me.joinedAt) {
      for (const p of joined) {
        if (peersRef.current.has(p.userId) || creatingRef.current.has(p.userId) || !p.joinedAt) continue;
        const mine = new Date(me.joinedAt).getTime();
        const theirs = new Date(p.joinedAt).getTime();
        if (mine > theirs || (mine === theirs && myId > p.userId)) void ensurePeer(p.userId, true);
      }
    }
    // Quelqu'un est parti : on referme sa connexion
    for (const id of Array.from(peersRef.current.keys())) {
      const entry = list.find((p) => p.userId === id);
      if (entry && entry.status !== "JOINED") {
        toast.info(`${entry.name} a quitté l'appel`);
        closePeer(id);
      }
    }
    if (phaseRef.current === "outgoing" && joined.length > 0) setPhaseBoth("active");
  }, [myId, ensurePeer, closePeer]);

  // ───── Actions ─────
  const endCall = useCallback(async () => {
    const id = callIdRef.current;
    cleanup();
    if (id) await post(`/api/calls/${id}`, { action: "end" }).catch(() => {});
  }, [cleanup]);

  const startCall = useCallback(async (conversationId: string, k: Kind, p: PeerInfo) => {
    if (phaseRef.current !== "idle") { toast.info("Vous êtes déjà en appel."); return; }
    if (typeof RTCPeerConnection === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Votre navigateur ne gère pas les appels.");
      return;
    }
    setKind(k);
    setParticipants([{ userId: "pending", name: p.name, avatarColor: p.avatarColor, avatarUrl: p.avatarUrl, status: "INVITED", joinedAt: null }]);
    setPhaseBoth("outgoing");
    const stream = await openMedia(k);
    if (!stream) { cleanup(); return; }
    const res = await post("/api/calls", { conversationId, kind: k });
    if (!res.ok) { toast.error(res.data.error ?? "Impossible de lancer l'appel"); cleanup(); return; }
    callIdRef.current = res.data.call.id;
  }, [cleanup]);

  async function acceptCall(callArg?: Incoming) {
    const call = callArg ?? incoming;
    if (!call) return;
    stopRing();
    setKind(call.kind);
    const stream = await openMedia(call.kind);
    if (!stream) { await post(`/api/calls/${call.id}`, { action: "decline" }).catch(() => {}); cleanup(); return; }
    callIdRef.current = call.id;
    const res = await post(`/api/calls/${call.id}`, { action: "accept" });
    if (!res.ok) { toast.error(res.data.error ?? "L'appel est terminé."); cleanup(); return; }
    setIncoming(null);
    setPhaseBoth("active");
  }

  async function declineCall() {
    const call = incoming;
    cleanup();
    if (call) await post(`/api/calls/${call.id}`, { action: "decline" }).catch(() => {});
  }

  function toggleMic() {
    const next = !mutedRef.current;
    mutedRef.current = next;
    localRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
    broadcastMeta();
  }

  async function toggleCam() {
    const local = localRef.current;
    if (!local) return;
    let cam = local.getVideoTracks()[0];
    if (!cam) {
      // Appel audio : on allume la caméra pour la première fois
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } });
        cam = s.getVideoTracks()[0];
        local.addTrack(cam);
      } catch {
        toast.error("Impossible d'accéder à la caméra.");
        return;
      }
      camOffRef.current = false;
      setCamOff(false);
      if (!screenRef.current) for (const p of peersRef.current.values()) await p.videoSender?.replaceTrack(cam);
    } else {
      const next = !camOffRef.current;
      cam.enabled = !next;
      camOffRef.current = next;
      setCamOff(next);
    }
    broadcastMeta();
    bump();
  }

  async function stopShare() {
    screenRef.current?.getTracks().forEach((t) => t.stop());
    screenRef.current = null;
    sharingRef.current = false;
    setSharing(false);
    const cam = localRef.current?.getVideoTracks()[0] ?? null;
    for (const p of peersRef.current.values()) await p.videoSender?.replaceTrack(cam).catch(() => {});
    broadcastMeta();
    bump();
  }

  async function toggleShare() {
    if (sharingRef.current) { await stopShare(); return; }
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const track = display.getVideoTracks()[0];
      track.onended = () => { void stopShare(); }; // bouton « Arrêter le partage » du navigateur
      screenRef.current = display;
      sharingRef.current = true;
      setSharing(true);
      for (const p of peersRef.current.values()) await p.videoSender?.replaceTrack(track).catch(() => {});
      broadcastMeta();
      bump();
    } catch (e) {
      if ((e as DOMException)?.name !== "NotAllowedError") toast.error("Impossible de partager l'écran.");
    }
  }

  async function openInvite() {
    setShowInvite(true);
    setDirLoading(true);
    try {
      const res = await fetch("/api/conversations/directory", { cache: "no-store" });
      if (res.ok) setDir((await res.json()).users);
    } finally {
      setDirLoading(false);
    }
  }

  async function invite(user: DirUser) {
    const id = callIdRef.current;
    if (!id) return;
    setInviting(user.id);
    const res = await post(`/api/calls/${id}`, { action: "invite", userId: user.id });
    setInviting(null);
    if (!res.ok) { toast.error(res.data.error ?? "Invitation impossible"); return; }
    toast.success(`${user.name} est invité(e) à rejoindre l'appel`);
    setShowInvite(false);
  }

  // ───── Boucle de sondage (présence + invitation + participants + signalisation) ─────
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    async function tick() {
      let next = document.hidden ? 4000 : 3500;
      try {
        const id = callIdRef.current;
        const res = await fetch(id ? `/api/calls/poll?callId=${id}` : "/api/calls/poll", { cache: "no-store" });
        if (res.ok && !stopped) {
          const data = await res.json();
          const p = phaseRef.current;

          if (p === "idle" || p === "incoming") {
            if (data.incoming) {
              if (p === "idle") {
                if (autoAnswerId.current === data.incoming.id) {
                  autoAnswerId.current = null; // ouvert depuis « Répondre » dans la notification
                  setPhaseBoth("incoming");
                  void acceptCall(data.incoming);
                } else {
                  setIncoming(data.incoming); setPhaseBoth("incoming"); startRing();
                }
              }
            } else if (p === "incoming") {
              stopRing(); setIncoming(null); setPhaseBoth("idle");
              toast.info("Appel manqué");
            }
            if (p === "incoming") next = 1500;
          } else {
            next = 1000;
            const call = data.call;
            if (call) {
              if (ENDED.includes(call.status) || call.myStatus !== "JOINED") {
                toast.info(call.status === "DECLINED" ? "Appel refusé" : call.status === "MISSED" ? "Pas de réponse" : "Appel terminé");
                cleanup();
              } else {
                participantsRef.current = data.participants;
                setParticipants(data.participants);
                for (const s of data.signals ?? []) await handleSignal(s);
                reconcile(data.participants);
              }
            }
          }
        }
      } catch { /* réseau instable : on retente au prochain tour */ }
      if (!stopped) timer = setTimeout(tick, next);
    }

    timer = setTimeout(tick, 800);
    return () => { stopped = true; clearTimeout(timer); };
  }, []);

  // « Répondre » depuis la notification : mémoriser l'appel à décrocher puis nettoyer l'URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("answer");
    if (id) {
      autoAnswerId.current = id;
      url.searchParams.delete("answer");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, []);

  // Fermer proprement si l'onglet est quitté pendant un appel
  useEffect(() => {
    const onUnload = () => {
      const id = callIdRef.current;
      if (id) navigator.sendBeacon?.(`/api/calls/${id}`, new Blob([JSON.stringify({ action: "end" })], { type: "application/json" }));
    };
    window.addEventListener("pagehide", onUnload);
    return () => window.removeEventListener("pagehide", onUnload);
  }, []);

  // ───── Rendu ─────
  const anyConnected = Array.from(peersRef.current.values()).some((p) => p.connected);
  useEffect(() => {
    if (!anyConnected) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [anyConnected]);

  const value = useMemo(() => ({ startCall, inCall: phase !== "idle" }), [startCall, phase]);

  const remotes = participants.filter((p) => p.userId !== myId && (p.status === "JOINED" || p.status === "INVITED"));
  const remoteSharer = remotes.find((p) => metas[p.userId]?.sharing)?.userId ?? null;
  const spotlight = sharing ? "me" : remoteSharer;
  const immersive = !spotlight && remotes.length <= 1;
  const hasLocalVideo = sharing || (!camOff && !!localRef.current?.getVideoTracks()[0]);
  const localStream = sharing ? screenRef.current : localRef.current;

  const remoteTile = (p: Participant, className: string, contain = false) => {
    const peer = peersRef.current.get(p.userId);
    const meta = metas[p.userId];
    const live = !!peer?.stream.getVideoTracks().some((t) => t.readyState === "live" && !t.muted);
    const showVideo = live && (!!meta?.sharing || !meta?.camOff);
    return (
      <Tile
        key={p.userId}
        className={className}
        stream={peer?.stream ?? null}
        name={p.name}
        color={p.avatarColor}
        photo={p.avatarUrl}
        showVideo={showVideo}
        contain={contain && !!meta?.sharing}
        ringing={p.status === "INVITED"}
        badge={<>{meta?.sharing && <MonitorUp className="h-3 w-3" aria-label="partage son écran" />}{meta?.muted && <MicOff className="h-3 w-3 text-red-300" aria-label="micro coupé" />}</>}
      />
    );
  };
  const localTile = (className: string, contain = false) => (
    <Tile
      key="me"
      className={className}
      stream={localStream}
      name={sharing ? "Votre écran" : "Vous"}
      color={null}
      showVideo={hasLocalVideo}
      contain={contain && sharing}
      muted
      badge={muted ? <MicOff className="h-3 w-3 text-red-300" aria-label="micro coupé" /> : undefined}
    />
  );

  const names = remotes.map((p) => p.name).join(", ");
  const status = phase === "outgoing" || !anyConnected ? (remotes.some((r) => r.status === "JOINED") ? "Connexion…" : "Appel en cours…") : fmt(seconds);
  const dirFiltered = dir.filter(
    (u) => !participants.some((p) => p.userId === u.id && (p.status === "JOINED" || p.status === "INVITED")) &&
      (!dirSearch || u.name.toLowerCase().includes(dirSearch.toLowerCase()))
  );

  const ctrl = "flex h-12 w-12 items-center justify-center rounded-full transition sm:h-14 sm:w-14";

  return (
    <CallContext.Provider value={value}>
      {children}

      {phase === "incoming" && incoming && (
        <div role="alertdialog" aria-label="Appel entrant" className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest-900/95 p-6 text-center text-cream-50 backdrop-blur-sm">
          <span className="relative mb-6 inline-flex">
            <span className="absolute inset-0 animate-ping rounded-full bg-terra-600/40" aria-hidden="true" />
            <Avatar name={incoming.caller?.name || "?"} color={incoming.caller?.avatarColor ?? null} src={incoming.caller?.avatarUrl} size="lg" className="relative h-28 w-28 text-4xl" />
          </span>
          <p className="font-display text-2xl font-semibold">{incoming.caller?.name}</p>
          <p className="mt-1 text-sm text-cream-200/80">
            {incoming.joined > 1 ? `Vous invite à un appel ${incoming.kind === "VIDEO" ? "vidéo" : "audio"} (${incoming.joined} personnes)` : `Appel ${incoming.kind === "VIDEO" ? "vidéo" : "audio"} entrant…`}
          </p>
          <div className="mt-10 flex gap-10">
            <button onClick={declineCall} aria-label="Refuser l'appel" className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition hover:bg-red-700"><PhoneOff className="h-7 w-7" /></button>
            <button onClick={() => acceptCall()} aria-label="Répondre à l'appel" className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-600 shadow-lg transition hover:bg-green-700">
              {incoming.kind === "VIDEO" ? <Video className="h-7 w-7" /> : <Phone className="h-7 w-7" />}
            </button>
          </div>
        </div>
      )}

      {(phase === "outgoing" || phase === "active") && (
        <div role="dialog" aria-label="Appel en cours" className="fixed inset-0 z-[100] overflow-hidden bg-forest-900 text-cream-50">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{names || "Appel"}</p>
              <p className="text-xs text-cream-100/80" aria-live="polite">{status}{remotes.length > 1 ? ` · ${remotes.filter((r) => r.status === "JOINED").length + 1} participants` : ""}</p>
            </div>
            {sharing && <span className="rounded-full bg-terra-600 px-3 py-1 text-xs font-semibold">Vous partagez votre écran</span>}
          </div>

          <div className={cn("absolute inset-0", immersive ? "" : "px-2 pb-28 pt-16 sm:px-4")}>
            {spotlight ? (
              <div className="flex h-full flex-col gap-2">
                <div className="min-h-0 flex-1">
                  {spotlight === "me" ? localTile("h-full w-full", true) : remoteTile(remotes.find((p) => p.userId === spotlight)!, "h-full w-full", true)}
                </div>
                <div className="flex h-24 shrink-0 gap-2 overflow-x-auto sm:h-28">
                  {remotes.filter((p) => p.userId !== spotlight).map((p) => remoteTile(p, "h-full w-36 shrink-0 sm:w-44"))}
                  {spotlight !== "me" && localTile("h-full w-36 shrink-0 sm:w-44")}
                </div>
              </div>
            ) : remotes.length <= 1 ? (
              <div className="relative h-full">
                {remotes[0] ? remoteTile(remotes[0], "h-full w-full rounded-none") : <div className="h-full" />}
                {hasLocalVideo && localTile("absolute bottom-28 right-3 z-20 h-36 w-28 border-2 border-white/30 shadow-lg sm:h-44 sm:w-36")}
              </div>
            ) : (
              <div className={cn("grid h-full auto-rows-fr gap-2", remotes.length + 1 <= 4 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3")}>
                {remotes.map((p) => remoteTile(p, "h-full w-full"))}
                {localTile("h-full w-full")}
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pb-6 sm:gap-5">
            <button onClick={toggleMic} aria-label={muted ? "Réactiver le micro" : "Couper le micro"} aria-pressed={muted} className={cn(ctrl, muted ? "bg-white text-forest-900" : "bg-white/15 hover:bg-white/25")}>
              {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <button onClick={toggleCam} aria-label={camOff ? "Activer la caméra" : "Couper la caméra"} aria-pressed={camOff} className={cn(ctrl, camOff ? "bg-white text-forest-900" : "bg-white/15 hover:bg-white/25")}>
              {camOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </button>
            {canShare && (
              <button onClick={toggleShare} aria-label={sharing ? "Arrêter le partage d'écran" : "Partager mon écran"} aria-pressed={sharing} className={cn(ctrl, sharing ? "bg-terra-600" : "bg-white/15 hover:bg-white/25")}>
                {sharing ? <MonitorOff className="h-6 w-6" /> : <MonitorUp className="h-6 w-6" />}
              </button>
            )}
            <button onClick={openInvite} aria-label="Ajouter une personne à l'appel" className={cn(ctrl, "bg-white/15 hover:bg-white/25")}><UserPlus className="h-6 w-6" /></button>
            <button onClick={endCall} aria-label="Raccrocher" className={cn(ctrl, "h-14 w-14 bg-red-600 shadow-lg hover:bg-red-700 sm:h-16 sm:w-16")}><PhoneOff className="h-7 w-7" /></button>
          </div>

          {showInvite && (
            <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={() => setShowInvite(false)}>
              <div role="dialog" aria-label="Ajouter une personne" onClick={(e) => e.stopPropagation()} className="flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl bg-white p-4 text-ink-900 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Ajouter à l&apos;appel</h2>
                  <button onClick={() => setShowInvite(false)} aria-label="Fermer" className="rounded-full p-1.5 text-ink-500 hover:bg-cream-100"><X className="h-5 w-5" /></button>
                </div>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input value={dirSearch} onChange={(e) => setDirSearch(e.target.value)} placeholder="Rechercher une personne…" aria-label="Rechercher" className="h-10 w-full rounded-full border border-cream-300 bg-cream-50 pl-9 pr-3 text-sm outline-none focus:border-terra-600" />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {dirLoading ? (
                    <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin text-ink-400" aria-hidden="true" /></div>
                  ) : dirFiltered.length === 0 ? (
                    <p className="p-6 text-center text-sm text-ink-500">Personne à ajouter.</p>
                  ) : (
                    <ul>
                      {dirFiltered.map((u) => (
                        <li key={u.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-cream-50">
                          <span className="relative inline-flex shrink-0">
                            <Avatar name={u.name} color={u.avatarColor} src={u.avatarUrl} size="md" />
                            <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white", u.online ? "bg-green-500" : "bg-ink-300")} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{u.name}</span>
                            <span className={cn("block text-xs", u.online ? "text-green-600" : "text-ink-400")}>{u.online ? "En ligne" : "Hors ligne"} · {u.subtitle}</span>
                          </span>
                          <button onClick={() => invite(u)} disabled={inviting === u.id} className="shrink-0 rounded-full bg-forest-900 px-4 py-1.5 text-xs font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60">
                            {inviting === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Inviter"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="mt-3 text-xs text-ink-400">Jusqu&apos;à 6 personnes. Au-delà de 4, la vidéo peut ralentir selon les connexions.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </CallContext.Provider>
  );
}
