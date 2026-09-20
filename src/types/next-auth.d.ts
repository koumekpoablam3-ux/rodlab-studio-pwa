import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT" | "ENTREPRISE";
      companyName?: string | null;
      avatarColor?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "CLIENT" | "ENTREPRISE";
    companyName?: string | null;
    avatarColor?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "CLIENT" | "ENTREPRISE";
    companyName?: string | null;
    avatarColor?: string | null;
  }
}
