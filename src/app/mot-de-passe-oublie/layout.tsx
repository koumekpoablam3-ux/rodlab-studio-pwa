// La page est un composant client : ses métadonnées (jamais indexée) sont portées par ce layout.
export const metadata = { title: "Mot de passe oublié", robots: { index: false, follow: false } };

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
