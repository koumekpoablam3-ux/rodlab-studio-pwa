import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const requestSchema = z.object({
  name: z.string().min(2, "Votre nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Choisissez un service"),
  budgetRange: z.string().optional(),
  message: z.string().min(10, "Décrivez votre besoin en quelques mots (10 caractères minimum)"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const request = await db.quoteRequest.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        phone: parsed.data.phone?.trim() || null,
        company: parsed.data.company?.trim() || null,
        serviceType: parsed.data.serviceType,
        budgetRange: parsed.data.budgetRange || null,
        message: parsed.data.message.trim(),
      },
    });

    return NextResponse.json({ id: request.id }, { status: 201 });
  } catch (error) {
    console.error("QUOTE_REQUEST_ERROR", error);
    return NextResponse.json({ error: "Impossible d'envoyer votre demande pour le moment" }, { status: 500 });
  }
}
