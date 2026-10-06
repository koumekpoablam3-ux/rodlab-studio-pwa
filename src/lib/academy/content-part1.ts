import type { ModuleSeed } from "./types";

/**
 * RODLAB ACADEMY — Contenu du cours, modules 1 à 4
 * « Créez votre premier site web professionnel »
 */
export const COURSE_META = {
  slug: "site-web-professionnel",
  title: "Créez votre premier site web professionnel",
  subtitle:
    "De la page blanche au site en ligne : la méthode complète de l'agence RodLab Studio, pensée pour les débutants ambitieux d'Afrique francophone.",
  description:
    "Une formation 100 % pratique où vous apprenez à planifier, concevoir, construire et publier un site web professionnel — puis à vendre cette compétence. Vous suivez 8 modules à votre rythme, leçon par leçon, puis vous validez vos connaissances avec un examen final de 24 questions. En cas de réussite, vous obtenez un certificat RodLab Studio vérifiable et téléchargeable en PDF.",
  level: "Débutant",
  durationHours: 14,
};

export const MODULES_1_4: ModuleSeed[] = [
  {
    order: 1,
    title: "Comprendre le web moderne",
    summary:
      "Internet sans mystère : comment une page voyage jusqu'à l'écran de votre visiteur, quels langages parlent les sites, et quel type de site correspond vraiment à votre projet.",
    minutes: 45,
    lessons: [
      {
        order: 1,
        title: "Comment fonctionne Internet : clients, serveurs et DNS",
        minutes: 14,
        content:
          "Quand vous tapez une adresse dans votre navigateur, une conversation rapide se déclenche. Votre appareil — le client — envoie une requête vers un ordinateur puissant toujours allumé — le serveur — qui renvoie les fichiers du site : HTML pour la structure, CSS pour le style, JavaScript pour les interactions, plus les images.\n\nEntre les deux, le DNS agit comme l'annuaire téléphonique d'Internet : il traduit le nom de domaine « rodlabstudio.tg » en adresse IP, le vrai numéro du serveur. C'est pour cela qu'acheter un nom de domaine est la première étape officielle de tout projet sérieux.\n\nRetenez cette chaîne, elle explique presque tous les problèmes que vous rencontrerez : un site inaccessible peut venir du domaine, du serveur, ou des fichiers eux-mêmes. Bonne nouvelle : créer un site, c'est simplement préparer ces fichiers pour qu'un serveur puisse les servir vite et bien.\n\n- Le navigateur (Chrome, Firefox, Safari) lit et affiche les fichiers du site\n- Le serveur héberge ces fichiers 24 h/24 et les renvoie à la demande\n- Le DNS relie le nom de domaine à l'adresse du serveur\n- La connexion se fait par HTTPS : les données sont chiffrées",
      },
      {
        order: 2,
        title: "Les langages du web : HTML, CSS et JavaScript",
        minutes: 12,
        content:
          "Trois langages suffisent à construire l'immense majorité du web, et chacun a un rôle précis. Le HTML (HyperText Markup Language) décrit la structure : c'est le squelette — titres, paragraphes, images, liens, formulaires. Sans HTML, il n'y a pas de page.\n\nLe CSS (Cascading Style Sheets) habille cette structure : couleurs, tailles, espacements, positionnement, adaptations mobile. C'est lui qui transforme un document brut en interface élégante. Le JavaScript, enfin, rend la page vivante : menus déroulants, galeries interactives, formulaires qui vérifient les données avant envoi.\n\nUne comparaison utile : le HTML est le corps, le CSS est la tenue, le JavaScript est les gestes. Un professionnel sait distinguer les trois couches et les faire collaborer proprement — c'est exactement ce que vous allez pratiquer dans les modules 3, 4 et 5.\n\nNe cherchez pas à tout retenir par cœur : même les développeurs expérimentés consultent la documentation (MDN Web Docs) chaque jour. Ce qui compte, c'est de comprendre la logique et de savoir chercher.",
      },
      {
        order: 3,
        title: "Choisir le bon type de site pour son projet",
        minutes: 19,
        content:
          "Tous les sites ne répondent pas au même besoin, et le pire investissement est celui qui ne correspond pas à votre objectif réel. Avant de coder ou de choisir un outil, identifiez la catégorie de votre projet.\n\n- Site vitrine : présenter une activité, ses services, ses contacts. C'est la carte de visite étendue d'une entreprise — la demande la plus fréquente au Togo et dans la sous-région.\n- Blog ou magazine : publier régulièrement du contenu pour attirer et fidéliser une audience.\n- Boutique en ligne (e-commerce) : vendre des produits avec panier et paiement. Il faut alors penser stock, livraison et paiement mobile (T-Money, Flooz, cartes).\n- Application web : un outil interactif — gestion de réservations, suivi de commandes, espace client. Plus coûteux, mais souvent rentable quand le besoin est réel.\n\nLe choix conditionne tout : budget, délais, hébergement, maintenance. Un site vitrine bien fait coûte autour de 450 000 FCFA chez un professionnel ; une application métier peut dépasser le million. Comprendre ces ordres de grandeur vous servira autant pour bâtir le vôtre que pour conseiller vos futurs clients.",
      },
    ],
  },
  {
    order: 2,
    title: "Planifier son site comme un pro",
    summary:
      "Ce qui sépare un site amateur d'un site professionnel se joue avant la première ligne de code : cahier des charges net, arborescence pensée pour le visiteur, identité visuelle cohérente.",
    minutes: 50,
    lessons: [
      {
        order: 1,
        title: "Le cahier des charges : votre feuille de route",
        minutes: 15,
        content:
          "Le cahier des charges est un document court qui fixe ce que le site doit faire, pour qui, et dans quelles limites. Il évite les deux pièges classiques : le site qui s'étire pendant des mois, et le client insatisfait « parce que ce n'était pas ça ».\n\nUn bon cahier tient en deux pages : objectif principal (vendre ? être contacté ? recruter ?), cibles (qui visite et pourquoi), pages nécessaires, contenus disponibles (textes, photos, logos), fonctionnalités (formulaire, galerie, WhatsApp), délais et budget.\n\n- Objectif unique et mesurable : « recevoir 20 demandes de devis par mois » plutôt que « être visible »\n- Une page = un objectif : la page Services fait comprendre, la page Contact fait agir\n- Liste des contenus à fournir, avec un responsable et une date pour chacun\n- Budget total incluant domaine, hébergement annuels — souvent oubliés\n\nPrenez l'habitude d'écrire ce document pour chaque projet, même les plus petits. C'est ce réflexe de professionnel qui vous fera gagner du temps — et de l'argent.",
      },
      {
        order: 2,
        title: "Arborescence et maquettes (wireframes)",
        minutes: 15,
        content:
          "L'arborescence est la carte du site : la liste des pages et comment elles se rejoignent. Un site vitrine efficace tient en 5 à 7 pages : Accueil, Services, Réalisations, À propos, Blog éventuel, FAQ, Contact. Au-delà, chaque page supplémentaire doit se justifier par un besoin réel du visiteur.\n\nLe wireframe est le croquis d'une page, sans couleur ni logo : juste des blocs (en-tête, hero, sections, pied de page) et la place du contenu. Dessiné à la main ou avec Figma, il répond à une seule question : dans quel ordre le visiteur doit-il découvrir l'information pour agir ?\n\nLa règle d'or : chaque page doit mener à l'action principale — appeler, écrire, acheter. Sur l'Accueil, placez l'essentiel en haut : qui vous êtes, ce que vous faites, le bouton qui passe à l'action. Le détail vient ensuite, pour ceux qui veulent creuser.\n\nFaites valider vos wireframes avant de styliser quoi que ce soit. Modifier un croquis coûte cinq minutes ; modifier un site stylé coûte des heures.",
      },
      {
        order: 3,
        title: "Identité visuelle : couleurs, typographie et ton",
        minutes: 20,
        content:
          "Votre site doit ressembler à la marque qu'il représente. Si la marque possède déjà un logo et des couleurs, le site les respecte : on ne réinvente pas une identité existante, on l'applique avec discipline.\n\nConstruisez une mini-charte : deux ou trois couleurs principales (une dominante, une accentuée pour les boutons, un fond clair), deux polices maximum (une pour les titres, une pour le texte), et un ton d'écriture (vous ou tu, sobre ou complice) appliqué partout.\n\n- Dominante : la couleur de la marque, utilisée pour l'en-tête et les titres\n- Accent : réservée aux actions (boutons, liens) — jamais décorative\n- Contraste : le texte doit rester lisible ; testez le blanc sur couleur foncée\n- Cohérence : mêmes marges, mêmes arrondis, mêmes tailles sur toutes les pages\n\nCe vocabulaire visuel commun est ce qui donne l'impression immédiate de sérieux. Dans les modules 4 et 5, vous traduirez cette charte en CSS propre — une palette bien définie rendra ce travail évident.",
      },
    ],
  },
  {
    order: 3,
    title: "HTML : la structure de vos pages",
    summary:
      "Écrivez vos premières pages web : balises, titres, textes, listes, images, liens et formulaires — le squelette solide que le CSS viendra habiller.",
    minutes: 55,
    lessons: [
      {
        order: 1,
        title: "Votre première page HTML",
        minutes: 20,
        content:
          "Ouvrez un éditeur simple (VS Code, gratuit, est la référence) et créez un fichier « index.html ». Le nom index est conventionnel : c'est la page que le serveur affiche par défaut à la racine du site.\n\nToute page commence par la déclaration <!DOCTYPE html>, suivie d'un élément html qui contient deux enfants : head (les informations pour le navigateur — titre de l'onglet, encodage, lien vers le CSS) et body (tout ce que le visiteur voit).\n\nUne balise s'ouvre et se ferme : <h1>…</h1>, <p>…</p>. Certaines sont autofermantes comme <img> ou <br>. Les balises peuvent porter des attributs : <a href=\"https://exemple.tg\"> un lien </a>, <img src=\"photo.jpg\" alt=\"Description de la photo\">.\n\nSaisissez quelques titres et paragraphes, enregistrez, puis ouvrez le fichier dans votre navigateur par double-clic : votre première page existe. C'est un moment fondateur — tout le reste du cours consiste à l'enrichir méthodiquement.",
      },
      {
        order: 2,
        title: "Structurer le contenu : titres, textes et listes",
        minutes: 15,
        content:
          "Le HTML propose six niveaux de titres, de <h1> à <h6>. Une page n'a qu'un seul <h1> — le titre principal — puis une hiérarchie logique : <h2> pour les grandes sections, <h3> pour leurs sous-parties. Cette hiérarchie sert aux moteurs de recherche comme aux lecteurs d'écran.\n\nLe texte courant vit dans <p>. Pour une énumération, deux choix : <ul> (liste à puces) ou <ol> (liste numérotée), chaque élément dans un <li>. Pour mettre en valeur : <strong> (important) et <em> (accent).\n\n## Les balises sémantiques\nDepuis HTML5, des balises décrivent le rôle des zones : <header> pour l'en-tête, <nav> pour la navigation, <main> pour le contenu principal, <section> pour une section, <footer> pour le pied de page. Elles ne changent rien visuellement, mais elles donnent du sens — le navigateur, Google et les outils d'accessibilité savent enfin où est quoi.\n\nPrenez le réflexe dès maintenant : structurez toujours avec des balises sémantiques, même si le rendu semble identique. C'est l'une des différences majeures entre un site d'amateur et un site de professionnel.",
      },
      {
        order: 3,
        title: "Images, liens et formulaires",
        minutes: 20,
        content:
          "L'image <img> exige deux attributs : src (le chemin du fichier) et alt (la description pour les malvoyants et les moteurs de recherche). Préférez des formats modernes et légers : une photo de 4 Mo ralentit tout le site — compressez vos images avant de les intégrer (WebP ou JPEG optimisé, largeur maximale ~1600 px pour un visuel pleine largeur).\n\nLe lien <a> avec son attribut href relie les pages entre elles. Un lien interne vise une page du même site (« /services.html »), un lien externe vise un autre domaine. L'attribut target=\"_blank\" ouvre dans un nouvel onglet — réservez-le aux sites externes.\n\n## Le formulaire de contact\n<form> regroupe des champs : <input type=\"text\"> pour le nom, type=\"email\" pour l'e-mail, <textarea> pour le message, et <button type=\"submit\"> pour envoyer. Chaque champ porte un label et un attribut name — c'est ce nom qui permettra au serveur d'identifier les données reçues.\n\nUn formulaire HTML seul ne sait pas envoyer d'e-mail : il faut un traitement côté serveur ou un service tiers. Pour vos premiers sites, une solution simple et fiable : faire pointer le formulaire vers un service de messagerie de formulaires, ou afficher directement les coordonnées et un bouton WhatsApp.",
      },
    ],
  },
  {
    order: 4,
    title: "CSS : donner vie au design",
    summary:
      "Traduisez votre charte en règles CSS : sélecteurs, couleurs, espacements, Flexbox pour la mise en page et media queries pour un site impeccable sur mobile.",
    minutes: 60,
    lessons: [
      {
        order: 1,
        title: "Sélecteurs et premières règles CSS",
        minutes: 20,
        content:
          "Le CSS relie des sélecteurs (à qui s'applique la règle ?) à des déclarations (que change-t-on ?). Une règle s'écrit : sélecteur { propriété : valeur; } — par exemple h1 { color: #1e5b3c; font-size: 32px; }.\n\nTrois sélecteurs couvrent 90 % des besoins : la balise (p, h2, img), la classe (.menu, .carte — la plus utilisée, réutilisable sur plusieurs éléments) et l'identifiant (#accueil — unique). On connecte la feuille de style avec <link rel=\"stylesheet\" href=\"style.css\"> dans le head.\n\n## Les propriétés essentielles\n- Couleurs : color pour le texte, background-color pour le fond — en notation hexadécimale (#276144) ou rgb\n- Espacements : margin (à l'extérieur de l'élément), padding (à l'intérieur)\n- Tailles : font-size, width, height — privilégiez rem et % aux pixels fixes\n- Bordures : border, border-radius pour les arrondis\n\nCréez un dossier styles/ avec un fichier style.css unique : une feuille par site, bien organisée par sections commentées. La discipline d'aujourd'hui est la rapidité de demain.",
      },
      {
        order: 2,
        title: "Le modèle de boîte et Flexbox",
        minutes: 20,
        content:
          "En CSS, chaque élément est une boîte composée de quatre couches : le contenu, le padding, la bordure et la marge. Comprendre ce modèle résout la plupart des surprises d'alignement. Ajoutez dès le départ * { box-sizing: border-box; } : les dimensions incluront padding et bordure, ce qui est beaucoup plus intuitif.\n\nPour organiser les boîtes entre elles, Flexbox est l'outil moderne. Sur un conteneur, display: flex active la mise en page ; flex-direction choisit l'axe (row ou column), justify-content distribue sur l'axe principal (flex-start, center, space-between), align-items aligne sur l'axe secondaire, et gap définit l'écart entre les éléments.\n\n## Recettes qui servent tous les jours\n- Centrer parfaitement : display: flex; justify-content: center; align-items: center;\n- En-tête classique : logo à gauche, menu à droite avec justify-content: space-between\n- Cartes de services : conteneur flex avec flex-wrap: wrap pour passer à la ligne\n\nEntraînez-vous en reprenant la page HTML du module 3 : alignez le menu, espacez les sections, disposez trois cartes côte à côte. Flexbox est le geste qui, maîtrisé, fait passer votre mise en page au niveau professionnel.",
      },
      {
        order: 3,
        title: "Responsive design : mobile d'abord",
        minutes: 20,
        content:
          "Plus de 80 % de vos visiteurs arriveront depuis un téléphone, souvent en 3G. Un site qui n'est pas pensé pour mobile perd ses visiteurs en quelques secondes — et Google le pénalise dans ses résultats.\n\nLa stratégie « mobile d'abord » consiste à styliser d'abord pour le petit écran, puis à enrichir pour les écrans larges avec les media queries : @media (min-width: 768px) { … } — les règles entre accolades ne s'appliquent qu'à partir de cette largeur.\n\nDeux réflexes suffisent à éviter 80 % des problèmes : des largeurs en pourcentage ou en max-width plutôt qu'en pixels fixes, et Flexbox avec flex-wrap pour que les rangées de cartes se réorganisent naturellement. Les images, elles, prennent max-width: 100% pour ne jamais déborder.\n\n- Testez dans Chrome avec F12 puis l'outil d'appareils (Ctrl+Shift+M)\n- Points de rupture usuels : 640 px (grand mobile), 768 px (tablette), 1024 px et 1280 px (desktop)\n- Le bouton d'action principal doit rester visible et touchable sur mobile\n\nLa méthode RodLab est simple : on conçoit la version mobile d'abord — c'est la plus contraignante — puis on laisse respirer sur grand écran. Un site responsive est un site qui respecte tous ses visiteurs.",
      },
    ],
  },
];
