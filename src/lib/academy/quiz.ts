import type { QuizQuestionSeed } from "./types";

/**
 * RODLAB ACADEMY — Examen final : 24 questions (seuil de réussite : 70 %)
 * Une banque couvrant les 8 modules du cours.
 */
export const QUIZ_QUESTIONS: QuizQuestionSeed[] = [
  // Module 1 — Comprendre le web moderne
  {
    prompt: "Quel est le rôle du DNS lorsqu'on tape une adresse de site dans le navigateur ?",
    options: [
      "Il chiffre la connexion entre le navigateur et le serveur",
      "Il traduit le nom de domaine en adresse IP du serveur",
      "Il compresse les images du site pour accélérer l'affichage",
      "Il stocke une copie du site pour la consultation hors-ligne",
    ],
    answer: 1,
    explanation:
      "Le DNS est l'annuaire d'Internet : il convertit le nom de domaine lisible (ex. rodlabstudio.tg) en adresse IP, la véritable adresse du serveur.",
  },
  {
    prompt: "Quel langage décrit la STRUCTURE d'une page web (titres, paragraphes, images) ?",
    options: ["CSS", "JavaScript", "HTML", "SQL"],
    answer: 2,
    explanation:
      "Le HTML structure le contenu de la page. Le CSS le met en forme et le JavaScript le rend interactif.",
  },
  {
    prompt: "Une entreprise veut présenter ses services et être contactée. Quel type de site correspond le mieux à ce besoin ?",
    options: [
      "Une application web métier",
      "Une boutique en ligne complète",
      "Un site vitrine de 5 à 7 pages",
      "Un réseau social interne",
    ],
    answer: 2,
    explanation:
      "Le site vitrine est la carte de visite étendue d'une entreprise : présenter l'activité et générer des contacts, sans complexité inutile.",
  },

  // Module 2 — Planifier son site comme un pro
  {
    prompt: "Que contient en priorité un bon cahier des charges ?",
    options: [
      "Le code HTML complet des futures pages",
      "L'objectif du site, les cibles, les pages, les fonctionnalités, le budget et les délais",
      "La liste des logiciels utilisés par le développeur",
      "Le prix des concurrents uniquement",
    ],
    answer: 1,
    explanation:
      "Le cahier des charges fixe l'objectif, les cibles, les pages, les fonctionnalités, les contenus, le budget et les délais — la feuille de route du projet.",
  },
  {
    prompt: "Qu'est-ce qu'un wireframe ?",
    options: [
      "Le croquis d'une page montrant les blocs et l'ordre de l'information, sans style final",
      "Le fichier final du site prêt à publier",
      "Un certificat de sécurité pour le site",
      "Le contrat signé entre le client et l'agence",
    ],
    answer: 0,
    explanation:
      "Le wireframe est le croquis structurel d'une page : blocs et hiérarchie de l'information, sans couleurs ni polices finales.",
  },
  {
    prompt: "Dans une charte visuelle, à quoi doit servir la couleur d'accent ?",
    options: [
      "À colorer tous les fonds de page",
      "Uniquement aux actions principales : boutons et liens actifs",
      "À décorer librement chaque section",
      "À remplacer la couleur de la marque",
    ],
    answer: 1,
    explanation:
      "La couleur d'accent est réservée aux actions (boutons, liens) : sa rareté la rend immédiatement repérable par le visiteur.",
  },

  // Module 3 — HTML
  {
    prompt: "Combien de balises <h1> une page bien construite doit-elle contenir ?",
    options: ["Une seule", "Autant que de sections", "Trois au maximum", "Aucune, c'est interdit"],
    answer: 0,
    explanation:
      "Une seule balise <h1> par page : le titre principal. Les <h2>, <h3>… structurent ensuite la hiérarchie des sections.",
  },
  {
    prompt: "Quel attribut de la balise <img> décrit l'image pour les malvoyants et les moteurs de recherche ?",
    options: ["src", "title", "alt", "name"],
    answer: 2,
    explanation:
      "L'attribut alt fournit une description textuelle de l'image, utilisée par les lecteurs d'écran et les moteurs de recherche.",
  },
  {
    prompt: "Pourquoi un formulaire HTML seul ne suffit-il pas pour recevoir des messages ?",
    options: [
      "Les formulaires HTML sont interdits par Google",
      "Il faut un traitement côté serveur (ou un service tiers) pour recevoir les données",
      "Les navigateurs bloquent tous les formulaires de contact",
      "Il faut obligatoirement payer une licence pour activer un formulaire",
    ],
    answer: 1,
    explanation:
      "Le HTML collecte les champs, mais l'envoi d'un e-mail ou l'enregistrement des données exige un traitement côté serveur ou un service de formulaires.",
  },

  // Module 4 — CSS
  {
    prompt: "Quelle règle CSS cible tous les éléments portant la classe « carte » ?",
    options: ["#carte { }", "carte { }", ".carte { }", "*carte { }"],
    answer: 2,
    explanation:
      "Le point désigne une classe : .carte { } s'applique à tous les éléments class=\"carte\". Le dièse (#) cible un identifiant unique.",
  },
  {
    prompt: "En CSS, quelle propriété crée l'espace INTÉRIEUR d'un élément, entre son bord et son contenu ?",
    options: ["margin", "padding", "gap", "border"],
    answer: 1,
    explanation:
      "Le padding est l'espace intérieur ; la margin est l'espace extérieur, entre l'élément et ses voisins.",
  },
  {
    prompt: "Que fait la règle @media (min-width: 768px) { … } ?",
    options: [
      "Elle charge la page à partir de 768 kilo-octets",
      "Elle applique ses règles seulement sur des écrans d'au moins 768 px de large",
      "Elle redimensionne toutes les images à 768 px",
      "Elle bloque l'accès au site sur mobile",
    ],
    answer: 1,
    explanation:
      "C'est une media query : les règles qu'elle contient ne s'appliquent qu'à partir de la largeur indiquée — le cœur du responsive design.",
  },

  // Module 5 — Design UI
  {
    prompt: "Combien de polices un site professionnel utilise-t-il au maximum ?",
    options: ["Une ou deux", "Quatre", "Autant que nécessaire", "Cinq pour la variété"],
    answer: 0,
    explanation:
      "Deux polices suffisent : une expressive pour les titres, une sobre et lisible pour le texte courant. Au-delà, la cohérence se perd.",
  },
  {
    prompt: "Quelle taille de corps de texte et quelle hauteur de ligne sont recommandées pour un article web ?",
    options: [
      "10–12 px, interligne 1,0",
      "16–18 px, interligne environ 1,6",
      "24–28 px, interligne 0,8",
      "14 px, texte justifié partout",
    ],
    answer: 1,
    explanation:
      "16–18 px avec une hauteur de ligne d'environ 1,6 et des lignes de 60 à 80 caractères : la combinaison la plus confortable à l'écran.",
  },
  {
    prompt: "Pourquoi définir des variables CSS comme :root { --forest: #276144; } ?",
    options: [
      "Pour accélérer le chargement des images",
      "Pour pouvoir changer une couleur en un seul endroit et mettre tout le site à jour",
      "Pour que le site fonctionne sans connexion Internet",
      "Pour chiffrer les couleurs et les protéger",
    ],
    answer: 1,
    explanation:
      "Les variables CSS centralisent les valeurs (couleurs, espacements) : la charte évolue en modifiant une seule ligne.",
  },

  // Module 6 — Outils & no-code
  {
    prompt: "Qu'est-ce qu'un CMS comme WordPress ?",
    options: [
      "Un système qui permet de gérer le contenu d'un site sans toucher au code après installation",
      "Un logiciel de retouche photo",
      "Un nom de domaine premium",
      "Un langage de programmation récent",
    ],
    answer: 0,
    explanation:
      "Un CMS (système de gestion de contenu) sépare la technique du contenu : le propriétaire édite textes et images sans coder.",
  },
  {
    prompt: "Quel est le principal inconvénient des outils no-code comme Webflow ou Framer ?",
    options: [
      "Ils ne permettent pas de faire de beaux designs",
      "L'abonnement mensuel par site et la dépendance à l'éditeur",
      "Ils exigent de connaître le JavaScript avancé",
      "Ils ne fonctionnent que sur Mac",
    ],
    answer: 1,
    explanation:
      "Le no-code est rapide et élégant, mais le site vit par abonnement chez l'éditeur : coût récurrent et dépendance, à peser selon le projet.",
  },

  // Module 7 — Mise en ligne
  {
    prompt: "Quelle est la différence entre un nom de domaine et un hébergement ?",
    options: [
      "Aucune, ce sont deux noms de la même chose",
      "Le domaine est l'adresse du site ; l'hébergement est le serveur qui stocke ses fichiers",
      "L'hébergement est l'adresse ; le domaine stocke les fichiers",
      "Le domaine est obligatoirement gratuit et l'hébergement payant",
    ],
    answer: 1,
    explanation:
      "Le domaine est l'adresse (ex. monentreprise.tg), l'hébergement est le serveur 24 h/24 qui garde et sert les fichiers du site.",
  },
  {
    prompt: "À quoi reconnaît-on une connexion sécurisée HTTPS sur un site ?",
    options: [
      "Au logo doré de l'hébergeur",
      "Au cadenas affiché dans la barre d'adresse du navigateur",
      "Au fait que le site soit payant",
      "À la présence d'un formulaire de contact",
    ],
    answer: 1,
    explanation:
      "HTTPS chiffre les échanges entre visiteur et serveur ; les navigateurs l'indiquent par un cadenas. Le certificat Let's Encrypt est gratuit.",
  },
  {
    prompt: "Que se passe-t-il si le nom de domaine d'un site n'est pas renouvelé à son échéance annuelle ?",
    options: [
      "Le site passe automatiquement en .com",
      "Le site devient inaccessible et le nom peut être racheté par quelqu'un d'autre",
      "Google renouvelle le domaine gratuitement",
      "Rien, un domaine est valable à vie",
    ],
    answer: 1,
    explanation:
      "Un domaine se renouvelle chaque année : expiré, le site disparaît et le nom peut être acheté par un tiers. Programmez un rappel de renouvellement.",
  },
  {
    prompt: "Quel outil gratuit fait apparaître une entreprise sur Google Maps et dans les recherches locales ?",
    options: [
      "Google Business Profile",
      "Google Translate",
      "Google Chrome",
      "Google Drive",
    ],
    answer: 0,
    explanation:
      "La fiche Google Business Profile est l'outil local par excellence : cartes, horaires, avis — décisif pour être trouvé près de chez soi.",
  },

  // Module 8 — Vivre de sa compétence
  {
    prompt: "Quelle est la meilleure preuve de valeur pour décrocher ses premiers clients ?",
    options: [
      "Un diplôme scanné envoyé par WhatsApp",
      "Un portefeuille de trois réalisations soignées, même fictives ou bénévoles",
      "Un compte TikTok actif",
      "Une carte de visite dorée",
    ],
    answer: 1,
    explanation:
      "Le portefeuille prouve ce que vous savez faire : trois réalisations soignées valent mieux que tous les discours commerciaux.",
  },
  {
    prompt: "Dans le modèle RodLab, comment se répartit le paiement d'un site vitrine ?",
    options: [
      "100 % à la fin du projet",
      "40 % à la commande, 30 % à la validation du design, 30 % à la livraison",
      "50 % avant, 50 % un an après",
      "Un abonnement mensuel à vie",
    ],
    answer: 1,
    explanation:
      "40/30/30 : l'acompte engage le client et finance le travail, le solde sécurise la livraison. C'est un standard sain pour la trésorerie.",
  },
  {
    prompt: "Pourquoi proposer une offre de maintenance mensuelle après la livraison d'un site ?",
    options: [
      "Parce qu'un site cassé ne se répare jamais autrement",
      "Pour transformer un client unique en revenu récurrent et fidéliser durablement",
      "Parce que la loi l'exige au Togo",
      "Pour éviter de refaire de nouveaux sites",
    ],
    answer: 1,
    explanation:
      "La maintenance (mises à jour, sauvegardes, petites modifications) crée un revenu stable : quelques clients fidèles valent mieux que mille projets dispersés.",
  },
];
