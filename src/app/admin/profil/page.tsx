import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata = { title: "Mon profil" };
export const dynamic = "force-dynamic";

export default async function AdminProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/connexion");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, role: true, phone: true, jobTitle: true,
      companyName: true, address: true, city: true, country: true, avatarColor: true, createdAt: true,
    },
  });
  if (!user) redirect("/connexion");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Mon profil</h1>
        <p className="mt-1 text-sm text-ink-500">Consultez et modifiez vos informations personnelles.</p>
      </div>
      <ProfileForm user={user} variant="admin" />
    </div>
  );
}
