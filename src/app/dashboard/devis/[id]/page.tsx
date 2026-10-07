import { redirect } from "next/navigation";

// Anciens liens d'emails / notifications (« /dashboard/devis/<id> ») : on renvoie vers la liste des devis.
export default function DevisDetailRedirect() {
  redirect("/dashboard/devis");
}
