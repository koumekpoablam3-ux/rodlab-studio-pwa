// ─────────────────────────────────────────────────────────────────────────────
// Contenus longs du site RodLab Studio — études de cas & articles de blog
// ─────────────────────────────────────────────────────────────────────────────

import { IMG } from "@/lib/site-data";

export type CaseCategory = "web" | "ecommerce" | "branding" | "mobile";

export const CASE_CATEGORIES: { value: CaseCategory | "tous"; label: string }[] = [
  { value: "tous", label: "Tous les projets" },
  { value: "web", label: "Sites web" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "branding", label: "Identité & branding" },
  { value: "mobile", label: "Applications mobiles" },
];

export const REALISATIONS = [
  {
    slug: "kafo-market",
    image: `${IMG}/real-kafo-market.jpg`,
    title: "Kafo Market",
    category: "ecommerce" as CaseCategory,
    categoryLabel: "E-commerce",
    client: "Kafo Market — Boutique multivendeuse",
    year: "2025",
    duration: "10 semaines",
    summary:
      "Une marketplace mobile-first avec paiement T-Money et Flooz, qui a multiplié les ventes en ligne par trois en six mois.",
    challenge:
      "Kafo Market vendait exclusivement par WhatsApp : commandes perdues, prix communiqués un par un, paiements compliqués à suivre. La gérante avait besoin d'une vraie boutique en ligne capable d'encaisser du Mobile Money et de gérer des dizaines de vendeuses indépendantes.",
    solution:
      "Nous avons développé une marketplace PWA : catalogue de 400+ produits, panier partagé par vendeuse, paiement T-Money et Flooz intégré, notifications de commande par WhatsApp et tableau de bord des ventes. Le tout fonctionne sans accroc sur un réseau 3G et reste consultable hors-ligne pour les vendeuses.",
    results: [
      { value: "×3", label: "Ventes en ligne en 6 mois" },
      { value: "400+", label: "Produits gérés" },
      { value: "98 %", label: "Paiements mobile money réussis" },
    ],
    features: ["Catalogue & recherche avancée", "Paiement T-Money / Flooz", "Espace vendeuse", "Notifications WhatsApp", "Mode hors-ligne PWA"],
    testimonial: {
      quote: "RodLab Studio a transformé notre petite boutique en une vraie machine de vente en ligne. Le paiement mobile money fonctionne parfaitement et l'équipe est restée disponible bien après la mise en ligne.",
      name: "Aïcha K.",
      role: "Gérante, Kafo Market",
    },
    tags: ["Next.js", "PWA", "T-Money", "Tableau de bord"],
    accent: "terra" as const,
  },
  {
    slug: "hotel-palm-beach",
    image: `${IMG}/real-hotel-palm-beach.jpg`,
    title: "Hôtel Palm Beach",
    category: "web" as CaseCategory,
    categoryLabel: "Site web",
    client: "Hôtel Palm Beach — Hôtellerie 3 étoiles",
    year: "2025",
    duration: "8 semaines",
    summary:
      "Un site de réservation directe en français et anglais dont les réservations ont presque doublé en quatre mois.",
    challenge:
      "L'hôtel dépendait presque entièrement des plateformes de réservation qui prélèvent 15 à 20 % de commission. Le propriétaire voulait capter les réservations directes, présenter ses 34 chambres de façon immersive et rassurer une clientèle internationale.",
    solution:
      "Site bilingue avec galerie immersive, moteur de disponibilité en temps réel, paiement d'acompte en ligne et synchronisation automatique du calendrier. Les demandes spéciales (transfert aéroport, excursions) se commandent depuis le site, et l'équipe de réception gère tout depuis une interface simple.",
    results: [
      { value: "+85 %", label: "Réservations directes" },
      { value: "4 mois", label: "Investissement rentabilisé" },
      { value: "2", label: "Langues (FR / EN)" },
    ],
    features: ["Moteur de réservation", "Version bilingue FR/EN", "Paiement d'acompte", "Galerie immersive", "Zéro commission"],
    testimonial: {
      quote: "Les réservations directes ont presque doublé depuis le lancement du nouveau site. Un investissement rentabilisé en moins de quatre mois. Merci pour le sérieux et la réactivité.",
      name: "Yao B.",
      role: "Propriétaire, Hôtel Palm Beach",
    },
    tags: ["Réservation en ligne", "Bilingue", "Hôtellerie"],
    accent: "forest" as const,
  },
  {
    slug: "clinique-sante-plus",
    image: `${IMG}/real-clinique-sante.jpg`,
    title: "Clinique Santé+",
    category: "branding" as CaseCategory,
    categoryLabel: "Identité & branding",
    client: "Clinique Santé+ — Santé privée",
    year: "2024",
    duration: "6 semaines",
    summary:
      "Une identité visuelle complète (logo, charte, signalétique) qui rend la clinique immédiatement reconnaissable.",
    challenge:
      "La clinique venait d'agrandir ses locaux mais son image restait celle d'un petit cabinet : logo datant de 2011, supports hétéroclites, aucune règle graphique. Le directeur voulait une image rassurante et moderne, à la hauteur des nouvelles installations.",
    solution:
      "Atelier de positionnement avec l'équipe soignante, puis création d'un logo symbolisant le soin et la proximité. Nous avons décliné l'identité sur tous les points de contact : signalétique des bâtiments, blouses, ordonnances, cartes de visite, plaquette de présentation et visuels réseaux sociaux — avec une charte de 40 pages remise à l'équipe.",
    results: [
      { value: "40", label: "Pages de charte graphique" },
      { value: "12", label: "Supports déclinés" },
      { value: "100 %", label: "Fichiers sources remis" },
    ],
    features: ["Logo & charte complète", "Signalétique intérieure", "Papeterie médicale", "Kit réseaux sociaux", "Uniformes & badges"],
    testimonial: {
      quote: "Une identité visuelle au-delà de nos attentes. Nos patients nous reconnaissent désormais au premier coup d'œil. Professionnalisme, écoute et délais respectés : je recommande sans hésiter.",
      name: "Dr. Kodjo M.",
      role: "Directeur, Clinique Santé+",
    },
    tags: ["Logo", "Charte graphique", "Signalétique"],
    accent: "gold" as const,
  },
  {
    slug: "togo-deliveries",
    image: `${IMG}/real-togo-deliveries.jpg`,
    title: "Togo Deliveries",
    category: "mobile" as CaseCategory,
    categoryLabel: "Application mobile",
    client: "Togo Deliveries — Livraison express",
    year: "2025",
    duration: "14 semaines",
    summary:
      "Une application de suivi de livraisons en temps réel, installable sur tous les téléphones et fonctionnant hors-ligne.",
    challenge:
      "Cette jeune entreprise de livraison gérait ses courses par appels et messages : aucun suivi pour les clients, des erreurs d'adressage fréquentes et des livreurs contraints d'appeler en permanence. Il fallait une solution simple, compatible avec tous les téléphones du marché.",
    solution:
      "Nous avons conçu une PWA installable en un clic, sans passer par les stores : le client commande et suit son colis sur une carte en temps réel, le livreur reçoit ses missions avec itinéraire, et tout fonctionne hors-ligne grâce à une synchronisation intelligente dès que le réseau revient. Les paiements à la livraison sont tracés dans l'application.",
    results: [
      { value: "-60 %", label: "Appels au support" },
      { value: "1 200+", label: "Livraisons suivies / mois" },
      { value: "100 %", label: "Téléphones compatibles" },
    ],
    features: ["Suivi temps réel sur carte", "Mode hors-ligne complet", "Installable sans store", "Itinéraires livreurs", "Historique & preuves"],
    testimonial: {
      quote: "Nos clients suivent leur colis comme avec les grandes plateformes, et nos livreurs ne se perdent plus. L'application marche même dans les zones où le réseau coupe, c'était notre obsession.",
      name: "Mawuli A.",
      role: "Cofondateur, Togo Deliveries",
    },
    tags: ["PWA", "Géolocalisation", "Hors-ligne", "Logistique"],
    accent: "forest" as const,
  },
  {
    slug: "academie-horizon",
    image: `${IMG}/real-academie-horizon.jpg`,
    title: "Académie Horizon",
    category: "web" as CaseCategory,
    categoryLabel: "Site web",
    client: "Académie Horizon — École privée",
    year: "2024",
    duration: "7 semaines",
    summary:
      "Un site école avec espace parents : emplois du temps, bulletins, notes et communication directe avec les enseignants.",
    challenge:
      "L'école communiquait par cahiers de liaison souvent perdus et des réunions coûteuses à organiser. Les parents, souvent loin de Lomé pour raisons professionnelles, demandaient un accès simple aux résultats et informations de leurs enfants.",
    solution:
      "Un site vitrine élégant pour attirer les nouvelles familles, doublé d'un espace parents sécurisé : bulletins téléchargeables, notes actualisées, emplois du temps, annonces de l'administration et messagerie directe avec les enseignants. L'équipe administrative met tout à jour sans compétence technique.",
    results: [
      { value: "380", label: "Familles connectées" },
      { value: "-70 %", label: "Appels au secrétariat" },
      { value: "24 h", label: "Mise à jour des notes" },
    ],
    features: ["Espace parents sécurisé", "Bulletins téléchargeables", "Messagerie enseignants", "Annonces & calendrier", "Formation du personnel"],
    testimonial: {
      quote: "Les parents nous remercient chaque semaine. Même depuis l'étranger, ils suivent tout : notes, absences, annonces. Le secrétariat a gagné un temps considérable.",
      name: "Mme Ahouansou",
      role: "Directrice, Académie Horizon",
    },
    tags: ["Éducation", "Espace membre", "Gestion scolaire"],
    accent: "terra" as const,
  },
  {
    slug: "pharma-lome",
    image: `${IMG}/real-pharma-lome.jpg`,
    title: "Pharma Lomé",
    category: "ecommerce" as CaseCategory,
    categoryLabel: "E-commerce",
    client: "Pharma Lomé — Réseau de 3 pharmacies",
    year: "2026",
    duration: "12 semaines",
    summary:
      "Une plateforme de réservation de médicaments avec retrait en pharmacie et vérification de disponibilité en temps réel.",
    challenge:
      "Les clients parcouraient plusieurs pharmacies pour trouver leur traitement, et les pharmaciens passaient leur temps au téléphone à vérifier les stocks. Le réseau de trois pharmacies voulait mutualiser sa disponibilité sans vendre en ligne, pour rester conforme à la réglementation.",
    solution:
      "Une plateforme de recherche et réservation : le client cherche son produit, voit les disponibilités dans les trois pharmacies en temps réel, réserve et retire sur place sous 2 heures avec un code unique. L'inventaire se synchronise automatiquement avec le logiciel des pharmacies, et les ordonnances se pré-téléchargent en photo.",
    results: [
      { value: "3", label: "Pharmacies connectées" },
      { value: "2 h", label: "Délai moyen de retrait" },
      { value: "-45 %", label: "Appels de vérification" },
    ],
    features: ["Recherche de médicaments", "Stock temps réel", "Réservation & retrait", "Ordonnance en photo", "Tableau de bord pharmacien"],
    testimonial: {
      quote: "Nos clients préparent leur visite en un clic et ne se déplacent plus pour rien. L'outil respecte la réglementation et nos équipes l'ont pris en main en une après-midi.",
      name: "Dr Tettekpoe",
      role: "Pharmacien titulaire, Pharma Lomé",
    },
    tags: ["Santé", "Réservation", "Stock temps réel"],
    accent: "gold" as const,
  },
];

