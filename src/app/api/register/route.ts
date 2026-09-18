import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { AVATAR_COLORS } from "@/lib/roles";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["CLIENT", "ENTREPRISE"]),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email, password, role, phone, companyName, jobTitle } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    if (role === "ENTREPRISE" && !companyName?.trim()) {
      return NextResponse.json(
        { error: "Le nom de l'entreprise est requis pour un compte entreprise" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]!;

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        phone: phone?.trim() || null,
        companyName: role === "ENTREPRISE" ? companyName!.trim() : null,
        jobTitle: jobTitle?.trim() || null,
        avatarColor,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 });
  }
}
