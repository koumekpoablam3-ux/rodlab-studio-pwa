import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeamManager } from "./team-manager";

export const metadata = { title: "Notre équipe" };
export const dynamic = "force-dynamic";

export default async function DashboardEquipePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ENTREPRISE") {
    redirect("/dashboard");
  }

  const members = await db.teamMember.findMany({
    where: { ownerId: session.user.id },
    orderBy: { invitedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <TeamManager members={members} />
    </div>
  );
}
