import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";

/**
 * Serveurs STUN/TURN pour WebRTC. STUN (Google) suffit pour la majorité des réseaux ;
 * un serveur TURN est indispensable pour les réseaux mobiles / pare-feu stricts.
 * Variables d'environnement (Vercel) : TURN_URLS (séparées par des virgules), TURN_USERNAME, TURN_CREDENTIAL.
 */
export async function GET() {
  if (!(await currentUser())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const iceServers: { urls: string | string[]; username?: string; credential?: string }[] = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
  ];
  const turn = (process.env.TURN_URLS ?? "").split(",").map((u) => u.trim()).filter(Boolean);
  if (turn.length > 0 && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    iceServers.push({ urls: turn, username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL });
  }
  return NextResponse.json({ iceServers, hasTurn: turn.length > 0 });
}
