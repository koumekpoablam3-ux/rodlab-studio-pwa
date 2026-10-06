import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-form";

export const metadata = { title: "Nouveau mot de passe" };

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-cream-200" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
