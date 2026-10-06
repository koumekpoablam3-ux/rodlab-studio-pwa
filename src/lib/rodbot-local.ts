// ─────────────────────────────────────────────────────────────────────────────
// RodBot — moteur de réponses local (secours sans IA distante / hors-ligne)
// Fichier PUR (aucune dépendance serveur) : utilisable par l'API et le widget.
// Les réponses reprennent exactement les informations officielles du site.
// ─────────────────────────────────────────────────────────────────────────────

interface Intent {
  name: string;
  keywords: string[];
  reply: string;
}

/** minuscules + suppression des accents (« Étudiant » → « etudiant ») */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`]/g, " ")
    .trim();
}

const INTENTS: Intent[] = [
  {
    name: "salutation",
    keywords: ["bonjour", "salut", "bonsoir", "hello", "coucou", "hey", "bjr", "slt", "bonnee journee", "yo"],
    reply:
      "Bonjour et bienvenue chez **RodLab Studio** ! Je peux vous renseigner sur nos **services et tarifs**, les **délais**, les **modes de paiement**, le **devis gratuit**, l'**installation de l'application** ou l'**espace client**. Que souhaitez-vous savoir ?",
  },
  {
    name: "tarif-design",
    keywords: ["logo", "identite", "charte", "design graphique", "flyer", "affiche", "carte de visite", "visuel"],
    reply:
      "Côté **design graphique**, trois formules : **Logo Essentiel** à 150 000 FCFA (2 propositions, fichiers PNG/PDF, 5 jours) · **Identité Complète** à 350 000 FCFA (la plus demandée : 3 propositions, charte graphique, cartes de visite, 5 visuels réseaux sociaux, fichiers sources inclus) · **Marque Premium** sur devis. Tous les fichiers sources vous appartiennent. Pour un rendu chiffré précis, demandez votre **devis gratuit** sur /contact — réponse sous 24 h ouvrées.",
  },
  {
    name: "tarif-web",
    keywords: ["site", "vitrine", "e-commerce", "ecommerce", "site web", "business", "application sur mesure", "developpement", "web mobile"],
    reply:
      "Côté **développement numérique** : **Site Vitrine** à 450 000 FCFA (5 pages, responsive, 3 semaines) · **Site Business** à 950 000 FCFA (12 pages, blog, espace client sécurisé, paiement Mobile Money, SEO avancé, 4 à 6 semaines) · **Application sur-mesure** sur devis (PWA installable et hors-ligne, tableaux de bord, 2 à 4 mois, 6 mois de maintenance inclus). Un acompte de 40 % lance le projet : parlez-nous de votre idée sur /contact.",
  },
  {
    name: "formation",
    keywords: ["formation", "apprendre", "cours", "etudiant", "certificat", "ecole", "former", "academy", "academie", "module", "quiz", "examen", "bureautique", "community management"],
    reply:
      "**RodLab Academy**, c'est désormais **6 formations en ligne gratuites certifiantes** : « Créez votre premier site web professionnel » (8 modules, 23 leçons), **Design graphique**, **Community management**, **Bureautique essentielle** (Word, Excel, PowerPoint), **Identité de marque & logo** et **Photo & vidéo au smartphone**. Chaque formation se termine par un examen et un **certificat PDF vérifiable**. Découvrez tout le catalogue sur /formation — inscription gratuite après création de compte.",
  },
  {
    name: "live",
    keywords: ["live", "direct", "en ligne session", "visio", "zoom", "meet", "webinaire", "masterclass", "atelier", "replay", "etranger", "diaspora", "distance"],
    reply:
      "**RodLab Live** — nos sessions de formation en direct, ouvertes aux apprenants **partout dans le monde** : masterclass gratuites, ateliers de code pratiques et sessions Q&A en visio (Zoom, Google Meet, YouTube). Horaires pensés pour l'Afrique, l'Europe et l'Amérique du Nord, replay envoyé aux inscrits. Inscrivez-vous en un clic sur /live (compte requis, gratuit).",
  },
  {
    name: "delais",
    keywords: ["delai", "delaie", "combien de temps", "duree", "durant combien", "rapidement", "vite", "quand sera", "livraison", "livre"],
    reply:
      "Nos **délais sont garantis par contrat** : un **logo en 5 jours**, une **identité complète en 2 semaines**, un **site vitrine en 3 semaines**, un **site business en 4 à 6 semaines** et une **application sur-mesure en 2 à 4 mois**. En cas de retard imputable à notre équipe, une remise s'applique automatiquement. Le calendrier exact est écrit dans votre devis.",
  },
  {
    name: "paiement",
    keywords: ["paiement", "payer", "paye", "acompte", "t-money", "tmoney", "money", "flooz", "virement", "especes", "tranche", "echelonne", "mobile money"],
    reply:
      "Les paiements se font en **trois fois** : **40 % d'acompte** au lancement, **30 % à la validation des maquettes** et le **solde à la livraison**. Nous acceptons **T-Money, Flooz, virement bancaire et espèces**. Chaque paiement est documenté par une facture disponible dans votre **espace client**.",
  },
  {
    name: "devis",
    keywords: ["devis", "combien ca coute", "coute", "cout", "prix", "tarif", "tarifs", "estimation", "cotation", "budget", "gratuit"],
    reply:
      "Le **devis est 100 % gratuit et sans engagement** : décrivez votre projet sur /contact (ou passez au bureau), et vous recevez sous **24 h ouvrées** une proposition détaillée — contenu, délais et prix. Quelques repères : logo à partir de **150 000 FCFA**, site vitrine **450 000 FCFA**, site business **950 000 FCFA**, maintenance dès **25 000 FCFA/mois**.",
  },
  {
    name: "contact",
    keywords: ["contact", "telephone", "whatsapp", "email", "mail", "adresse", "bureau", "joindre", "appeler", "ou etes vous", "localisation", "lome", "horaire", "ouvert"],
    reply:
      "Nous sommes au **Bd du Mono, Tokoin — Lomé, Togo**, du **lundi au samedi, 8 h à 18 h**. Téléphone et WhatsApp : **+228 70 08 86 68**, email : **contact@rodlabstudio.tg**. Le plus rapide reste le formulaire sur /contact : réponse garantie sous 24 h ouvrées. Passez aussi nous voir au bureau, la café est offert !",
  },
  {
    name: "installation",
    keywords: ["installer", "installation", "installer lapplication", "telecharger lapplication", "application mobile", "pwa", "ecran daccueil", "store", "play store", "app store", "android", "iphone", "ios", "icone dans la barre"],
    reply:
      "Pour installer l'application **RodLab Studio** : rendez-vous sur **/telecharger** et appuyez sur « Installer » (ou scannez le QR code depuis votre téléphone). Sinon, **Chrome/Edge** : icône d'installation directement dans la barre d'adresse · **Android** : menu ⋮ → « Installer l'application » · **iPhone** : Safari → Partager → « Sur l'écran d'accueil ». L'app fonctionne **hors-ligne** et envoie des **notifications**.",
  },
  {
    name: "espace-client",
    keywords: ["espace client", "mon compte", "compte", "connexion", "connecter", "mot de passe", "suivre mon projet", "suivi", "login", "inscrire", "facture", "mes projets"],
    reply:
      "Chaque client dispose d'un **espace client sécurisé** : suivi des projets en temps réel (avancement, jalons), devis, factures et messagerie directe avec l'équipe. Créez votre compte sur /inscription, ou connectez-vous sur /connexion. Pour la démonstration, les comptes publics (mot de passe **demo1234**) sont : **admin@rodlabstudio.tg** (administration), **kossi@chezkossi.tg** (client) et **contact@techbuild-group.com** (entreprise).",
  },
  {
    name: "hors-ligne",
    keywords: ["hors ligne", "hors-ligne", "offline", "reseau", "3g", "4g", "connexion faible", "sans internet"],
    reply:
      "C'est notre spécialité : nous optimisons chaque page pour les **réseaux 3G/4G** (images compressées, chargement progressif) et l'application **RodLab Studio** est une **PWA consultable hors-ligne** — vos pages essentielles restent accessibles même quand le réseau faiblit. Installez-la depuis /telecharger pour en profiter.",
  },
  {
    name: "maintenance",
    keywords: ["maintenance", "sauvegarde", "mise a jour", "bug", "surveillance", "hebergement"],
    reply:
      "Nos **maintenances démarrent à 25 000 FCFA/mois** : mises à jour de sécurité, **sauvegardes quotidiennes**, corrections de bugs, petites modifications de contenu et surveillance de disponibilité. La formule exacte dépend de votre site — elle est détaillée dans le devis. Et chaque application sur-mesure inclut déjà **6 mois de maintenance**.",
  },
  {
    name: "propriete",
    keywords: ["proprietaire", "fichiers sources", "domaine", "changé de prestataire", "dependent", "rancon", "code source"],
    reply:
      "Vous êtes **totalement propriétaire** de votre site, de vos **fichiers sources** (AI, PSD, SVG selon le projet) et de vos **identifiants de domaine et d'hébergement** — tout est à votre nom à la livraison. Vous pouvez changer de prestataire quand vous voulez, **sans rançon** : c'est écrit noir sur blanc dans nos contrats.",
  },
  {
    name: "international",
    keywords: ["kara", "cotonou", "abidjan", "accra", "hors lome", "etranger", "nigeria", "benin", "cote divoire", "ghana", "distance", "a distance"],
    reply:
      "Bien sûr : nous accompagnons des clients à **Kara, Cotonou, Abidjan et Accra**. Les échanges se font par **WhatsApp, appel visio et espace client**, et **deux déplacements sur site sont inclus** pour tout projet de développement. La distance n'a jamais été un obstacle — l'essentiel est d'échanger clairement dès le devis.",
  },
  {
    name: "services",
    keywords: ["services", "offre", "proposez", "que faites vous", "expertise", "specialise", "activite", "metiers"],
    reply:
      "**RodLab Studio** couvre trois expertises complémentaires : **design graphique** (logos, chartes, supports print et réseaux sociaux), **développement numérique** (sites vitrines, e-commerce, applications sur-mesure et PWA) et **formation professionnelle** (design, développement, UI/UX, community management, bureautique). Découvrez tout sur /services — et dites-moi votre projet, je vous oriente !",
  },
  {
    name: "realisations",
    keywords: ["realisation", "realisations", "portfolio", "exemple", "reference", "deja fait", "projets passes", "etude de cas", "clients"],
    reply:
      "Notre **portfolio** est visible sur /realisations : études de cas complètes avec défi, solution et **résultats chiffrés** pour chaque client (design, sites web, applications, formations). Vous y trouverez aussi les témoignages. Un projet similaire au vôtre y figure probablement — regardez, et demandez votre devis sur /contact !",
  },
  {
    name: "equipe",
    keywords: ["equipe", "a propos", "histoire", "qui etes vous", "agence", "creator", "fondation", "valeurs", "awa"],
    reply:
      "**RodLab Studio** est une agence créative de **Lomé (Togo)** née d'une passion simple : donner aux entreprises africaines une image et des outils numériques à la hauteur de leurs ambitions. Design, développement et formation se renforcent mutuellement — découvrez notre histoire et l'équipe sur /a-propos.",
  },
  {
    name: "merci",
    keywords: ["merci", "genial", "parfait", "super", "top", "excellent", "nickel", "great"],
    reply:
      "Avec plaisir ! Si une question sur vos projets, tarifs ou l'installation de l'application vous vient plus tard, je suis là. Et pour passer à l'action, le **devis gratuit** vous attend sur /contact — à très vite chez **RodLab Studio** !",
  },
  {
    name: "aurevoir",
    keywords: ["au revoir", "bye", "a bientot", "ciao", "bonne soiree", "bonne journee", "adieu"],
    reply:
      "À bientôt chez **RodLab Studio** ! N'oubliez pas : devis gratuit sous 24 h ouvrées sur /contact, et l'application s'installe depuis /telecharger. Bonne journée !",
  },
  {
    name: "aide",
    keywords: ["aide", "comment ca marche", "que peux tu", "que peux-tu", "tu sais faire", "fonctionnalite", "qui es tu", "rodbot", "robot"],
    reply:
      "Je suis **RodBot**, l'assistant de RodLab Studio ! Je peux vous renseigner sur : nos **services et tarifs** (logo, site, formation), les **délais**, les **paiements** (T-Money, Flooz), le **devis gratuit**, l'**installation de l'application**, l'**espace client**, la **maintenance** ou nos **coordonnées à Lomé**. Posez votre question !",
  },
];

const FALLBACK_REPLY =
  "Je ne suis pas sûr d'avoir bien compris, mais je peux vous renseigner sur : nos **services et tarifs**, les **délais**, les **modes de paiement**, le **devis gratuit**, l'**installation de l'application**, l'**espace client** ou nos **coordonnées à Lomé**. Reformulez votre question avec l'un de ces mots-clés, ou écrivez-nous directement sur /contact !";

/** Choisit la réponse locale la plus pertinente pour le dernier message utilisateur. */
export function localReply(userMessage: string): string {
  const text = normalize(userMessage);
  if (!text) return FALLBACK_REPLY;

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (text.includes(kw)) score += kw.includes(" ") ? 3 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best ? best.intent.reply : FALLBACK_REPLY;
}
