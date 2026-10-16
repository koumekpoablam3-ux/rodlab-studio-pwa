import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ACADEMY_COURSES, ACADEMY_QUIZ, quizSeedForCourse } from "./academy";

/**
 * RODLAB STUDIO — Données de démonstration réalistes
 * Comptes créés (mot de passe : demo1234) :
 *   Admin      : admin@rodlabstudio.tg
 *   Client     : kossi@chezkossi.tg
 *   Entreprise : contact@hotelpalma.tg
 *
 * Source unique utilisée :
 *   - par l'auto-réparation au démarrage (src/lib/bootstrap.ts)
 *   - par le script de re-seed en ligne de commande (scripts/seed.ts → scripts/seed.js)
 */

const d = (daysFromNow: number) => new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
const m = (monthOffset: number, day = 5, hour = 10) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + monthOffset, day, hour, 30);
};

export async function seedDemoData(db: PrismaClient) {
  console.log("[seed] Nettoyage de la base…");
  await db.notification.deleteMany();
  await db.pushSubscription.deleteMany();
  await db.teamMember.deleteMany();
  await db.message.deleteMany();
  await db.lessonProgress.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.certificate.deleteMany();
  await db.enrollment.deleteMany();
  await db.liveRegistration.deleteMany();
  await db.liveSession.deleteMany();
  await db.quizQuestion.deleteMany();
  await db.quiz.deleteMany();
  await db.courseModule.deleteMany();
  await db.course.deleteMany();
  await db.projectTask.deleteMany();
  await db.invoice.deleteMany();
  await db.quote.deleteMany();
  await db.project.deleteMany();
  await db.quoteRequest.deleteMany();
  await db.siteContent.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 12);

  console.log("[seed] Création des comptes…");
  const admin = await db.user.create({
    data: {
      name: "Awa Kodjo",
      email: "admin@rodlabstudio.tg",
      passwordHash,
      role: "ADMIN",
      jobTitle: "Directrice de production",
      phone: "+228 70 08 86 68",
      city: "Lomé",
      avatarColor: "#276144",
    },
  });

  await db.user.create({
    data: {
      name: "K.A.S. Rodrigue",
      email: "directeur@rodlabstudio.tg",
      passwordHash,
      role: "ADMIN",
      jobTitle: "Fondateur & Directeur créatif",
      phone: "+228 96 32 79 92",
      city: "Lomé",
      avatarColor: "#bd4f2b",
    },
  });

  const kossi = await db.user.create({
    data: {
      name: "Kossi Amégan",
      email: "kossi@chezkossi.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Restaurateur",
      phone: "+228 90 11 22 33",
      address: "Bd du 13 Janvier, Tokoin",
      city: "Lomé",
      country: "Togo",
      avatarColor: "#b98224",
    },
  });

  const ayaba = await db.user.create({
    data: {
      name: "Ayaba Tetteh",
      email: "ayaba@adjale-boutique.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Fondatrice",
      phone: "+228 91 45 67 89",
      city: "Lomé",
      country: "Togo",
      avatarColor: "#1b6fa8",
    },
  });

  const palma = await db.user.create({
    data: {
      name: "Sévérin Lawson",
      email: "contact@hotelpalma.tg",
      passwordHash,
      role: "ENTREPRISE",
      jobTitle: "Directeur général",
      companyName: "Hôtel Palma Lomé",
      phone: "+228 22 21 45 67",
      address: "Route d'Aného, Agbalépédogan",
      city: "Lomé",
      country: "Togo",
      avatarColor: "#7c3aed",
    },
  });

  // Membre d'équipe rattaché au compte entreprise
  const comptable = await db.user.create({
    data: {
      name: "Ekoué Badji",
      email: "comptabilite@hotelpalma.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Responsable comptable",
      companyName: "Hôtel Palma Lomé",
      city: "Lomé",
      avatarColor: "#be185d",
    },
  });

  console.log("[seed] Équipe de l'entreprise…");
  await db.teamMember.createMany({
    data: [
      {
        ownerId: palma.id,
        userId: comptable.id,
        name: "Ekoué Badji",
        email: "comptabilite@hotelpalma.tg",
        phone: "+228 90 88 77 66",
        position: "Responsable comptable",
        status: "ACTIVE",
        joinedAt: m(-4, 12),
      },
      {
        ownerId: palma.id,
        name: "Mireille Dossou",
        email: "mireille.dossou@hotelpalma.tg",
        position: "Responsable marketing",
        status: "INVITED",
      },
      {
        ownerId: palma.id,
        name: "Tchala Bodjona",
        email: "tchala.bodjona@hotelpalma.tg",
        phone: "+228 93 22 44 66",
        position: "Chef réception",
        status: "SUSPENDED",
      },
    ],
  });

  console.log("[seed] Projets…");
  const pPalmaWeb = await db.project.create({
    data: {
      title: "Site web & moteur de réservation",
      description:
        "Conception et développement du nouveau site de l'hôtel avec moteur de réservation intégré, paiement Mobile Money et version trilingue (français, anglais, éwé).",
      serviceType: "developpement-numerique",
      status: "IN_PROGRESS",
      progress: 65,
      budget: 2800000,
      clientId: palma.id,
      startDate: m(-3, 2),
      deadline: d(21),
    },
  });
  const pPalmaIdentite = await db.project.create({
    data: {
      title: "Refonte de l'identité visuelle",
      description:
        "Modernisation du logo, création de la charte graphique complète et déclinaisons sur tous les supports de l'hôtel : signalétique, papeterie, uniformes et menus.",
      serviceType: "design-graphique",
      status: "REVIEW",
      progress: 90,
      budget: 950000,
      clientId: palma.id,
      startDate: m(-4, 10),
      deadline: d(7),
    },
  });
  const pKossiMenu = await db.project.create({
    data: {
      title: "Menu digital & QR code",
      description:
        "Création d'un menu digital consultable par QR code, avec photos des plats, prix mis à jour en temps réel et version anglaise pour la clientèle touristique.",
      serviceType: "design-graphique",
      status: "DELIVERED",
      progress: 100,
      budget: 450000,
      clientId: kossi.id,
      startDate: m(-6, 8),
      deadline: m(-5, 8),
      deliveredAt: m(-5, 6),
    },
  });
  const pKossiSocial = await db.project.create({
    data: {
      title: "Campagne réseaux sociaux — 3 mois",
      description:
        "Gestion éditoriale et visuelle des pages Facebook et Instagram du restaurant : 12 publications mensuelles, visuels saisonniers et reporting mensuel.",
      serviceType: "community-management",
      status: "IN_PROGRESS",
      progress: 40,
      budget: 900000,
      clientId: kossi.id,
      startDate: m(-1, 15),
      deadline: d(45),
    },
  });
  const pAdjaleEcom = await db.project.create({
    data: {
      title: "Boutique e-commerce Adjalé",
      description:
        "Développement d'une boutique en ligne de pagnes et accessoires : catalogue 120 références, paiement T-Money/Visa, livraison Lomé & régions, espace administrateur.",
      serviceType: "developpement-numerique",
      status: "IN_PROGRESS",
      progress: 55,
      budget: 1650000,
      clientId: ayaba.id,
      startDate: m(-2, 20),
      deadline: d(30),
    },
  });
  const pAdjaleFormation = await db.project.create({
    data: {
      title: "Formation community management",
      description:
        "Formation intensive de 2 semaines pour l'équipe de la boutique : stratégie de contenu, prise de vue produit, publicités Meta et service client en ligne.",
      serviceType: "formation",
      status: "PENDING",
      progress: 0,
      budget: 250000,
      clientId: ayaba.id,
      deadline: d(60),
    },
  });
  const pKodjoLogo = await db.project.create({
    data: {
      title: "Logo & charte clinique dentaire",
      description:
        "Identité visuelle complète pour la clinique : logo, carte de visite, ordonnances en-tête et façade lumineuse.",
      serviceType: "design-graphique",
      status: "DELIVERED",
      progress: 100,
      budget: 600000,
      clientId: kossi.id,
      startDate: m(-8, 3),
      deadline: m(-7, 3),
      deliveredAt: m(-7, 1),
    },
  });

  console.log("[seed] Tâches des projets…");
  await db.projectTask.createMany({
    data: [
      { projectId: pPalmaWeb.id, title: "Wireframes & maquettes validées", done: true, order: 1 },
      { projectId: pPalmaWeb.id, title: "Intégration front-end", done: true, order: 2 },
      { projectId: pPalmaWeb.id, title: "Moteur de réservation", done: true, order: 3 },
      { projectId: pPalmaWeb.id, title: "Paiement Mobile Money", done: false, order: 4 },
      { projectId: pPalmaWeb.id, title: "Recette & mise en ligne", done: false, order: 5 },
      { projectId: pPalmaIdentite.id, title: "Recherche créative", done: true, order: 1 },
      { projectId: pPalmaIdentite.id, title: "Logo finalisé", done: true, order: 2 },
      { projectId: pPalmaIdentite.id, title: "Charte graphique", done: true, order: 3 },
      { projectId: pPalmaIdentite.id, title: "Validation direction", done: false, order: 4 },
      { projectId: pAdjaleEcom.id, title: "Catalogue importé", done: true, order: 1 },
      { projectId: pAdjaleEcom.id, title: "Paiement T-Money", done: true, order: 2 },
      { projectId: pAdjaleEcom.id, title: "Module livraison", done: false, order: 3 },
      { projectId: pAdjaleEcom.id, title: "Tests utilisateurs", done: false, order: 4 },
      { projectId: pKossiSocial.id, title: "Mois 1 — publications livrées", done: true, order: 1 },
      { projectId: pKossiSocial.id, title: "Mois 2 — publications livrées", done: false, order: 2 },
    ],
  });

  console.log("[seed] Devis…");
  const items = (rows: [string, number, number][]) =>
    JSON.stringify(rows.map(([label, qty, unitPrice]) => ({ label, qty, unitPrice })));

  const qPalmaResa = await db.quote.create({
    data: {
      number: "DV-2026-001",
      title: "Site web & moteur de réservation",
      clientId: palma.id,
      projectId: pPalmaWeb.id,
      items: items([
        ["Design UX/UI (10 écrans)", 1, 450000],
        ["Développement front + back", 1, 1850000],
        ["Moteur de réservation", 1, 400000],
        ["Formation des équipes", 1, 100000],
      ]),
      subtotal: 2800000,
      taxRate: 18,
      taxAmount: 504000,
      total: 3304000,
      status: "ACCEPTED",
      validUntil: m(-3, 1),
      decidedAt: m(-3, 2),
      createdAt: m(-4, 1),
    },
  });
  const qKossiMenu = await db.quote.create({
    data: {
      number: "DV-2026-002",
      title: "Menu digital & QR code",
      clientId: kossi.id,
      projectId: pKossiMenu.id,
      items: items([
        ["Design du menu digital", 1, 250000],
        ["Shooting photo des plats (20 plats)", 1, 150000],
        ["Mise en place QR code", 1, 50000],
      ]),
      subtotal: 450000,
      taxRate: 18,
      taxAmount: 81000,
      total: 531000,
      status: "ACCEPTED",
      validUntil: m(-6, 1),
      decidedAt: m(-6, 7),
      createdAt: m(-6, 2),
    },
  });
  const qAdjaleEcom = await db.quote.create({
    data: {
      number: "DV-2026-003",
      title: "Boutique e-commerce Adjalé",
      clientId: ayaba.id,
      projectId: pAdjaleEcom.id,
      items: items([
        ["Boutique en ligne (120 références)", 1, 1200000],
        ["Paiement mobile & carte", 1, 250000],
        ["Module livraison", 1, 200000],
      ]),
      subtotal: 1650000,
      taxRate: 18,
      taxAmount: 297000,
      total: 1947000,
      status: "ACCEPTED",
      validUntil: m(-2, 15),
      decidedAt: m(-2, 18),
      createdAt: m(-2, 12),
    },
  });
  await db.quote.create({
    data: {
      number: "DV-2026-004",
      title: "Formation community management",
      clientId: ayaba.id,
      projectId: pAdjaleFormation.id,
      items: items([
        ["Formation 2 semaines (5 personnes)", 1, 200000],
        ["Support de cours & exercices", 1, 50000],
      ]),
      subtotal: 250000,
      taxRate: 18,
      taxAmount: 45000,
      total: 295000,
      status: "SENT",
      validUntil: d(12),
      createdAt: m(0, 2),
    },
  });
  const qKossiSocial = await db.quote.create({
    data: {
      number: "DV-2026-005",
      title: "Campagne réseaux sociaux — 3 mois",
      clientId: kossi.id,
      projectId: pKossiSocial.id,
      items: items([
        ["Package mensuel (12 posts + stories)", 3, 250000],
        ["Reporting mensuel", 3, 50000],
      ]),
      subtotal: 900000,
      taxRate: 18,
      taxAmount: 162000,
      total: 1062000,
      status: "ACCEPTED",
      validUntil: m(-1, 10),
      decidedAt: m(-1, 13),
      createdAt: m(-1, 8),
    },
  });
  await db.quote.create({
    data: {
      number: "DV-2026-006",
      title: "Application fidélité Chez Kossi",
      clientId: kossi.id,
      items: items([
        ["Application mobile fidélité", 1, 1600000],
        ["Backend & tableau de bord", 1, 900000],
      ]),
      subtotal: 2500000,
      taxRate: 18,
      taxAmount: 450000,
      total: 2950000,
      status: "SENT",
      validUntil: d(20),
      createdAt: m(0, 8),
    },
  });

  console.log("[seed] Factures…");
  const inv = (
    number: string,
    clientId: string,
    projectId: string | null,
    quoteId: string | null,
    amount: number,
    status: string,
    issue: Date,
    due: Date | null,
    paid: Date | null,
    method: string | null
  ) =>
    db.invoice.create({
      data: {
        number,
        clientId,
        projectId,
        quoteId,
        amount,
        taxRate: 18,
        taxAmount: Math.round(amount * 0.18),
        total: amount + Math.round(amount * 0.18),
        status,
        issueDate: issue,
        dueDate: due,
        paidAt: paid,
        method,
      },
    });

  await inv("FA-2026-001", palma.id, pPalmaWeb.id, qPalmaResa.id, 933000, "PAID", m(-3, 3), m(-3, 18), m(-3, 15), "Virement bancaire");
  await inv("FA-2026-002", palma.id, pPalmaWeb.id, null, 1188000, "PAID", m(-2, 5), m(-2, 20), m(-2, 19), "Virement bancaire");
  await inv("FA-2026-003", kossi.id, pKossiMenu.id, qKossiMenu.id, 531000, "PAID", m(-5, 10), m(-5, 25), m(-5, 22), "Mobile Money");
  await inv("FA-2026-004", ayaba.id, pAdjaleEcom.id, qAdjaleEcom.id, 973500, "PAID", m(-2, 20), m(-1, 5), m(-1, 4), "Mobile Money");
  await inv("FA-2026-005", ayaba.id, pAdjaleEcom.id, null, 486750, "SENT", m(0, 1), d(14), null, null);
  await inv("FA-2026-006", kossi.id, pKossiSocial.id, qKossiSocial.id, 354000, "PAID", m(-1, 15), m(0, 1), m(0, 1), "Espèces");
  await inv("FA-2026-007", palma.id, pPalmaIdentite.id, null, 285000, "OVERDUE", m(-1, 20), m(0, 4), null, null);

  console.log("[seed] Messagerie…");
  await db.message.createMany({
    data: [
      {
        threadId: palma.id,
        senderId: palma.id,
        senderRole: "ENTREPRISE",
        content: "Bonjour, est-ce que le module de paiement Mobile Money sera prêt avant la mise en ligne ? Nous avons beaucoup de demandes de réservation en ce moment.",
        createdAt: m(0, 9, 9),
      },
      {
        threadId: palma.id,
        senderId: admin.id,
        senderRole: "ADMIN",
        content: "Bonjour M. Lawson ! Oui, le connecteur T-Money et Flooz est en cours de test en environnement de production simulée. Vous pourrez le valider dès la semaine prochaine lors de la recette.",
        createdAt: m(0, 9, 11),
      },
      {
        threadId: palma.id,
        senderId: palma.id,
        senderRole: "ENTREPRISE",
        content: "Parfait, merci pour la réactivité. Ma comptable suivra également la validation des factures depuis son espace.",
        createdAt: m(0, 9, 12),
      },
      {
        threadId: kossi.id,
        senderId: kossi.id,
        senderRole: "CLIENT",
        content: "Bonjour, j'ai bien reçu le devis pour l'application de fidélité. Est-ce qu'on peut étaler le paiement sur 3 fois ?",
        createdAt: m(0, 10, 10),
      },
      {
        threadId: kossi.id,
        senderId: admin.id,
        senderRole: "ADMIN",
        content: "Bonjour Kossi ! Bien sûr, c'est possible : 40 % au démarrage, 30 % à la livraison de la version de test et 30 % à la mise en ligne. Je mets à jour le devis aujourd'hui.",
        createdAt: m(0, 10, 14),
      },
      {
        threadId: ayaba.id,
        senderId: ayaba.id,
        senderRole: "CLIENT",
        content: "La boutique avance très bien ! Serait-il possible d'ajouter une page « Lookbook » pour présenter les nouveautés en photos ?",
        createdAt: m(0, 11, 16),
      },
    ],
  });

  console.log("[seed] Demandes de devis…");
  await db.quoteRequest.createMany({
    data: [
      {
        name: "Adjoa Sowu",
        email: "adjoa.sowu@glambeauty.tg",
        phone: "+228 92 55 66 77",
        company: "Glam Beauty Institute",
        serviceType: "design-graphique",
        budgetRange: "250 000 – 500 000 FCFA",
        message:
          "Bonjour, nous ouvrons un institut de beauté à Kara et nous aurions besoin d'un logo complet, de cartes de visite et d'affiches pour notre lancement prévu dans deux mois.",
        status: "NEW",
        createdAt: m(0, 12),
      },
      {
        name: "Étienne Gbedemah",
        email: "etienne@transportsexpress.tg",
        phone: "+228 90 34 56 78",
        company: "Transports Express Togo",
        serviceType: "developpement-numerique",
        budgetRange: "1 000 000 – 3 000 000 FCFA",
        message:
          "Nous cherchons à digitaliser le suivi de nos livraisons : une application où les clients peuvent suivre leurs colis en temps réel et payer en mobile money.",
        status: "IN_REVIEW",
        notes: "Potentiel intéressant — proposer un MVP en 2 phases. RDV visio à planifier.",
        createdAt: m(0, 10),
      },
      {
        name: "Fafa Nyante",
        email: "fafa.nyante@gmail.com",
        phone: "+228 91 78 90 12",
        serviceType: "formation",
        budgetRange: "Moins de 250 000 FCFA",
        message:
          "Étudiante en marketing, je souhaite suivre la formation en design graphique à temps partiel. Quelles sont les prochaines dates de session et les modalités de paiement ?",
        status: "NEW",
        createdAt: m(0, 13),
      },
      {
        name: "Yao Mensah",
        email: "yao.mensah@agroterroir.tg",
        phone: "+228 90 23 45 67",
        company: "Agro Terroir",
        serviceType: "design-graphique",
        budgetRange: "500 000 – 1 000 000 FCFA",
        message: "Refonte de nos étiquettes de produits alimentaires pour l'export régional.",
        status: "CONVERTED",
        convertedUserId: kossi.id,
        convertedProjectId: pKossiMenu.id,
        handledAt: m(-5, 7),
        createdAt: m(-5, 5),
      },
      {
        name: "Comité d'organisation FESPOL",
        email: "contact@fespol2026.tg",
        serviceType: "design-graphique",
        budgetRange: "250 000 – 500 000 FCFA",
        message: "Demande d'affiche officielle et de kakémonos pour le festival du policiers 2026.",
        status: "ARCHIVED",
        notes: "Budget annulé — reporté à 2027.",
        handledAt: m(-4, 2),
        createdAt: m(-4, 1),
      },
    ],
  });

  console.log("[seed] Contenu du site…");
  await db.siteContent.createMany({
    data: [
      { key: "hero.title", section: "hero", label: "Titre principal de l'accueil", value: "Votre vision, notre expertise.", type: "TEXT" },
      { key: "hero.subtitle", section: "hero", label: "Sous-titre de l'accueil", value: "Agence de design graphique, développement numérique et formation professionnelle à Lomé. Nous transformons vos idées en expériences digitales mémorables.", type: "TEXT" },
      { key: "stats.projects", section: "stats", label: "Statistique — projets livrés", value: "120", type: "NUMBER" },
      { key: "stats.clients", section: "stats", label: "Statistique — clients satisfaits", value: "65", type: "NUMBER" },
      { key: "stats.years", section: "stats", label: "Statistique — années d'expérience", value: "8", type: "NUMBER" },
      { key: "stats.learners", section: "stats", label: "Statistique — apprenants formés", value: "200", type: "NUMBER" },
      { key: "contact.phone", section: "contact", label: "Téléphone affiché sur le site", value: "+228 70 08 86 68", type: "TEXT" },
      { key: "contact.email", section: "contact", label: "Email affiché sur le site", value: "contact@rodlabstudio.tg", type: "TEXT" },
      { key: "contact.address", section: "contact", label: "Adresse affichée sur le site", value: "Bd du Mono, Tokoin — Lomé, Togo", type: "TEXT" },
      { key: "cta.title", section: "cta", label: "Titre de l'appel à l'action", value: "Un projet en tête ? Parlons-en.", type: "TEXT" },
      { key: "cta.text", section: "cta", label: "Texte de l'appel à l'action", value: "Décrivez-nous votre besoin en 2 minutes : nous revenons vers vous sous 24 h avec une première proposition.", type: "TEXT" },
    ],
  });

  console.log("[seed] RodLab Academy — catalogue de 6 cours, modules, leçons et quiz…");
  type SeededCourse = {
    id: string;
    slug: string;
    lessonIds: Map<string, string>;
    quizId: string | null;
  };
  const seededCourses = new Map<string, SeededCourse>();
  for (const courseSeed of ACADEMY_COURSES) {
    const course = await db.course.create({
      data: {
        slug: courseSeed.slug,
        title: courseSeed.title,
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        level: courseSeed.level,
        durationHours: courseSeed.durationHours,
        skills: JSON.stringify(courseSeed.skills),
        published: true,
      },
    });

    const lessonIds = new Map<string, string>(); // "moduleOrder-lessonOrder" → id
    for (const mod of courseSeed.modules) {
      const createdModule = await db.courseModule.create({
        data: {
          courseId: course.id,
          order: mod.order,
          title: mod.title,
          summary: mod.summary,
          minutes: mod.minutes,
          lessons: {
            create: mod.lessons.map((les) => ({
              order: les.order,
              title: les.title,
              minutes: les.minutes,
              content: les.content,
            })),
          },
        },
        include: { lessons: true },
      });
      for (const les of createdModule.lessons) {
        lessonIds.set(`${mod.order}-${les.order}`, les.id);
      }
    }

    const quizSeed = quizSeedForCourse(courseSeed.slug);
    let quizId: string | null = null;
    if (quizSeed) {
      const quiz = await db.quiz.create({
        data: {
          courseId: course.id,
          title: quizSeed.title,
          passScore: quizSeed.passScore,
          questions: {
            create: quizSeed.questions.map((q, i) => ({
              order: i + 1,
              prompt: q.prompt,
              options: JSON.stringify(q.options),
              answer: q.answer,
              explanation: q.explanation,
            })),
          },
        },
      });
      quizId = quiz.id;
    }
    seededCourses.set(courseSeed.slug, { id: course.id, slug: course.slug, lessonIds, quizId });
  }

  console.log("[seed] Academy — parcours de démonstration…");
  const webCourse = seededCourses.get("site-web-professionnel")!;

  // Ayaba : parcours complet du cours vedette + certificat (démo de vérification publique)
  const enrAyaba = await db.enrollment.create({
    data: { userId: ayaba.id, courseId: webCourse.id, status: "COMPLETED", startedAt: d(-25), completedAt: d(-12) },
  });
  const allLessons = Array.from(webCourse.lessonIds.values());
  await db.lessonProgress.createMany({
    data: allLessons.map((lessonId, i) => ({
      userId: ayaba.id,
      lessonId,
      completedAt: d(-25 + Math.floor((i * 13) / allLessons.length)),
    })),
  });
  await db.quizAttempt.create({
    data: {
      userId: ayaba.id,
      quizId: webCourse.quizId!,
      enrollmentId: enrAyaba.id,
      answers: "{}",
      score: 88,
      correct: 21,
      total: ACADEMY_QUIZ.questions.length,
      passed: true,
      createdAt: d(-12),
    },
  });
  await db.certificate.create({
    data: {
      code: "RODLAB-WEB-A7K2MQ",
      userId: ayaba.id,
      courseId: webCourse.id,
      enrollmentId: enrAyaba.id,
      score: 88,
      holderName: ayaba.name,
      issuedAt: d(-12),
    },
  });

  // Kossi : a entamé la formation vedette (module 1 terminé, leçon 1 du module 2)
  await db.enrollment.create({
    data: { userId: kossi.id, courseId: webCourse.id, status: "ACTIVE", startedAt: d(-6) },
  });
  const kossiDone = ["1-1", "1-2", "1-3", "2-1"];
  await db.lessonProgress.createMany({
    data: kossiDone
      .map((key, i) => ({ userId: kossi.id, lessonId: webCourse.lessonIds.get(key)!, completedAt: d(-6 + i) }))
      .filter((p) => Boolean(p.lessonId)),
  });

  // Kossi : vient de commencer « Community management » (2 leçons faites)
  const communityCourse = seededCourses.get("community-management");
  if (communityCourse) {
    await db.enrollment.create({
      data: { userId: kossi.id, courseId: communityCourse.id, status: "ACTIVE", startedAt: d(-3) },
    });
    const kossiCommunityDone = ["1-1", "1-2"];
    await db.lessonProgress.createMany({
      data: kossiCommunityDone
        .map((key, i) => ({ userId: kossi.id, lessonId: communityCourse.lessonIds.get(key)!, completedAt: d(-3 + i) }))
        .filter((p) => Boolean(p.lessonId)),
    });
  }

  // Palma : vient de s'inscrire au cours « Design graphique »
  const designCourse = seededCourses.get("design-graphique-pro");
  if (designCourse) {
    await db.enrollment.create({
      data: { userId: palma.id, courseId: designCourse.id, status: "ACTIVE", startedAt: d(-2) },
    });
  }

  console.log("[seed] RodLab Live — sessions de formation à distance…");
  await db.liveSession.createMany({
    data: [
      {
        slug: "masterclass-7-erreurs-site-web",
        title: "Masterclass gratuite : les 7 erreurs qui font fuir vos visiteurs",
        summary:
          "En 90 minutes, décortiquons les défauts qui coûtent des clients aux sites togolais et africains — et les correctifs concrets à appliquer dès ce soir.",
        description:
          "Design surchargé, textes illisibles, site lent sur 3G, absence de bouton d'action : ces erreurs sont partout, et elles coûtent cher. Cette masterclass passe en revue sept défauts observés sur de vrais sites de la sous-région, avec avant/après à l'appui.\n\nVous repartez avec une grille de contrôle de 20 points à appliquer immédiatement sur votre site ou celui de vos clients.\n\n- Public : entrepreneurs, créateurs de sites, responsables communication\n- Niveau requis : aucun — la masterclass est ouverte à tous\n- Un lien d'accès Zoom est envoyé après inscription, 24 h avant la session\n- Replay envoyé aux inscrits qui ne peuvent pas être présents",
        platform: "ZOOM",
        joinUrl: "https://zoom.us/j/rodlab-demo-masterclass",
        startsAt: d(3),
        durationMin: 90,
        status: "SCHEDULED",
        capacity: 300,
      },
      {
        slug: "atelier-landing-page-90-minutes",
        title: "Atelier live : construisez votre landing page en 90 minutes",
        summary:
          "Atelier pratique à 50 places : HTML, CSS et une méthode rodée pour publier une page d'atterrissage qui convertit — de la maquette à la mise en ligne.",
        description:
          "Un atelier où l'on code ensemble, caméra coupée ou non. Objectif : chacun repart avec sa landing page publiée sur une URL gratuite.\n\nAu programme : structure de la page qui convertit (titre, promesse, preuves, formulaire), intégration HTML/CSS guidée pas à pas, adaptation mobile, mise en ligne sur Netlify.\n\n- Prérequis : suivre les modules 3 et 4 de la formation avant l'atelier\n- Places limitées à 50 pour pouvoir répondre à tout le monde\n- Apportez vos textes et votre logo : le reste est fourni\n- Google Meet, lien envoyé après inscription",
        platform: "MEET",
        joinUrl: "https://meet.google.com/rodlab-atelier-demo",
        startsAt: d(10),
        durationMin: 120,
        status: "SCHEDULED",
        capacity: 50,
      },
      {
        slug: "qa-vivre-du-web-afrique-ouest",
        title: "Session Q&A : vivre du web en Afrique de l'Ouest",
        summary:
          "K.A.S. Rodrigue, fondateur de RodLab Studio, répond en direct à vos questions : tarifs, clients difficiles, paiements à l'international, organisation du travail.",
        description:
          "Une session sans sujet imposé : vos questions, des réponses franches, issues de huit années d'agence à Lomé.\n\nExemples de questions traitées lors des précédentes éditions : comment se faire payer par un client à l'étranger ? Combien facturer son premier site ? Faut-il se spécialiser ? Comment gérer un client qui ne valide jamais ?\n\n- Diffusé en direct sur YouTube et StreamYard\n- Posez vos questions à l'avance après inscription ou en direct dans le chat\n- Idéal aussi pour les apprenants hors Togo : horaires pensés pour l'Europe et l'Amérique du Nord",
        platform: "STREAMYARD",
        joinUrl: "https://streamyard.com/rodlab-qa-demo",
        startsAt: d(17),
        durationMin: 60,
        status: "SCHEDULED",
        capacity: 500,
      },
      {
        slug: "lancement-rodlab-academy",
        title: "Lancement de RodLab Academy : la méthode RodLab expliquée",
        summary:
          "La session inaugurale : pourquoi RodLab ouvre sa formation, comment fonctionne le parcours par modules, et la démonstration complète du certificat vérifiable.",
        description:
          "Lors de cette session inaugurale, l'équipe RodLab a présenté l'Academy : la pédagogie par modules, l'examen final de 24 questions et le certificat PDF vérifiable en ligne grâce à son code unique.\n\nLe replay complet sera publié ici. En attendant, le parcours complet est disponible dans l'application : créez votre compte, suivez les modules à votre rythme, puis passez l'examen.",
        platform: "YOUTUBE",
        joinUrl: null,
        startsAt: d(-8),
        durationMin: 75,
        status: "DONE",
        capacity: 300,
      },
    ],
  });

  // Kossi s'est inscrit à la première masterclass
  const firstSession = await db.liveSession.findUnique({ where: { slug: "masterclass-7-erreurs-site-web" } });
  if (firstSession) {
    await db.liveRegistration.create({
      data: {
        sessionId: firstSession.id,
        userId: kossi.id,
        name: kossi.name,
        email: kossi.email,
        country: "Togo",
      },
    });
  }

  console.log("[seed] Notifications de démonstration…");
  await db.notification.createMany({
    data: [
      { userId: palma.id, title: "Nouveau devis reçu", body: "Devis DV-2026-004 est en attente de votre décision.", url: "/dashboard/devis", createdAt: m(0, 8) },
      { userId: palma.id, title: "Avancement du projet", body: "« Site web & moteur de réservation » est maintenant à 65 % d'avancement.", url: "/dashboard/projets", createdAt: m(0, 9) },
      { userId: kossi.id, title: "Paiement confirmé", body: "Votre facture FA-2026-006 a été marquée comme payée. Merci !", url: "/dashboard/factures", createdAt: m(0, 1) },
      { userId: admin.id, title: "Devis accepté", body: "Kossi Amégan a accepté le devis DV-2026-005.", url: "/admin/devis", createdAt: m(-1, 13) },
    ],
  });

  console.log("[seed] ✅ Données de démonstration créées.");
  console.log("[seed]    Admin      : admin@rodlabstudio.tg / demo1234");
  console.log("[seed]    Client     : kossi@chezkossi.tg / demo1234");
  console.log("[seed]    Entreprise : contact@hotelpalma.tg / demo1234");
}
