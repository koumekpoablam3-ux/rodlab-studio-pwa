import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 bg-hero-glow px-5 py-10 sm:px-8">
      <RegisterForm />
    </div>
  );
}
