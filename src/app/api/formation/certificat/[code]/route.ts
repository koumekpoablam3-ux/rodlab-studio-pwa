import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { db } from "@/lib/db";

// URL du site affichée sur le certificat — configurable via NEXT_PUBLIC_SITE_URL
// (voir .env.example). Sans protocole, pour l'affichage texte sur le PDF.
const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

/**
 * Téléchargement du certificat RodLab Academy en PDF (A4 paysage).
 * Route publique mais protégée par le code unique du certificat.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();

  const certificate = await prismaQuery(cleanCode);
  if (!certificate) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 });
  }

  const pdf = await buildCertificatePdf({
    holderName: certificate.holderName,
    courseTitle: certificate.course.title,
    score: certificate.score,
    code: certificate.code,
    issuedAt: certificate.issuedAt,
  });

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-rodlab-${certificate.code}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function prismaQuery(code: string) {
  return db.certificate.findUnique({
    where: { code },
    include: { course: { select: { title: true } } },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Génération du visuel PDF — palette RodLab (forêt / crème / or / terracotta)
// ────────────────────────────────────────────────────────────────────────────

const FOREST = rgb(0.153, 0.38, 0.267); // #276144
const FOREST_DARK = rgb(0.11, 0.29, 0.2);
const CREAM = rgb(0.98, 0.965, 0.933); // #FAF6EE
const GOLD = rgb(0.725, 0.51, 0.141); // #B98224
const TERRA = rgb(0.741, 0.31, 0.169); // #BD4F2B
const INK = rgb(0.16, 0.17, 0.16);

async function buildCertificatePdf(data: {
  holderName: string;
  courseTitle: string;
  score: number;
  code: string;
  issuedAt: Date;
}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Certificat RodLab Studio — ${data.holderName}`);
  pdf.setSubject("Certificat de réussite RodLab Academy");
  pdf.setProducer("RodLab Studio PWA");
  pdf.setCreator("RodLab Studio");

  const page = pdf.addPage([841.89, 595.28]); // A4 paysage
  const { width, height } = page.getSize();

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const center = (text: string, font: typeof regular, size: number, y: number, color = INK) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  // Fond crème
  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });

  // Cadre double : forêt épais + filet or
  const m1 = 24;
  page.drawRectangle({
    x: m1, y: m1, width: width - m1 * 2, height: height - m1 * 2,
    borderColor: FOREST, borderWidth: 3,
  });
  const m2 = 32;
  page.drawRectangle({
    x: m2, y: m2, width: width - m2 * 2, height: height - m2 * 2,
    borderColor: GOLD, borderWidth: 1,
  });

  // Bandeau supérieur forêt
  page.drawRectangle({
    x: m2, y: height - m2 - 64, width: width - m2 * 2, height: 64, color: FOREST,
  });

  // Logo RodLab (à gauche du bandeau, hors du texte centré)
  try {
    const logoBytes = await readFile(path.join(process.cwd(), "public", "icons", "logo-mark.png"));
    const logo = await pdf.embedPng(logoBytes);
    const lw = 48, lh = 48;
    page.drawImage(logo, {
      x: m2 + 26, y: height - m2 - 60, width: lw, height: lh,
    });
  } catch {
    // logo absent : le certificat reste valide sans image
  }

  // En-tête dans le bandeau
  center("RODLAB STUDIO · ACADEMY", bold, 13, height - m2 - 18, rgb(0.96, 0.94, 0.87));
  center("Lomé — Togo · " + SITE_HOST, regular, 9, height - m2 - 33, rgb(0.85, 0.9, 0.85));

  // Titre principal
  center("CERTIFICAT DE RÉUSSITE", bold, 34, height - 150, FOREST_DARK);
  page.drawRectangle({
    x: width / 2 - 60, y: height - 166, width: 120, height: 2.5, color: GOLD,
  });

  // « Délivré à »
  center("Le présent certificat est délivré avec fierté à", regular, 12, height - 190, INK);

  // Nom de l'apprenant
  const nameSize = data.holderName.length > 28 ? 30 : 38;
  center(data.holderName, bold, nameSize, height - 232, TERRA);

  // Corps
  center("pour avoir suivi avec succès l'intégralité de la formation", regular, 13, height - 272, INK);
  center(`« ${data.courseTitle} »`, bold, 16, height - 298, FOREST_DARK);

  // Détails
  const dateStr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(data.issuedAt);
  center(
    `Examen final : ${data.score} % de bonnes réponses  ·  Émis le ${dateStr}`,
    regular, 11.5, height - 336, INK
  );

  // Encadré vérification
  const boxW = 430, boxH = 46;
  page.drawRectangle({
    x: (width - boxW) / 2, y: 118, width: boxW, height: boxH,
    color: rgb(0.96, 0.93, 0.86), borderColor: GOLD, borderWidth: 1,
  });
  center("CODE DE VÉRIFICATION", bold, 9.5, 148, GOLD);
  center(data.code, bold, 15, 128, FOREST_DARK);
  center("Authenticité vérifiable en ligne : " + SITE_HOST + "/certificats/" + data.code, italic, 9, 102, INK);

  // Signature
  center("K.A.S. Rodrigue", italic, 14, 62, FOREST_DARK);
  page.drawRectangle({ x: width / 2 - 90, y: 56, width: 180, height: 1, color: FOREST });
  center("Fondateur & Directeur créatif — RodLab Studio", regular, 9.5, 42, INK);

  return pdf;
}
