import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue v8.6
 * Cours 6/6 : « Photo & vidéo au smartphone : produisez du contenu pro »
 */
export const COURSE_PHOTO: CourseSeed = {
  slug: "photo-video-smartphone",
  title: "Photo & vidéo au smartphone : produisez du contenu pro",
  subtitle:
    "Lumière, cadrage, son, montage CapCut et organisation de production : tournez avec votre téléphone des photos et vidéos qui passent pour du matériel professionnel.",
  description:
    "Une formation 100 % pratique où vous apprenez à photographier et filmer avec le seul appareil que vous avez déjà — votre smartphone : maîtriser la lumière, composer l'image, tourner des vidéos qui retiennent l'attention, monter avec CapCut et organiser une production de contenu régulière. Vous suivez 4 modules à votre rythme, leçon par leçon, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de réussite, vous obtenez un certificat RodLab Studio vérifiable et téléchargeable en PDF.",
  level: "Débutant",
  durationHours: 7,
  skills: [
    "Utiliser la lumière naturelle comme un studio",
    "Composer des images selon la règle des tiers et plus",
    "Tourner des vidéos verticales avec un hook qui retient",
    "Capturer un son propre sans matériel coûteux",
    "Monter avec CapCut : coupes, sous-titres, musique, export",
    "Produire une banque de contenu en série et l'archiver",
  ],
  modules: [
    {
      order: 1,
      title: "La photo au smartphone",
      summary:
        "Le téléphone photographie très bien — quand la lumière et le cadrage le servent. Les fondations qui séparent une photo amateur d'une photo professionnelle.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Lumière : le vrai secret de la photo",
          minutes: 16,
          content:
            "La photographie signifie littéralement « dessiner avec la lumière » — et c'est la lumière, pas l'appareil, qui sépare l'amateur du professionnel. La règle la plus rentable de tout ce cours : placez votre sujet FACE à une source de lumière (fenêtre, porte ouverte), jamais dos à elle. Un sujet face à une fenêtre par jour clair obtient un rendu doux et uniforme que rien ne remplace.\n\n## Les moments et directions de lumière\n\n- L'heure dorée (une heure après le lever, avant le coucher) : lumière chaude, ombres longues, la plus flatteuse pour les visages et les extérieurs\n- La lumière du midi : dure et verticale, elle creuse les yeux — évitez les portraits à cette heure, ou passez à l'ombre\n- L'ombre ouverte (sous un auvent, à l'intérieur près de la fenêtre) : le studio du pauvre, parfait pour les produits et les portraits\n- Le contre-jour donne des silhouettes et de l'atmosphère : à utiliser volontairement, jamais par accident\n\nÉteignez le flash intégré : il aplatit et blanchit. À l'intérieur, une simple lampe dirigée sur le mur en face du sujet crée une lumière rebondie acceptable. Ce sont ces décisions de lumière, prises avant d'appuyer sur le déclencheur, qui font 80 % de la qualité finale.",
        },
        {
          order: 2,
          title: "Cadrage et composition : grammaire de l'image",
          minutes: 15,
          content:
            "La composition décide de ce que l'œil regarde et de ce qu'il ressent. Le fondement universel : la règle des tiers. Activez la grille de l'appareil photo (Réglages > Appareil photo > Grille) et placez votre sujet sur l'une des intersections des lignes plutôt qu'au centre — l'image respire et l'œil circule.\n\n## Les outils de composition qui servent tous les jours\n\n- Les lignes directrices : route, table, mur, fenêtre — elles guident l'œil vers le sujet\n- L'arrière-plan propre : la première cause de photo amateur est le poteau qui sort de la tête — déplacez-vous de trois pas, souvent\n- La distance : approchez. Les meilleures photos produits et portraits se prennent près, pas de loin\n- La perspective : photographiez à hauteur du sujet (à genoux pour un enfant, au ras du plat pour une assiette), pas toujours debout\n\nAvant chaque pression sur le déclencheur, faites le tour visuel : sujet net, arrière-plan propre, bords sans déchets, lumière face au sujet. Ces quatre vérifications prennent trois secondes et changent tout.",
        },
        {
          order: 3,
          title: "Réglages et nettoyage : tirer le meilleur de son téléphone",
          minutes: 14,
          content:
            "Le smartphone de 2019 et celui d'aujourd'hui se valent presque en journée — ce qui les différencie, ce sont les réglages et les réflexes de l'utilisateur.\n\n## Les réglages qui comptent\n\n- Nettoyez l'objectif avec un chiffon doux avant chaque session : c'est LE conseil le plus rentable, le téléphone vit dans la poche et la lentille graisseuse floute toute la journée\n- Touchez l'écran sur le sujet pour verrouiller la mise au point et l'exposition ; glissez le soleil qui apparaît pour éclaircir ou assombrir\n- Verrouillez AE/AF (appui long) quand le sujet bouge\n- Photographiez en mode HDR par défaut, sans zoom numérique — le zoom numérique détruit la qualité : rapprochez-vous\n- Pour les produits : un fond uni, une fenêtre latérale, et le mode rafale pour choisir la meilleure prise\n\nPour la retouche, trois gestes suffisent dans l'éditeur intégré ou Snapseed (gratuit) : la luminosité, le contraste léger, le recadrage. Résistez aux filtres saturés : une retouche invisible vaut mieux qu'une retouche visible.",
        },
      ],
    },
    {
      order: 2,
      title: "La vidéo qui retient",
      summary:
        "Formats verticaux, hook, son, mouvements : le module où votre téléphone devient une caméra de production de contenu — sans stabilisateur ni micro-studio.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Formats verticaux : hook, rythme, durée",
          minutes: 15,
          content:
            "Sur Instagram, TikTok et WhatsApp, la vidéo verticale (9:16) est reine : elle occupe tout l'écran et l'algorithme la favorise. Mais le format vertical a sa grammaire propre — et une loi d'airain : les deux premières secondes décident si le spectateur reste ou défile.\n\n## La structure qui fonctionne\n\n- Le hook (0-2 s) : le résultat d'abord. Montrez le plat fini avant la recette, l'avant/après avant l'explication, la question choquante avant le développement\n- Le corps (5-25 s) : une seule idée. Chaque seconde doit apporter quelque chose — sinon coupez\n- La fin : un appel clair (suivre, commenter, lien en bio) en une phrase\n\nLe rythme se construit au montage : une action par plan, des plans courts (2 à 4 secondes), pas de temps morts entre les phrases. Pour la durée, mieux vaut 20 secondes denses que 90 secondes diluées — la complétion du visionnage est le signal que l'algorithme récompense le plus.",
        },
        {
          order: 2,
          title: "Le son : la moitié de la qualité perçue",
          minutes: 14,
          content:
            "Les spectateurs pardonnent une image moyenne ; ils quittent une vidéo dont le son est mauvais. Le son représente la moitié de la qualité perçue — et c'est souvent lui qui distingue un contenu amateur d'un contenu pro.\n\n## Tourner propre, sans studio\n\n- Le vent est l'ennemi n° 1 : équipez-vous d'un micro-cravate filaire (10 000-15 000 FCFA), la meilleure dépense de ce cours\n- Rapprochez le micro de la bouche : à défaut de cravate, filmez à moins d'un mètre du sujet, dans la pièce la plus calme\n- Coupez les bruits de fond : ventilateur, télévision, rue — choisissez la pièce la plus silencieuse, les meubles absorbent l'écho\n- Vérifiez en écoutant au casque les 10 premières secondes : toujours\n- En voix off : parlez comme au téléphone, plus près du micro que vous ne le pensez\n\nUne astuce de production : tournez l'ambiance 20 secondes sans parole (le lieu, les mains qui travaillent) — ces plans serviront au montage pour cacher les coupes et enrichir le rythme.",
        },
        {
          order: 3,
          title: "Plans, mouvements et stabilité",
          minutes: 16,
          content:
            "Une vidéo qui bouge tout le temps fatigue ; une vidéo parfaitement statique endort. Le professionnalisme naît de l'intention : chaque mouvement a une raison d'être.\n\n## Les plans de base d'un vocabulaire complet\n\n- Le plan large : installe le lieu (l'atelier, le restaurant, la boutique)\n- Le plan moyen : montre l'action (les mains qui coupent, qui versent, qui mesurent)\n- Le gros plan : fait ressentir (la texture, la fumée, le sourire) — c'est le plan le plus engageant sur mobile\n- Le plan de détail : coupe, ingrédient, outil — idéal pour couvrir les transitions\n\nPour la stabilité : coudes contre le corps, téléphone à deux mains, ou téléphone posé sur un support improvisé (pile de livres, verre). Les mouvements simples — un travelling latéral lent en marchant à pas feutrés, un pivot doux sur un axe fixe — s'apprennent en une semaine. Le stabilisateur électronique du téléphone lisse les micro-tremblements : avancez lentement, toujours lentement. Et tournez chaque action deux fois : la seconde prise, plus détendue, est presque toujours la bonne.",
        },
      ],
    },
    {
      order: 3,
      title: "Le montage",
      summary:
        "CapCut pas à pas : couper, rythmer, sous-titrer, musiquer et exporter — la chaîne complète du montage mobile qui transforme des rushes bruts en vidéo publiables.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "CapCut pas à pas : coupe, transitions, texte",
          minutes: 16,
          content:
            "CapCut (gratuit) est devenu le standard du montage mobile : complet, gratuit, adapté aux formats verticaux. Son interface se comprend en trois zones : la timeline (les plans posés les uns après les autres), la prévisualisation, et le menu d'outils (couper, texte, audio, effets).\n\n## Le premier montage, plan par plan\n\n1. Nouveau projet → importez vos rushes dans l'ordre logique du récit\n2. Coupez les débuts et fins inutiles : sélectionnez le plan, déplacez les poignées blanches, ou utilisez « Diviser » au point de coupe\n3. Supprimez les silences et hésitations : le rythme se crée en enlevant, pas en ajoutant\n4. Le texte : minimum un titre d'accroche au début, une police lisible, placé au tiers supérieur (jamais coupé par les boutons de l'interface TikTok/Reels en bas)\n5. Les transitions : le fondu enchaîné discret suffit à 90 % des cas — les transitions spectaculaires datent vite\n\nHabitude de pro : montez d'abord toute la structure avec des plans bruts, regardez le résultat en entier, puis raffinez. Le montage est une écriture : d'abord le brouillon, ensuite le style.",
        },
        {
          order: 2,
          title: "Sous-titres automatiques et accessibilité",
          minutes: 13,
          content:
            "La majorité des vidéos de réseaux sociaux est regardée sans le son — dans les transports, au bureau, en scannant son fil. Une vidéo sans sous-titres perd donc l'essentiel de son audience. CapCut intègre la génération automatique de sous-titres (Texte > Sous-titres auto) : elle reconnaît le français avec une précision honorable et pose les mots au bon moment.\n\n## Les règles des sous-titres professionnels\n\n- Relisez et corrigez : l'automatique se trompe sur les noms propres, les chiffres et le vocabulaire métier\n- Par bloc court : 4 à 7 mots à l'écran maximum, la lecture doit rester instantanée\n- Position : au centre-bas mais au-dessus des zones d'interface, avec une ombre ou un fond léger pour rester lisible sur toute image\n- Style constant : une police, une taille, une couleur pour toute la vidéo — la cohérence fait le pro\n\nLes sous-titres servent aussi le référencement : les plateformes analysent le texte des vidéos pour classer le contenu. Mentionner clairement le sujet dans les sous-titres aide la bonne audience à vous trouver — c'est de l'accessibilité ET de la stratégie.",
        },
        {
          order: 3,
          title: "Musique, droits et exports optimisés",
          minutes: 16,
          content:
            "La musique donne l'émotion et le rythme — mais elle est aussi la première source de problèmes de droits. La règle simple : utilisez la bibliothèque intégrée à la plateforme de publication (sons Instagram/TikTok) ou les banques libres de droits (bibliothèque audio CapCut, YouTube Audio Library). Une chanson populaire collée sur une vidéo destinée à un usage commercial (pub, page d'un client) peut entraîner la suppression du son — voire du compte.\n\n## Le mixage simple qui suffit\n\n- La musique accompagne, elle ne couvre pas : volume à 20-30 % quand il y a de la voix\n- Utilisez le fondu audio (fade) à l'entrée et à la sortie : une musique qui coupe net trahit l'amateur\n- Choisissez le tempo selon le rythme des coupes : synchroniser les plans sur les temps forts est le luxe du montage\n\nPour l'export : 1080 × 1920 (vertical), 30 images/s suffisent, débit élevé si l'application le propose. Exportez une fois en qualité maximale et publiez depuis la galerie — réexporter ou recadrer après coup dégrade l'image. Nommez le fichier avant l'export (« client-produit-reel-2026-03 ») : le rangement commence là.",
        },
      ],
    },
    {
      order: 4,
      title: "Organiser sa production",
      summary:
        "La régularité ne s'improvise pas : shooting en série, gabarits de montage, archivage propre — la méthode de production qui fait durer la qualité dans le temps.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Banque de contenu : shooting en série",
          minutes: 14,
          content:
            "Produire un contenu par jour épuise ; produire quinze contenus en une après-midi est réaliste. La différence tient à la production en série : préparer le décor, les tenues et la liste de plans, puis dérouler toute la séance d'un trait. C'est la méthode de toutes les équipes de contenu professionnelles.\n\n## Organiser une séance rentable\n\n- La semaine précédente : la liste des plans écrite (quels plats, quels gestes, quels témoignages), le décor préparé, la lumière repérée selon l'heure\n- Pendant la séance : un plan après l'autre, deux prises chacun, et les plans d'ambiance en fin de séance (les mains, les détails, le lieu)\n- Les raccords : filmez chaque action de début à fin, même si vous ne garderez que 3 secondes — la coupe libre au montage\n- Multipliez les usages : une même séance produit des posts photos, des Reels, des stories et des images de couverture pour un mois\n\nNotez dans un carnet ce qui a été filmé : au montage, trois semaines plus tard, la mémoire fait défaut. La banque de contenu est le stock qui sauve les semaines chargées — c'est elle qui rend la régularité possible.",
        },
        {
          order: 2,
          title: "Cohérence de marque et gabarits de montage",
          minutes: 13,
          content:
            "Une vidéo réussie engage ; dix vidéos cohérentes construisent une marque. La cohérence vidéo repose sur des éléments fixes que le spectateur reconnaît avant même le logo : le style de sous-titres, la police des titres, la manière d'ouvrir (le hook), la couleur dominante des visuels.\n\n## Le gabarit qui accélère tout\n\n- Dans CapCut, enregistrez un projet modèle : intro typée, style de sous-titres, logo en filigrane discret, transition de fin avec appel à l'action — chaque nouvelle vidéo part de ce squelette\n- La même police et les mêmes couleurs que la charte graphique : les vidéos appartiennent à la marque, pas au monteur\n- Un ton de voix constant : la marque qui chuchote lundi et hurle samedi brouille tout le monde\n- Les thèmes récurrents créent des rendez-vous : « le conseil du mardi », « la coulisse du vendredi » — l'audience revient pour la série\n\nCette mécanique a un effet de bord précieux : elle rend le travail délégable. Un assistant qui suit le gabarit produit des vidéos conformes — c'est ainsi qu'un créateur de contenu passe d'un format artisanal à une vraie production.",
        },
        {
          order: 3,
          title: "Planifier et archiver ses médias",
          minutes: 13,
          content:
            "Le contenu produit mais introuvable est un contenu perdu. La dernière discipline du créateur professionnel est archivistique : savoir où est chaque rush, chaque version finale, chaque musique utilisée — pour les retrouver, les recycler et les sauvegarder.\n\n## Le système minimal viable\n\n- Une arborescence fixe : Année > Mois > Client ou Projet, avec les sous-dossiers « rushes », « projet-montage », « exports »\n- Les noms de fichiers datés et nommés : « 2026-03-15-hotelpalma-plat-jollof-prise2.mp4 »\n- La sauvegarde 3-2-1 adaptée : le téléphone + le disque externe + le cloud (Google Photos, Drive) — les médias sont les fichiers les plus lourds et les plus précieux\n- Le registre des droits : d'où vient chaque musique, chaque photo de personne (accord oral suffit rarement — un message écrit d'accord vaut mieux)\n\nAjoutez le calendrier de publication au même endroit (tableau simple ou application) : chaque semaine, 30 minutes de revue — ce qui a été publié, ce qui reste dans la banque, ce qui manque. Ce point hebdomadaire transforme la production de contenu d'une course permanente en routine maîtrisée.",
        },
      ],
    },
  ],
};
