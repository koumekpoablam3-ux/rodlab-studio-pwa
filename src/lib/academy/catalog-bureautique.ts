import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue v8.6
 * Cours 4/6 : « Bureautique essentielle : Word, Excel, PowerPoint »
 */
export const COURSE_BUREAUTIQUE: CourseSeed = {
  slug: "bureautique-essentielle",
  title: "Bureautique essentielle : Word, Excel, PowerPoint",
  subtitle:
    "L'ordinateur sans stress, des documents Word impeccables, des tableaux Excel qui calculent tout seuls et des présentations PowerPoint qui impressionnent : le socle exigé par tous les emplois.",
  description:
    "Une formation 100 % pratique où vous maîtrisez l'ordinateur au quotidien (fichiers, sauvegardes, sécurité), puis les trois outils que tout employeur attend : Word pour des documents professionnels, Excel pour gérer et analyser des données, PowerPoint pour présenter avec impact. Vous suivez 4 modules à votre rythme, leçon par leçon, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de réussite, vous obtenez un certificat RodLab Studio vérifiable et téléchargeable en PDF.",
  level: "Débutant",
  durationHours: 12,
  skills: [
    "Organiser ses fichiers et ne plus jamais perdre un document",
    "Créer des documents Word propres : styles, sommaire, tableaux",
    "Automatiser le courrier avec le publipostage",
    "Maîtriser les formules Excel essentielles (SOMME, MOYENNE, SI)",
    "Construire des graphiques lisibles et des impressions propres",
    "Présenter avec des diapositives qui soutiennent le discours",
  ],
  modules: [
    {
      order: 1,
      title: "L'ordinateur sans stress",
      summary:
        "Les réflexes de base que personne n'enseigne : organiser ses fichiers, utiliser les raccourcis qui font gagner des heures, naviguer sur Internet et e-mail en sécurité.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Fichiers, dossiers et sauvegardes : la maison numérique",
          minutes: 14,
          content:
            "Un ordinateur est une maison : si chaque chose n'a pas sa place, on perd un temps fou à chercher. La règle d'or des professionnels : un seul dossier racine (Documents, ou « Travail »), à l'intérieur duquel chaque grand projet devient un dossier, et chaque dossier reçoit des fichiers nommés selon un format fixe — « date-client-document-version » (ex. : 2026-03-devis-hotel-palma-v2).\n\n## La sauvegarde 3-2-1, adaptée à la réalité\n\n- 3 copies des fichiers importants\n- 2 supports différents (l'ordinateur + un disque externe ou une clé)\n- 1 copie hors site : le cloud (Google Drive, OneDrive) protège du vol et de la panne\n\nLes clés USB se perdent et se corrompent : ne comptez que sur elles, c'est prendre un risque inutile. Le réflexe simple : travaillez directement dans le dossier synchronisé avec le cloud, et copiez chaque fin de semaine les fichiers critiques sur un disque externe. Dix minutes par semaine qui sauvent des années de travail.",
        },
        {
          order: 2,
          title: "Raccourcis et astuces qui font gagner des heures",
          minutes: 12,
          content:
            "La différence entre un utilisateur lent et un utilisateur efficace tient à une poignée de réflexes. Les raccourcis clavier sont le premier : la main reste sur le clavier au lieu d'aller chercher chaque action dans les menus. Ceux-ci fonctionnent dans presque tous les logiciels, y compris Word, Excel et le navigateur.\n\n## Les raccourcis qui changent le quotidien\n\n- Ctrl+C / Ctrl+X / Ctrl+V : copier / couper / coller\n- Ctrl+Z : annuler — le bouton le plus important de l'informatique\n- Ctrl+F : chercher dans un document ou une page web\n- Alt+Tab : basculer entre les fenêtres ouvertes\n- Ctrl+S : enregistrer — à faire devenir un tic\n- Ctrl+Maj+V : coller sans mise en forme (le sauveur des documents propres)\n\nDeuxième réflexe : le clic droit expose presque toujours plus d'options que le clic simple. Troisième réflexe : quand vous cherchez une fonction, tapez son nom dans la barre de recherche du logiciel au lieu de fouiller les menus. L'objectif n'est pas de tout mémoriser, mais d'automatiser les dix gestes que vous répétez cent fois par jour.",
        },
        {
          order: 3,
          title: "Internet, e-mail et sécurité de base",
          minutes: 14,
          content:
            "Le navigateur et la messagerie sont les deux outils les plus utilisés au travail — et les portes d'entrée de la plupart des problèmes. Trois réflexes suffisent à éviter l'essentiel des pièges.\n\n## Les trois réflexes de sécurité\n\nPremier réflexe : le mot de passe fort et unique par service, géré par un gestionnaire (celui du navigateur convient très bien). Deuxième réflexe : la double authentification (code reçu par SMS ou application) sur la messagerie et les réseaux — elle bloque la quasi-totalité des piratages de comptes. Troisième réflexe : le doute systématique devant l'urgence. « Votre compte sera bloqué, cliquez vite » est le schéma de toutes les arnaques ; en cas de doute, on ne clique jamais, on va soi-même sur le site officiel.\n\nPour l'e-mail professionnel : un objet clair (« Devis n° 24 — Hôtel Palma »), un message court, une pièce jointe nommée proprement, et une réponse sous 24 h même si c'est pour dire « je reviens vers vous vendredi ». La réactivité est la première qualité perçue au travail.",
        },
      ],
    },
    {
      order: 2,
      title: "Word : des documents professionnels",
      summary:
        "Contrats, rapports, courriers : vous apprenez la mise en forme par styles, les sommaires automatiques, les tableaux propres et le publipostage qui envoie 100 lettres personnalisées en 5 minutes.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "Mise en forme propre : styles, titres, sommaire automatique",
          minutes: 18,
          content:
            "Le réflexe amateur : sélectionner chaque titre pour le mettre en gras et en rouge, un par un. Résultat : un document incohérent, impossible à mettre à jour. Le réflexe professionnel : utiliser les styles (Accueil > Styles) — Titre 1 pour les grandes parties, Titre 2 pour les sous-parties, Normal pour le texte. On définit l'apparence une fois, elle s'applique partout.\n\n## La puissance du sommaire automatique\n\nQuand vos titres utilisent les styles, Word peut générer un sommaire automatique (Références > Table des matières) : une seule ligne de menu, et le sommaire se met à jour avec les numéros de pages exacts après chaque modification (clic droit > Mettre à jour les champs). Pour un rapport de 30 pages, c'est la différence entre 2 heures de corrections et 2 secondes.\n\n- Définissez d'abord la police et la taille du style Normal, tout le document en hérite\n- Utilisez des interlignes 1,15 ou 1,5 : la lecture en est transformée\n- Les sauts de page (Ctrl+Entrée) structurent les grandes sections, pas les touches Entrée\n- Alignez à gauche par défaut ; le justifié crée des rivières blanches inélégantes",
        },
        {
          order: 2,
          title: "Tableaux, images et pages de garde",
          minutes: 16,
          content:
            "Un document professionnel n'est pas qu'une suite de paragraphes : il contient des tableaux de données, des images illustratives, une page de garde soignée. Chacun a ses règles simples.\n\n## Les tableaux\n\nInsérez le tableau (Insertion > Tableau), remplissez, puis utilisez les styles de tableau intégrés — une ligne d'en-tête sombre et des lignes alternées se lisent mieux que des bordures lourdes de partout. Cochez « Ligne d'en-tête » dans l'onglet Disposition pour que l'en-tête se répète automatiquement quand le tableau s'étale sur plusieurs pages : le détail qui distingue un rapport sérieux.\n\n## Les images et la page de garde\n\n- Une image s'insère en ligne avec le texte (Insertion > Images) ; pour la placer librement, choisissez l'habillage « Devant le texte » ou « Carré »\n- Redimensionnez toujours par un coin pour respecter les proportions\n- La page de garde (Insertion > Page de garde) donne un rendu instantané : titre, sous-titre, date, auteur\n- Numérotez les pages (Insertion > Numéro de page) — un document sans pagination perd sa crédibilité dès la deuxième page",
        },
        {
          order: 3,
          title: "Le publipostage : 100 lettres en 5 minutes",
          minutes: 16,
          content:
            "Le publipostage est la fonction la plus impressionnante de Word — et la moins connue. Elle génère automatiquement autant de lettres, étiquettes ou enveloppes que de destinataires, chacun avec son nom, son adresse, son montant. Le principe : un document modèle + une liste de données (Excel), et Word génère tout seul chaque document personnalisé.\n\n## La marche à suivre\n\n- Préparez votre liste dans Excel : une ligne par destinataire, une colonne par information (Nom, Adresse, Ville, Montant…)\n- Dans Word, ouvrez votre lettre modèle, puis Publipostage > Démarrer la fusion > Lettres\n- Sélectionnez les destinataires : « Utiliser une liste existante » → votre fichier Excel\n- Insérez les champs de fusion dans le texte : « Cher <<Nom>>… »\n- Aperçu des résultats, puis « Terminer et fusionner » : Word crée toutes les lettres\n\nLe même mécanisme produit des certificats de participation, des étiquettes d'adresse, des attestations personnalisées. C'est exactement le genre de tâche que vous pourrez facturer : « Je vous prépare 200 invitations personnalisées pour demain » devient un service, pas une corvée.",
        },
      ],
    },
    {
      order: 3,
      title: "Excel : le tableur au travail",
      summary:
        "Du tableau simple aux formules qui calculent tout seuls : la saisie propre, les formules essentielles, et des graphiques que tout dirigeant comprend en dix secondes.",
      minutes: 55,
      lessons: [
        {
          order: 1,
          title: "Saisie, tri et mise en forme de tableaux",
          minutes: 18,
          content:
            "Excel organise les données en cellules — colonnes (A, B, C…) et lignes (1, 2, 3…). La première règle professionnelle : une information par cellule, une ligne par enregistrement, une colonne par champ. Un tableau de ventes propre, c'est : Date | Client | Produit | Quantité | Prix unitaire | Total. Cette discipline de saisie détermine tout ce que vous pourrez faire ensuite — trier, filtrer, calculer.\n\n## Les manipulations de base\n\n- Le coin inférieur droit d'une cellule se tire pour recopier une formule ou une série (janvier, février, mars…)\n- Ctrl+Maj+Flèche sélectionne jusqu'à la dernière donnée : fini les sélections à la souris interminables\n- Données > Trier et Filtrer : un clic sur l'entonnoir filtre par valeur, par texte, par date\n- Format > Nombre : les montants en FCFA, les dates en date — jamais de texte là où il faut calculer\n\nMettez la première ligne en gras et figez-la (Affichage > Figer la ligne supérieure) : elle reste visible quand vous défilez. Ces petits réflexes rendent vos tableaux agréables à lire — et vous crédibles devant un patron ou un client.",
        },
        {
          order: 2,
          title: "Formules essentielles : SOMME, MOYENNE, SI, NB",
          minutes: 20,
          content:
            "Une formule commence toujours par le signe =. Les quatre fonctions ci-dessous couvrent 80 % des besoins quotidiens — les maîtriser suffit à transformer un tableau statique en outil de pilotage.\n\n## Les incontournables\n\n- =SOMME(B2:B31) : additionne une plage (les ventes du mois)\n- =MOYENNE(C2:C100) : la valeur moyenne (panier moyen, note moyenne)\n- =NB.SI(B2:B100;\"Payé\") : compte les cellules qui remplissent un critère\n- =SI(D2>=500000;\"Objectif atteint\";\"En cours\") : une décision automatique selon un test\n\nLa fonction SI est la porte d'entrée de l'automatisation : elle compare une valeur à un seuil et renvoie un résultat différent selon le cas. Combinez-la avec NB.SI et SOMME.SI pour des tableaux de bord qui se mettent à jour dès qu'une ligne change.\n\nDeux réflexes de pro : utilisez les références de cellules (=B2*C2, jamais 1500*3 tapés à la main), et nommez vos plages importantes (Formules > Définir un nom) pour des formules lisibles : =SOMME(Ventes_Mars). Quand vous copiez une formule, faites attention aux références : ajoutez un $ devant la colonne ou la ligne à figer (=B2*$F$1 pour toujours multiplier par le même taux).",
        },
        {
          order: 3,
          title: "Graphiques et impressions propres",
          minutes: 17,
          content:
            "Un chiffre convainc, une image convainc en dix secondes. Excel transforme vos données en graphiques en trois clics : sélectionnez la plage, Insertion > Graphique recommandé. Le choix du type fait toute la différence : colonnes pour comparer des catégories, ligne pour montrer une évolution dans le temps, secteurs (camembert) pour une répartition en parts — et jamais plus de 5-6 parts, sinon la lecture devient impossible.\n\n## Soigner le graphique\n\n- Un titre qui dit la conclusion : « Ventes : +34 % au 2e trimestre », pas « Graphique 1 »\n- Supprimez le superflu : grille trop dense, légendes redondantes, effets 3D datés\n- Une couleur d'accent pour la série importante, gris clair pour le reste\n- Étiquettes de données sur les valeurs clés, plutôt qu'un axe que le lecteur doit décoder\n\nPour l'impression : Mise en page > Zone d'impression pour ne sortir que le tableau utile, « Faire tenir sur une page » pour l'échelle, et vérifiez toujours l'aperçu avant d'imprimer — rien ne compromet un rapport comme un tableau coupé en deux sur deux pages.",
        },
      ],
    },
    {
      order: 4,
      title: "PowerPoint & communication",
      summary:
        "Des diapositives qui soutiennent le discours au lieu de le remplacer, la posture pour présenter avec assurance, et l'e-mail professionnel plus le travail collaboratif.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Diaporamas qui soutiennent le discours",
          minutes: 16,
          content:
            "Le péché capital des présentations : transformer PowerPoint en document de lecture. Un slide n'est pas un rapport — c'est un support visuel qui appuie ce que vous dites. La règle des professionnels : une idée par diapositive, un maximum de 20 mots par slide. Si tout votre discours est écrit sur la diapositive, l'audience lit au lieu de vous écouter, et vous devenez un lecteur à voix haute.\n\n## La structure d'une présentation qui marque\n\n- Slide 1 : le titre + qui vous êtes (10 secondes, on y reste peu)\n- Slide 2 : le problème ou la question — c'est elle qui accroche l'audience\n- Slides 3 à 8 : le cœur, une idée par slide, avec visuel dominant et peu de texte\n- Slide finale : la conclusion ou l'appel à l'action — ce que vous voulez qu'il se passe\n\nCôté forme : utilisez le modèle du thème (Création > Thèmes) pour une cohérence automatique, une seule famille de polices, et des images en pleine page plutôt que des puces à répétition. Les transitions sobres (fondu) suffisent ; les animations spectaculaires décrédibilisent en réunion professionnelle.",
        },
        {
          order: 2,
          title: "Présenter en public avec assurance",
          minutes: 14,
          content:
            "L'outil ne fait pas l'orateur : c'est votre présence qui porte le message. La préparation est le meilleur remède au trac — non pas apprendre par cœur, mais maîtriser le fil : l'introduction, les trois idées du corps, la conclusion. Avec ce squelette en tête, un oubli de détail ne casse jamais la présentation.\n\n## Les techniques qui changent tout\n\n- La règle 10-20-30 de Guy Kawasaki : 10 slides, 20 minutes, police minimale 30 — la concision force la clarté\n- Répétez à voix haute au moins deux fois : ce que vous découvrez à voix haute, l'audience le sent\n- Regardez trois points dans la salle (gauche, centre, droite) : tout le monde se sent regardé\n- Parlez plus lentement que votre sensation : votre perception du rythme est déformée par le trac\n- Prévoyez les questions probables et préparez des réponses en une phrase\n\nEt le jour J, arrivez en avance pour tester la projection, le son et le clic : les incidents techniques se règlent mal à la dernière minute. Si le matériel tombe en panne, vous devez pouvoir présenter sans slides — c'est le test ultime de la maîtrise du sujet.",
        },
        {
          order: 3,
          title: "E-mail pro et travail collaboratif (Drive, partage)",
          minutes: 15,
          content:
            "L'e-mail professionnel a ses codes — et ils comptent, parce que la messagerie reste le premier canal du monde du travail. Un bon e-mail tient en quatre blocs : l'objet informatif (« Proposition site web — Hôtel Palma »), la salutation brève, le corps structuré (une demande ou une info par paragraphe, les questions numérotées), la formule de politesse courte. Répondre sous 24 h, même par un simple accusé, est la norme professionnelle.\n\n## Le collaboratif : fin des pièces jointes interminables\n\n- Google Drive ou OneDrive : le fichier vit en ligne, tout le monde travaille sur la même version\n- Le partage se fait par lien avec droits : « Peut consulter » ou « Peut modifier » — choisissez consciemment\n- Historique de versions : un fichier écrasé par erreur se restaure en deux clics\n- Les commentaires en marge remplacent les allers-retours d'e-mails contradictoires\n\nLa bonne pratique : pour toute révision de document à plusieurs, un lien cloud plutôt qu'une pièce jointe. Les versions « rapport-final-v3-corrigé-VRAIMENT-final.xlsx » disparaissent, et avec elles la moitié des malentendus d'équipe.",
        },
      ],
    },
  ],
};
