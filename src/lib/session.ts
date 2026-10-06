import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Utilisateur connecté (id + rôle) ou null. */
export async function currentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return { id: session.user.id, role: session.user.role as string, name: session.user.name ?? "" };
}
