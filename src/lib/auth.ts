import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ensureDatabaseReady } from "@/lib/bootstrap";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  providers: [
    CredentialsProvider({
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Auto-réparation : crée le schéma et les comptes de démo si la base
        // est absente ou vide (installation locale incomplète). Sans effet si
        // la base est déjà prête. Une erreur ici est journalisée et renvoyée
        // comme erreur de configuration au client (et non « identifiants incorrects »).
        try {
          await ensureDatabaseReady();
        } catch (error) {
          console.error("[auth] Base de données indisponible :", error);
          throw new Error("DatabaseUnavailable");
        }

        const email = credentials.email.trim().toLowerCase();
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (!user.active) {
          throw new Error("AccountSuspended");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as "ADMIN" | "CLIENT" | "ENTREPRISE",
          companyName: user.companyName,
          avatarColor: user.avatarColor,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyName = user.companyName;
        token.avatarColor = user.avatarColor;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyName = token.companyName;
        session.user.avatarColor = token.avatarColor;
      }
      return session;
    },
  },
};
