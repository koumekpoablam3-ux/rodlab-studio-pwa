import { redirect } from "next/navigation";

// Anciens liens d'emails / notifications (« /dashboard/factures/<id> ») : on renvoie vers la liste des factures.
export default function FactureDetailRedirect() {
  redirect("/dashboard/factures");
}
