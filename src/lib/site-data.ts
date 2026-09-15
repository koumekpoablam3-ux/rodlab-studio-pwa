// ─────────────────────────────────────────────────────────────────────────────
// Données éditoriales du site RodLab Studio v6 — source unique de vérité
// (services enrichis, navigation, équipe, FAQ, valeurs, timeline)
// ─────────────────────────────────────────────────────────────────────────────

export type Accent = "terra" | "forest" | "gold";

/** Préfixe commun des photos du site (générées, servies depuis /public). */
export const IMG = "/images/site";

export const NAV = {
  main: [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services", mega: "services" },
    { href: "/formation", label: "Formation" },
    { href: "/live", label: "Live" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/a-propos", label: "Agence", mega: "agence" },
    { href: "/contact", label: "Contact" },
  ],
  agence: [
    { href: "/a-propos", label: "À propos de nous", desc: "Notre histoire, nos valeurs et notre équipe" },
    { href: "/blog", label: "Blog & actualités", desc: "Conseils et coulisses de l'agence" },
    { href: "/faq", label: "Questions fréquentes", desc: "Réponses aux questions les plus posées" },
    { href: "/contact", label: "Nous contacter", desc: "Devis gratuit, réponse sous 24 h" },
  ],
  footer: {
    agence: [
      { href: "/a-propos", label: "À propos" },
      { href: "/realisations", label: "Réalisations" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
    ressources: [
      { href: "/formation", label: "Formation certifiante" },
      { href: "/live", label: "Sessions live" },
      { href: "/connexion", label: "Espace client" },
      { href: "/inscription", label: "Créer un compte" },
      { href: "/contact", label: "Demander un devis" },
      { href: "/hors-ligne", label: "Mode hors-ligne" },
    ],
  },
} as const;

export const SERVICES = [
  {
    slug: "design-graphique",
    image: `${IMG}/svc-design.jpg`,
    icon: "palette",
    accent: "terra" as Accent,
    title: "Design graphique",
    subtitle: "Une identité qui vous ressemble",
    short:
      "Logos, chartes graphiques et supports de communication : nous construisons une image de marque cohérente et mémorable.",
    description:
      "Votre image de marque mérite plus qu'un simple logo. Nous concevons des identités visuelles cohérentes et mémorables qui racontent votre histoire et vous distinguent durablement.",
    items: ["Identité visuelle & logo", "Charte graphique", "Affiches, flyers, kakémonos", "Supports de communication", "Visuels réseaux sociaux"],
    intro: [
      "Une marque forte se reconnaît en une fraction de seconde. Chez RodLab Studio, nous partons de votre histoire, de votre clientèle et de vos ambitions pour construire une identité visuelle qui ne se contente pas d'être belle : elle travaille pour vous, sur tous vos supports, tous les jours.",
      "De la création du logo à la charte graphique complète, en passant par les cartes de visite, les affiches et les visuels de réseaux sociaux, chaque livrable respecte un système cohérent de couleurs, de typographies et de formes. Vous recevez tous les fichiers sources, prêts à utiliser en impression comme à l'écran.",
    ],
    benefits: [
      { title: "Une image professionnelle immédiate", desc: "Vos clients jugent votre entreprise en quelques secondes. Une identité soignée inspire confiance dès le premier contact, que ce soit sur une devanture, un flyer ou un profil Facebook." },
      { title: "Une cohérence sur tous les supports", desc: "Carte de visite, affiche, bannière ou publication : tout décline le même langage visuel. Cette cohérence multiplie la mémorisation de votre marque." },
      { title: "Des fichiers sources livrés", desc: "Vous recevez les fichiers modifiables (AI, PSD, SVG) et les exports print/web. Aucune dépendance : vous restez propriétaire de votre image." },
    ],
    plans: [
      { name: "Logo Essentiel", price: "150 000 FCFA", desc: "Pour démarrer avec une base solide", features: ["2 propositions de logo", "2 séries de retouches", "Fichiers PNG + PDF", "Livraison en 5 jours"], popular: false },
      { name: "Identité Complète", price: "350 000 FCFA", desc: "Le choix de la majorité de nos clients", features: ["3 propositions de logo", "Charte graphique complète", "Cartes de visite & papeterie", "5 visuels réseaux sociaux", "Fichiers sources inclus"], popular: true },
      { name: "Marque Premium", price: "sur devis", desc: "Pour les marques à fort enjeu", features: ["Atelier de positionnement", "Identité + ton de voix", "Kit réseaux sociaux complet", "Supports print grand format", "Accompagnement 3 mois"], popular: false },
    ],
    faq: [
      { q: "Combien de propositions de logo vais-je recevoir ?", a: "Selon la formule, nous présentons 2 à 3 directions créatives distinctes. Vous choisissez celle qui vous parle, puis nous l'affinons ensemble lors des séries de retouches incluses." },
      { q: "Que se passe-t-il si aucun logo ne me plaît ?", a: "C'est très rare, mais nous reprenons alors l'atelier de découverte gratuitement pour comprendre ce qui manque, et nous présentons une nouvelle série sans frais supplémentaires." },
      { q: "Puis-je faire décliner mon identité plus tard ?", a: "Oui : votre charte graphique sert de règle du jeu. Revenez quand vous voulez pour ajouter des supports (uniformes, signalétique, véhicule) qui respecteront l'identité établie." },
    ],
  },
  {
    slug: "developpement-numerique",
    image: `${IMG}/svc-dev.jpg`,
    icon: "code",
    accent: "forest" as Accent,
    title: "Développement numérique",
    subtitle: "Des solutions robustes et sur-mesure",
    short:
      "Sites vitrines, e-commerce, applications métier : nous développons des outils performants, sécurisés et évolutifs.",
    description:
      "Du site vitrine à l'application métier, nous développons des solutions performantes, sécurisées et évolutives — pensées pour grandir avec vous.",
    items: ["Sites vitrines & e-commerce", "Applications mobiles", "Solutions sur-mesure", "Interfaces UI/UX", "Maintenance & hébergement"],
    intro: [
      "Un site web n'est pas une vitrine figée : c'est un outil qui doit générer des contacts, des ventes ou des gains de temps. Nous concevons et développons des plateformes rapides, sécurisées et pensées pour les réalités locales — connexion variable, paiement mobile money, publics bilingues.",
      "Notre stack technique moderne (Next.js, bases de données SQL, architecture PWA) nous permet de livrer des applications installables sur mobile, consultables hors-ligne et notifiables en temps réel. Vous suivez chaque étape du développement depuis votre espace client, avec un pourcentage d'avancement actualisé.",
    ],
    benefits: [
      { title: "Rapide même avec une connexion faible", desc: "Sites optimisés pour les réseaux 3G/4G : images compressées, chargement progressif et mode hors-ligne pour les PWA. Vos clients n'attendent jamais." },
      { title: "Paiement Mobile Money intégré", desc: "T-Money, Flooz, cartes bancaires : nous connectons les moyens de paiement que vos clients utilisent réellement au quotidien." },
      { title: "Vous suivez tout en temps réel", desc: "Jalons, pourcentage d'avancement, échanges avec l'équipe : votre espace client centralise l'information, accessible depuis votre téléphone." },
    ],
    plans: [
      { name: "Site Vitrine", price: "450 000 FCFA", desc: "Présence en ligne professionnelle", features: ["Jusqu'à 5 pages", "Design responsive", "Formulaire de contact", "Référencement de base", "Livraison en 3 semaines"], popular: false },
      { name: "Site Business", price: "950 000 FCFA", desc: "Pour vendre et générer des contacts", features: ["Jusqu'à 12 pages", "Blog & actualités", "Espace client sécurisé", "Paiement Mobile Money", "SEO avancé + analytics"], popular: true },
      { name: "Application Sur-Mesure", price: "sur devis", desc: "Gestion, réservation, e-commerce", features: ["Cahier des charges complet", "PWA installable hors-ligne", "Tableaux de bord & notifications", "Formation des équipes", "Maintenance 6 mois incluse"], popular: false },
    ],
    faq: [
      { q: "Combien de temps pour un site professionnel ?", a: "Un site vitrine est livré en 3 semaines environ, un site business en 4 à 6 semaines, une application sur-mesure en 2 à 4 mois selon la complexité. Les délais sont contractualisés dès le devis." },
      { q: "Le site fonctionnera-t-il bien sur mobile ?", a: "C'est notre priorité : plus de 80 % de vos visiteurs utiliseront un téléphone. Chaque site est conçu d'abord pour mobile, puis adapté aux tablettes et ordinateurs." },
      { q: "Qui héberge le site et qui paie le domaine ?", a: "Nous nous occupons de tout : achat du domaine (.tg ou .com), hébergement performant et certificat de sécurité SSL. Vous recevez les identifiants et restez propriétaire de tout." },
    ],
  },
  {
    slug: "formation",
    image: `${IMG}/svc-formation.jpg`,
    icon: "graduation",
    accent: "gold" as Accent,
    title: "Formation professionnelle",
    subtitle: "Les talents numériques de demain",
    short:
      "Formations intensives encadrées par des professionnels actifs : design, développement, community management et bureautique.",
    description:
      "Le numérique s'apprend en pratiquant. Nos formations intensives encadrées par des professionnels actifs vous font passer de débutant à opérationnel.",
    items: ["Design graphique", "Développement web & mobile", "UI/UX Design", "Community management", "Bureautique & outils numériques"],
    intro: [
      "Le meilleur moyen d'apprendre le numérique est de pratiquer sur des projets réels. Nos formations intensives sont animées par des professionnels qui livrent des clients chaque semaine : vous apprenez les outils, mais surtout les méthodes et les réflexes du métier.",
      "Les sessions se déroulent en petits groupes (8 personnes maximum) dans notre local de Tokoin, avec un ordinateur par apprenant. Chaque parcours alterne théorie le matin et ateliers pratiques l'après-midi, et se conclut par un projet personnel présenté devant le groupe. Un certificat de fin de formation est délivré.",
    ],
    benefits: [
      { title: "80 % de pratique, 20 % de théorie", desc: "Vous passez le temps sur les outils, en réalisant des projets concrets type agence : maquettes, sites, campagnes. Vous sortez avec un portfolio réel." },
      { title: "Des formateurs qui exercent", desc: "Pas de formateurs théoriciens : ceux qui vous forment conçoivent et livrent des projets clients chaque semaine, avec les exigences du marché." },
      { title: "Suivi après la formation", desc: "Groupe WhatsApp alumni, revue de portfolio mensuelle et priorité sur nos missions freelance : nous restons présents après le certificat." },
    ],
    plans: [
      { name: "Atelier Week-end", price: "35 000 FCFA", desc: "2 jours pour acquérir une compétence", features: ["Samedi + dimanche, 12 h", "Un thème ciblé", "Support de cours inclus", "Groupe de 8 max"], popular: false },
      { name: "Parcours Certifiant", price: "150 000 FCFA", desc: "6 semaines pour changer de voie", features: ["24 séances de 2 h", "Projet final évalué", "Certificat RodLab", "Kit outils professionnels", "Accès alumni"], popular: true },
      { name: "Formation Entreprise", price: "sur devis", desc: "Pour monter en compétence vos équipes", features: ["Programme sur mesure", "Dans vos locaux ou chez nous", "Cas pratiques sur vos outils", "Évaluation des acquis"], popular: false },
    ],
    faq: [
      { q: "Faut-il déjà maîtriser l'informatique pour s'inscrire ?", a: "Non. Nos parcours partent des bases : savoir utiliser un navigateur et un clavier suffit. Les groupes étant petits, le rythme s'adapte à chacun." },
      { q: "Les formations donnent-elles un diplôme reconnu ?", a: "Vous recevez un certificat de fin de formation RodLab Studio détaillant les compétences acquises et le projet réalisé. C'est un atout de portfolio très valorisé par les employeurs locaux." },
      { q: "Proposez-vous des facilités de paiement ?", a: "Oui : en deux ou trois versements pour le parcours certifiant, et des tarifs réduits pour les étudiants sur présentation de la carte." },
    ],
  },
  {
    slug: "community-management",
    image: `${IMG}/svc-social.jpg`,
    icon: "megaphone",
    accent: "terra" as Accent,
    title: "Community management",
    subtitle: "Votre marque, active chaque jour",
    short:
      "Stratégie éditoriale, création de contenus, publicités et reporting : nous animons vos réseaux sociaux pour de vrai.",
    description:
      "Nous animons vos réseaux sociaux avec une ligne éditoriale claire, des visuels soignés et un suivi précis des performances.",
    items: ["Stratégie éditoriale", "Création de contenus", "Publicités Meta", "Modération & communauté", "Reporting mensuel"],
    intro: [
      "Être présent sur les réseaux sociaux n'est pas une option pour une entreprise en 2026 — mais poster au hasard ne sert à rien. Nous construisons pour vous une ligne éditoriale claire, un calendrier de publication régulier et des visuels aux standards de votre identité de marque.",
      "Chaque mois, vous recevez un reporting clair : croissance de l'audience, portée, engagements, et surtout ce que nous en déduisons pour le mois suivant. La publicité Meta (Facebook & Instagram) est pilotée au franc près, avec des audiences pensées pour le marché togolais.",
    ],
    benefits: [
      { title: "Un calendrier, zéro trou d'air", desc: "Vos pages publient régulièrement, aux bonnes heures, sans que vous ayez à y penser. La régularité est ce qui fait grandir une audience." },
      { title: "Des visuels au niveau de votre marque", desc: "Nos designers produisent vos visuels : pas de photos volées ni de templates génériques. Votre feed ressemble à votre entreprise." },
      { title: "Des chiffres qui parlent", desc: "Rapport mensuel d'une page : ce qui a marché, ce qui a moins marché, et les 3 actions décidées pour le mois suivant. Simple et actionnable." },
    ],
    plans: [
      { name: "Présence", price: "90 000 FCFA/mois", desc: "Maintenir une présence soignée", features: ["8 publications / mois", "Visuels créés sur mesure", "Modération des commentaires", "Rapport mensuel"], popular: false },
      { name: "Croissance", price: "180 000 FCFA/mois", desc: "Le rythme qui fait grandir", features: ["16 publications / mois", "Stories & reels", "1 campagne Meta incluse", "Veille concurrentielle", "Rapport + réunion mensuelle"], popular: true },
      { name: "Performance", price: "sur devis", desc: "Multi-plateformes & campagnes", features: ["Gestion 3 plateformes", "Campagnes publicitaires avancées", "Shooting photo mensuel", "Community management 7j/7", "Tableau de bord temps réel"], popular: false },
    ],
    faq: [
      { q: "Sur quelles plateformes travaillez-vous ?", a: "Principalement Facebook, Instagram, WhatsApp Business et TikTok — celles où sont vos clients au Togo. LinkedIn et YouTube sont couverts dans les formules Performance." },
      { q: "Qui rédige les publications ?", a: "Notre équipe rédige et crée tout : textes, visuels, hashtags. Vous validez le calendrier du mois en amont, puis nous gérons la suite." },
      { q: "Puis-je arrêter à tout moment ?", a: "Oui, les abonnements sont mensuels sans engagement de durée. Vous recevez de toute façon tous les contenus et accès créés pendant notre collaboration." },
    ],
  },
];

export const PROCESS_STEPS = [
  { step: "01", title: "Découverte", desc: "Un échange gratuit pour comprendre vos objectifs, votre audience et vos contraintes. Nous écoutons avant de proposer." },
  { step: "02", title: "Conception", desc: "Maquettes et prototypes que vous validez avant toute ligne de code. Pas de mauvaise surprise à la livraison." },
  { step: "03", title: "Développement", desc: "Un code propre et testé, avec des points d'avancement réguliers. Vous suivez l'évolution en temps réel depuis votre espace." },
  { step: "04", title: "Lancement & suivi", desc: "Mise en ligne, formation à la prise en main et support réactif. Nous restons à vos côtés après la livraison." },
];

export const TESTIMONIALS = [
  {
    name: "Aïcha K.",
    role: "Gérante, Kafo Market",
    photo: `${IMG}/avatar-aicha.jpg`,
    quote:
      "RodLab Studio a transformé notre petite boutique en une vraie machine de vente en ligne. Le paiement mobile money fonctionne parfaitement et l'équipe est restée disponible bien après la mise en ligne.",
    initials: "AK",
  },
  {
    name: "Dr. Kodjo M.",
    role: "Directeur, Clinique Santé+",
    photo: `${IMG}/avatar-kodjo.jpg`,
    quote:
      "Une identité visuelle au-delà de nos attentes. Nos patients nous reconnaissent désormais au premier coup d'œil. Professionnalisme, écoute et délais respectés : je recommande sans hésiter.",
    initials: "KM",
  },
  {
    name: "Yao B.",
    role: "Propriétaire, Hôtel Palm Beach",
    photo: `${IMG}/avatar-yao.jpg`,
    quote:
      "Les réservations directes ont presque doublé depuis le lancement du nouveau site. Un investissement rentabilisé en moins de quatre mois. Merci pour le sérieux et la réactivité.",
    initials: "YB",
  },
];

export const WHY_US = [
  {
    title: "Une équipe 100 % togolaise, des standards internationaux",
    desc: "Basés à Lomé, nous connaissons vos réalités : Mobile Money, connexion irrégulière, publics bilingues. Nos livrables répondent aux mêmes exigences que ceux des grandes agences.",
  },
  {
    title: "Un suivi transparent, projet par projet",
    desc: "Chaque client dispose d'un espace personnel : avancement en pourcentage, jalons validés, devis et factures. Vous savez toujours où en est votre projet.",
  },
  {
    title: "Livraisons à l'heure, garantie écrite",
    desc: "Les délais sont contractualisés dès le devis. En cas de retard imputable à notre équipe, une remise automatique s'applique. C'est notre engagement.",
  },
];

export const VALUES = [
  { title: "Transparence", desc: "Prix clairs, délais écrits, avancement visible en temps réel dans votre espace client. Vous ne découvrez jamais rien après coup.", icon: "eye" },
  { title: "Excellence", desc: "Chaque livrable est testé, relu et confronté aux standards internationaux avant de vous parvenir. Le « assez bien » n'existe pas ici.", icon: "award" },
  { title: "Proximité", desc: "Un interlocuteur unique joignable sur WhatsApp, des réunions en présentiel à Lomé, et des explications sans jargon technique.", icon: "handshake" },
  { title: "Impact", desc: "Nous mesurons notre réussite à la vôtre : ventes qui montent, rendez-vous qui s'organisent, temps gagné au quotidien.", icon: "trending" },
];

export const TIMELINE = [
  { year: "2018", title: "Les débuts", desc: "Rodrique quitte son poste de développeur et lance RodLab Studio depuis une chambre à Tokoin, avec un ordinateur et beaucoup de détermination." },
  { year: "2020", title: "Les premières marques", desc: "L'équipe s'agrandit à deux designers. L'agence livre ses dix premiers sites et se spécialise dans l'accompagnement des PME." },
  { year: "2022", title: "Lancement des formations", desc: "Face à la demande de talents, RodLab ouvre ses parcours de formation. Première promotion : 8 apprenants, tous opérationnels en 6 semaines." },
  { year: "2024", title: "Le cap des 100 projets", desc: "Centième projet livré, et une spécialisation dans les solutions e-commerce avec paiement Mobile Money intégré pour le marché togolais." },
  { year: "2026", title: "L'ère des espaces clients", desc: "Lancement de l'application RodLab : projets, devis, factures et messagerie accessibles partout, même hors-ligne, depuis le téléphone." },
];

export const TEAM = [
  { name: "K.A.S. Rodrigue", role: "Fondateur · Développeur full-stack", initials: "KR", color: "#bd4f2b", photo: `${IMG}/team-rodrigue.jpg`, bio: "8 ans de développement web. Obsédé par la fiabilité et les délais tenus." },
  { name: "Afi Amégan", role: "Designer UI/UX", initials: "AA", color: "#102a20", photo: `${IMG}/team-afi.jpg`, bio: "Diplômée en design numérique, elle signe nos identités et interfaces les plus audacieuses." },
  { name: "Komlan Sodji", role: "Développeur mobile", initials: "KS", color: "#b98a2f", photo: `${IMG}/team-komlan.jpg`, bio: "Spécialiste des applications installables et du mode hors-ligne pour connexions instables." },
  { name: "Sika Dossou", role: "Communication & formation", initials: "SD", color: "#7a4a1f", photo: `${IMG}/team-sika.jpg`, bio: "Anime nos réseaux, forme nos apprenants et traduit le technique en langage clair." },
];

/** Photos d'ambiance de l'agence (page À propos + accueil). */
export const AGENCY_PHOTOS = {
  hero: `${IMG}/hero-formation.jpg`,
  bureau: `${IMG}/about-bureau.jpg`,
  equipe: `${IMG}/about-equipe.jpg`,
  client: `${IMG}/why-us.jpg`,
  lome: `${IMG}/cta-lome.jpg`,
} as const;

export const FAQ_ITEMS = [
  { q: "Quels sont vos délais moyens de réalisation ?", a: "Un logo en 5 jours, une identité complète en 2 semaines, un site vitrine en 3 semaines, un site business en 4 à 6 semaines et une application sur-mesure en 2 à 4 mois. Les délais sont écrits dans le devis et garantis par contrat : en cas de retard imputable à notre équipe, une remise s'applique automatiquement." },
  { q: "Comment se passent les paiements ?", a: "Un acompte de 40 % lance le projet, 30 % à la validation des maquettes et le solde à la livraison. Nous acceptons T-Money, Flooz, virement bancaire et espèces. Chaque paiement est documenté par une facture disponible dans votre espace client." },
  { q: "Le devis est-il vraiment gratuit ?", a: "Oui, absolument. Décrivez votre projet depuis la page Contact ou passez au bureau : vous recevez sous 24 h ouvrées une proposition détaillée (contenu, délais, prix), sans engagement de votre part." },
  { q: "Suis-je propriétaire de mon site et de mes fichiers ?", a: "Totalement. À la livraison, vous recevez les accès administrateur, les fichiers sources et les identifiants de domaine et d'hébergement, tous à votre nom. Vous pouvez changer de prestataire quand vous voulez, sans rançon." },
  { q: "Que comprend la maintenance ?", a: "Selon la formule : mises à jour de sécurité, sauvegardes quotidiennes, corrections de bugs, petites modifications de contenu et surveillance de disponibilité. Les maintenances démarrant à 25 000 FCFA/mois sont détaillées dans le devis." },
  { q: "Mon site fonctionnera-t-il avec une mauvaise connexion ?", a: "C'est notre spécialité. Nous optimisons chaque page pour les réseaux 3G/4G, compressons les médias et proposons des applications PWA consultables hors-ligne : vos clients voient l'essentiel même quand le réseau faiblit." },
  { q: "Formez-vous mes équipes à utiliser le site ?", a: "Oui, une session de prise en main est incluse dans chaque projet de développement. Elle couvre la mise à jour des contenus, la lecture des statistiques et la gestion des formulaires. La session est enregistrée en vidéo pour vos nouveaux employés." },
  { q: "Travaillez-vous avec des clients hors de Lomé ?", a: "Bien sûr : nous accompagnons des clients à Kara, Cotonou, Abidjan et Accra. Les échanges se font par WhatsApp, appel visio et espace client ; deux déplacements sur site sont inclus pour tout projet de développement." },
];

export const STATS = [
  { value: "120+", label: "Projets livrés" },
  { value: "65", label: "Clients accompagnés" },
  { value: "8", label: "Années d'expérience" },
  { value: "200+", label: "Apprenants formés" },
];