export const BLOG_POSTS = [
  {
    slug: "pourquoi-site-web-2026",
    cover: `${IMG}/blog-site-web.jpg`,
    title: "Pourquoi votre entreprise togolaise a vraiment besoin d'un site web en 2026",
    excerpt:
      "80 % de vos prospects vous cherchent en ligne avant d'acheter. Sans site, ce sont vos concurrents qu'ils trouvent. Voici les chiffres et les arguments qui comptent.",
    category: "Stratégie",
    date: "12 août 2026",
    readTime: "6 min",
    author: { name: "K.A.S. Rodrigue", role: "Fondateur, RodLab Studio", initials: "KR", photo: `${IMG}/team-rodrigue.jpg` },
    content: [
      {
        heading: "Vos clients ont déjà changé de comportement",
        paragraphs: [
          "Au Togo, plus de 4 personnes sur 5 possèdent un smartphone et consultent Internet chaque jour. Avant de se déplacer dans une boutique, de réserver une chambre ou de commander un repas, elles vérifient : recherche Google, page Facebook, avis. Si votre entreprise n'apparaît pas, ou apparaît mal, la décision se prend sans vous.",
          "Ce constat ne concerne plus seulement les grandes villes : depuis Kara à Dapaong, la recherche locale passe par le téléphone. Un site web n'est donc plus un luxe de grande entreprise — c'est l'équivalent numérique de votre devanture, ouvert 24 heures sur 24.",
        ],
      },
      {
        heading: "Site vitrine, page Facebook : ce que chacun apporte vraiment",
        paragraphs: [
          "Une page Facebook active est excellente pour créer du lien et publier des actualités. Mais elle vous appartient peu : l'algorithme décide qui voit vos publications, la plateforme peut changer ses règles du jour au lendemain, et vos contenus ne sont pas structurés pour la recherche.",
          "Un site web, lui, reste votre propriété. Il organise votre offre en pages claires, remonte dans les résultats Google, collecte des demandes par formulaire, encaisse des paiements et vous fournit des statistiques fiables. Les deux se complètent : le site convertit, les réseaux attirent.",
        ],
      },
      {
        heading: "Ce qu'un site bien conçu rapporte concrètement",
        paragraphs: [
          "Chez nos clients, un site vitrine professionnel génère en moyenne 15 à 30 demandes qualifiées par mois dès le troisième mois. Pour un commerce avec paiement mobile money intégré, le chiffre d'affaires en ligne dépasse souvent 25 % du total la première année. Pour un hôtel, les réservations directes suppriment 15 à 20 % de commissions de plateformes.",
          "L'investissement se rentabilise typiquement en 3 à 6 mois. L'essentiel est de partir avec des objectifs précis — générer des appels, vendre, prendre des rendez-vous — et de concevoir chaque page pour cet objectif. C'est exactement notre méthode chez RodLab Studio.",
        ],
      },
      {
        heading: "Par où commencer ?",
        paragraphs: [
          "Listez trois choses que votre site doit accomplir (être appelé, montrer vos réalisations, vendre un produit). Rassemblez vos photos, vos prix et vos coordonnées. Puis demandez un devis gratuit : nous transformons ce matériau en un site qui travaille pour vous, livré en trois semaines.",
        ],
      },
    ],
  },
  {
    slug: "integrer-tmoney-flooz-site-web",
    cover: `${IMG}/blog-mobile-money.jpg`,
    title: "T-Money et Flooz sur votre site : comment intégrer le Mobile Money sans se tromper",
    excerpt:
      "Le Mobile Money représente la majorité des transactions en ligne au Togo. Voici notre expérience de l'intégration de T-Money et Flooz sur les sites de nos clients.",
    category: "Technique",
    date: "28 juillet 2026",
    readTime: "8 min",
    author: { name: "Komlan Sodji", role: "Développeur mobile", initials: "KS", photo: `${IMG}/team-komlan.jpg` },
    content: [
      {
        heading: "Pourquoi le Mobile Money change tout pour le e-commerce local",
        paragraphs: [
          "Moins de 5 % des consommateurs togolais possèdent une carte bancaire internationale, mais plus de 60 % utilisent quotidiennement T-Money ou Flooz. En concevant un site avec seulement un paiement par carte, vous vous privez de 95 % de votre marché. L'inverse est vrai : bien intégré, le paiement Mobile Money devient votre meilleur argument de vente.",
          "Nos clients e-commerce constatent des taux de conversion de 70 à 90 % sur les paiements Mobile Money, contre moins de 40 % pour tout autre moyen. Le réflexe est ancré : l'acheteur valide sur son téléphone en quelques secondes.",
        ],
      },
      {
        heading: "Les deux parcours que vos clients attendent",
        paragraphs: [
          "Premier parcours, le plus fluide : le paiement par API marchande. Le client choisit son opérateur, saisit son numéro, valide avec son code PIN sur son téléphone. La confirmation revient automatiquement au site, la commande passe en payée. C'est ce que nous mettons en place via les passerelles agréées Togocom et Moov.",
          "Deuxième parcours, en complément : le transfert manuel vérifié. Le client voit le numéro marchand, effectue le transfert depuis son application, puis saisit l'ID de transaction. Une notification alerte l'équipe qui valide. Plus artisanal, ce mode sauve néanmoins des ventes lorsque l'API rencontre une indisponibilité.",
        ],
      },
      {
        heading: "Les pièges que nous avons appris à éviter",
        paragraphs: [
          "Toujours vérifier l'état du paiement côté serveur avant de livrer : ne jamais se fier uniquement au retour navigateur, qui peut être fermé avant confirmation. Prévoir la gestion des doubles soumissions — le client qui appuie deux fois ne doit pas payer deux fois. Afficher des montants en FCFA sans décimales, et tester chaque scénario : solde insuffisant, timeout, annulation opérateur.",
          "Enfin, soignez la communication : un message clair pendant l'attente de validation (« Composez votre code PIN sur votre téléphone ») réduit drastiquement les abandons et les appels au support.",
        ],
      },
      {
        heading: "Notre recommandation",
        paragraphs: [
          "Si vous vendez en ligne au Togo, intégrez dès le premier jour le paiement Mobile Money comme moyen principal, et la carte comme option secondaire. Nos formules Site Business et Application Sur-Mesure incluent cette intégration clé en main, avec tests et formation de votre équipe.",
        ],
      },
    ],
  },
  {
    slug: "pwa-pme-africaines",
    cover: `${IMG}/blog-pwa.jpg`,
    title: "PWA : l'alternative maligne aux applications mobiles pour les PME africaines",
    excerpt:
      "Installer une application sans passer par les stores, qui fonctionne même sans réseau : les Progressive Web Apps transforment la relation client des PME. Explications.",
    category: "Technique",
    date: "15 juillet 2026",
    readTime: "7 min",
    author: { name: "K.A.S. Rodrigue", role: "Fondateur, RodLab Studio", initials: "KR", photo: `${IMG}/team-rodrigue.jpg` },
    content: [
      {
        heading: "Le problème des applications classiques",
        paragraphs: [
          "Développer une application native (Android et iOS) coûte souvent deux à trois fois plus cher qu'un site, impose de passer par les stores, et nécessite des mises à jour permanentes. Pour une PME, la barrière est double : le coût initial et la maintenance technique continue.",
          "Pire : dans nos réalités, beaucoup de téléphones sont équipés en mémoire modeste, et télécharger une application de 80 Mo sur une connexion payée au mégaoctet dissuade même les clients motivés.",
        ],
      },
      {
        heading: "La PWA, ou l'application légère",
        paragraphs: [
          "Une Progressive Web App est un site web perfectionné qui s'installe sur l'écran d'accueil en une pression — sans store, sans 80 Mo, avec une icône et un plein écran comme une vraie application. Elle démarre instantanément, envoie des notifications, et surtout : elle continue de fonctionner sans Internet.",
          "Ce dernier point est décisif chez nous. Un livreur qui saisit ses preuves de livraison en zone rurale, un commerçant qui consulte son stock quand le réseau coupe, un parent qui relit le bulletin de son enfant dans le bus : tout reste accessible, puis se synchronise dès que la connexion revient.",
        ],
      },
      {
        heading: "Ce que nous livrons concrètement",
        paragraphs: [
          "Nos PWA incluent l'installation sur écran d'accueil, le mode hors-ligne des pages essentielles, les notifications push (nouveau devis, message, avancement de projet), et une interface pensée d'abord pour le tactile. L'application RodLab Studio que vous utilisez en est l'illustration : installez-la depuis votre navigateur et testez-la en coupant le réseau.",
          "Pour une PME, le budget se situe typiquement entre celui d'un site business et d'une application native, avec une maintenance bien plus simple. C'est pourquoi nous recommandons cette architecture par défaut pour les projets avec suivi client, gestion d'équipe ou consultation fréquente.",
        ],
      },
      {
        heading: "Et si votre projet s'y prête ?",
        paragraphs: [
          "Demandez une démonstration : nous vous montrons en 20 minutes, sur votre propre téléphone, ce qu'une PWA changerait pour vos clients et vos équipes. La démonstration est gratuite, en présentiel à Lomé ou en visioconférence.",
        ],
      },
    ],
  },
  {
    slug: "checklist-lancement-site",
    cover: `${IMG}/blog-checklist.jpg`,
    title: "Checklist : 12 points à vérifier avant de lancer votre site web",
    excerpt:
      "Contenus, sécurité, mobile, référencement : la liste exacte que nous passons en revue avant chaque mise en ligne chez RodLab Studio.",
    category: "Conseils",
    date: "2 juin 2026",
    readTime: "5 min",
    author: { name: "Afi Amégan", role: "Designer UI/UX", initials: "AA", photo: `${IMG}/team-afi.jpg` },
    content: [
      {
        heading: "Avant la mise en ligne : les contenus",
        paragraphs: [
          "Un site lancé avec des textes approximatifs perd sa crédibilité dès la première lecture. Vérifiez chaque page : orthographe relue par une seconde personne, coordonnées exactes (numéro, email, adresse), prix à jour, photos réelles de votre activité plutôt que des images génériques. Remplacez impérativement les mentions « Lorem ipsum » et les pages vides par du vrai contenu.",
          "Pensez également aux cas particuliers : que lit un visiteur qui ne connaît pas votre activité ? Que voit-il sur la page d'accueil en trois secondes ? Votre promesse principale doit être compréhensible immédiatement, avec un bouton d'action évident.",
        ],
      },
      {
        heading: "Technique et sécurité",
        paragraphs: [
          "Le site doit être accessible en HTTPS (le petit cadenas), s'afficher correctement sur un téléphone de milieu de gamme, charger en moins de trois secondes sur 3G et présenter aucun lien cassé. Testez tous les formulaires : chaque message doit bien arriver, avec une notification de confirmation pour le visiteur.",
          "Côté référencement, chaque page doit avoir un titre unique et descriptif, les images des textes alternatifs, et une page de contact trouvable depuis n'importe où. Ajoutez votre entreprise sur Google Maps avec le lien vers le site : c'est le premier apport de visiteurs pour une activité locale.",
        ],
      },
      {
        heading: "Les 12 points, en résumé",
        paragraphs: [
          "1. Orthographe relue. 2. Coordonnées exactes. 3. Photos réelles. 4. Aucune page vide. 5. Promesse claire en 3 secondes. 6. HTTPS actif. 7. Test mobile complet. 8. Chargement < 3 s en 3G. 9. Formulaires testés. 10. Titres de pages uniques. 11. Textes alternatifs d'images. 12. Fiche Google Maps reliée.",
          "Imprimez cette liste et gardez-la pour votre prochain lancement — ou confiez-nous la relecture : nous passons chaque projet de nos clients au crible de ces douze points avant chaque mise en production.",
        ],
      },
    ],
  },
];
