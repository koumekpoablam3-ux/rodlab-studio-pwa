import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue v8.6
 * Cours 2/6 : « Design graphique : créez des visuels qui marquent »
 */
export const COURSE_DESIGN: CourseSeed = {
  slug: "design-graphique-pro",
  title: "Design graphique : créez des visuels qui marquent",
  subtitle:
    "Couleurs, typographies, composition, Canva, Photoshop et Illustrator : la méthode de l'atelier RodLab pour produire des affiches, logos et visuels réseaux de niveau professionnel.",
  description:
    "Une formation 100 % pratique où vous apprenez les vraies règles du design — couleurs, typographies, composition — puis à les appliquer dans Canva et les outils professionnels pour créer des affiches, des flyers, des visuels de réseaux sociaux et des logos propres. Vous suivez 4 modules à votre rythme, leçon par leçon, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de réussite, vous obtenez un certificat RodLab Studio vérifiable et téléchargeable en PDF.",
  level: "Débutant",
  durationHours: 10,
  skills: [
    "Construire des palettes harmonieuses et lisibles",
    "Marier des polices et hiérarchiser un texte",
    "Composer des affiches et flyers qui se lisent en 3 secondes",
    "Créer et exporter des gabarits pro dans Canva",
    "Utiliser calques, détourage et vectoriel (Photoshop / Illustrator)",
    "Livrer des fichiers sources et des exports print/web corrects",
  ],
  modules: [
    {
      order: 1,
      title: "Les fondations du design visuel",
      summary:
        "Avant les outils, les règles qui ne changent pas : comment la couleur transmet une émotion, comment la typographie guide la lecture et comment la composition ordonne l'œil.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "La couleur : construire une palette qui raconte",
          minutes: 16,
          content:
            "La couleur est le premier message qu'un visuel envoie, avant même le texte. Chaque teinte porte une émotion : le vert forêt inspire la confiance et la croissance, le terracotta la chaleur et la proximité, l'or le prestige, le bleu la sécurité. Un bon designer ne choisit pas des couleurs qu'il « aime » : il choisit celles qui parlent à la cible et au secteur d'activité.\n\n## La règle du 60-30-10\n\nPour éviter les palettes brouillonnes, les professionnels utilisent une répartition simple : 60 % de couleur dominante (souvent un fond neutre), 30 % de couleur secondaire (les blocs et illustrations), 10 % de couleur d'accent (boutons, mots-clés, éléments à souligner). C'est cette petite part d'accent qui attire l'œil exactement où il faut.\n\n- Limitez chaque projet à 3 couleurs maximum, plus le blanc et le noir\n- Vérifiez toujours le contraste : un texte doit se lire au premier coup d'œil\n- Testez votre palette en noir et blanc : si la hiérarchie survit, elle est solide\n- Gardez vos palettes dans un fichier texte (codes HEX) pour les réutiliser",
        },
        {
          order: 2,
          title: "Typographie : choisir et marier des polices",
          minutes: 14,
          content:
            "La typographie occupe jusqu'à 80 % d'un visuel : c'est elle qui rend un message lisible ou illisible. Deux grandes familles suffisent à comprendre l'essentiel : les serifs (avec empattements, comme Times ou Fraunces) qui évoquent le classique, le prestige et l'éditorial ; les sans-serif (sans empattements, comme Inter ou Montserrat) qui évoquent la modernité, la simplicité et la tech.\n\n## La règle des deux polices\n\nUn projet professionnel utilise au maximum deux familles : une pour les titres (expressive, avec du caractère) et une pour le corps de texte (lisible, discrète). Pour les marier, jouez le contraste : un serif fort avec un sans-serif neutre fonctionne presque toujours. Deux polices trop similaires créent un effet d'erreur.\n\n- Évitez les polices décoratives dans le corps de texte : elles fatiguent la lecture\n- Limitez les graisses à deux par police (regular + bold, par exemple)\n- La taille parle : un titre fort fait 2 à 3 fois la taille du texte courant\n- Interligne généreux (1,4 à 1,6) = texte aéré = lecture confortable",
        },
        {
          order: 3,
          title: "Composition : hiérarchie, alignement, espaces",
          minutes: 15,
          content:
            "La composition décide de l'ordre dans lequel l'œil traverse votre visuel. Un bon design raconte : d'abord le titre (l'accroche), puis l'information clé, enfin l'action à mener (contact, date, QR code). Si tout crie en même temps, rien n'est entendu.\n\n## Trois leviers immédiats\n\nPremier levier : l'alignement. Aligner les éléments entre eux crée un fil invisible qui structure la page — c'est la différence la plus visible entre amateur et pro. Deuxième levier : l'espace blanc. Il n'est pas « perdu » : il isole, respire et met en valeur. Un affiche bourrée d'informations est une affiche jetée. Troisième levier : la hiérarchie par la taille et le gras — un seul élément doit dominer.\n\n- Une accroche, un message, une action : sinon découpez en plusieurs visuels\n- Utilisez une grille mentale : marges égales, colonnes régulières\n- Le contraste guide : fond sombre + texte clair, ou l'inverse, jamais les deux moyens\n- Reculez de 2 mètres : si le message principal ne se lit pas, recommencez",
        },
      ],
    },
    {
      order: 2,
      title: "Canva : de zéro à pro",
      summary:
        "Canva est l'outil le plus rapide pour produire proprement. Vous apprenez à démarrer vite avec les gabarits, à les personnaliser pour ne pas ressembler à tout le monde, et à exporter au bon format.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "L'interface et les gabarits : démarrer vite",
          minutes: 15,
          content:
            "Canva organise le travail autour de trois zones : la toile centrale où vous composez, la barre d'outils supérieure (texte, éléments, téléchargement) et le panneau latéral (gabarits, polices, photos). Le réflexe professionnel consiste à partir d'un gabarit proche du résultat voulu, puis à le modifier — jamais à créer une page blanche quand le client attend un livrable rapide.\n\n## Organiser son espace dès le premier jour\n\nCréez deux dossiers dès maintenant : « Clients » (un sous-dossier par client) et « Gabarits maison » (vos compositions réutilisables). Chaque projet dupliqué à partir d'un gabarit sauve 30 à 60 minutes. Renommez chaque fichier avec un format clair : « client-type-support-date ».\n\n- Partez d'un gabarit, mais changez au minimum la palette et la police\n- Verrouillez les éléments de fond pour ne pas les déplacer par erreur\n- Utilisez les grilles (Position > Grilles) pour aligner proprement\n- Le mode « Redimensionner » transforme un post carré en story en un clic",
        },
        {
          order: 2,
          title: "Personnaliser un gabarit : votre identité, pas un modèle générique",
          minutes: 18,
          content:
            "Le piège numéro un des débutants : livrer un gabarit Canva reconnaissable entre mille. Le client paie pour une identité, pas pour un modèle vu 10 000 fois. La bonne méthode : conserver la structure du gabarit (son squelette), puis remplacer systématiquement les couleurs, les polices, les images et les formes.\n\n## La checklist de personnalisation\n\nUn gabarit devient « à vous » quand quatre couches ont été remplacées : la palette (vos codes HEX enregistrés dans Marque), les typographies (vos deux familles), les visuels (photos libres ou photos du client, jamais les images saturées par défaut) et les formes décoratives (remplacez les blobs génériques par des éléments liés au secteur).\n\n- Créez une « Marque » Canva par client : logo, palette, polices enregistrées\n- Remplacez le texte par de vrais messages, jamais les lorem ipsum du gabarit\n- Ajustez les espaces : les gabarits serrés respirent mal avec du texte français\n- Comparez avant/après : si votre version ressemble encore au gabarit, continuez",
        },
        {
          order: 3,
          title: "Exports : formats, résolutions, print vs web",
          minutes: 17,
          content:
            "Un beau visuel mal exporté devient inutilisable : photo floue à l'impression, fichier de 15 Mo refusé par WhatsApp, PDF non convertible par l'imprimeur. Chaque usage a son format, et le professionnel le connaît par cœur.\n\n## Les exports à connaître\n\n- JPG : photos et visuels web légers — qualité 80-90 %, le bon compromis\n- PNG : logos, éléments avec transparence, textes fins sur fond uni\n- PDF Impression : affiches et flyers, avec repères et fond perdu si l'imprimeur l'exige\n- PDF Standard : envois par e-mail et archivage, plus léger\n- MP4 : animations Canva pour les réseaux\n\nPour le print, travaillez à 300 DPI et ajoutez 3 mm de fond perdu : la couleur doit déborder au-delà de la coupe, sinon une liseré blanc apparaît. Pour le web et les réseaux, 72 DPI et les dimensions natives de la plateforme suffisent (1080 × 1080 pour un post, 1080 × 1920 pour une story).\n\nUne habitude qui rassure les clients : livrer un dossier zip nommé « livrables » contenant les exports finaux + les fichiers sources. Cela double la valeur perçue du travail.",
        },
      ],
    },
    {
      order: 3,
      title: "Les outils pros : Photoshop & Illustrator",
      summary:
        "Quand Canva atteint ses limites, les outils professionnels prennent le relais : retouche photo et détourage d'un côté, création vectorielle de l'autre — avec des alternatives gratuites pour chaque usage.",
      minutes: 55,
      lessons: [
        {
          order: 1,
          title: "Photoshop : calques, retouches et détourage",
          minutes: 20,
          content:
            "Photoshop manipule des images en pixels. Son concept central est le calque : chaque élément (photo, texte, forme, réglage) vit sur une couche indépendante que vous pouvez déplacer, masquer ou corriger sans toucher aux autres. Comprenez les calques et vous comprenez 80 % de Photoshop.\n\n## Le détourage, la compétence la plus demandée\n\nDétourer, c'est isoler un sujet de son fond — pour un packshot produit, une photo d'identité, un montage. La méthode rapide : sélection du sujet en un clic (Sélection > Sujet), puis affinage des contours avec l'outil Améliorer le bord, surtout sur les cheveux. Travaillez toujours sur une copie et enregistrez en PSD (fichier source) avant d'exporter.\n\n- Les masques de fusion effacent sans détruire : peignez en noir pour cacher, blanc pour montrer\n- Courbes et niveaux corrigent la luminosité mieux que les filtres automatiques\n- Le tampon de correction retire les petits défauts (poussière, prise, fil électrique)\n- Export web : Fichier > Exportation > Exporter sous, en JPG qualité 80",
        },
        {
          order: 2,
          title: "Illustrator : formes et logo vectoriel",
          minutes: 19,
          content:
            "Illustrator travaille en vectoriel : des formes mathématiques, pas des pixels. Conséquence décisive : un logo vectoriel peut passer d'une carte de visite à une bâche de 10 mètres sans jamais se flouter. C'est pour cela que tout logo sérieux se construit dans un outil vectoriel — Illustrator, ou son alternative gratuite Inkscape.\n\n## Les outils qui suffisent pour un premier logo\n\nL'outil Plume trace des tracés précis point par point — il demande de l'entraînement mais reste irremplaçable. L'outil Forme (rectangle, ellipse, polygone) combiné aux opérations Pathfinder (union, soustraction, intersection) construit des monogrammes propres. Le texte vectorisé (Object > Vectoriser) transforme une police en formes : indispensable pour livrer un logo que n'importe qui pourra ouvrir.\n\n- Commencez en noir et blanc : un logo doit fonctionner sans couleur\n- Testez-le à 16 px (favicon) comme à 3 mètres : il doit rester lisible\n- Simplifiez : un bon logo tient en une forme et une idée, pas dix détails\n- Livrez en SVG, PDF et EPS, plus les exports PNG transparents",
        },
        {
          order: 3,
          title: "Quand utiliser quel outil (et les alternatives gratuites)",
          minutes: 16,
          content:
            "Le professionnel ne « maîtrise tout » : il sait quel outil choisir en trois secondes selon la tâche. La mauvaise excuse du débutant est de tout faire dans un seul logiciel ; la mauvaise habitude du confirmé est de sortir Photoshop pour un post Instagram.\n\n## La carte des usages\n\n- Photo à retoucher, détourer, recomposer → Photoshop (ou GIMP, gratuit)\n- Logo, icône, illustration nette à toutes tailles → Illustrator (ou Inkscape, gratuit)\n- Post réseau, story, présentation rapide → Canva (ou Photopea, gratuit, clone de Photoshop dans le navigateur)\n- Mise en page longue (brochure, magazine) → InDesign (ou Scribus, gratuit)\n- Diagrammes et maquettes d'interface → Figma, gratuit en usage individuel\n\nCe qui compte pour vos clients, c'est le résultat : un détourage net, un logo qui reste net, un visuel cohérent. Les outils sont des moyens. Commencez par Canva, ajoutez Photopea pour la retouche, puis passez à Illustrator quand des clients demandent du vectoriel — c'est le parcours le plus rentable.",
        },
      ],
    },
    {
      order: 4,
      title: "Des supports qui convertissent",
      summary:
        "Le design n'est pas une fin : il sert un message. Affiches qui se lisent de loin, visuels réseaux réutilisables, livrables professionnels — le module final transforme vos compétences en production rentable.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Affiches et flyers : le message avant la décoration",
          minutes: 15,
          content:
            "Une affiche efficace se lit en trois secondes : quoi (l'événement ou l'offre), quand (la date, en gros), où (le lieu ou le contact). Tout le reste est secondaire. Avant d'ouvrir un outil, écrivez ces trois informations sur papier et classez-les par importance — cette hiérarchie devient votre composition.\n\n## La structure qui marche\n\nEn haut, l'accroche (le titre, la plus grande taille de tout le visuel). Au centre, l'information visuelle : photo du produit, visage du conférencier, illustration. En bas, les détails pratiques regroupés dans un bloc unique — date, heure, lieu, contact — alignés et aérés. Un seul point de contact suffit : un numéro, un QR code ou un nom de page. Multiplier les contacts dilue l'action.\n\n- Maximum deux polices et trois couleurs, même à grande échelle\n- La date en très gros : c'est l'information n° 1 d'un événement\n- Testez l'affiche réduite à la taille d'un timbre : le titre doit rester lisible\n- Pour le print, vérifiez fond perdu et 300 DPI avant d'envoyer à l'imprimeur",
        },
        {
          order: 2,
          title: "Visuels réseaux sociaux : gabarits réutilisables",
          minutes: 15,
          content:
            "Sur les réseaux, la cohérence vaut plus que l'originalité : un feed où chaque post est différent paraît amateur, un feed structuré paraît professionnel. La solution des agences — celle que RodLab applique — est le gabarit réutilisable : une mise en page fixe où seuls le texte et la photo changent.\n\n## Construire son système de gabarits\n\nCréez quatre gabarits de base : citation (texte centré, logo discret), annonce (titre fort + photo), carrousel (première slide accrocheuse + slides de contenu), promo (offre + prix + bouton). Enregistrez-les dans Canva comme modèles d'équipe. Un mois de contenu se produit alors en quelques heures au lieu de quelques jours.\n\n- Réservez une zone fixe au logo : même position, même taille sur tous les posts\n- Alternez les formats de contenu (citation, conseil, coulisses, preuve client) pour éviter la monotonie\n- Les carrousels doublent souvent l'engagement : la première slide doit donner envie de cliquer\n- Vérifiez vos visuels sur mobile : 9 lecteurs sur 10 les verront sur un écran de téléphone",
        },
        {
          order: 3,
          title: "Livrables pro : fichiers sources, mini-charte, droits",
          minutes: 15,
          content:
            "Ce qui distingue un professionnel, ce n'est pas seulement le visuel : c'est la livraison. Un client qui reçoit un dossier propre revient ; un client qui reçoit trois JPG perdus dans WhatsApp doute. La livraison est un argument de vente à part entière.\n\n## Le dossier de livraison type\n\nUn dossier zip structuré : « exports » (les fichiers prêts à l'emploi, nommés clairement), « sources » (PSD, AI ou lien Canva en mode modèle), « readme » (un fichier texte qui explique où utiliser chaque format et quels sont les droits). Ajoutez une mini-charte d'une page : palette HEX, deux polices, règles d'usage du logo. Cette page vaut parfois plus que le visuel lui-même aux yeux du client.\n\n- Nommez les fichiers : « client-support-version-date », jamais « final-final-2 »\n- Précisez toujours les droits des photos utilisées : libres, achetées, ou fournies par le client\n- Gardez une sauvegarde de chaque livraison : le client reviendra six mois plus tard\n- Proposez une mini-charte en option payante : c'est un upsell naturel et utile",
        },
      ],
    },
  ],
};
