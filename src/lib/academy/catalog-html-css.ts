import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Cours : « HTML & CSS avancé »
 */
export const COURSE_HTML_CSS: CourseSeed = {
  "slug": "html-css-avance",
  "title": "HTML & CSS avancé : maîtriser le web moderne",
  "subtitle": "Sémantique poussée, accessibilité, Grid, variables CSS, animations et architecture de composants — le niveau attendu d'un intégrateur professionnel.",
  "description": "Cette formation s'adresse à ceux qui connaissent déjà les bases du HTML et du CSS et veulent atteindre un niveau professionnel : accessibilité réelle (pas seulement cosmétique), CSS Grid et variables natives, animations performantes, architecture de composants réutilisables et responsive avancé avec les container queries. 4 modules, 12 leçons, puis un examen final de 8 questions pour obtenir votre certificat RodLab Studio.",
  "level": "Avancé",
  "durationHours": 14,
  "skills": [
    "Écrire du HTML sémantique qui sert le SEO et l'accessibilité",
    "Rendre une interface réellement utilisable au clavier et au lecteur d'écran (ARIA)",
    "Construire des mises en page complexes avec CSS Grid",
    "Utiliser les variables CSS pour un theming et un dark mode propres",
    "Créer des animations fluides sans dégrader les performances",
    "Structurer son CSS avec une méthodologie (BEM / ITCSS) qui tient à l'échelle"
  ],
  "modules": [
    {
      "order": 1,
      "title": "HTML sémantique et accessibilité avancée",
      "summary": "Le HTML n'est pas une simple structure : bien écrit, il porte le SEO, l'accessibilité et la robustesse de toute l'interface. Ce module va au-delà des balises de base.",
      "minutes": 45,
      "lessons": [
        {
          "order": 1,
          "title": "Sémantique HTML5 : structurer pour le sens, pas pour le style",
          "minutes": 15,
          "content": "Un <div> ne dit rien sur son contenu ; <article>, <nav>, <aside>, <section> ou <figure> racontent immédiatement à un moteur de recherche, à un lecteur d'écran ou à un futur développeur ce que représente chaque bloc. La règle professionnelle : choisir la balise sémantique correcte avant de penser au style, puis habiller avec CSS. Le style ne doit jamais dicter le choix de la structure.\n\n## Les pièges fréquents\n\nBeaucoup de développeurs utilisent <section> pour tout regrouper visuellement, alors que cette balise implique un contenu qui mériterait un titre propre dans le plan du document. De même, <header> et <footer> ne sont pas réservés à la page entière : un <article> peut avoir son propre <header> (auteur, date) sans conflit.\n\n- Un seul <h1> par page, puis une hiérarchie <h2> à <h6> sans saut de niveau\n- <main> une seule fois : il désigne le contenu principal, unique et navigable\n- <figure> + <figcaption> pour toute image porteuse de sens, jamais pour la décoration\n- Validez votre structure avec l'outil « Contour du document » des devtools"
        },
        {
          "order": 2,
          "title": "ARIA et navigation clavier : l'accessibilité qui fonctionne vraiment",
          "minutes": 16,
          "content": "La première règle de l'accessibilité web est contre-intuitive pour beaucoup : « no ARIA is better than bad ARIA ». Un <button> natif est accessible par défaut ; un <div role=\"button\"> mal outillé (sans tabindex, sans gestion de la touche Entrée) est pire qu'un bouton simple, car il fait croire à un lecteur d'écran qu'il est interactif sans l'être réellement.\n\n## Ce qu'ARIA ajoute vraiment\n\nARIA sert à combler les trous que le HTML natif ne couvre pas : aria-expanded sur un menu déroulant, aria-live pour annoncer un message dynamique (comme une erreur de formulaire qui apparaît sans rechargement), aria-label quand un bouton n'a qu'une icône et aucun texte visible. Chaque attribut ARIA doit correspondre à un vrai comportement JavaScript, sinon il ment à l'utilisateur.\n\n- Testez toujours votre page en naviguant uniquement au clavier (Tab, Entrée, Échap)\n- Un focus visible (outline) ne doit jamais être supprimé sans alternative\n- aria-hidden=\"true\" cache un élément aux lecteurs d'écran, pas visuellement : à utiliser avec précaution\n- Les lecteurs d'écran gratuits (NVDA, VoiceOver) permettent de tester en 10 minutes"
        },
        {
          "order": 3,
          "title": "Formulaires avancés : validation, UX et accessibilité combinées",
          "minutes": 14,
          "content": "Un formulaire professionnel valide côté client pour le confort (retour immédiat) et côté serveur pour la sécurité (le client peut toujours être contourné). HTML5 offre déjà beaucoup sans une ligne de JavaScript : type=\"email\", required, pattern, minlength, et l'API de validation native (element.validity, element.setCustomValidity).\n\n## Lier chaque champ à son message\n\nUn <label for=\"id\"> correctement associé à son <input id=\"id\"> double la zone cliquable et permet au lecteur d'écran d'annoncer le nom du champ. Les erreurs doivent être annoncées avec aria-describedby pointant vers un message d'erreur inséré près du champ, et non seulement en couleur rouge — la couleur seule exclut les utilisateurs daltoniens.\n\n- autocomplete=\"email\" ou \"tel\" accélère la saisie mobile de façon spectaculaire\n- Groupez les champs liés avec <fieldset> et <legend> (ex : adresse complète)\n- N'affichez jamais une erreur uniquement au survol : elle doit rester visible et lisible\n- inputmode=\"numeric\" ouvre le bon clavier mobile sans changer le type du champ"
        }
      ]
    },
    {
      "order": 2,
      "title": "CSS moderne : Grid, variables et theming",
      "summary": "CSS Grid et les variables natives ont changé la manière de construire des mises en page. Ce module traite les usages avancés qu'un intégrateur senior doit maîtriser.",
      "minutes": 48,
      "lessons": [
        {
          "order": 1,
          "title": "CSS Grid avancé : zones nommées et mises en page complexes",
          "minutes": 17,
          "content": "Au-delà de grid-template-columns basique, grid-template-areas permet de nommer des zones (\"header\", \"sidebar\", \"main\", \"footer\") et de redessiner toute la mise en page pour le mobile en changeant une seule propriété, sans toucher au HTML. C'est la différence entre un CSS qui suit le contenu et un CSS qui le sert vraiment.\n\n## repeat(), minmax() et auto-fit\n\nUne grille de cartes responsive tient en une ligne : grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)). Cette syntaxe crée autant de colonnes de 240 px minimum que la largeur le permet, et les étire pour combler l'espace — sans une seule media query. C'est l'un des gains de productivité les plus nets du CSS moderne.\n\n- grid-area permet à un élément d'occuper plusieurs zones nommées à la fois\n- gap remplace élégamment les anciennes marges bricolées entre colonnes\n- subgrid hérite de la grille du parent : utile pour aligner des cartes de hauteurs différentes\n- Grid et Flexbox se combinent : Grid pour la structure globale, Flexbox à l'intérieur des cellules"
        },
        {
          "order": 2,
          "title": "Variables CSS natives : un theming sans préprocesseur",
          "minutes": 16,
          "content": "Les custom properties (--couleur-primaire: #1c3829;) ne sont pas de simples constantes comme en Sass : elles vivent dans le DOM, sont modifiables en JavaScript (element.style.setProperty) et héritent en cascade comme n'importe quelle propriété CSS. C'est ce qui les rend supérieures aux variables Sass pour tout ce qui doit changer dynamiquement : thème sombre, préférences utilisateur, marque blanche.\n\n## Portée et redéfinition en cascade\n\nUne variable définie sur :root s'applique partout, mais peut être redéfinie localement — par exemple .carte-premium { --couleur-accent: gold; } surcharge la variable uniquement à l'intérieur de ce composant, sans toucher au reste du site. C'est un système de theming complet sans aucune ligne de JavaScript.\n\n- var(--x, valeur-de-repli) fournit une valeur par défaut si la variable n'existe pas\n- Les variables acceptent des valeurs partielles réutilisées dans calc() : --marge: 8px puis calc(var(--marge) * 2)\n- Documentez vos variables dans un fichier tokens.css unique, source de vérité de la marque\n- Les navigateurs recalculent les variables en temps réel : idéal pour un sélecteur de thème live"
        },
        {
          "order": 3,
          "title": "Dark mode et prefers-color-scheme sans dette technique",
          "minutes": 15,
          "content": "prefers-color-scheme: dark détecte la préférence système de l'utilisateur, mais un dark mode professionnel doit aussi proposer un choix manuel qui prime sur cette préférence — beaucoup de sites oublient ce second niveau et frustrent les utilisateurs. La bonne architecture combine les deux avec les variables CSS vues précédemment.\n\n## Le pattern qui marche à grande échelle\n\nOn définit les couleurs par défaut sur :root, puis on les redéfinit dans un bloc @media (prefers-color-scheme: dark), et enfin on ajoute un sélecteur d'attribut [data-theme=\"dark\"] sur <html> que le bouton de bascule contrôle en JavaScript. L'attribut manuel doit toujours avoir la priorité sur la préférence système dans l'ordre des règles CSS.\n\n- Ne vous contentez jamais d'inverser les couleurs : certains contrastes doivent être repensés\n- Stockez le choix de l'utilisateur en localStorage pour qu'il persiste entre les visites\n- Testez vos images et logos : un logo sombre disparaît sur un fond sombre\n- color-scheme: light dark; dans le CSS aide aussi le navigateur à styliser les éléments natifs (scrollbars, inputs)"
        }
      ]
    },
    {
      "order": 3,
      "title": "Animations, performance et responsive avancé",
      "summary": "Une belle interface qui rame déçoit autant qu'une interface moche. Ce module traite les animations fluides, le rendu critique et les container queries.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "Animations performantes : transform, opacity et la carte graphique",
          "minutes": 16,
          "content": "Toutes les propriétés CSS ne coûtent pas le même prix au navigateur. Animer width, height, top ou margin force un recalcul de la mise en page entière (« reflow ») à chaque frame, tandis qu'animer transform et opacity s'exécute directement sur la carte graphique (GPU), sans jamais toucher au flux du document. La différence se voit immédiatement sur mobile bas de gamme.\n\n## Le réflexe professionnel\n\nPour déplacer un élément, utilisez transform: translateX() plutôt que left ou margin-left. Pour redimensionner en douceur, transform: scale() plutôt que width. will-change: transform prévient le navigateur qu'une animation arrive et lui permet de préparer la couche graphique en amont — mais à utiliser avec parcimonie, car il consomme de la mémoire.\n\n- prefers-reduced-motion: reduce doit désactiver ou réduire les animations pour les utilisateurs sensibles\n- Les transitions CSS suffisent pour 90 % des besoins ; réservez @keyframes aux séquences complexes\n- Une animation à 60 fps garde chaque frame sous 16 ms : mesurez avec l'onglet Performance des devtools\n- Évitez d'animer plus de 3-4 éléments complexes simultanément sur une page"
        },
        {
          "order": 2,
          "title": "Le chemin de rendu critique : ce qui bloque l'affichage",
          "minutes": 15,
          "content": "Avant d'afficher le premier pixel, le navigateur doit construire le DOM (à partir du HTML) et le CSSOM (à partir du CSS), puis les fusionner en un arbre de rendu. Tout CSS chargé de façon bloquante retarde ce premier affichage — c'est pourquoi la taille et l'ordre de chargement des feuilles de style ont un impact direct sur la performance perçue.\n\n## Optimiser sans changer le design\n\nLe « critical CSS » consiste à inliner directement dans le <head> les quelques règles nécessaires à l'affichage immédiat (au-dessus de la ligne de flottaison), et à charger le reste de façon asynchrone. Les frameworks modernes (Next.js, Astro) le font automatiquement, mais comprendre le principe permet de diagnostiquer un site lent construit à la main.\n\n- Évitez les sélecteurs CSS trop profonds (.a .b .c .d) : ils coûtent cher à calculer\n- content-visibility: auto permet de ne pas rendre les sections hors écran tant qu'elles ne sont pas visibles\n- Un fichier CSS unique minifié charge plus vite que dix petits fichiers séparés\n- Les polices web bloquantes retardent le texte : font-display: swap affiche un texte lisible immédiatement"
        },
        {
          "order": 3,
          "title": "Container queries : le responsive au niveau du composant",
          "minutes": 15,
          "content": "Les media queries raisonnent au niveau de la fenêtre entière, ce qui pose un problème dès qu'un composant (une carte, une barre latérale) doit s'adapter à l'espace qui lui est réellement alloué — pas à la largeur de l'écran. Les container queries résolvent exactement ce problème : un composant s'adapte à son propre conteneur, où qu'il soit placé sur la page.\n\n## La syntaxe et son usage\n\nOn déclare container-type: inline-size sur le parent, puis on écrit @container (min-width: 400px) { .carte { flex-direction: row; } } sur l'enfant. La même carte peut ainsi s'afficher empilée dans une colonne étroite et côte à côte dans une colonne large, sans dupliquer aucun code ni dépendre de la largeur totale de l'écran.\n\n- Nommez vos conteneurs (container-name) quand plusieurs niveaux imbriqués sont possibles\n- Les container queries complètent les media queries, elles ne les remplacent pas entièrement\n- Idéal pour les design systems où un même composant vit dans des contextes très différents\n- Vérifiez le support navigateur avant de baser toute une mise en page critique dessus"
        }
      ]
    },
    {
      "order": 4,
      "title": "Architecture CSS et design system",
      "summary": "Un CSS qui fonctionne sur une page ne suffit pas : un CSS professionnel doit survivre à des dizaines de pages et plusieurs développeurs sans devenir ingérable.",
      "minutes": 44,
      "lessons": [
        {
          "order": 1,
          "title": "BEM et méthodologies de nommage : éviter le chaos des sélecteurs",
          "minutes": 15,
          "content": "BEM (Block, Element, Modifier) nomme chaque classe selon une logique stricte : .carte (le bloc), .carte__titre (un élément du bloc), .carte--premium (une variante du bloc). Ce système élimine presque totalement les conflits de spécificité CSS, le pire fléau des projets qui grossissent sans discipline.\n\n## Pourquoi ça fonctionne à l'échelle\n\nAvec BEM, chaque classe reste à plat en termes de spécificité (0,1,0 dans le calcul CSS), ce qui évite les guerres de !important. Un développeur qui rejoint le projet comprend immédiatement la relation entre .menu, .menu__item et .menu__item--active sans lire une ligne de CSS. C'est une convention, pas une technologie : elle fonctionne avec du CSS natif comme avec Sass.\n\n- Un bloc ne dépend jamais de son contexte : .carte doit s'afficher pareil partout où on le colle\n- Les modificateurs (--) changent l'apparence, jamais la structure HTML\n- Évitez de dépasser deux niveaux d'imbrication : .bloc__element__sous-element signale un découpage à revoir\n- Combinez BEM avec les variables CSS vues plus haut pour un theming propre par bloc"
        },
        {
          "order": 2,
          "title": "ITCSS : organiser ses fichiers CSS du général au spécifique",
          "minutes": 15,
          "content": "ITCSS (Inverted Triangle CSS) organise les fichiers CSS en couches, de la plus générique à la plus spécifique : Settings (variables), Tools (mixins), Generic (reset), Elements (balises HTML nues), Objects (structures réutilisables), Components (BEM spécifique), Utilities (classes utilitaires comme .mt-4). L'ordre d'importation suit exactement cette pyramide.\n\n## Ce que ça résout concrètement\n\nSans cette discipline, un projet CSS finit par accumuler des !important en cascade pour corriger des conflits de spécificité imprévus. ITCSS garantit que la spécificité augmente naturellement au fil des fichiers importés, dans le même ordre que la pyramide — plus besoin de forcer quoi que ce soit.\n\n- Un reset (Generic) ne doit jamais contenir de classe, seulement des sélecteurs de balises\n- Les Utilities viennent toujours en dernier : elles doivent pouvoir tout surcharger proprement\n- Cette structure se marie très bien avec Tailwind pour la couche Utilities et du CSS natif pour le reste\n- Documentez la couche de chaque nouveau fichier dans un README pour l'équipe"
        },
        {
          "order": 3,
          "title": "Débogage CSS avancé avec les DevTools",
          "minutes": 14,
          "content": "L'onglet Elements des DevTools affiche, pour chaque élément sélectionné, la liste complète des règles CSS qui s'appliquent, barrées si elles sont surchargées — c'est le point de départ de tout débogage sérieux, bien plus fiable que deviner en modifiant le code au hasard.\n\n## Les outils qui font gagner du temps\n\nL'onglet Computed montre la valeur finale de chaque propriété après cascade, utile pour comprendre pourquoi une couleur ou une taille ne correspond pas à ce qui a été écrit. L'inspecteur de Grid et de Flexbox (icône dédiée à côté de display: grid ou flex) superpose visuellement les lignes de la grille directement sur la page — indispensable pour déboguer un alignement complexe.\n\n- Forcer un état (:hover, :focus) depuis l'onglet Elements pour déboguer sans manipuler la souris\n- L'onglet Rendering permet d'émuler prefers-color-scheme et prefers-reduced-motion sans changer l'OS\n- Le mode « responsive » simule différentes tailles d'écran ET différents ratios de pixels\n- Toujours vérifier la spécificité affichée avant d'ajouter un !important de dépannage"
        }
      ]
    }
  ]
};
