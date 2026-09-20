import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { formatFCFA, formatDate } from "@/lib/format";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app").replace(/\/$/, "");
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

const FOREST = rgb(0.11, 0.22, 0.16);
const FOREST_DARK = rgb(0.07, 0.16, 0.12);
const GOLD = rgb(0.73, 0.55, 0.19);
const TERRA = rgb(0.74, 0.31, 0.18);
const INK = rgb(0.23, 0.21, 0.19);
const INK_LIGHT = rgb(0.55, 0.52, 0.49);
const CREAM = rgb(0.95, 0.94, 0.9);
const LINE = rgb(0.87, 0.85, 0.8);

type ClientInfo = {
  name: string;
  companyName: string | null;
  role: string;
  email: string;
  address: string | null;
  city: string | null;
  country: string | null;
};

type LineItem = { label: string; qty: number; unitPrice: number };

type DocData = {
  kind: "DEVIS" | "FACTURE";
  number: string;
  title?: string; // devis uniquement
  client: ClientInfo;
  items: LineItem[]; // pour une facture simple, un seul item reconstitué depuis amount/notes
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: string;
  statusLabel: string;
  notes: string | null;
  issueDate: Date;
  dueOrValidUntil: Date | null;
  dueOrValidLabel: string; // "Échéance" ou "Valable jusqu'au"
  paidAt?: Date | null;
  projectTitle?: string | null;
};

