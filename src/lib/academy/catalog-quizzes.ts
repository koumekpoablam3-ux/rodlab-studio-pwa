import type { CourseQuizSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue v8.6
 * Examens finaux des 5 nouveaux cours (10 questions chacun, seuil 70 %).
 */
export const CATALOG_QUIZZES: CourseQuizSeed[] = [
  {
    courseSlug: "design-graphique-pro",
    title: "Examen final — Design graphique",
    passScore: 70,
    questions: [
      {
        prompt: "Selon la règle du 60-30-10, que représente les 10 % de couleur d'accent ?",
        options: ["Le fond du visuel", "Les éléments à mettre en valeur (boutons, mots-clés)", "La couleur des photos", "Le texte courant"],
        answer: 1,
        explanation: "Les 10 % d'accent attirent l'œil exactement où il faut : boutons, mots-clés, éléments d'action. Le fond prend 60 %, les blocs secondaires 30 %.",
      },
      {
        prompt: "Combien de familles de polices utilise au maximum un projet professionnel ?",
        options: ["Une seule, toujours", "Deux : une pour les titres, une pour le texte", "Quatre pour varier", "Autant que nécessaire"],
        answer: 1,
        explanation: "La règle des deux polices : une expressive pour les titres, une lisible pour le corps. Au-delà, la mise en page devient brouillonne.",
      },
      {
        prompt: "Pour exporter une affiche destinée à l'impression, il faut :",
        options: ["72 DPI et JPG", "300 DPI et PDF avec fond perdu", "PNG transparent", "Un GIF animé"],
        answer: 1,
        explanation: "Le print exige 300 DPI et un PDF avec fond perdu (3 mm) : la couleur doit déborder au-delà de la coupe pour éviter le liseré blanc.",
      },
      {
        prompt: "Un logo doit impérativement être créé en vectoriel parce que :",
        options: ["C'est plus léger à envoyer", "Il reste net à toutes les tailles, du favicon à la bâche", "Illustrator est plus rapide que Photoshop", "Les pixels ne permettent pas la couleur"],
        answer: 1,
        explanation: "Le vectoriel repose sur des formes mathématiques : le logo passe d'une carte de visite à une bâche de 10 mètres sans jamais se flouter.",
      },
      {
        prompt: "Quel est le premier réflexe pour personnaliser un gabarit Canva ?",
        options: ["Le publier tel quel pour aller vite", "Remplacer palette, polices, images et formes par celles de la marque", "Changer uniquement le texte", "Ajouter plus de décorations"],
        answer: 1,
        explanation: "Un gabarit devient « à vous » quand les quatre couches sont remplacées : palette, typographies, visuels et formes décoratives.",
      },
      {
        prompt: "Sur une affiche d'événement, quelle information mérite la plus grande taille ?",
        options: ["Le logo de l'organisateur", "Le titre de l'événement et la date", "Les remerciements", "Le plan d'accès détaillé"],
        answer: 1,
        explanation: "L'affiche se lit en trois secondes : quoi (le titre), quand (la date en très gros), où. Tout le reste est secondaire.",
      },
      {
        prompt: "Le masque de fusion de Photoshop a un avantage décisif :",
        options: ["Il efface définitivement les pixels", "Il cache sans détruire : on peut revenir en arrière à tout moment", "Il accélère l'export", "Il change automatiquement les couleurs"],
        answer: 1,
        explanation: "Peignez en noir pour cacher, blanc pour montrer : le masque non destructif permet de revenir en arrière sans perte.",
      },
      {
        prompt: "Pour un post Instagram carré, la dimension native à exporter est :",
        options: ["1080 × 1080 px", "500 × 500 px", "300 DPI obligatoires", "1920 × 1080 px"],
        answer: 0,
        explanation: "Le post carré natif Instagram fait 1080 × 1080 px ; la story fait 1080 × 1920 px.",
      },
      {
        prompt: "Pourquoi livrer les fichiers sources au client ?",
        options: ["Pour qu'il paie plus", "Le dossier complet (exports + sources) double la valeur perçue et fidélise", "Parce que la loi l'exige", "Pour occuper son espace de stockage"],
        answer: 1,
        explanation: "Un dossier de livraison structuré (exports nommés, sources, mini-charte) transforme une prestation en service professionnel complet.",
      },
      {
        prompt: "Testez un logo en le réduisant à 16 px pour vérifier :",
        options: ["Ses couleurs", "Sa lisibilité en favicon — il doit rester reconnaissable", "Son poids en Ko", "Sa compatibilité Word"],
        answer: 1,
        explanation: "Le test de l'échelle : un bon logo reste lisible à 16 px (favicon) comme à 3 mètres (façade).",
      },
    ],
  },
  {
    courseSlug: "community-management",
    title: "Examen final — Community management",
    passScore: 70,
    questions: [
      {
        prompt: "Quel est le signal que l'algorithme récompense le plus ?",
        options: ["Le nombre d'abonnés", "Le partage du contenu", "La longueur des légendes", "Le nombre de hashtags"],
        answer: 1,
        explanation: "Le partage est le signal le plus fort : il prolonge la portée vers de nouvelles audiences. Viennent ensuite la complétion vidéo et les commentaires.",
      },
      {
        prompt: "La répartition éprouvée des trois colonnes de contenu est :",
        options: ["40 % utile, 30 % preuve, 30 % lien", "100 % promotion", "50 % photos de produits, 50 % citations", "Autant de chaque plateforme"],
        answer: 0,
        explanation: "Contenu utile (40 %), preuve (30 %) et lien humain (30 %) : le compte devient une ressource que l'on suit, pas une publicité que l'on fuit.",
      },
      {
        prompt: "Que fait un community manager au moment de la définition de persona ?",
        options: ["Il choisit le logo", "Il dresse le portrait précis du client idéal : âge, frustrations, habitudes numériques", "Il rédige les CGU", "Il achète des abonnés"],
        answer: 1,
        explanation: "Le persona précise à qui l'on parle vraiment : écrire pour « Fatima, 28 ans, entrepreneure à Lomé » rend les contenus pertinents.",
      },
      {
        prompt: "Combien d'appels à l'action par publication ?",
        options: ["Un seul", "Deux pour doubler les chances", "Un par plateforme", "Aucun, le client décide seul"],
        answer: 0,
        explanation: "Un seul appel à l'action : deux actions possibles, c'est zéro action — l'attention ne se partage pas.",
      },
      {
        prompt: "La structure d'une vidéo courte efficace est :",
        options: ["Intro longue, conclusion brève", "Hook en 2 secondes, une seule idée, appel à l'action clair", "Musique d'abord, message ensuite", "Un plan unique de 3 minutes"],
        answer: 1,
        explanation: "Hook (0-2 s), corps (une seule idée, plans de 2-4 s), fin avec appel clair : la complétion du visionnage fait la portée.",
      },
      {
        prompt: "Pourquoi sous-titrer systématiquement ses vidéos ?",
        options: ["Pour occuper l'écran", "La majorité regarde sans le son : les sous-titres gardent l'audience", "Parce que c'est obligatoire", "Pour ralentir le spectateur"],
        answer: 1,
        explanation: "Transports, bureau, scroll silencieux : la majorité regarde sans son. Les sous-titres sont de l'accessibilité et de la stratégie.",
      },
      {
        prompt: "Budget de test recommandé pour une première campagne Meta :",
        options: ["2 000 à 5 000 FCFA/jour pendant 4 à 7 jours", "100 FCFA une seule fois", "500 000 FCFA dès le départ", "Zéro, la pub est inutile"],
        answer: 0,
        explanation: "Un petit budget test sur plusieurs jours permet d'arbitrer entre deux variantes et de mesurer le coût par résultat avant d'investir.",
      },
      {
        prompt: "Quelle est l'indicateur le plus parlant pour un client ?",
        options: ["Le nombre d'abonnés", "Le coût par résultat (par message reçu, par clic)", "Le nombre de likes", "La longueur des publications"],
        answer: 1,
        explanation: "Le coût par résultat relie l'effort à l'argent : dépensé, messages reçus, coût par message — c'est ce chiffre qui convainc.",
      },
      {
        prompt: "Face à une réclamation en commentaire, la bonne pratique est :",
        options: ["Supprimer immédiatement", "Accueillir sans excès, passer en privé, résoudre, puis réponse publique brève", "Ignorer une semaine", "Répondre avec ironie"],
        answer: 1,
        explanation: "La réponse publique lue par les futurs visiteurs : accueil posé, résolution en privé, trace publique brève — la marque est jugée sur ce comportement.",
      },
      {
        prompt: "Que contient le rapport mensuel d'une page à un client ?",
        options: ["Uniquement le nombre d'abonnés", "Chiffres clés, top 3 des publications, actions réalisées, 3 recommandations", "Toutes les captures d'écran du mois", "Un poème de motivation"],
        answer: 1,
        explanation: "Une page : chiffres de tête avec évolution, top 3 commenté, actions réalisées et 3 recommandations concrètes pour le mois suivant.",
      },
    ],
  },
  {
    courseSlug: "bureautique-essentielle",
    title: "Examen final — Bureautique essentielle",
    passScore: 70,
    questions: [
      {
        prompt: "La règle de sauvegarde 3-2-1 signifie :",
        options: ["3 copies, 2 supports différents, 1 copie hors site (cloud)", "3 dossiers, 2 disques, 1 mot de passe", "Sauvegarder 3 fois par jour", "3 ordinateurs au minimum"],
        answer: 0,
        explanation: "Trois copies des fichiers importants, sur deux supports différents, dont une hors site : le cloud protège du vol et de la panne.",
      },
      {
        prompt: "Quel raccourci annule la dernière action dans presque tous les logiciels ?",
        options: ["Ctrl+Z", "Ctrl+S", "Ctrl+F", "Alt+Tab"],
        answer: 0,
        explanation: "Ctrl+Z est « le bouton le plus important de l'informatique » : annuler. Ctrl+S enregistre, Ctrl+F cherche, Alt+Tab bascule entre fenêtres.",
      },
      {
        prompt: "Pourquoi utiliser les styles (Titre 1, Titre 2) dans Word plutôt que la mise en forme manuelle ?",
        options: ["Pour la couleur", "Le sommaire automatique et la cohérence en dépendent directement", "Pour économiser de l'encre", "Par tradition"],
        answer: 1,
        explanation: "Les styles alimentent le sommaire automatique et garantissent la cohérence : modifier le style une fois met à jour tout le document.",
      },
      {
        prompt: "Le publipostage sert à :",
        options: ["Envoyer un e-mail en copie cachée", "Générer automatiquement des documents personnalisés à partir d'une liste (Excel)", "Corriger l'orthographe", "Imprimer en recto verso"],
        answer: 1,
        explanation: "Document modèle + liste de données : Word génère 100 lettres, étiquettes ou certificats personnalisés en quelques minutes.",
      },
      {
        prompt: "Dans Excel, une formule commence toujours par :",
        options: ["Le signe =", "Le signe #", "Une majuscule", "Le mot FORMULE"],
        answer: 0,
        explanation: "Toute formule Excel débute par le signe = : =SOMME(B2:B31), =SI(D2>=500000;\"Atteint\";\"En cours\")…",
      },
      {
        prompt: "Quelle fonction compte les cellules qui remplissent un critère ?",
        options: ["NB.SI", "SOMME", "MOYENNE", "MAX"],
        answer: 0,
        explanation: "=NB.SI(B2:B100;\"Payé\") compte les cellules correspondant au critère — la base des tableaux de bord simples.",
      },
      {
        prompt: "À quoi sert le symbole $ dans une référence comme $F$1 ?",
        options: ["À afficher des francs CFA", "À figer la référence quand on recopie la formule", "À rendre la cellule invisible", "À multiplier"],
        answer: 1,
        explanation: "Le $ fige colonne et/ou ligne : en recopiant la formule, toutes les cellules pointent toujours vers le même taux, le même coefficient.",
      },
      {
        prompt: "Quel type de graphique choisir pour montrer une évolution dans le temps ?",
        options: ["Le graphique en ligne", "Le camembert", "L'histogramme 3D", "Le nuage de mots"],
        answer: 0,
        explanation: "La ligne montre l'évolution temporelle ; les colonnes comparent des catégories ; le camembert (5-6 parts max) montre une répartition.",
      },
      {
        prompt: "La règle d'or d'une diapositive PowerPoint est :",
        options: ["Une idée par slide, 20 mots maximum", "Tout le discours écrit en petit", "Le maximum d'animations", "Une police par slide"],
        answer: 0,
        explanation: "Une idée par diapositive, peu de mots : si tout est écrit, l'audience lit au lieu d'écouter — et vous devenez un lecteur à voix haute.",
      },
      {
        prompt: "Pour travailler à plusieurs sur un document, la bonne pratique est :",
        options: ["S'envoyer des pièces jointes « final-v3-corrigé »", "Partager un lien cloud avec des droits définis (consulter/modifier)", "Travailler chacun sur sa version", "Imprimer et recopier"],
        answer: 1,
        explanation: "Le lien cloud (Drive, OneDrive) avec droits choisis garde une version unique, un historique restaurable et des commentaires en marge.",
      },
    ],
  },
  {
    courseSlug: "identite-de-marque",
    title: "Examen final — Identité de marque",
    passScore: 70,
    questions: [
      {
        prompt: "Le positionnement d'une marque se formule avec :",
        options: ["Un slogan poétique", "La formule : pour [cible], [marque] est [catégorie] qui [bénéfice], parce que [preuve]", "Une liste de prix", "Le logo seul"],
        answer: 1,
        explanation: "Le positionnement définit la place unique dans l'esprit du client : cible, catégorie, bénéfice clé, preuve — avant tout dessin.",
      },
      {
        prompt: "Combien d'adjectifs précis définissent une personnalité de marque ?",
        options: ["3 à 5, précis et distinctifs", "« Moderne » et « professionnel » suffisent", "Aucun, la marque improvise", "20 pour couvrir tout"],
        answer: 0,
        explanation: "3 à 5 adjectifs précis (« directe et chaleureuse, avec une pointe d'audace ») deviennent la référence de chaque décision visuelle et verbale.",
      },
      {
        prompt: "À quoi sert l'audit concurrentiel avant la création ?",
        options: ["À copier le leader", "À repérer les codes du secteur et les espaces libres pour se différencier", "À calculer les salaires", "À remplir un site web"],
        answer: 1,
        explanation: "L'audit montre les codes à connaître et les espaces libres : si tous sont bleus et sobres, un accent affirmé rend immédiatement identifiable.",
      },
      {
        prompt: "Le test de la silhouette consiste à :",
        options: ["Imprimer le logo en grand", "Noircir le logo : la forme doit rester reconnaissable", "Le tester au téléphone", "Mesurer son poids en Ko"],
        answer: 1,
        explanation: "Noirci, un bon logo reste reconnaissable : la forme porte l'identité, pas la couleur ni les effets.",
      },
      {
        prompt: "Combien de pistes de logo présente-t-on au client ?",
        options: ["Trois directions sérieuses, pas trente", "Trente pour faire plaisir", "Une seule, sans discussion", "Aucune, on livre direct"],
        answer: 0,
        explanation: "Trois pistes distinctes permettent de choisir un cap ; trente variantes d'une même idée produisent une réunion confuse et un logo moyen.",
      },
      {
        prompt: "Quel fichier permet à un logo de rester net à toutes les tailles ?",
        options: ["Le JPG", "Le SVG / PDF vectoriel", "Le screenshot", "Le GIF"],
        answer: 1,
        explanation: "Le vectoriel (SVG, PDF, EPS) repose sur des formes mathématiques : net du favicon à la bâche. Livrez aussi des PNG transparents.",
      },
      {
        prompt: "La zone de protection d'un logo est :",
        options: ["Un cadre imprimé", "Un espace vide minimum autour du logo qu'aucun élément n'empiète", "Un mot de passe", "Le fond de la page"],
        answer: 1,
        explanation: "Le logo s'entoure d'un vide minimum (souvent la hauteur d'une lettre du nom) : c'est ce qui préserve sa lisibilité sur tout support.",
      },
      {
        prompt: "Que doit contenir une charte graphique d'une page ?",
        options: ["Palette codée, polices, usages du logo et interdits", "Seulement le logo", "L'historique de l'entreprise", "Les contrats clients"],
        answer: 0,
        explanation: "La page unique : couleurs (HEX/CMJN), deux polices avec hiérarchie, règles et interdits du logo. Le livre complet vient avec la croissance.",
      },
      {
        prompt: "Pourquoi chaque règle de charte doit-elle être illustrée « à faire / à ne pas faire » ?",
        options: ["Pour remplir le document", "La règle illustrée est comprise même par les non-créatifs", "Par tradition juridique", "Pour doubler le nombre de pages"],
        answer: 1,
        explanation: "L'exemple fait et l'exemple défendu rendent la règle visuelle : un community manager ou un imprimeur l'applique correctement sans formation.",
      },
      {
        prompt: "Comment corriger un logo qui change de couleur sur chaque support ?",
        options: ["Redessiner tout", "Revenir à la charte et redistribuer les fichiers officiels à tous les producteurs", "Changer de nom", "Supprimer les réseaux"],
        answer: 1,
        explanation: "Le logo-caméléon se soigne par la charte : redistribuer les fichiers officiels + gabarits verrouillés + audit trimestriel de cohérence.",
      },
    ],
  },
  {
    courseSlug: "photo-video-smartphone",
    title: "Examen final — Photo & vidéo au smartphone",
    passScore: 70,
    questions: [
      {
        prompt: "La règle la plus rentable en photo : placer le sujet…",
        options: ["Dos à la fenêtre", "Face à la source de lumière (fenêtre, porte ouverte)", "Sous le soleil de midi", "Dans le noir complet"],
        answer: 1,
        explanation: "Un sujet face à la lumière obtient un rendu doux et uniforme. Le contre-jour et le midi dur sont des choix volontaires, jamais des accidents.",
      },
      {
        prompt: "Quelle est la meilleure heure pour photographier en extérieur ?",
        options: ["L'heure dorée (après le lever, avant le coucher)", "12 h 00 en plein soleil", "Nuit sans lumière", "Peu importe"],
        answer: 0,
        explanation: "L'heure dorée offre une lumière chaude et des ombres longues. À midi, la lumière verticale creuse les yeux : passez à l'ombre.",
      },
      {
        prompt: "La règle des tiers consiste à :",
        options: ["Diviser l'image en trois couleurs", "Placer le sujet sur les intersections de la grille, pas au centre exact", "Prendre trois photos", "Filmer en trois plans"],
        answer: 1,
        explanation: "Activez la grille de l'appareil et placez le sujet sur une intersection : l'image respire et l'œil circule naturellement.",
      },
      {
        prompt: "Pourquoi nettoyer l'objectif avant chaque session ?",
        options: ["Par hygiène", "La lentille graissée dans la poche floute toute la journée — c'est LE conseil le plus rentable", "Pour la garantie", "Pour le zoom"],
        answer: 1,
        explanation: "Le téléphone vit dans la poche : un chiffon doux sur la lentille avant de shooter améliore instantanément toutes les photos.",
      },
      {
        prompt: "Le zoom numérique d'un téléphone :",
        options: ["Améliore la qualité", "Détruit la qualité : rapprochez-vous physiquement", "Est indispensable", "Change la lumière"],
        answer: 1,
        explanation: "Le zoom numérique agrandit les pixels au lieu d'opter pour une vraie focale : rapprochez-vous du sujet, toujours.",
      },
      {
        prompt: "Dans une vidéo verticale, que se passe-t-il dans les 2 premières secondes ?",
        options: ["Rien d'important", "Tout : le hook décide si le spectateur reste ou défile", "On attend la musique", "On présente le logo"],
        answer: 1,
        explanation: "Le hook (résultat d'abord, question choquante, avant/après) retient l'attention : la complétion du visionnage est le signal que l'algorithme récompense.",
      },
      {
        prompt: "Quelle est la meilleure dépense audio pour débuter ?",
        options: ["Un micro-cravate filaire (10 000-15 000 FCFA)", "Une enceinte Bluetooth", "Un logiciel payant", "Rien, le son ne compte pas"],
        answer: 0,
        explanation: "Le spectateur pardonne une image moyenne, jamais un son mauvais : le micro-cravate est la moitié de la qualité perçue.",
      },
      {
        prompt: "Le rythme d'une vidéo se construit au montage en :",
        options: ["Ajoutant des effets partout", "Coupant : une action par plan, 2 à 4 secondes, zéro temps mort", "Ralentissant tout", "Filmant plus longtemps"],
        answer: 1,
        explanation: "Le rythme se crée en enlevant : plans courts, une action chacun, silences supprimés. 20 secondes denses battent 90 secondes diluées.",
      },
      {
        prompt: "Où placer les sous-titres pour qu'ils restent lisibles ?",
        options: ["Tout en bas, sous l'interface", "Centre-bas, au-dessus des zones d'interface, avec ombre ou fond léger", "En haut à gauche, minuscules", "N'importe où"],
        answer: 1,
        explanation: "Centre-bas mais au-dessus des boutons d'interface, 4 à 7 mots par bloc, style constant : la lecture doit rester instantanée.",
      },
      {
        prompt: "Pour la musique d'une vidéo destinée à un client :",
        options: ["N'importe quelle chanson à la mode", "Une banque libre de droits ou la bibliothèque de la plateforme — jamais de tube commercial", "Du silence", "Enregistrer la radio"],
        answer: 1,
        explanation: "Une chanson commerciale sur un usage commercial peut coûter la suppression du son ou du compte : banques libres de droits uniquement.",
      },
    ],
  },
];
