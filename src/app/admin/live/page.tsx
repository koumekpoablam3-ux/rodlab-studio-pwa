import type { Metadata } from "next";
import { Video } from "lucide-react";
import { db } from "@/lib/db";
import { LiveManager } from "@/components/academy/live-manager";

export const metadata: Metadata = { title: "Sessions live — Administration RodLab" };
export const dynamic = "force-dynamic";

export default async function AdminLivePage() {
  const sessions = await db.liveSession.findMany({
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra-100 text-terra-600">
          <Video className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-terra-600">RodLab Live</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900">Sessions de formation à distance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            Créez vos masterclass et ateliers, communiquez les liens Zoom / Meet / StreamYard, et suivez les
            inscriptions — y compris les apprenants hors du Togo.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <LiveManager
          sessions={sessions.map((s) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            summary: s.summary,
            platform: s.platform,
            joinUrl: s.joinUrl,
            startsAt: s.startsAt.toISOString(),
            durationMin: s.durationMin,
            capacity: s.capacity,
            status: s.status,
            registrations: s._count.registrations,
          }))}
        />
      </div>
    </div>
  );
}