/** Génère le PDF (A4 portrait) d'un devis ou d'une facture RodLab Studio. */
export async function buildCommercialPdf(doc: DocData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const m = 48; // marge
  let y = height - m;

  // La police PDF standard (WinAnsi) ne sait pas encoder certains espaces
  // Unicode que Intl.NumberFormat("fr-FR") insère entre les milliers (espace
  // fine insécable U+202F) — on les remplace par un espace normal avant de
  // dessiner, sans toucher au formatage utilisé ailleurs dans l'app.
  const clean = (t: string) => t.replace(/[\u00A0\u202F\u2009\u2007]/g, " ");

  const text = (t: string, x: number, yy: number, font: PDFFont, size: number, color = INK) => {
    page.drawText(clean(t), { x, y: yy, size, font, color });
  };
  const right = (t: string, xRight: number, yy: number, font: PDFFont, size: number, color = INK) => {
    const safe = clean(t);
    const w = font.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: xRight - w, y: yy, size, font, color });
  };
  const line = (x1: number, yy: number, x2: number, color = LINE, thickness = 0.75) => {
    page.drawLine({ start: { x: x1, y: yy }, end: { x: x2, y: yy }, thickness, color });
  };

  // ---- En-tête : logo texte + coordonnées, numéro de document en vis-à-vis ----
  page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: TERRA });

  text("RodLab", m, y - 6, bold, 22, FOREST_DARK);
  text(" Studio", m + bold.widthOfTextAtSize("RodLab", 22), y - 6, bold, 22, TERRA);
  text("Bd du Mono, Tokoin — Lomé, Togo", m, y - 26, regular, 9, INK_LIGHT);
  text("+228 70 08 86 68 · contact@rodlabstudio.tg", m, y - 39, regular, 9, INK_LIGHT);
  text(SITE_HOST, m, y - 52, regular, 9, INK_LIGHT);

  const docLabel = doc.kind === "DEVIS" ? "DEVIS" : "FACTURE";
  right(docLabel, width - m, y - 6, bold, 20, FOREST_DARK);
  right(`N° ${doc.number}`, width - m, y - 26, regular, 10, INK);
  right(`Émis le ${formatDate(doc.issueDate)}`, width - m, y - 40, regular, 9, INK_LIGHT);
  if (doc.dueOrValidUntil) {
    right(`${doc.dueOrValidLabel} : ${formatDate(doc.dueOrValidUntil)}`, width - m, y - 53, regular, 9, INK_LIGHT);
  }

  y -= 90;
  line(m, y, width - m, LINE, 1);
  y -= 28;

  // ---- Bloc client ----
  text("FACTURÉ À", m, y, bold, 9, GOLD);
  y -= 16;
  const clientDisplayName = doc.client.role === "ENTREPRISE" ? doc.client.companyName || doc.client.name : doc.client.name;
  text(clientDisplayName, m, y, bold, 12, INK);
  y -= 16;
  if (doc.client.role === "ENTREPRISE" && doc.client.companyName) {
    text(doc.client.name, m, y, regular, 9.5, INK_LIGHT);
    y -= 14;
  }
  text(doc.client.email, m, y, regular, 9.5, INK_LIGHT);
  y -= 14;
  if (doc.client.address || doc.client.city) {
    text([doc.client.address, doc.client.city, doc.client.country].filter(Boolean).join(", "), m, y, regular, 9.5, INK_LIGHT);
    y -= 14;
  }

  if (doc.title) {
    y -= 6;
    text("OBJET", m, y, bold, 9, GOLD);
    y -= 16;
    text(doc.title, m, y, regular, 11, INK);
    y -= 14;
  }
  if (doc.projectTitle) {
    text(`Projet lié : ${doc.projectTitle}`, m, y, regular, 9, INK_LIGHT);
    y -= 14;
  }

  y -= 20;

  // ---- Tableau des lignes ----
  const colDesc = m;
  const colQty = width - m - 220;
  const colPrice = width - m - 140;
  const colTotal = width - m;

  page.drawRectangle({ x: m, y: y - 8, width: width - 2 * m, height: 26, color: FOREST });
  text("Description", colDesc + 10, y, bold, 9.5, rgb(1, 1, 1));
  right("Qté", colQty, y, bold, 9.5, rgb(1, 1, 1));
  right("Prix unitaire", colPrice, y, bold, 9.5, rgb(1, 1, 1));
  right("Montant", colTotal - 10, y, bold, 9.5, rgb(1, 1, 1));
  y -= 30;

  doc.items.forEach((item, i) => {
    const rowY = y;
    if (i % 2 === 1) {
      page.drawRectangle({ x: m, y: rowY - 8, width: width - 2 * m, height: 24, color: CREAM });
    }
    text(item.label, colDesc + 10, rowY, regular, 10, INK);
    right(String(item.qty), colQty, rowY, regular, 10, INK);
    right(formatFCFA(item.unitPrice), colPrice, rowY, regular, 10, INK);
    right(formatFCFA(item.qty * item.unitPrice), colTotal - 10, rowY, regular, 10, INK);
    y -= 24;
  });

  y -= 6;
  line(width - m - 220, y, width - m, LINE, 0.75);
  y -= 20;

  // ---- Totaux ----
  const totalsLabelX = width - m - 220;
  text("Sous-total", totalsLabelX, y, regular, 10, INK_LIGHT);
  right(formatFCFA(doc.subtotal), colTotal - 10, y, regular, 10, INK);
  y -= 18;
  text(`TVA (${doc.taxRate}%)`, totalsLabelX, y, regular, 10, INK_LIGHT);
  right(formatFCFA(doc.taxAmount), colTotal - 10, y, regular, 10, INK);
  y -= 22;

  page.drawRectangle({ x: totalsLabelX - 10, y: y - 10, width: width - m - (totalsLabelX - 10), height: 28, color: FOREST });
  text("TOTAL", totalsLabelX, y, bold, 11, rgb(1, 1, 1));
  right(`${formatFCFA(doc.total)}`, colTotal - 10, y, bold, 13, rgb(1, 1, 1));
  y -= 44;

  // ---- Statut ----
  const statusColor = doc.status === "PAID" || doc.status === "ACCEPTED" ? FOREST : doc.status === "OVERDUE" || doc.status === "REFUSED" ? TERRA : GOLD;
  page.drawRectangle({ x: m, y: y - 6, width: bold.widthOfTextAtSize(doc.statusLabel, 9.5) + 20, height: 20, color: statusColor });
  text(doc.statusLabel, m + 10, y, bold, 9.5, rgb(1, 1, 1));
  if (doc.paidAt) {
    text(`Payée le ${formatDate(doc.paidAt)}`, m + bold.widthOfTextAtSize(doc.statusLabel, 9.5) + 34, y, regular, 9.5, INK_LIGHT);
  }
  y -= 36;

  // ---- Notes ----
  if (doc.notes) {
    text("NOTES", m, y, bold, 9, GOLD);
    y -= 15;
    const words = doc.notes.split(/\s+/);
    let lineStr = "";
    const maxWidth = width - 2 * m;
    for (const w of words) {
      const test = lineStr ? `${lineStr} ${w}` : w;
      if (regular.widthOfTextAtSize(test, 9.5) > maxWidth) {
        text(lineStr, m, y, regular, 9.5, INK_LIGHT);
        y -= 13;
        lineStr = w;
      } else {
        lineStr = test;
      }
    }
    if (lineStr) {
      text(lineStr, m, y, regular, 9.5, INK_LIGHT);
      y -= 13;
    }
  }

  // ---- Pied de page ----
  const footerY = 54;
  line(m, footerY + 20, width - m, LINE, 0.75);
  text(
    doc.kind === "DEVIS"
      ? "Ce devis est donné à titre indicatif et engage RodLab Studio jusqu'à la date de validité indiquée ci-dessus."
      : "Facture émise par RodLab Studio — Lomé, Togo. Merci de votre confiance.",
    m,
    footerY,
    regular,
    8,
    INK_LIGHT
  );
  right(SITE_HOST, width - m, footerY, regular, 8, INK_LIGHT);

  return pdf.save();
}
