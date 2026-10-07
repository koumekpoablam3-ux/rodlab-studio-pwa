import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

/**
 * Données de démonstration livrées avec le projet (voir src/lib/demo-seed.ts).
 * Seuls ces comptes et ces demandes précis sont supprimés — jamais les comptes
 * administrateur ni le compte connecté.
 */
const DEMO_CLIENT_EMAILS = [
  "kossi@chezkossi.tg",
  "ayaba@adjale-boutique.tg",
  "contact@hotelpalma.tg",
  "comptabilite@hotelpalma.tg",
];
const DEMO_REQUEST_EMAILS = [
  "adjoa.sowu@glambeauty.tg",
  "etienne@transportsexpress.tg",
  "fafa.nyante@gmail.com",
  "yao.mensah@agroterroir.tg",
  "contact@fespol2026.tg",
];

export async function POST() {
  const guard = await requireAdmin("director");
  if (!guard.ok) return guard.response;
  const session = { user: guard.user };

  try {
    // Les projets, devis, factures, messages, inscriptions et collaborateurs rattachés
    // à ces comptes sont supprimés en cascade par la base de données.
    const [users, requests] = await db.$transaction([
      db.user.deleteMany({
        where: { email: { in: DEMO_CLIENT_EMAILS }, role: { not: "ADMIN" }, id: { not: session.user.id } },
      }),
      db.quoteRequest.deleteMany({ where: { email: { in: DEMO_REQUEST_EMAILS } } }),
    ]);
    // Conversations laissées sans aucun membre par la suppression des comptes de démo
    await db.conversation.deleteMany({ where: { members: { none: {} } } }).catch(() => {});
    await db.callParticipant.deleteMany({ where: { userId: { notIn: (await db.user.findMany({ select: { id: true } })).map((u) => u.id) } } }).catch(() => {});
    return NextResponse.json({ ok: true, users: users.count, requests: requests.count });
  } catch (error) {
    console.error("DEMO_CLEANUP_ERROR", error);
    return NextResponse.json({ error: "Impossible de supprimer les données de démonstration" }, { status: 500 });
  }
}
